import { PageLayout } from '@/components/layout/PageLayout';
import { FavoritesContent } from './components/FavoritesContent';
import { FavoritesCount } from './components/FavoritesCount';

export function Page() {
  return (
    <PageLayout title="내가 찜한 책">
      <FavoritesCount />
      <FavoritesContent />
    </PageLayout>
  );
}
