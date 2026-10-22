import type { HTMLAttributes } from 'react';
import { cx } from '@/lib/utils';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'animate-pulse rounded-sm bg-palette-lightGray motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
