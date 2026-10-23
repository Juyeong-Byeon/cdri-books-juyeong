import { describe, expect, it, vi } from 'vitest';
import { createBook } from '@/test/fixtures/books';
import { useFavoritesStore } from './store';

describe('찜 저장소', () => {
  it('추가 후 같은 ID로 토글하면 중복 없이 해제한다', () => {
    const book = createBook();
    useFavoritesStore.getState().toggleFavorite(book);
    expect(useFavoritesStore.getState().isFavorite(book.id)).toBe(true);
    expect(useFavoritesStore.getState().books).toHaveLength(1);
    useFavoritesStore.getState().toggleFavorite({ ...book, title: '변경된 제목' });
    expect(useFavoritesStore.getState().books).toEqual([]);
  });
  it('찜 시점의 도서와 배열 스냅샷을 저장한다', () => {
    const book = createBook({ translators: ['번역자'] });
    useFavoritesStore.getState().toggleFavorite(book);
    book.title = '변경';
    book.authors.push('다른 저자');
    book.translators[0] = '변경';
    expect(useFavoritesStore.getState().books[0]).toMatchObject({
      title: '테스트 도서',
      authors: ['테스트 저자'],
      translators: ['번역자'],
    });
  });
  it('저장된 도서를 재수화하고 손상된 항목을 제외한다', async () => {
    localStorage.setItem(
      'cdri-books:favorites',
      JSON.stringify({ version: 1, state: { books: [createBook(), { id: 'invalid' }] } })
    );
    await useFavoritesStore.persist.rehydrate();
    expect(useFavoritesStore.getState().books).toEqual([createBook()]);
  });
  it.each(['{broken', JSON.stringify({ version: 1, state: { books: 'broken' } })])(
    '잘못된 저장 데이터가 앱을 중단하지 않는다',
    async (value) => {
      localStorage.setItem('cdri-books:favorites', value);
      await expect(useFavoritesStore.persist.rehydrate()).resolves.not.toThrow();
      expect(useFavoritesStore.getState().books).toEqual([]);
    }
  );
  it('저장소 접근이 차단되어도 현재 세션에서 찜을 사용할 수 있다', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    await useFavoritesStore.persist.rehydrate();
    expect(() => useFavoritesStore.getState().toggleFavorite(createBook())).not.toThrow();
    expect(useFavoritesStore.getState().books).toHaveLength(1);
  });
});
