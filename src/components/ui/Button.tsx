import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cx } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'rounded-sm bg-palette-primaryStrong text-body2-bold text-palette-white hover:bg-palette-primaryStrong/95',
        outline:
          'rounded-md border border-palette-gray bg-palette-white text-body2 text-text-secondary hover:border-palette-primary hover:text-palette-primaryStrong',
        secondary:
          'rounded-md bg-palette-lightGray text-caption text-text-secondary hover:bg-palette-gray/60',
        ghost: 'bg-transparent text-palette-white',
        'muted-ghost': 'bg-transparent text-ui-gray hover:text-text-secondary',
        'subtle-ghost': 'bg-transparent text-caption text-text-secondary hover:text-text-primary',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-8 px-3',
        list: 'h-12 w-[115px] shrink-0 rounded-md px-5 text-caption',
        'icon-sm': 'size-4 p-0',
        icon: 'size-8 p-0 [&_svg]:size-6',
        'icon-close': 'size-5 p-0 [&_svg]:size-5',
        search: 'h-10 rounded-md px-5 text-caption',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        data-slot="button"
        className={cx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
