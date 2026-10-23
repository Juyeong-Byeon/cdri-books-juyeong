import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';

describe('화면 오류 경계', () => {
  it('렌더 오류가 발생해도 헤더를 유지하고 다시 시도와 탭 이동으로 복구한다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let broken = true;
    function Content() {
      if (broken) throw new Error('render failed');
      return <p>복구된 화면</p>;
    }
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Content />} />
            <Route path="/favorites" element={<p>찜한 책 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('화면을 표시하지 못했습니다.');
    expect(screen.getByRole('link', { name: '도서 검색' })).toBeInTheDocument();
    broken = false;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(screen.getByText('복구된 화면')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }));
    expect(screen.getByText('찜한 책 화면')).toBeInTheDocument();
  });
});
