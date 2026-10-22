import { memo, useState } from 'react';
import { ExpandableCard } from '@/components/ui/ExpandableCard';
import type { Book } from '@/types/domain/book';
import { BookCover } from './BookCover';
import { BookDescription } from './BookDescription';
import { BookDetailsTrigger } from './BookDetailsTrigger';
import { BookFavoriteButton } from './BookFavoriteButton';
import { BookHeading } from './BookHeading';
import { BookPurchaseActions } from './BookPurchaseActions';
import { formatBookTitle } from './utils/format-book';

interface BookCardItemProps {
  book: Book;
}

export const BookCardItem = memo(function BookCardItem({ book }: BookCardItemProps) {
  const [expanded, setExpanded] = useState(false);
  const title = formatBookTitle(book.title);

  return (
    <ExpandableCard
      expanded={expanded}
      onExpandedChange={setExpanded}
      media={
        <BookCover title={title} thumbnail={book.thumbnail} expanded={expanded}>
          <BookFavoriteButton book={book} expanded={expanded} />
        </BookCover>
      }
      heading={<BookHeading title={title} authors={book.authors} expanded={expanded} />}
      details={<BookDescription contents={book.contents} />}
      actions={<BookPurchaseActions book={book} expanded={expanded} />}
      trigger={
        <BookDetailsTrigger
          expanded={expanded}
          aria-label={`${title} 상세보기 ${expanded ? '접기' : '펼치기'}`}
        />
      }
    />
  );
});
