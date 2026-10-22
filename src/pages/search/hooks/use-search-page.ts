import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';
import type { BookSearchTarget } from '@/types/domain/book-search';
import { parseSearchConditions, serializeSearchConditions } from '../utils/search-params';
import { useBookSearch } from './use-book-search';

export function useSearchPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const conditions = parseSearchConditions(searchParams);
  const search = useBookSearch(conditions);
  const addSearchKeyword = useSearchHistoryStore((state) => state.addSearchKeyword);
  const canonicalSearch = serializeSearchConditions(conditions).toString();

  useEffect(() => {
    if (searchParams.toString() !== canonicalSearch) {
      setSearchParams(canonicalSearch, { replace: true });
    }
  }, [canonicalSearch, searchParams, setSearchParams]);

  const submitSearch = (searchKeyword: string, target?: BookSearchTarget) => {
    const params = serializeSearchConditions({ ...conditions, searchKeyword, target });
    if (searchKeyword) {
      addSearchKeyword(searchKeyword);
    }

    if (params.toString() === canonicalSearch) {
      if (searchKeyword) search.retry();
    } else {
      setSearchParams(params);
    }
  };

  return { conditions, search, searchFormKey: location.key, submitSearch };
}
