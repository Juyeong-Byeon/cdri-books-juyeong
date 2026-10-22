import { ExpandableCard } from '@/components/ui/ExpandableCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { cx } from '@/lib/utils';
import { BookCover } from './BookCover';
import { BookDetailsTrigger } from './BookDetailsTrigger';

export function BookCardSkeleton() {
  return (
    <ExpandableCard
      expanded={false}
      onExpandedChange={() => {}}
      media={<BookCover isLoading />}
      heading={
        <div className={cx('flex flex-wrap items-center gap-4')}>
          <Skeleton className={cx('h-[18px] w-32 max-w-full')} />
          <Skeleton className={cx('h-[14px] w-24 max-w-full')} />
        </div>
      }
      details={null}
      actions={
        <>
          <Skeleton className={cx('mr-auto h-[18px] w-[76px] lg:mr-12')} />
          <Skeleton className={cx('h-12 w-[115px] shrink-0 rounded-md')} />
        </>
      }
      trigger={<BookDetailsTrigger expanded={false} disabled tabIndex={-1} />}
    />
  );
}
