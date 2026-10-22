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
  const {
    formRef,
    inputRef,
    searchKeyword,
    setSearchKeyword,
    searchKeywords,
    isHistoryVisible,
    openHistory,
    focusInput,
    handleSubmit,
    handleSelectKeyword,
    handleRemoveKeyword,
    handleInputKeyDown,
    handleKeyDown,
  } = useSearchInput({
    initialSearchKeyword: conditions.target ? '' : conditions.searchKeyword,
    onSearch: submitSearch,
  });

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={cx('relative h-12 min-w-0 flex-1', isHistoryVisible && 'z-20')}
    >
      <label htmlFor={inputId} className={cx('sr-only')}>
        검색어
      </label>
      <div
        className={cx(
          'absolute inset-x-0 top-0 overflow-hidden rounded-[24px] bg-palette-lightGray transition-shadow',
          'has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-palette-primary',
          isHistoryVisible && 'shadow-md'
        )}
      >
        <InputGroup variant="embedded">
          <InputGroupInput
            ref={inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onFocus={openHistory}
            onClick={openHistory}
            onKeyDown={handleInputKeyDown}
            aria-controls={isHistoryVisible ? historyId : undefined}
            aria-describedby={isHistoryVisible ? hintId : undefined}
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        {isHistoryVisible && (
          <>
            <p id={hintId} className={cx('sr-only')}>
              최근 검색어 목록입니다. 아래 방향키 또는 Tab 키로 이동해 검색하거나 삭제할 수
              있습니다. Escape 키로 닫습니다.
            </p>
            <SearchHistoryList
              id={historyId}
              searchKeywords={searchKeywords}
              onSelect={handleSelectKeyword}
              onRemove={handleRemoveKeyword}
              onFocusInput={focusInput}
            />
          </>
        )}
      </div>
    </form>
  );
}
