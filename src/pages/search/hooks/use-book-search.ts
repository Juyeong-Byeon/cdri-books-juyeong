import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from '@/services/books';
import { MAX_BOOK_PAGE, type BookSearchConditions } from '@/types/domain/book-search';
import { getBookSearchQueryKey } from '../utils/book-search-query-key';

export function useBookSearch(conditions: BookSearchConditions) {
  const isIdle = !conditions.searchKeyword;
  const query = useInfiniteQuery({
    queryKey: getBookSearchQueryKey(conditions),
    queryFn: ({ pageParam, signal }) => searchBooks(conditions, pageParam, signal),
    initialPageParam: 1,
    enabled: !isIdle,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.meta.isEnd || lastPage.books.length === 0 || lastPageParam >= MAX_BOOK_PAGE
        ? undefined
        : lastPageParam + 1,
  });

  const books = useMemo(() => {
    const seen = new Set<string>();
    return (query.data?.pages.flatMap((page) => page.books) ?? []).filter((book) => {
      if (seen.has(book.id)) return false;
      seen.add(book.id);
      return true;
    });
  }, [query.data]);

  const canLoadMore = !isIdle && Boolean(query.hasNextPage) && !query.isFetching && !query.isError;
  const { fetchNextPage, refetch } = query;
  const loadMore = useCallback(() => {
    if (canLoadMore) void fetchNextPage({ cancelRefetch: false });
  }, [canLoadMore, fetchNextPage]);
  const retry = () => {
    refetch({ cancelRefetch: false });
  };
  const retryNextPage = () => {
    if (query.hasNextPage && !query.isFetching) void fetchNextPage({ cancelRefetch: false });
  };

  return {
    books,
    totalCount: query.data?.pages[0]?.meta.totalCount ?? 0,
    isIdle,
    isLoading: !isIdle && query.isPending,
    isEmpty: !isIdle && query.isSuccess && books.length === 0,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchNextPageError: query.isFetchNextPageError,
    hasNextPage: query.hasNextPage,
    canLoadMore,
    loadMore,
    retry,
    retryNextPage,
  };
}
