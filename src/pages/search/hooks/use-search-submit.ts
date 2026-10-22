import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';
import type { BookSearchConditions, BookSearchTarget } from '@/types/domain/book-search';
import { serializeSearchConditions } from '../utils/search-params';
import { getBookSearchQueryKey } from '../utils/book-search-query-key';

export function useSearchSubmit(conditions: BookSearchConditions) {
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();
  const addSearchKeyword = useSearchHistoryStore((state) => state.addSearchKeyword);
  const canonicalSearch = serializeSearchConditions(conditions).toString();

  return useCallback(
    (searchKeyword: string, target?: BookSearchTarget) => {
      const params = serializeSearchConditions({ ...conditions, searchKeyword, target });
      if (searchKeyword) {
        addSearchKeyword(searchKeyword);
      }

      if (params.toString() === canonicalSearch) {
        if (searchKeyword) {
          void queryClient.refetchQueries(
            { queryKey: getBookSearchQueryKey(conditions), exact: true, type: 'active' },
            { cancelRefetch: false }
          );
        }
      } else {
        setSearchParams(params);
      }
    },
    [addSearchKeyword, canonicalSearch, conditions, queryClient, setSearchParams]
  );
}
