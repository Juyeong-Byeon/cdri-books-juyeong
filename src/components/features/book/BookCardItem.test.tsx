import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createBook } from '@/test/fixtures/books';
import { useFavoritesStore } from '@/stores/favorites/store';
import { BookCardItem } from './BookCardItem';

describe('도서 카드', () => {
  it('상세 ARIA와 표지 크기를 전환하고 가격·안전한 새 탭 링크를 표시한다', async () => {
    const user = userEvent.setup();
    render(<BookCardItem book={createBook({ thumbnail: 'https://example.com/cover.jpg' })} />);
    const toggle = screen.getByRole('button', { name: '테스트 도서 상세보기 펼치기' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('img', { name: '테스트 도서 표지' })).toHaveAttribute('width', '48');
    const purchase = screen.getByRole('link', { name: '테스트 도서 구매하기 (새 탭)' });
    expect(purchase).toHaveAttribute('href', 'https://example.com/books/1');
    expect(purchase).toHaveAttribute('target', '_blank');
    expect(purchase).toHaveAttribute('rel', 'noopener noreferrer');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toHaveTextContent(
      '도서 소개입니다.'
    );
    expect(screen.getByRole('img', { name: '테스트 도서 표지' })).toHaveAttribute('width', '210');
    expect(screen.getByText('도서 소개입니다.')).toBeVisible();
    expect(screen.getByText('16,000원')).toBeVisible();
    expect(screen.getByText('13,500원')).toBeVisible();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('도서 소개입니다.')).not.toBeInTheDocument();
  });

  it('찜 액션과 aria-pressed를 저장소에 연결하고 표지 오류를 대체한다', async () => {
    const user = userEvent.setup();
    const book = createBook({ thumbnail: 'https://example.com/missing.jpg' });
    render(<BookCardItem book={book} />);
    const favorite = screen.getByRole('button', { name: '테스트 도서 찜하기' });
    expect(favorite).toHaveAttribute('aria-pressed', 'false');
    await user.click(favorite);
    expect(favorite).toHaveAttribute('aria-pressed', 'true');
    expect(useFavoritesStore.getState().isFavorite(book.id)).toBe(true);
    await user.click(favorite);
    expect(useFavoritesStore.getState().books).toEqual([]);
    fireEvent.error(screen.getByRole('img', { name: '테스트 도서 표지' }));
    expect(screen.getByRole('img', { name: '테스트 도서 표지 없음' })).toBeInTheDocument();
  });

  it('구매 URL이 없으면 링크를 만들지 않고 가격 미제공을 표시한다', () => {
    render(
      <BookCardItem
        book={createBook({ url: 'javascript:alert(1)', price: null, salePrice: null })}
      />
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('가격 정보 없음')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /구매하기/ })).toBeDisabled();
  });
});
