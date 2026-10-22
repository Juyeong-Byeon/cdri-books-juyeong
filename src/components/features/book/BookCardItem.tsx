import { memo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExpandableCard } from '@/components/ui/ExpandableCard';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { cx } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites/store';
import type { Book } from '@/types/domain/book';
import { BookCover } from './BookCover';
import { BookDetailsTrigger } from './BookDetailsTrigger';
import { formatAuthors, formatBookTitle, formatPrice, getPurchaseUrl } from './utils/format-book';

interface BookCardItemProps {
  book: Book;
}

export const BookCardItem = memo(function BookCardItem({ book }: BookCardItemProps) {
  const [expanded, setExpanded] = useState(false);
  const title = formatBookTitle(book.title);
  const isFavorite = useFavoritesStore((state) => state.books.some(({ id }) => id === book.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const purchaseUrl = getPurchaseUrl(book.url);
  const displayPrice = book.salePrice ?? book.price;
  const hasDiscount = book.price !== null && book.salePrice !== null && book.salePrice < book.price;

  const purchaseButton = (
    <Button
      type="button"
      size="list"
      asChild={Boolean(purchaseUrl)}
      disabled={!purchaseUrl}
      className={cx(expanded && 'w-full')}
    >
      {purchaseUrl ? (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} 구매하기 (새 탭)`}
        >
          구매하기
        </a>
      ) : (
        '구매하기'
      )}
    </Button>
  );

  return (
    <ExpandableCard
      expanded={expanded}
      onExpandedChange={setExpanded}
      media={
        <BookCover title={title} thumbnail={book.thumbnail} expanded={expanded}>
          <Button
            type="button"
            variant="ghost"
            size={expanded ? 'icon' : 'icon-sm'}
            aria-label={`${title} 찜${isFavorite ? ' 해제' : '하기'}`}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(book)}
            className={cx('absolute right-0 top-0', expanded && 'right-1 top-1')}
          >
            <HeartIcon filled={isFavorite} />
          </Button>
        </BookCover>
      }
      heading={
        <div
          className={cx(
            'flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2',
            !expanded && 'lg:flex-nowrap'
          )}
        >
          <h2
            className={cx(
              'min-w-0 text-title3 text-text-primary',
              expanded ? 'leading-6' : 'truncate'
            )}
            title={title}
          >
            {title}
          </h2>
          <p className={cx('shrink-0 text-body2 text-text-secondary')}>
            {formatAuthors(book.authors)}
          </p>
        </div>
      }
      details={
        <div className={cx('flex flex-col gap-4')}>
          <h3 className={cx('text-body2-bold text-text-primary')}>책 소개</h3>
          <p
            className={cx('whitespace-pre-line break-words text-small leading-4 text-text-primary')}
          >
            {book.contents.trim() || '책 소개가 없습니다.'}
          </p>
        </div>
      }
      actions={
        expanded ? (
          <div className={cx('flex flex-col gap-8')}>
            <dl className={cx('flex flex-col items-end gap-3')}>
              {hasDiscount && (
                <div className={cx('flex items-center gap-2')}>
                  <dt className={cx('text-small text-text-subtitle')}>원가</dt>
                  <dd className={cx('text-caption text-text-primary')}>
                    <s>{formatPrice(book.price)}</s>
                  </dd>
                </div>
              )}
              <div className={cx('flex items-center gap-2')}>
                <dt className={cx('text-small text-text-subtitle')}>
                  {hasDiscount ? '할인가' : '판매가'}
                </dt>
                <dd className={cx('text-title3 text-text-primary')}>{formatPrice(displayPrice)}</dd>
              </div>
            </dl>
            {purchaseButton}
          </div>
        ) : (
          <>
            <p
              className={cx(
                'mr-auto whitespace-nowrap text-title3 text-text-primary lg:mr-12 lg:w-[76px] lg:text-right'
              )}
            >
              {formatPrice(displayPrice)}
            </p>
            {purchaseButton}
          </>
        )
      }
      trigger={
        <BookDetailsTrigger
          expanded={expanded}
          aria-label={`${title} 상세보기 ${expanded ? '접기' : '펼치기'}`}
        />
      }
    />
  );
});
