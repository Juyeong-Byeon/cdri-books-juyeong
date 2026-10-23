import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createBook } from '@/test/fixtures/books';
import { renderApp } from '@/test/renderApp';
import { useFavoritesStore } from '@/stores/favorites/store';

describe('찜한 책 페이지', () => {
  it('저장된 도서를 검색 API 없이 표시하고 마지막 해제 시 빈 화면으로 바뀐다', async () => {
    useFavoritesStore.getState().toggleFavorite(createBook());
    const { user } = renderApp('/favorites');
    expect(screen.getByRole('heading', { name: '테스트 도서' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '테스트 도서 찜 해제' }));
    expect(screen.getByText('찜한 책이 없습니다.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '테스트 도서' })).not.toBeInTheDocument();
  });
});
