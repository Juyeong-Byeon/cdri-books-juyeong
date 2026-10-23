import { describe, expect, it } from 'vitest';
import { parseSearchConditions, serializeSearchConditions } from './searchParams';

describe('검색 URL 어댑터', () => {
  it('검색어 공백과 허용되지 않은 대상·정렬을 정규화한다', () => {
    const conditions = parseSearchConditions(
      new URLSearchParams('q=+책+&target=isbn&sort=wrong&page=7')
    );
    expect(conditions).toEqual({ searchKeyword: '책', target: undefined, sort: 'accuracy' });
    expect(serializeSearchConditions(conditions).toString()).toBe('q=%EC%B1%85');
  });
  it.each(['title', 'person', 'publisher'])('허용 대상 %s와 정렬을 왕복 보존한다', (target) => {
    const params = new URLSearchParams({ q: '무라카미 하루키', target, sort: 'latest' });
    expect(serializeSearchConditions(parseSearchConditions(params)).toString()).toBe(
      params.toString()
    );
  });
  it('검색어가 없으면 대상도 제거하고 기본값을 생략한다', () => {
    expect(
      serializeSearchConditions(
        parseSearchConditions(new URLSearchParams('q=+&target=title&sort=accuracy'))
      ).toString()
    ).toBe('');
  });
});
