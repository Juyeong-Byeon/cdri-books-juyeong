import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';

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
  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    if (event.nativeEvent.isComposing) return;

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (index === 0) {
          onFocusInput();
          return;
        }
        nextIndex = index - 1;
        break;
      case 'ArrowDown':
        nextIndex = Math.min(index + 1, searchKeywords.length - 1);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = searchKeywords.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[data-history-select]')
      [nextIndex]?.focus();
  }

  return (
    <ul
      id={id}
      aria-label="최근 검색어"
      className={cx('max-h-[105px] overflow-y-auto overscroll-contain pb-[13px] pl-11 pr-3 pt-3')}
    >
      {searchKeywords.map((searchKeyword, index) => (
        <li
          key={searchKeyword}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cx('flex h-10 items-center gap-3')}
        >
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
  );
}
