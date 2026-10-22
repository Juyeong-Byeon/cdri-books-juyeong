import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/utils';

export function BookList({ children, className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  const isBusy = props['aria-busy'] === true || props['aria-busy'] === 'true';

  return (
    <div className={cx('mt-9 w-full')}>
      {isBusy && (
        <p role="status" className={cx('sr-only')}>
          도서 목록을 불러오는 중입니다.
        </p>
      )}
      <ul aria-label="도서 목록" className={cx('m-0 list-none p-0', className)} {...props}>
        {children}
      </ul>
    </div>
  );
}

export function BookListItem({ children, className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return (
    <li className={cx('motion-safe:animate-book-row-enter', className)} {...props}>
      {children}
    </li>
  );
}
