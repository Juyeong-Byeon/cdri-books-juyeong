import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from './test/renderApp';

describe('App navigation', () => {
  it('switches the visible section when a navigation tab is selected', async () => {
    const { user } = renderApp();

    expect(screen.getByRole('heading', { level: 1, name: '도서 검색' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }));

    expect(screen.getByRole('heading', { level: 1, name: '내가 찜한 책' })).toBeInTheDocument();
  });
});
