import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from '@/services/books';
import { MAX_BOOK_PAGE, type BookSearchConditions } from '@/types/domain/book-search';
import { getBookSearchQueryKey } from '../utils/bookSearchQueryKey';

export function useBookSearch(conditions: BookSearchConditions) {
  const isIdle = !conditions.searchKeyword;
  const {
    data,
    error,
    hasNextPage,
    isPending,
    isSuccess,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
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
    return (data?.pages.flatMap((page) => page.books) ?? []).filter((book) => {
      if (seen.has(book.id)) return false;
      seen.add(book.id);
      return true;
    });
  }, [data]);

  const canLoadMore = !isIdle && Boolean(hasNextPage) && !isFetching && !isError;
  const loadMore = useCallback(() => {
    if (canLoadMore) void fetchNextPage({ cancelRefetch: false });
  }, [canLoadMore, fetchNextPage]);
  const retry = useCallback(() => {
    refetch({ cancelRefetch: false });
  }, [refetch]);
  const retryNextPage = useCallback(() => {
    if (hasNextPage && !isFetching) void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage, hasNextPage, isFetching]);
  const totalCount = data?.pages[0]?.meta.totalCount ?? 0;
  const isLoading = !isIdle && isPending;
  const isEmpty = !isIdle && isSuccess && books.length === 0;

  return useMemo(
    () => ({
      books,
      totalCount,
      isIdle,
      isLoading,
      isEmpty,
      error,
      isError,
      isFetching,
      isFetchingNextPage,
      isFetchNextPageError,
      hasNextPage,
      canLoadMore,
      loadMore,
      retry,
      retryNextPage,
    }),
    [
      books,
      totalCount,
      isIdle,
      isLoading,
      isEmpty,
      error,
      isError,
      isFetching,
      isFetchingNextPage,
      isFetchNextPageError,
      hasNextPage,
      canLoadMore,
      loadMore,
      retry,
      retryNextPage,
    ]
  );
}
