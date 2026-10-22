import { cx } from '@/lib/utils';
import { formatAuthors } from './utils/formatBook';

interface BookHeadingProps {
  title: string;
  authors: readonly string[];
  expanded: boolean;
}

export function BookHeading({ title, authors, expanded }: BookHeadingProps) {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2',
        !expanded && 'lg:flex-nowrap'
      )}
    >
      <h2
        className={cx('min-w-0 text-title3 text-text-primary', expanded ? 'leading-6' : 'truncate')}
        title={title}
      >
        {title}
      </h2>
      <p className={cx('shrink-0 text-body2 text-text-secondary')}>{formatAuthors(authors)}</p>
    </div>
  );
}
