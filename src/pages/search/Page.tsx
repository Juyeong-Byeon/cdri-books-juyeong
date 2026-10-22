import { PageLayout } from '@/components/layout/PageLayout';
import { cx } from '@/lib/utils';
import { BookSearchBar } from './components/BookSearchBar';
import { SearchResultCount } from './components/SearchResultCount';
import { SearchResults } from './components/SearchResults';
import { useSearchPage } from './hooks/use-search-page';

export function Page() {
  const { conditions, search, searchFormKey, submitSearch } = useSearchPage();

  return (
    <PageLayout title="도서 검색">
      <div className={cx('w-full max-w-[570px]')}>
        <BookSearchBar key={searchFormKey} conditions={conditions} onSearch={submitSearch} />
        {(!search.isError || search.books.length > 0) && (
          <SearchResultCount totalCount={search.totalCount} isLoading={search.isLoading} />
        )}
      </div>
      <SearchResults search={search} />
    </PageLayout>
  );
}
