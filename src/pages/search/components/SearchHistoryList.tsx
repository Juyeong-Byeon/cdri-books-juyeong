import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';
import { useSearchHistoryHotkeys } from '../hooks/useSearchHistoryHotkeys';
import { useSearchHistoryScrollHint } from '../hooks/useSearchHistoryScrollHint';

interface SearchHistoryListProps {
  id: string;
  searchKeywords: readonly string[];
  onSelect: (searchKeyword: string) => void;
  onRemove: (searchKeyword: string) => void;
  onFocusInput: () => void;
}

export function SearchHistoryList({
  id,
  searchKeywords,
  onSelect,
  onRemove,
  onFocusInput,
}: SearchHistoryListProps) {
  const { listRef, hasMoreBelow, updateScrollHint } = useSearchHistoryScrollHint(searchKeywords);
  useSearchHistoryHotkeys(listRef, onFocusInput);

  return (
    <div className={cx('relative')}>
      <ul
        ref={listRef}
        id={id}
        aria-label="최근 검색어"
        onScroll={updateScrollHint}
        className={cx('max-h-[105px] overflow-y-auto overscroll-contain pb-[13px] pl-11 pr-3 pt-3')}
      >
        {searchKeywords.map((searchKeyword) => (
          <li key={searchKeyword} className={cx('flex h-10 items-center gap-3')}>
            <Button
              type="button"
              variant="subtle-ghost"
              data-history-select=""
              className={cx('h-10 min-w-0 flex-1 justify-start rounded-sm px-0')}
              aria-label={`${searchKeyword} 검색`}
              title={searchKeyword}
              onClick={() => onSelect(searchKeyword)}
            >
              <span className={cx('truncate')}>{searchKeyword}</span>
            </Button>
            <Button
              type="button"
              variant="muted-ghost"
              size="icon-close"
              aria-label={`${searchKeyword} 검색 기록 삭제`}
              onClick={() => onRemove(searchKeyword)}
              className={cx('size-8 shrink-0 rounded-sm')}
            >
              <X aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className={cx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-palette-lightGray via-palette-lightGray/80 to-transparent transition-opacity duration-150 motion-reduce:transition-none',
          hasMoreBelow ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}
