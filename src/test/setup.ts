import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, vi } from 'vitest';
import { useFavoritesStore } from '@/stores/favorites/store';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';
import { server } from './server';

const unhandledRequests: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledRequest(request, print) {
      unhandledRequests.push(`${request.method} ${request.url}`);
      print.error();
    },
  })
);
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  if (typeof window !== 'undefined') {
    useFavoritesStore.setState({ books: [] });
    useSearchHistoryStore.setState({ searchKeywords: [] });
    localStorage.clear();
    window.history.replaceState(null, '', '/');
  }
  expect(unhandledRequests.splice(0)).toEqual([]);
});
afterAll(() => server.close());

// Radix가 사용하는 브라우저 API 중 JSDOM에 없는 부분만 보완한다.
if (typeof window !== 'undefined') {
  window.PointerEvent ??= MouseEvent as typeof PointerEvent;
  HTMLElement.prototype.hasPointerCapture ??= () => false;
  HTMLElement.prototype.setPointerCapture ??= () => {};
  HTMLElement.prototype.releasePointerCapture ??= () => {};
  HTMLElement.prototype.scrollIntoView ??= () => {};
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
