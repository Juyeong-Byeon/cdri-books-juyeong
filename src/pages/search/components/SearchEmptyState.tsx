import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/Empty';
import { cx } from '@/lib/utils';
import emptySearchIllustration from '../assets/empty-search.svg';

export function SearchEmptyState() {
  return (
    <Empty className={cx('mt-[104px] w-full')} aria-live="polite">
      <EmptyHeader>
        <EmptyMedia>
          <img src={emptySearchIllustration} alt="" aria-hidden="true" width={80} height={80} />
        </EmptyMedia>
        <EmptyDescription>검색된 결과가 없습니다.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
