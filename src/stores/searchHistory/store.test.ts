import { describe, expect, it } from 'vitest';
import { useSearchHistoryStore } from './store';

describe('검색 기록 저장소', () => {
  it('공백은 저장하지 않고 중복은 맨 앞으로 이동하며 최대 8개를 보관한다', () => {
    const { addSearchKeyword } = useSearchHistoryStore.getState();
    addSearchKeyword(' ');
    for (let index = 0; index < 10; index++) addSearchKeyword(`책${index}`);
    addSearchKeyword(' 책5 ');
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual([
      '책5',
      '책9',
      '책8',
      '책7',
      '책6',
      '책4',
      '책3',
      '책2',
    ]);
  });
  it('개별 삭제와 전체 삭제를 저장한다', () => {
    const { addSearchKeyword, removeSearchKeyword, clearSearchHistory } =
      useSearchHistoryStore.getState();
    addSearchKeyword('첫째');
    addSearchKeyword('둘째');
    removeSearchKeyword('첫째');
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual(['둘째']);
    clearSearchHistory();
    expect(
      JSON.parse(localStorage.getItem('cdri-books:search-history')!).state.searchKeywords
    ).toEqual([]);
  });
  it.each([
    { version: 2, state: { searchKeywords: [' 책 ', '책', '', 5, '다른 책'] } },
    { version: 1, state: { terms: [' 책 ', '책', '', 5, '다른 책'] } },
  ])('현재 및 이전 저장 형식에서 기록을 복원한다 ($version)', async (saved) => {
    localStorage.setItem('cdri-books:search-history', JSON.stringify(saved));
    await useSearchHistoryStore.persist.rehydrate();
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual(['책', '다른 책']);
  });
});
