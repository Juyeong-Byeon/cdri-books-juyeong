import { cx } from '@/lib/utils';

interface SearchResultCountProps {
  totalCount: number;
  isLoading?: boolean;
}

export function SearchResultCount({ totalCount, isLoading = false }: SearchResultCountProps) {
  return (
    <p
      aria-live="polite"
      className={cx('mt-6 flex items-center gap-3 text-body2 text-text-primary')}
    >
      <span>도서 검색 결과</span>
      {isLoading ? (
        <span>검색 중…</span>
      ) : (
        <span>
          총{' '}
          <strong className={cx('text-body2-bold text-palette-primaryStrong')}>{totalCount}</strong>
          건
        </span>
      )}
    </p>
  );
}
