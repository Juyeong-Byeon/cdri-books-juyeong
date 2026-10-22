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
  const retry = () => {
    refetch({ cancelRefetch: false });
  };
  const retryNextPage = () => {
    if (hasNextPage && !isFetching) void fetchNextPage({ cancelRefetch: false });
  };

  return {
    books,
    totalCount: data?.pages[0]?.meta.totalCount ?? 0,
    isIdle,
    isLoading: !isIdle && isPending,
    isEmpty: !isIdle && isSuccess && books.length === 0,
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
  };
}
