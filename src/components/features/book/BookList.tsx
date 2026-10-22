import { cx } from '@/lib/utils';
import type { Book } from '@/types/domain/book';
import { BOOK_PAGE_SIZE } from '@/types/domain/book-search';
import { BookCardItem } from './BookCardItem';
import { BookCardSkeleton } from './BookCardSkeleton';

interface BookListProps {
  books: readonly Book[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
}

export function BookList({ books, isLoading = false, isLoadingMore = false }: BookListProps) {
  return (
    <div className={cx('mt-9 w-full')}>
      {(isLoading || isLoadingMore) && (
        <p role="status" className={cx('sr-only')}>
          도서 목록을 불러오는 중입니다.
        </p>
      )}
      <ul
        aria-label="도서 목록"
        aria-busy={isLoading || isLoadingMore}
        className={cx('m-0 list-none p-0')}
      >
        {isLoading
          ? Array.from({ length: BOOK_PAGE_SIZE }, (_, index) => (
              <li key={`loading:${index}`} aria-hidden="true">
                <BookCardSkeleton />
              </li>
            ))
          : books.map((book) => (
              <li key={book.id} className={cx('motion-safe:animate-book-row-enter')}>
                <BookCardItem book={book} />
              </li>
            ))}
      </ul>
    </div>
  );
}
