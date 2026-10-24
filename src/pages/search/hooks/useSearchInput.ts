import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';

interface UseSearchInputOptions {
  initialSearchKeyword: string;
  onSearch: (searchKeyword: string) => void;
}

export function useSearchInput({ initialSearchKeyword, onSearch }: UseSearchInputOptions) {
  const [searchKeyword, setSearchKeyword] = useState(initialSearchKeyword);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const searchKeywords = useSearchHistoryStore((state) => state.searchKeywords);
  const removeSearchKeyword = useSearchHistoryStore((state) => state.removeSearchKeyword);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSearchHistory = searchKeywords.length > 0;
  const isHistoryVisible = isHistoryOpen && hasSearchHistory;

  useEffect(() => {
    if (!isHistoryVisible) return;

    function dismissWhenOutside(event: Event) {
      if (event.target instanceof Node && !formRef.current?.contains(event.target)) {
        setIsHistoryOpen(false);
      }
    }

    document.addEventListener('pointerdown', dismissWhenOutside);
    document.addEventListener('focusin', dismissWhenOutside);
    return () => {
      document.removeEventListener('pointerdown', dismissWhenOutside);
      document.removeEventListener('focusin', dismissWhenOutside);
    };
  }, [isHistoryVisible]);

  const openHistory = useCallback(() => {
    setIsHistoryOpen(true);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsHistoryOpen(false);
      onSearch(searchKeyword.trim());
    },
    [onSearch, searchKeyword]
  );

  const handleSelectKeyword = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      focusInput();
      setIsHistoryOpen(false);
      onSearch(keyword);
    },
    [focusInput, onSearch]
  );

  const handleRemoveKeyword = useCallback(
    (keyword: string) => {
      focusInput();
      removeSearchKeyword(keyword);
    },
    [focusInput, removeSearchKeyword]
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'ArrowDown' || !hasSearchHistory) return;

      event.preventDefault();
      setIsHistoryOpen(true);
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLButtonElement>('[data-history-select]')?.focus();
      });
    },
    [hasSearchHistory]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'Escape' || !isHistoryVisible) return;

      event.preventDefault();
      focusInput();
      setIsHistoryOpen(false);
    },
    [focusInput, isHistoryVisible]
  );

  return useMemo(
    () => ({
      searchKeyword,
      setSearchKeyword,
      searchKeywords,
      isHistoryVisible,
      formRef,
      inputRef,
      openHistory,
      focusInput,
      handleSubmit,
      handleSelectKeyword,
      handleRemoveKeyword,
      handleInputKeyDown,
      handleKeyDown,
    }),
    [
      searchKeyword,
      setSearchKeyword,
      searchKeywords,
      isHistoryVisible,
      formRef,
      inputRef,
      openHistory,
      focusInput,
      handleSubmit,
      handleSelectKeyword,
      handleRemoveKeyword,
      handleInputKeyDown,
      handleKeyDown,
    ]
  );
}
