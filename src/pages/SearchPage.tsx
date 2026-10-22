import { cx } from '../lib/utils';
import { PageLayout } from '../components/layout/PageLayout';

export function SearchPage() {
  return (
    <PageLayout title="도서 검색">
      <p className={cx('text-body2 text-text-secondary')}>검색 화면을 준비하고 있습니다.</p>
    </PageLayout>
  );
}
