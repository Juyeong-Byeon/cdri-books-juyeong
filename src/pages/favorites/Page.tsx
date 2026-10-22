import { PageLayout } from '@/components/layout/PageLayout';
import { cx } from '@/lib/utils';

export function Page() {
  return (
    <PageLayout title="내가 찜한 책">
      <p className={cx('text-body2 text-text-secondary')}>찜한 책 화면을 준비하고 있습니다.</p>
    </PageLayout>
  );
}
