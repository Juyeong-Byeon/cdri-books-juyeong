import { describe, expect, it } from 'vitest';
import { formatAuthors, formatBookTitle, formatPrice, getPurchaseUrl } from './formatBook';

describe('도서 표시 형식', () => {
  it('제목의 괄호와 HTML 엔티티를 제거한다', () => {
    expect(formatBookTitle('<어둠의 저편> &lt;책&gt;')).toBe('어둠의 저편 책');
    expect(formatBookTitle(' ')).toBe('제목 정보 없음');
  });
  it('분리된 글자 저자는 합치고 여러 저자는 구분한다', () => {
    expect(formatAuthors(['가', '톨', '릭', '대'])).toBe('가톨릭대');
    expect(formatAuthors([' 저자1 ', '저자2'])).toBe('저자1, 저자2');
    expect(formatAuthors([])).toBe('저자 정보 없음');
  });
  it('0원과 미제공 가격을 구별한다', () => {
    expect(formatPrice(0)).toBe('0원');
    expect(formatPrice(13500)).toBe('13,500원');
    expect(formatPrice(null)).toBe('가격 정보 없음');
  });
  it.each(['', 'javascript:alert(1)', 'data:text/html,test', '/relative'])(
    '구매 URL %s를 허용하지 않는다',
    (url) => {
      expect(getPurchaseUrl(url)).toBeNull();
    }
  );
  it('HTTP(S) 구매 URL만 허용한다', () => {
    expect(getPurchaseUrl('https://example.com/book')).toBe('https://example.com/book');
    expect(getPurchaseUrl('http://example.com/book')).toBe('http://example.com/book');
  });
});
