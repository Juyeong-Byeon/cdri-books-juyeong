import * as React from 'react';
import { cx } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'underline';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => (
    <input
      type={type}
      data-slot="input"
      className={cx(
        'flex w-full min-w-0 bg-transparent px-3 py-2 text-caption text-text-primary transition-colors placeholder:text-text-subtitle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-palette-red',
        variant === 'underline'
          ? 'h-10 rounded-none border-0 border-b border-palette-primary'
          : 'h-12 rounded-sm border border-palette-gray focus-visible:ring-2 focus-visible:ring-palette-primary',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
