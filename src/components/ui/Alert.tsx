import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '@/lib/utils';

export const Alert = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cx(
        'w-full rounded-md border border-palette-gray bg-palette-lightGray p-4 text-body2 text-text-primary',
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cx('text-body2-bold', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('mt-2 text-body2 leading-6 text-text-secondary', className)}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';
