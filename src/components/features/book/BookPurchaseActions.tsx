import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';
import type { Book } from '@/types/domain/book';
import { formatBookTitle, formatPrice, getPurchaseUrl } from './utils/format-book';

interface BookPurchaseActionsProps {
  book: Book;
  expanded: boolean;
}

export function BookPurchaseActions({ book, expanded }: BookPurchaseActionsProps) {
  const title = formatBookTitle(book.title);
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

  if (!expanded) {
    return (
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
    );
  }

  return (
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
  );
}
