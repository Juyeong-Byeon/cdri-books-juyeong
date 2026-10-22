import { BookCardItem } from '@/components/features/book/BookCardItem';
import { BookEmptyState } from '@/components/features/book/BookEmptyState';
import { BookList, BookListItem } from '@/components/features/book/BookList';
import { useFavoritesStore } from '@/stores/favorites/store';

export function FavoritesContent() {
  const books = useFavoritesStore((state) => state.books);

  if (books.length === 0) {
    return <BookEmptyState description="찜한 책이 없습니다." />;
  }

  return (
    <BookList aria-label="찜한 책 목록">
      {books.map((book) => (
        <BookListItem key={book.id}>
          <BookCardItem book={book} />
        </BookListItem>
      ))}
    </BookList>
  );
}
