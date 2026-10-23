export function createBookSearchConfigurationError(): Response {
  return new Response(JSON.stringify({ error: 'Book search API is not configured' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
