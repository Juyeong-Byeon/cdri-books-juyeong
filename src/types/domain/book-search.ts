import type { Book } from './book';

export const BOOK_PAGE_SIZE = 10;
export const MAX_BOOK_PAGE = 50;

export const BOOK_SEARCH_TARGETS = {
  title: '제목',
  person: '저자명',
  publisher: '출판사',
} as const;

export type BookSearchTarget = keyof typeof BOOK_SEARCH_TARGETS;
export type BookSearchSort = 'accuracy' | 'latest';

export interface BookSearchConditions {
  searchKeyword: string;
  target?: BookSearchTarget;
  sort: BookSearchSort;
}

export interface BookSearchPage {
  books: Book[];
  meta: {
    totalCount: number;
    pageableCount: number;
    isEnd: boolean;
  };
}
