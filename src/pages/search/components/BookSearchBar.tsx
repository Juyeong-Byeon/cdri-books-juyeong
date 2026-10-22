import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/InputGroup';
import { cx } from '@/lib/utils';
import type { BookSearchConditions, BookSearchTarget } from '@/types/domain/book-search';
import { AdvancedSearchPopover } from './AdvancedSearchPopover';

interface BookSearchBarProps {
  conditions: BookSearchConditions;
  onSearch: (searchKeyword: string, target?: BookSearchTarget) => void;
}

export function BookSearchBar({ conditions, onSearch }: BookSearchBarProps) {
  const [searchKeyword, setSearchKeyword] = useState(
    conditions.target ? '' : conditions.searchKeyword
  );
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchKeyword.trim());
  };
  return (
    <div role="search" aria-label="도서 검색" className={cx('flex items-center gap-3')}>
      <form onSubmit={handleSubmit} className={cx('min-w-0 flex-1')}>
        <label htmlFor="book-search-keyword" className={cx('sr-only')}>
          검색어
        </label>
        <InputGroup>
          <InputGroupInput
            id="book-search-keyword"
            type="search"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </form>
      <AdvancedSearchPopover conditions={conditions} onSearch={onSearch} />
    </div>
  );
}
