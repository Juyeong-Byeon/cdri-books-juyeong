import { useLocation } from 'react-router';
import { cx } from '@/lib/utils';
import { AdvancedSearchPopover } from './AdvancedSearchPopover';
import { BookSearchInput } from './BookSearchInput';

export function BookSearchBar() {
  const location = useLocation();

  return (
    <div
      key={location.key}
      role="search"
      aria-label="도서 검색"
      className={cx('flex items-center gap-3')}
    >
      <BookSearchInput />
      <AdvancedSearchPopover />
    </div>
  );
}
