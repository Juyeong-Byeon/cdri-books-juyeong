import { BookList } from '@/components/features/book/BookList';
import { cx } from '@/lib/utils';
import type { useBookSearch } from '../hooks/use-book-search';
import { useLoadMore } from '../hooks/use-load-more';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchErrorState } from './SearchErrorState';
import { SearchLoadMore } from './SearchLoadMore';

interface SearchResultsProps {
  search: ReturnType<typeof useBookSearch>;
}

export function SearchResults({ search }: SearchResultsProps) {
  const sentinelRef = useLoadMore(search.canLoadMore, search.loadMore);

  return (
    <>
      {search.isError && !search.isFetchNextPageError && (
        <SearchErrorState
          error={search.error}
          title={
            search.books.length ? '검색 결과를 갱신하지 못했습니다.' : '도서 검색에 실패했습니다.'
          }
          onRetry={search.retry}
          isRetrying={search.isFetching}
        />
      )}
      {search.isIdle || search.isEmpty ? (
        <SearchEmptyState />
      ) : (
        <BookList
          books={search.books}
          isLoading={search.isLoading}
          isLoadingMore={search.isFetchingNextPage}
        />
      )}
      {search.isFetchNextPageError && (
        <SearchErrorState
          error={search.error}
          title="다음 도서를 불러오지 못했습니다."
          onRetry={search.retryNextPage}
          isRetrying={search.isFetching}
        />
      )}
      <div ref={sentinelRef} aria-hidden="true" className={cx('h-px [overflow-anchor:none]')} />
      {!search.isIdle && search.books.length > 0 && (
        <SearchLoadMore
          hasNextPage={search.hasNextPage}
          isError={search.isError}
          isFetching={search.isFetching}
          isFetchingNextPage={search.isFetchingNextPage}
          onLoadMore={search.loadMore}
        />
      )}
    </>
  );
}
