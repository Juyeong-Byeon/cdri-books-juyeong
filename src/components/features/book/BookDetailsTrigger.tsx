import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';

interface BookDetailsTriggerProps extends ComponentPropsWithoutRef<typeof Button> {
  expanded: boolean;
}

export const BookDetailsTrigger = forwardRef<HTMLButtonElement, BookDetailsTriggerProps>(
  ({ expanded, className, ...props }, ref) => (
    <Button
      ref={ref}
      type="button"
      variant="secondary"
      size="list"
      className={cx('gap-1', className)}
      {...props}
    >
      상세보기
      <ChevronDown
        data-icon="inline-end"
        aria-hidden="true"
        className={cx(
          'text-ui-gray transition-transform motion-reduce:transition-none',
          expanded && 'rotate-180'
        )}
      />
    </Button>
  )
);
BookDetailsTrigger.displayName = 'BookDetailsTrigger';
