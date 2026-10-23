import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { cx } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites/store';
import type { Book } from '@/types/domain/book';
import { formatBookTitle } from './utils/formatBook';

interface BookFavoriteButtonProps {
  book: Book;
  expanded: boolean;
}

export function BookFavoriteButton({ book, expanded }: BookFavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.books.some(({ id }) => id === book.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const title = formatBookTitle(book.title);

  return (
    <Button
      type="button"
      variant="ghost"
      size={expanded ? 'icon' : 'icon-sm'}
      aria-label={`${title} 찜${isFavorite ? ' 해제' : '하기'}`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(book)}
      className={cx('absolute right-0 top-0', expanded && 'right-1 top-1')}
    >
      <HeartIcon
        filled={isFavorite}
        className={cx(
          !isFavorite && 'text-palette-white drop-shadow-[0_0_1px_theme(colors.palette.black)]'
        )}
      />
    </Button>
  );
}
