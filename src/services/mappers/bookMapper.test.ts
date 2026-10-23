import { describe, expect, it } from 'vitest';
import { createBookDocument, createBookSearchResponse } from '@/test/fixtures/books';
import { mapBook, mapBookSearchPage } from './bookMapper';

describe('도서 매퍼', () => {
  it.each([
    ['0132350882 978-0-13-235088-4', 'isbn:9780132350884', '9780132350884'],
    ['0132350882', 'isbn:0132350882', '0132350882'],
    ['invalid 9780132350885', 'url:https://example.com/books/1', ''],
    ['', 'url:https://example.com/books/1', ''],
  ])('ISBN %s를 안정적인 ID로 변환한다', (isbn, id, normalized) => {
    expect(mapBook(createBookDocument({ isbn }))).toMatchObject({ id, isbn: normalized });
  });

  it('ISBN과 URL이 모두 없으면 목록에서 제외한다', () => {
    const page = mapBookSearchPage(
      createBookSearchResponse([createBookDocument({ isbn: '', url: ' ' }), createBookDocument()], {
        total_count: 8,
        pageable_count: 7,
        is_end: false,
      })
    );
    expect(page.books).toHaveLength(1);
    expect(page.meta).toEqual({ totalCount: 8, pageableCount: 7, isEnd: false });
  });

  it('빈 필드와 저자 배열을 정리하고 0원은 유지한다', () => {
    expect(
      mapBook(
        createBookDocument({
          title: ' ',
          contents: ' ',
          thumbnail: ' ',
          datetime: '',
          status: '',
          publisher: ' 출판사 ',
          authors: [' 저자 ', ''],
          translators: [' 번역자 ', ' '],
          price: 0,
          sale_price: -1,
        })
      )
    ).toMatchObject({
      title: '제목 정보 없음',
      contents: '',
      thumbnail: null,
      publishedAt: null,
      status: null,
      publisher: '출판사',
      authors: ['저자'],
      translators: ['번역자'],
      price: 0,
      salePrice: null,
    });
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    '유효하지 않은 가격 %s를 미제공으로 처리한다',
    (price) => {
      expect(mapBook(createBookDocument({ price, sale_price: price }))).toMatchObject({
        price: null,
        salePrice: null,
      });
    }
  );
});
