import type { ComponentProps } from 'react';
import { cx } from '@/lib/utils';

function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cx('flex min-w-0 flex-col items-center justify-center text-center', className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cx('flex max-w-sm flex-col items-center gap-4 text-center', className)}
      {...props}
    />
  );
}

function EmptyMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-media"
      className={cx('flex shrink-0 items-center justify-center', className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cx('text-caption text-text-secondary', className)}
      {...props}
    />
  );
}

export { Empty, EmptyHeader, EmptyMedia, EmptyDescription };
