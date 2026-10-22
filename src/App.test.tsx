import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App navigation', () => {
  it('switches the visible section when a navigation tab is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { level: 2, name: '도서 검색' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '내가 찜한 책' }));

    expect(screen.getByRole('heading', { level: 2, name: '내가 찜한 책' })).toBeInTheDocument();
  });
});
