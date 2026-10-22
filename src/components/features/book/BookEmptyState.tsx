import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/Empty';
import { cx } from '@/lib/utils';
import emptyBooksIllustration from './assets/empty-books.svg';

interface BookEmptyStateProps {
  description: string;
}

export function BookEmptyState({ description }: BookEmptyStateProps) {
  return (
    <Empty className={cx('mt-[104px] w-full')} aria-live="polite">
      <EmptyHeader>
        <EmptyMedia>
          <img src={emptyBooksIllustration} alt="" aria-hidden="true" width={80} height={80} />
        </EmptyMedia>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
