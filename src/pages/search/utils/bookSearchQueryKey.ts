import { type BookSearchConditions } from '@/types/domain/book-search';

export function getBookSearchQueryKey(conditions: BookSearchConditions) {
  return ['books', { ...conditions }] as const;
}
