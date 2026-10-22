import { BOOK_PAGE_SIZE, type BookSearchConditions } from '@/types/domain/book-search';

export function getBookSearchQueryKey(conditions: BookSearchConditions) {
  return ['books', { ...conditions, size: BOOK_PAGE_SIZE }] as const;
}
