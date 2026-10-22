import { useId, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { cx } from '@/lib/utils';
import {
  BOOK_SEARCH_TARGETS,
  type BookSearchConditions,
  type BookSearchTarget,
} from '@/types/domain/book-search';

interface AdvancedSearchPopoverProps {
  conditions: BookSearchConditions;
  onSearch: (searchKeyword: string, target: BookSearchTarget) => void;
}

export function AdvancedSearchPopover({ conditions, onSearch }: AdvancedSearchPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [target, setTarget] = useState<BookSearchTarget>('title');
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setSearchKeyword(conditions.target ? conditions.searchKeyword : '');
      setTarget(conditions.target ?? 'title');
    }
    setOpen(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) return;
    onSearch(keyword, target);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={cx('shrink-0')}>
          상세검색
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={16}
        className={cx('w-[400px] rounded-lg border-0 px-7 pb-10 pt-10')}
        aria-labelledby={titleId}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <h2 id={titleId} className={cx('sr-only')}>
          상세검색
        </h2>
        <Button
          type="button"
          variant="muted-ghost"
          size="icon-close"
          className={cx('absolute right-3 top-3')}
          aria-label="상세검색 닫기"
          onClick={() => setOpen(false)}
        >
          <X aria-hidden="true" />
        </Button>
        <form onSubmit={handleSubmit} className={cx('flex flex-col gap-4')}>
          <div className={cx('grid grid-cols-[112px_minmax(0,1fr)] items-end gap-1')}>
            <Select
              value={target}
              onValueChange={(value) => {
                if (Object.keys(BOOK_SEARCH_TARGETS).includes(value))
                  setTarget(value as BookSearchTarget);
              }}
            >
              <SelectTrigger aria-label="검색 대상" variant="underline">
                <SelectValue>{BOOK_SEARCH_TARGETS[target]}</SelectValue>
              </SelectTrigger>
              <SelectContent variant="underline" align="start" sideOffset={0}>
                <SelectGroup>
                  {Object.entries(BOOK_SEARCH_TARGETS)
                    .filter(([value]) => value !== target)
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value} variant="underline">
                        {label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <label htmlFor={inputId} className={cx('sr-only')}>
              상세 검색어
            </label>
            <Input
              ref={inputRef}
              id={inputId}
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="검색어 입력"
              required
              variant="underline"
            />
          </div>
          <Button type="submit" size="search" className={cx('w-full')}>
            검색하기
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
