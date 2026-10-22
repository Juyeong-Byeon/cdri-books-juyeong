import { cx } from '../lib/utils';
import { PageLayout } from '../components/layout/PageLayout';

export function FavoritesPage() {
  return (
    <PageLayout title="내가 찜한 책">
      <p className={cx('text-body2 text-text-secondary')}>찜한 책 화면을 준비하고 있습니다.</p>
    </PageLayout>
  );
}
