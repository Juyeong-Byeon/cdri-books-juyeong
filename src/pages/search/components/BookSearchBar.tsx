import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/InputGroup';
import { cx } from '@/lib/utils';

export function BookSearchBar() {
  return (
    <div role="search" aria-label="도서 검색" className={cx('flex items-center gap-3')}>
      <label htmlFor="book-search-keyword" className={cx('sr-only')}>
        검색어
      </label>
      <InputGroup className={cx('flex-1')}>
        <InputGroupInput id="book-search-keyword" type="search" placeholder="검색어를 입력하세요" />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
      <Button type="button" variant="outline" size="sm" className={cx('shrink-0 text-body2')}>
        상세검색
      </Button>
    </div>
  );
}
