import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { createBookSearchConfigurationError } from './server/createBookSearchConfigurationError';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const kakaoApiKey = env.KAKAO_REST_API_KEY || '';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api/books': {
          target: 'https://dapi.kakao.com',
          changeOrigin: true,
          async bypass(_request, response) {
            if (kakaoApiKey || !response) return;
            const error = createBookSearchConfigurationError();
            response.writeHead(error.status, Object.fromEntries(error.headers));
            response.end(await error.text());
            // 종료한 응답을 업스트림으로 전달하지 않도록 Vite의 bypass 경로를 반환한다.
            return '/api/books';
          },
          rewrite: (path) => path.replace(/^\/api\/books(?=\?|$)/, '/v3/search/book'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (kakaoApiKey) {
                proxyReq.setHeader('Authorization', `KakaoAK ${kakaoApiKey}`);
              }
            });
          },
        },
      },
    },
  };
});
