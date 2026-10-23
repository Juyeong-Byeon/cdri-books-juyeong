import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createBookSearchResponse } from './fixtures/books';

export const server = setupServer(
  http.get('http://localhost/api/books', () => HttpResponse.json(createBookSearchResponse()))
);
