import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App navigation', () => {
  it('switches the visible section when a navigation tab is selected', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: '도서 검색' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }));

    expect(screen.getByRole('heading', { level: 1, name: '내가 찜한 책' })).toBeInTheDocument();
  });
});
