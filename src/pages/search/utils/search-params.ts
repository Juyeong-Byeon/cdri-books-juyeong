import {
  BOOK_SEARCH_TARGETS,
  type BookSearchConditions,
  type BookSearchTarget,
} from '@/types/domain/book-search';

export function parseSearchConditions(params: URLSearchParams): BookSearchConditions {
  const target = params.get('target');
  const searchKeyword = params.get('q')?.trim() ?? '';
  return {
    searchKeyword,
    target:
      searchKeyword && target && Object.keys(BOOK_SEARCH_TARGETS).includes(target)
        ? (target as BookSearchTarget)
        : undefined,
    sort: params.get('sort') === 'latest' ? 'latest' : 'accuracy',
  };
}

export function serializeSearchConditions(conditions: BookSearchConditions): URLSearchParams {
  const params = new URLSearchParams();
  const searchKeyword = conditions.searchKeyword.trim();
  if (searchKeyword) {
    params.set('q', searchKeyword);
    if (conditions.target) params.set('target', conditions.target);
  }
  if (conditions.sort === 'latest') params.set('sort', conditions.sort);
  return params;
}
