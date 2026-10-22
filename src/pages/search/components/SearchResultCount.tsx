import { cx } from '@/lib/utils';

interface SearchResultCountProps {
  totalCount: number;
}

export function SearchResultCount({ totalCount }: SearchResultCountProps) {
  return (
    <p
      aria-live="polite"
      className={cx('mt-6 flex items-center gap-3 text-body2 text-text-primary')}
    >
      <span>도서 검색 결과</span>
      <span>
        총 <strong className={cx('text-body2-bold text-palette-primary')}>{totalCount}</strong>건
      </span>
    </p>
  );
}
