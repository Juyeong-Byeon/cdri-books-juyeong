import { act, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { renderApp } from '@/test/renderApp';
import { createBookDocument, createBookSearchResponse } from '@/test/fixtures/books';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function observeLoadMore() {
  const observers: {
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
    active: boolean;
  }[] = [];
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      observers.push({
        callback,
        observer: this as unknown as IntersectionObserver,
        active: false,
      });
    }
    observe() {
      observers.find(
        ({ observer }) => observer === (this as unknown as IntersectionObserver)
      )!.active = true;
    }
    disconnect() {
      observers.find(
        ({ observer }) => observer === (this as unknown as IntersectionObserver)
      )!.active = false;
    }
  }
  vi.stubGlobal('IntersectionObserver', Observer);
  return () =>
    act(() => {
      observers
        .filter(({ active }) => active)
        .forEach(({ callback, observer }) => {
          callback([{ isIntersecting: true } as IntersectionObserverEntry], observer);
        });
    });
}

const first = createBookDocument({ title: '첫 페이지' });
const second = createBookDocument({
  title: '다음 페이지',
  isbn: '9780306406157',
  url: 'https://example.com/books/2',
});

describe('검색 결과와 추가 로딩', () => {
  it('관찰 영역 진입 시 다음 페이지를 한 번 요청하고 중복 도서를 제거하며 종료 후 멈춘다', async () => {
    const intersect = observeLoadMore();
    const gate = deferred();
    const pages: string[] = [];
    server.use(
      http.get('http://localhost/api/books', async ({ request }) => {
        const page = new URL(request.url).searchParams.get('page')!;
        pages.push(page);
        if (page === '2') await gate.promise;
        return HttpResponse.json(
          createBookSearchResponse(page === '1' ? [first] : [first, second], {
            total_count: 2,
            is_end: page === '2',
          })
        );
      })
    );
    const { user } = renderApp('/?q=책');
    await screen.findByRole('heading', { name: '첫 페이지' });
    await waitFor(() => expect(screen.getByRole('button', { name: '더 불러오기' })).toBeEnabled());
    intersect();
    intersect();
    await screen.findByRole('button', { name: '도서를 불러오는 중…' });
    await user.click(screen.getByRole('button', { name: '도서를 불러오는 중…' }));
    expect(pages).toEqual(['1', '2']);
    expect(screen.getByRole('heading', { name: '첫 페이지' })).toBeInTheDocument();
    await act(async () => gate.resolve());
    await screen.findByRole('heading', { name: '다음 페이지' });
    expect(screen.getAllByRole('heading', { name: '첫 페이지' })).toHaveLength(1);
    expect(screen.getByText('모든 도서를 불러왔습니다.')).toBeInTheDocument();
    intersect();
    expect(pages).toEqual(['1', '2']);
  });

  it('추가 페이지 실패 시 기존 결과를 유지하고 같은 페이지부터 수동 재시도한다', async () => {
    let fail = true;
    const pages: string[] = [];
    server.use(
      http.get('http://localhost/api/books', ({ request }) => {
        const page = new URL(request.url).searchParams.get('page')!;
        pages.push(page);
        if (page === '2' && fail) return HttpResponse.json({ error: 'quota' }, { status: 429 });
        return HttpResponse.json(
          createBookSearchResponse(page === '1' ? [first] : [second], {
            total_count: 2,
            is_end: page === '2',
          })
        );
      })
    );
    const { user } = renderApp('/?q=책');
    await screen.findByRole('heading', { name: '첫 페이지' });
    await user.click(await screen.findByRole('button', { name: '더 불러오기' }));
    await screen.findByRole('heading', { name: '다음 도서를 불러오지 못했습니다.' });
    expect(screen.getByRole('heading', { name: '첫 페이지' })).toBeInTheDocument();
    expect(screen.queryByText('검색된 결과가 없습니다.')).not.toBeInTheDocument();
    fail = false;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    await screen.findByRole('heading', { name: '다음 페이지' });
    expect(pages).toEqual(['1', '2', '2']);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('대기 중인 이전 검색을 취소하고 새 조건은 첫 페이지에서 분리한다', async () => {
    const gate = deferred();
    const requests: { keyword: string | null; page: string | null; signal: AbortSignal }[] = [];
    server.use(
      http.get('http://localhost/api/books', async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const keyword = params.get('query');
        requests.push({ keyword, page: params.get('page'), signal: request.signal });
        if (keyword === '이전') await gate.promise;
        return HttpResponse.json(
          createBookSearchResponse([createBookDocument({ title: `${keyword} 결과` })])
        );
      })
    );
    const { user } = renderApp('/?q=이전');
    await waitFor(() => expect(requests).toHaveLength(1));
    const input = screen.getByRole('searchbox', { name: '검색어' });
    await user.clear(input);
    await user.type(input, '새검색{Enter}');
    await screen.findByRole('heading', { name: '새검색 결과' });
    expect(requests[0].signal.aborted).toBe(true);
    expect(requests[1]).toMatchObject({ keyword: '새검색', page: '1' });
    await act(async () => gate.resolve());
    expect(screen.queryByRole('heading', { name: '이전 결과' })).not.toBeInTheDocument();
  });

  it.each([400, 401, 403, 429])('%s는 자동 재시도하지 않고 빈 결과와 구분한다', async (status) => {
    let count = 0;
    server.use(
      http.get('http://localhost/api/books', () => {
        count++;
        return HttpResponse.json({ error: 'secret-upstream-detail' }, { status });
      })
    );
    renderApp('/?q=오류');
    await screen.findByRole('alert');
    expect(count).toBe(1);
    expect(screen.queryByText('검색된 결과가 없습니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('secret-upstream-detail')).not.toBeInTheDocument();
    if (status !== 429)
      expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument();
  });

  it.each([500, 503, 'network'] as const)(
    '%s는 한 번만 자동 재시도하고 수동으로 복구한다',
    async (status) => {
      let count = 0;
      let fail = true;
      server.use(
        http.get('http://localhost/api/books', () => {
          count++;
          if (!fail) return HttpResponse.json(createBookSearchResponse([first]));
          return status === 'network'
            ? HttpResponse.error()
            : HttpResponse.json({ error: 'unavailable' }, { status });
        })
      );
      const { user } = renderApp('/?q=오류');
      await screen.findByRole('alert', {}, { timeout: 5000 });
      expect(count).toBe(2);
      fail = false;
      await user.click(screen.getByRole('button', { name: '다시 시도' }));
      await screen.findByRole('heading', { name: '첫 페이지' });
      expect(count).toBe(3);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }
  );

  it('잘못된 응답 구조도 빈 결과로 숨기지 않는다', async () => {
    server.use(
      http.get('http://localhost/api/books', () => HttpResponse.json({ documents: [], meta: {} }))
    );
    renderApp('/?q=책');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '검색 서버의 응답 형식이 올바르지 않습니다.'
    );
    expect(screen.queryByText('검색된 결과가 없습니다.')).not.toBeInTheDocument();
  });

  it('기존 결과의 갱신 실패는 목록을 유지하면서 별도로 알린다', async () => {
    let count = 0;
    server.use(
      http.get('http://localhost/api/books', () => {
        count++;
        return count === 1
          ? HttpResponse.json(createBookSearchResponse([first]))
          : HttpResponse.json({}, { status: 429 });
      })
    );
    const { user } = renderApp('/?q=책');
    await screen.findByRole('heading', { name: '첫 페이지' });
    await user.click(screen.getByRole('searchbox', { name: '검색어' }));
    await user.keyboard('{Enter}');
    await screen.findByRole('heading', { name: '검색 결과를 갱신하지 못했습니다.' });
    expect(screen.getByRole('heading', { name: '첫 페이지' })).toBeInTheDocument();
    expect(count).toBe(2);
  });

  it('빈 페이지는 is_end가 false여도 추가 요청을 멈춘다', async () => {
    let count = 0;
    server.use(
      http.get('http://localhost/api/books', () => {
        count++;
        return HttpResponse.json(createBookSearchResponse([], { is_end: false }));
      })
    );
    renderApp('/?q=책');
    await waitFor(() => expect(count).toBe(1));
    await screen.findByText('검색된 결과가 없습니다.');
    expect(screen.queryByRole('button', { name: '더 불러오기' })).not.toBeInTheDocument();
  });
});
