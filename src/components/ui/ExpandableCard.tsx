import type { ReactElement, ReactNode } from 'react';
import { cx } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';

interface ExpandableCardProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  media: ReactNode;
  heading: ReactNode;
  details: ReactNode;
  actions: ReactNode;
  trigger: ReactElement;
}

export function ExpandableCard({
  expanded,
  onExpandedChange,
  media,
  heading,
  details,
  actions,
  trigger,
}: ExpandableCardProps) {
  return (
    <Collapsible open={expanded} onOpenChange={onExpandedChange} asChild>
      <article
        className={cx(
          'grid gap-4 border-b border-ui-divider px-4 lg:pl-12',
          expanded
            ? 'grid-cols-1 py-6 lg:grid-cols-[210px_minmax(0,1fr)_240px] lg:gap-8'
            : 'grid-cols-[48px_minmax(0,1fr)] items-center py-4 lg:h-[100px] lg:grid-cols-[48px_minmax(0,1fr)_370px] lg:gap-x-12 lg:py-0'
        )}
      >
        <div className={cx('shrink-0', expanded && 'justify-self-center lg:justify-self-start')}>
          {media}
        </div>
        <div className={cx('min-w-0', expanded && 'lg:pt-5')}>
          {heading}
          <CollapsibleContent className={cx('mt-6')}>{details}</CollapsibleContent>
        </div>
        <div
          className={cx(
            'flex',
            expanded
              ? 'flex-col items-end gap-6 lg:self-stretch'
              : 'col-span-2 flex-wrap items-center justify-end gap-2 lg:col-span-1 lg:flex-nowrap'
          )}
        >
          <div
            className={cx(
              expanded
                ? 'order-2 mt-auto w-full'
                : 'flex min-w-0 basis-full items-center justify-end gap-2 sm:basis-auto sm:flex-1'
            )}
          >
            {actions}
          </div>
          <CollapsibleTrigger asChild>{trigger}</CollapsibleTrigger>
        </div>
      </article>
    </Collapsible>
  );
}
