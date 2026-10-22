import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

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
        '/api/search/book': {
          target: 'https://dapi.kakao.com',
          changeOrigin: true,
          rewrite: () => '/v3/search/book',
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
