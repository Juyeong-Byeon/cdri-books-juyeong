import { BOOK_PAGE_SIZE, type BookSearchConditions } from '@/types/domain/book-search';
import type { KakaoBookSearchResponseDTO } from '@/types/dto/kakao-book';
import { mapBookSearchPage } from './mappers/bookMapper';

export class BookSearchError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'BookSearchError';
  }
}

function getErrorMessage(status: number): string {
  if (status === 401 || status === 403)
    return '카카오 API 인증에 실패했습니다. 서버의 API 키와 권한을 확인해 주세요.';
  if (status === 429) return '검색 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.';
  if (status === 400) return '검색 조건을 확인한 뒤 다시 검색해 주세요.';
  if (status === 503)
    return '검색 서버를 사용할 수 없습니다. 서버의 API 키 설정과 연결 상태를 확인해 주세요.';
  return '도서 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

export async function searchBooks(
  conditions: BookSearchConditions,
  page: number,
  signal: AbortSignal
) {
  const params = new URLSearchParams({
    query: conditions.searchKeyword,
    sort: conditions.sort,
    page: String(page),
    size: String(BOOK_PAGE_SIZE),
  });
  if (conditions.target) params.set('target', conditions.target);

  const response = await fetch(`/api/books?${params}`, { signal });
  // 업스트림 오류 본문은 인증 정보가 포함될 수 있어 UI나 로그에 전달하지 않습니다.
  if (!response.ok) throw new BookSearchError(getErrorMessage(response.status), response.status);

  try {
    const data = (await response.json()) as KakaoBookSearchResponseDTO;
    if (
      !data ||
      !Array.isArray(data.documents) ||
      !data.meta ||
      !Number.isInteger(data.meta.total_count) ||
      data.meta.total_count < 0 ||
      !Number.isInteger(data.meta.pageable_count) ||
      data.meta.pageable_count < 0 ||
      typeof data.meta.is_end !== 'boolean'
    ) {
      throw new Error();
    }
    return mapBookSearchPage(data);
  } catch (error) {
    if (signal.aborted) throw error;
    throw new BookSearchError('검색 서버의 응답 형식이 올바르지 않습니다.');
  }
}
