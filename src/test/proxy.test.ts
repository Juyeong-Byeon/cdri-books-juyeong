// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';
import { http, HttpResponse, passthrough } from 'msw';
import viteConfig from '../../vite.config';
import { onRequestGet } from '../../functions/api/books';
import { server } from './server';

let devServer: ViteDevServer | undefined;
afterEach(async () => {
  await devServer?.close();
  devServer = undefined;
});

async function startProxy(key: string) {
  // test 모드를 사용하므로 실제 키가 든 .env.dev를 읽지 않는다.
  vi.stubEnv('KAKAO_REST_API_KEY', key);
  if (typeof viteConfig !== 'function') throw new Error('Vite 설정 함수를 찾을 수 없습니다.');
  const config = await viteConfig({ mode: 'test', command: 'serve' });
  devServer = await createServer({
    ...config,
    configFile: false,
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { ...config.server, host: '127.0.0.1', port: 0, watch: null },
  });
  await devServer.listen();
  const address = devServer.httpServer?.address();
  if (!address || typeof address === 'string') throw new Error('개발 서버 주소가 없습니다.');
  const origin = `http://127.0.0.1:${address.port}`;
  server.use(http.get(`${origin}/api/books`, () => passthrough()));
  return origin;
}

describe('개발·배포 프록시', () => {
  it('키가 없으면 두 환경 모두 업스트림 없이 같은 503 JSON을 반환한다', async () => {
    let upstreamCalls = 0;
    server.use(
      http.get('https://dapi.kakao.com/v3/search/book', () => {
        upstreamCalls++;
        return HttpResponse.json({ unexpected: true });
      })
    );
    const origin = await startProxy('');
    const development = await fetch(`${origin}/api/books?query=책`);
    const deployment = await onRequestGet({
      request: new Request('https://books.example/api/books?query=책'),
      env: {},
    });
    for (const response of [development, deployment]) {
      expect(response.status).toBe(503);
      expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
      expect(await response.json()).toEqual({ error: 'Book search API is not configured' });
    }
    expect(upstreamCalls).toBe(0);
  });

  it.each([200, 401, 429])(
    '한글 쿼리와 인증 헤더를 전달하고 업스트림 상태 %s를 보존한다',
    async (status) => {
      const requests: Request[] = [];
      server.use(
        http.get('https://dapi.kakao.com/v3/search/book', ({ request }) => {
          requests.push(request);
          return HttpResponse.json({ result: 'upstream' }, { status });
        })
      );
      const origin = await startProxy('test-only-key');
      const params = new URLSearchParams({
        query: '무라카미 하루키',
        target: 'person',
        sort: 'latest',
        page: '2',
        size: '10',
      });
      const development = await fetch(`${origin}/api/books?${params}`);
      const deployment = await onRequestGet({
        request: new Request(`https://books.example/api/books?${params}`),
        env: { KAKAO_REST_API_KEY: 'test-only-key' },
      });
      expect(requests).toHaveLength(2);
      for (const request of requests) {
        expect(new URL(request.url).pathname).toBe('/v3/search/book');
        expect(new URL(request.url).searchParams.toString()).toBe(params.toString());
        expect(request.headers.get('Authorization')).toBe('KakaoAK test-only-key');
        expect(request.url).not.toContain('test-only-key');
      }
      for (const response of [development, deployment]) {
        expect(response.status).toBe(status);
        expect(await response.json()).toEqual({ result: 'upstream' });
        expect(response.headers.get('Authorization')).toBeNull();
      }
    }
  );

  it('배포 함수의 연결 실패는 502로 구분한다', async () => {
    server.use(http.get('https://dapi.kakao.com/v3/search/book', () => HttpResponse.error()));
    const response = await onRequestGet({
      request: new Request('https://books.example/api/books?query=책'),
      env: { KAKAO_REST_API_KEY: 'test-only-key' },
    });
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Failed to proxy request to Kakao API' });
  });
});
