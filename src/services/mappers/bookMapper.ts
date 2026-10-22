import type { Book } from '@/types/domain/book';
import type { BookSearchPage } from '@/types/domain/book-search';
import type { KakaoBookDocumentDTO, KakaoBookSearchResponseDTO } from '@/types/dto/kakao-book';

function isValidIsbn(isbn: string): boolean {
  if (/^\d{13}$/.test(isbn)) {
    const sum = [...isbn].reduce(
      (total, digit, index) => total + Number(digit) * (index % 2 ? 3 : 1),
      0
    );
    return sum % 10 === 0;
  }

  if (/^\d{9}[\dX]$/.test(isbn)) {
    const sum = [...isbn].reduce(
      (total, digit, index) => total + (digit === 'X' ? 10 : Number(digit)) * (10 - index),
      0
    );
    return sum % 11 === 0;
  }

  return false;
}

function getIsbn(value: string): string {
  const candidates = value
    .trim()
    .split(/\s+/)
    .map((isbn) => isbn.replace(/-/g, '').toUpperCase())
    .filter(isValidIsbn);
  return candidates.find((isbn) => isbn.length === 13) ?? candidates[0] ?? '';
}

function normalizePrice(price: number): number | null {
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function mapBook(document: KakaoBookDocumentDTO): Book | null {
  const isbn = getIsbn(document.isbn ?? '');
  const url = document.url?.trim() ?? '';

  if (!isbn && !url) return null;

  return {
    id: isbn ? `isbn:${isbn}` : `url:${url}`,
    title: document.title?.trim() || '제목 정보 없음',
    contents: document.contents?.trim() ?? '',
    url,
    isbn,
    authors: (document.authors ?? []).map((author) => author.trim()).filter(Boolean),
    publisher: document.publisher?.trim() ?? '',
    translators: (document.translators ?? [])
      .map((translator) => translator.trim())
      .filter(Boolean),
    publishedAt: document.datetime?.trim() || null,
    thumbnail: document.thumbnail?.trim() || null,
    price: normalizePrice(document.price),
    salePrice: normalizePrice(document.sale_price),
    status: document.status?.trim() || null,
  };
}

export function mapBookSearchPage(response: KakaoBookSearchResponseDTO): BookSearchPage {
  return {
    books: response.documents.map(mapBook).filter((book): book is Book => book !== null),
    meta: {
      totalCount: response.meta.total_count,
      pageableCount: response.meta.pageable_count,
      isEnd: response.meta.is_end,
    },
  };
}
