import { PageLayout } from '@/components/layout/PageLayout';
import { cx } from '@/lib/utils';
import { BookSearchBar } from './components/BookSearchBar';
import { SearchResults } from './components/SearchResults';
import { useNormalizeSearchParams } from './hooks/useNormalizeSearchParams';

export function Page() {
  useNormalizeSearchParams();

  return (
    <PageLayout title="도서 검색">
      <div className={cx('w-full max-w-[570px]')}>
        <BookSearchBar />
      </div>
      <SearchResults />
    </PageLayout>
  );
}
