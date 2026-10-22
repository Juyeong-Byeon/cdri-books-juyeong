import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/Input';
import { cx } from '@/lib/utils';

function InputGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cx(
        'group/input-group relative flex h-12 w-full min-w-0 items-center rounded-full border border-transparent bg-palette-lightGray transition-shadow',
        'has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-palette-primary',
        'has-[[data-slot=input-group-control][aria-invalid=true]]:border-palette-red has-[[data-slot=input-group-control][aria-invalid=true]]:ring-palette-red',
        className
      )}
      {...props}
    />
  );
}

function InputGroupAddon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align="inline-start"
      className={cx(
        'order-first flex shrink-0 cursor-text items-center pl-3 text-caption text-text-primary [&>svg]:pointer-events-none [&>svg]:size-5 [&>svg]:shrink-0',
        className
      )}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        event.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cx('h-full flex-1 rounded-none border-0 py-0 focus-visible:ring-0', className)}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
