import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';
import type { BookSearchConditions, BookSearchTarget } from '@/types/domain/book-search';
import { serializeSearchConditions } from '../utils/searchParams';
import { getBookSearchQueryKey } from '../utils/bookSearchQueryKey';

export function useSearchSubmit(conditions: BookSearchConditions) {
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();
  const addSearchKeyword = useSearchHistoryStore((state) => state.addSearchKeyword);
  const { searchKeyword: submittedSearchKeyword, target: submittedTarget, sort } = conditions;
  const canonicalSearch = serializeSearchConditions(conditions).toString();

  return useCallback(
    (searchKeyword: string, target?: BookSearchTarget) => {
      const params = serializeSearchConditions({ searchKeyword, target, sort });
      if (searchKeyword) {
        addSearchKeyword(searchKeyword);
      }

      if (params.toString() === canonicalSearch) {
        if (searchKeyword) {
          void queryClient.refetchQueries(
            {
              queryKey: getBookSearchQueryKey({
                searchKeyword: submittedSearchKeyword,
                target: submittedTarget,
                sort,
              }),
              exact: true,
              type: 'active',
            },
            { cancelRefetch: false }
          );
        }
      } else {
        setSearchParams(params);
      }
    },
    [
      addSearchKeyword,
      canonicalSearch,
      submittedSearchKeyword,
      submittedTarget,
      sort,
      queryClient,
      setSearchParams,
    ]
  );
}
