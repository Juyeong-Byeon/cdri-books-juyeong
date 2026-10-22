import * as React from 'react';
import { cx } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      data-slot="input"
      className={cx(
        'flex h-12 w-full min-w-0 rounded-sm border border-palette-gray bg-transparent px-3 py-2 text-caption text-text-primary transition-colors placeholder:text-text-subtitle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-palette-red',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
