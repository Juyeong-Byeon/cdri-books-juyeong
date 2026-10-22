import { BookCardItem } from '@/components/features/book/BookCardItem';
import { BookEmptyState } from '@/components/features/book/BookEmptyState';
import { BookList, BookListItem } from '@/components/features/book/BookList';
import { BookListSkeleton } from '@/components/features/book/BookListSkeleton';
import { cx } from '@/lib/utils';
import { BOOK_PAGE_SIZE } from '@/types/domain/book-search';
import { useBookSearch } from '../hooks/use-book-search';
import { useLoadMore } from '../hooks/use-load-more';
import { useSearchConditions } from '../hooks/use-search-conditions';
import { SearchErrorState } from './SearchErrorState';
import { SearchLoadMore } from './SearchLoadMore';
import { SearchResultCount } from './SearchResultCount';

export function SearchResults() {
  const conditions = useSearchConditions();
  const search = useBookSearch(conditions);
  const sentinelRef = useLoadMore(search.canLoadMore, search.loadMore);

  return (
    <>
      {(!search.isError || search.books.length > 0) && (
        <div className={cx('w-full max-w-[570px]')}>
          <SearchResultCount totalCount={search.totalCount} isLoading={search.isLoading} />
        </div>
      )}
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
        <BookEmptyState description="검색된 결과가 없습니다." />
      ) : (
        <BookList aria-busy={search.isLoading || search.isFetchingNextPage}>
          {search.isLoading ? (
            <BookListSkeleton count={BOOK_PAGE_SIZE} />
          ) : (
            search.books.map((book) => (
              <BookListItem key={book.id}>
                <BookCardItem book={book} />
              </BookListItem>
            ))
          )}
        </BookList>
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
