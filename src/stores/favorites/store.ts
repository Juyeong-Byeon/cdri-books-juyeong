import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Book } from '@/types/domain/book';
import { safeLocalStorage } from '../util/safe-local-storage';

interface FavoritesStore {
  books: Book[];
  toggleFavorite: (book: Book) => void;
  isFavorite: (id: string) => boolean;
}

function snapshotBook(book: Book): Book {
  return {
    ...book,
    authors: [...book.authors],
    translators: [...book.translators],
  };
}

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const book = value as Record<string, unknown>;

  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.contents === 'string' &&
    typeof book.url === 'string' &&
    typeof book.isbn === 'string' &&
    Array.isArray(book.authors) &&
    book.authors.every((author) => typeof author === 'string') &&
    typeof book.publisher === 'string' &&
    Array.isArray(book.translators) &&
    book.translators.every((translator) => typeof translator === 'string') &&
    (typeof book.publishedAt === 'string' || book.publishedAt === null) &&
    (typeof book.thumbnail === 'string' || book.thumbnail === null) &&
    (typeof book.price === 'number' || book.price === null) &&
    (typeof book.salePrice === 'number' || book.salePrice === null) &&
    (typeof book.status === 'string' || book.status === null)
  );
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      books: [],
      toggleFavorite: (book) => {
        set((state) => {
          if (state.books.some((favorite) => favorite.id === book.id)) {
            return { books: state.books.filter((favorite) => favorite.id !== book.id) };
          }

          return { books: [...state.books, snapshotBook(book)] };
        });
      },
      isFavorite: (id) => get().books.some((book) => book.id === id),
    }),
    {
      name: 'cdri-books:favorites',
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ books: state.books }),
      merge: (persistedState, currentState) => {
        const books = (persistedState as { books?: unknown } | undefined)?.books;

        return {
          ...currentState,
          books: Array.isArray(books) ? books.filter(isBook).map(snapshotBook) : [],
        };
      },
    }
  )
);
