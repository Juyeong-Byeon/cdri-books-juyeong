import { PageLayout } from '@/components/layout/PageLayout';
import { cx } from '@/lib/utils';
import { BookSearchBar } from './components/BookSearchBar';
import { SearchEmptyState } from './components/SearchEmptyState';
import { SearchResultCount } from './components/SearchResultCount';

export function Page() {
  return (
    <PageLayout title="도서 검색">
      <div className={cx('w-full max-w-[570px]')}>
        <BookSearchBar />
        <SearchResultCount totalCount={0} />
      </div>
      <SearchEmptyState />
    </PageLayout>
  );
}
