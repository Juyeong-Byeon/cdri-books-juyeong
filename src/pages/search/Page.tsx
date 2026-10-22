import { PageLayout } from '@/components/layout/PageLayout';
import { BookList } from '@/components/features/book/BookList';
import { cx } from '@/lib/utils';
import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';
import type { BookSearchTarget } from '@/types/domain/book-search';
import { BookSearchBar } from './components/BookSearchBar';
import { SearchEmptyState } from './components/SearchEmptyState';
import { SearchResultCount } from './components/SearchResultCount';
import { SearchErrorState } from './components/SearchErrorState';
import { useBookSearch } from './hooks/use-book-search';
import { useLoadMore } from './hooks/use-load-more';
import { parseSearchConditions, serializeSearchConditions } from './utils/search-params';

export function Page() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const conditions = parseSearchConditions(searchParams);
  const search = useBookSearch(conditions);
  const sentinelRef = useLoadMore(search.canLoadMore, search.loadMore);
  const addSearchKeyword = useSearchHistoryStore((state) => state.addSearchKeyword);
  const canonicalSearch = serializeSearchConditions(conditions).toString();

  useEffect(() => {
    if (searchParams.toString() !== canonicalSearch) {
      setSearchParams(canonicalSearch, { replace: true });
    }
  }, [canonicalSearch, searchParams, setSearchParams]);

  const handleSearch = (searchKeyword: string, target?: BookSearchTarget) => {
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

  return (
    <PageLayout title="도서 검색">
      <div className={cx('w-full max-w-[570px]')}>
        <BookSearchBar key={location.key} conditions={conditions} onSearch={handleSearch} />
        {(!search.isError || search.books.length > 0) && (
          <SearchResultCount totalCount={search.totalCount} isLoading={search.isLoading} />
        )}
      </div>
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
        <div className={cx('mt-6 flex h-12 items-center justify-center [overflow-anchor:none]')}>
          {search.hasNextPage && !search.isError ? (
            <Button
              type="button"
              variant="outline"
              onClick={search.loadMore}
              disabled={search.isFetching}
              aria-busy={search.isFetchingNextPage}
              className={cx('w-56')}
            >
              {search.isFetchingNextPage && (
                <LoaderCircle
                  aria-hidden="true"
                  data-icon="inline-start"
                  className={cx('animate-spin motion-reduce:animate-none')}
                />
              )}
              {search.isFetchingNextPage ? '도서를 불러오는 중…' : '더 불러오기'}
            </Button>
          ) : !search.hasNextPage && !search.isError ? (
            <p role="status" className={cx('text-body2 text-text-subtitle')}>
              모든 도서를 불러왔습니다.
            </p>
          ) : null}
        </div>
      )}
    </PageLayout>
  );
}
