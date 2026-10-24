import { cx } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites/store';

export function FavoritesCount() {
  const totalCount = useFavoritesStore((state) => state.books.length);

  return (
    <p aria-live="polite" className={cx('flex items-center gap-3 text-body2 text-text-primary')}>
      <span>찜한 책</span>
      <span>
        총{' '}
        <strong className={cx('text-body2-bold text-palette-primaryStrong')}>{totalCount}</strong>건
      </span>
    </p>
  );
}
