import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';

interface SearchLoadMoreProps {
  hasNextPage: boolean | undefined;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function SearchLoadMore({
  hasNextPage,
  isError,
  isFetching,
  isFetchingNextPage,
  onLoadMore,
}: SearchLoadMoreProps) {
  return (
    <div className={cx('mt-6 flex h-12 items-center justify-center [overflow-anchor:none]')}>
      {!isError &&
        (hasNextPage ? (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetching}
            aria-busy={isFetchingNextPage}
            className={cx('w-56')}
          >
            {isFetchingNextPage && (
              <LoaderCircle
                aria-hidden="true"
                data-icon="inline-start"
                className={cx('animate-spin motion-reduce:animate-none')}
              />
            )}
            {isFetchingNextPage ? '도서를 불러오는 중…' : '더 불러오기'}
          </Button>
        ) : (
          <p role="status" className={cx('text-body2 text-text-secondary')}>
            모든 도서를 불러왔습니다.
          </p>
        ))}
    </div>
  );
}
