import { BookCardItem } from '@/components/features/book/BookCardItem';
import { BookEmptyState } from '@/components/features/book/BookEmptyState';
import { BookList, BookListItem } from '@/components/features/book/BookList';
import { cx } from '@/lib/utils';
import { BOOK_PAGE_SIZE } from '@/types/domain/book-search';
import { useBookSearch } from '../hooks/useBookSearch';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSearchConditions } from '../hooks/useSearchConditions';
import { SearchErrorState } from './SearchErrorState';
import { SearchLoadMore } from './SearchLoadMore';
import { SearchResultCount } from './SearchResultCount';
import { BookCardSkeleton } from '@/components/features/book/BookCardSkeleton';

export function SearchResults() {
  const conditions = useSearchConditions();
  const {
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
  } = useBookSearch(conditions);
  const sentinelRef = useIntersectionObserver({
    enabled: canLoadMore,
    onIntersect: loadMore,
    rootMargin: '200px',
  });

  return (
    <>
      {(!isError || books.length > 0) && (
        <div className={cx('w-full max-w-[570px]')}>
          <SearchResultCount totalCount={totalCount} isLoading={isLoading} />
        </div>
      )}
      {isError && !isFetchNextPageError && (
        <SearchErrorState
          error={error}
          title={books.length ? '검색 결과를 갱신하지 못했습니다.' : '도서 검색에 실패했습니다.'}
          onRetry={retry}
          isRetrying={isFetching}
        />
      )}
      {isIdle || isEmpty ? (
        <BookEmptyState description="검색된 결과가 없습니다." />
      ) : (
        <BookList aria-busy={isLoading || isFetchingNextPage}>
          {isLoading ? (
            <>
              {Array.from({ length: BOOK_PAGE_SIZE }, (_, index) => (
                <BookListItem key={`loading:${index}`} aria-hidden="true">
                  <BookCardSkeleton />
                </BookListItem>
              ))}
            </>
          ) : (
            books.map((book) => (
              <BookListItem key={book.id}>
                <BookCardItem book={book} />
              </BookListItem>
            ))
          )}
        </BookList>
      )}
      {isFetchNextPageError && (
        <SearchErrorState
          error={error}
          title="다음 도서를 불러오지 못했습니다."
          onRetry={retryNextPage}
          isRetrying={isFetching}
        />
      )}
      <div ref={sentinelRef} aria-hidden="true" className={cx('h-px [overflow-anchor:none]')} />
      {!isIdle && books.length > 0 && (
        <SearchLoadMore
          hasNextPage={hasNextPage}
          isError={isError}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={loadMore}
        />
      )}
    </>
  );
}
