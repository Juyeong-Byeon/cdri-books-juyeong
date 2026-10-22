import { useId } from 'react';
import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/InputGroup';
import { cx } from '@/lib/utils';
import { useSearchInput } from '../hooks/useSearchInput';
import { useSearchConditions } from '../hooks/useSearchConditions';
import { useSearchSubmit } from '../hooks/useSearchSubmit';
import { SearchHistoryList } from './SearchHistoryList';

export function BookSearchInput() {
  const inputId = useId();
  const historyId = useId();
  const hintId = useId();
  const conditions = useSearchConditions();
  const submitSearch = useSearchSubmit(conditions);
  const input = useSearchInput({
    initialSearchKeyword: conditions.target ? '' : conditions.searchKeyword,
    onSearch: submitSearch,
  });

  return (
    <form
      ref={input.formRef}
      onSubmit={input.handleSubmit}
      onKeyDown={input.handleKeyDown}
      className={cx('relative h-12 min-w-0 flex-1', input.isHistoryVisible && 'z-20')}
    >
      <label htmlFor={inputId} className={cx('sr-only')}>
        검색어
      </label>
      <div
        className={cx(
          'absolute inset-x-0 top-0 overflow-hidden rounded-[24px] bg-palette-lightGray transition-shadow',
          'has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-palette-primary',
          input.isHistoryVisible && 'shadow-md'
        )}
      >
        <InputGroup variant="embedded">
          <InputGroupInput
            ref={input.inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            placeholder="검색어를 입력하세요"
            value={input.searchKeyword}
            onChange={(event) => input.setSearchKeyword(event.target.value)}
            onFocus={input.openHistory}
            onClick={input.openHistory}
            onKeyDown={input.handleInputKeyDown}
            aria-controls={input.isHistoryVisible ? historyId : undefined}
            aria-describedby={input.isHistoryVisible ? hintId : undefined}
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        {input.isHistoryVisible && (
          <>
            <p id={hintId} className={cx('sr-only')}>
              최근 검색어 목록입니다. 아래 방향키 또는 Tab 키로 이동해 검색하거나 삭제할 수
              있습니다. Escape 키로 닫습니다.
            </p>
            <SearchHistoryList
              id={historyId}
              searchKeywords={input.searchKeywords}
              onSelect={input.handleSelectKeyword}
              onRemove={input.handleRemoveKeyword}
              onFocusInput={input.focusInput}
            />
          </>
        )}
      </div>
    </form>
  );
}
