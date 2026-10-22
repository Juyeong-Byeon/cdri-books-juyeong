import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeLocalStorage } from '../util/safe-local-storage';

const MAX_SEARCH_HISTORY = 8;

interface SearchHistoryStore {
  searchKeywords: string[];
  addSearchKeyword: (searchKeyword: string) => void;
  removeSearchKeyword: (searchKeyword: string) => void;
  clearSearchHistory: () => void;
}

function normalizeSearchKeywords(searchKeywords: unknown) {
  if (!Array.isArray(searchKeywords)) {
    return [];
  }

  const normalizedKeywords = searchKeywords
    .filter((keyword): keyword is string => typeof keyword === 'string')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return [...new Set(normalizedKeywords)].slice(0, MAX_SEARCH_HISTORY);
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set) => ({
      searchKeywords: [],
      addSearchKeyword: (searchKeyword) => {
        const normalizedKeyword = searchKeyword.trim();

        if (!normalizedKeyword) {
          return;
        }

        set((state) => ({
          searchKeywords: [
            normalizedKeyword,
            ...state.searchKeywords.filter(
              (existingKeyword) => existingKeyword !== normalizedKeyword
            ),
          ].slice(0, MAX_SEARCH_HISTORY),
        }));
      },
      removeSearchKeyword: (searchKeyword) => {
        set((state) => ({
          searchKeywords: state.searchKeywords.filter((keyword) => keyword !== searchKeyword),
        }));
      },
      clearSearchHistory: () => set({ searchKeywords: [] }),
    }),
    {
      name: 'cdri-books:search-history',
      version: 2,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ searchKeywords: state.searchKeywords }),
      migrate: (persistedState, version) => {
        const state =
          typeof persistedState === 'object' && persistedState !== null
            ? (persistedState as { searchKeywords?: unknown; terms?: unknown })
            : {};
        const savedKeywords = version < 2 ? state.terms : state.searchKeywords;

        return { searchKeywords: normalizeSearchKeywords(savedKeywords) };
      },
      merge: (persistedState, currentState) => {
        const state =
          typeof persistedState === 'object' && persistedState !== null
            ? (persistedState as { searchKeywords?: unknown; terms?: unknown })
            : undefined;

        return {
          ...currentState,
          searchKeywords: normalizeSearchKeywords(state?.searchKeywords ?? state?.terms),
        };
      },
    }
  )
);
