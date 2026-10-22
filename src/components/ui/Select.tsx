import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cx } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

type SelectVariant = 'default' | 'underline';

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { variant?: SelectVariant }
>(({ className, children, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cx(
      'flex w-full items-center justify-between gap-2 whitespace-nowrap bg-palette-white outline-none disabled:opacity-50 [&>span]:truncate',
      variant === 'underline'
        ? 'h-10 rounded-none border-0 border-b border-ui-divider px-2 text-caption font-bold text-text-primary focus-visible:border-palette-primary'
        : 'h-9 rounded-sm border border-palette-gray px-3 text-body2 text-text-secondary focus:ring-2 focus:ring-palette-primary',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={cx('size-4 text-ui-gray')} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cx('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className={cx('size-4')} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cx('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className={cx('size-4')} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { variant?: SelectVariant }
>(({ className, children, position = 'popper', variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cx(
        'relative z-50 max-h-[var(--radix-select-content-available-height)] overflow-y-auto overflow-x-hidden border bg-palette-white',
        variant === 'underline'
          ? 'w-[var(--radix-select-trigger-width)] rounded-none border-ui-divider text-caption text-text-subtitle shadow-sm'
          : 'min-w-[8rem] rounded-sm border-palette-gray text-body2 text-text-primary shadow-md',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cx(
          variant === 'underline' ? 'p-0' : 'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { variant?: SelectVariant }
>(({ className, children, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cx(
      'relative flex w-full cursor-default select-none items-center outline-none focus:bg-palette-lightGray data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      variant === 'underline'
        ? 'h-9 px-2 text-caption focus:underline focus:decoration-palette-primary focus:decoration-2 focus:underline-offset-2'
        : 'rounded-sm py-2 pl-2 pr-8 text-body2',
      className
    )}
    {...props}
  >
    {variant === 'default' && (
      <span className={cx('absolute right-2 flex size-3.5 items-center justify-center')}>
        <SelectPrimitive.ItemIndicator>
          <Check className={cx('size-4')} />
        </SelectPrimitive.ItemIndicator>
      </span>
    )}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
