import { createBookSearchConfigurationError } from '../../server/createBookSearchConfigurationError';

interface CloudflareEnv {
  KAKAO_REST_API_KEY?: string;
}

interface CloudflareContext {
  request: Request;
  env: CloudflareEnv;
}

/**
 * Cloudflare Pages Function for the same-origin Kakao Books endpoint.
 * Route: /api/books
 */
export async function onRequestGet(context: CloudflareContext): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const targetUrl = new URL('https://dapi.kakao.com/v3/search/book');

  // 클라이언트의 쿼리 파라미터(query, sort, page, size, target) 그대로 포워딩
  requestUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const kakaoApiKey = context.env.KAKAO_REST_API_KEY;

  if (!kakaoApiKey) {
    return createBookSearchConfigurationError();
  }

  try {
    const kakaoResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    });

    return new Response(kakaoResponse.body, {
      status: kakaoResponse.status,
      headers: {
        'Content-Type':
          kakaoResponse.headers.get('Content-Type') ?? 'application/json; charset=utf-8',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to proxy request to Kakao API' }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
