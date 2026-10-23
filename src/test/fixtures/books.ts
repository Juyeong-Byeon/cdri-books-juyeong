import type { Book } from '@/types/domain/book';
import type { KakaoBookDocumentDTO, KakaoBookSearchResponseDTO } from '@/types/dto/kakao-book';

export function createBookDocument(
  overrides: Partial<KakaoBookDocumentDTO> = {}
): KakaoBookDocumentDTO {
  return {
    title: '테스트 도서',
    contents: '도서 소개입니다.',
    url: 'https://example.com/books/1',
    isbn: '0132350882 9780132350884',
    authors: ['테스트 저자'],
    publisher: '테스트 출판사',
    translators: [],
    datetime: '2026-01-01T00:00:00.000+09:00',
    thumbnail: '',
    price: 16000,
    sale_price: 13500,
    status: '정상판매',
    ...overrides,
  };
}

export function createBookSearchResponse(
  documents: KakaoBookDocumentDTO[] = [],
  meta: Partial<KakaoBookSearchResponseDTO['meta']> = {}
): KakaoBookSearchResponseDTO {
  return {
    documents,
    meta: {
      total_count: documents.length,
      pageable_count: documents.length,
      is_end: true,
      ...meta,
    },
  };
}

export function createBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 'isbn:9780132350884',
    title: '테스트 도서',
    contents: '도서 소개입니다.',
    url: 'https://example.com/books/1',
    isbn: '9780132350884',
    authors: ['테스트 저자'],
    publisher: '테스트 출판사',
    translators: [],
    publishedAt: null,
    thumbnail: null,
    price: 16000,
    salePrice: 13500,
    status: '정상판매',
    ...overrides,
  };
}
