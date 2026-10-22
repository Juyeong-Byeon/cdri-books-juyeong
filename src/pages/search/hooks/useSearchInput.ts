import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
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
  const isHistoryVisible = isHistoryOpen && searchKeywords.length > 0;

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

  function openHistory() {
    setIsHistoryOpen(true);
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsHistoryOpen(false);
    onSearch(searchKeyword.trim());
  }

  function handleSelectKeyword(keyword: string) {
    setSearchKeyword(keyword);
    focusInput();
    setIsHistoryOpen(false);
    onSearch(keyword);
  }

  function handleRemoveKeyword(keyword: string) {
    focusInput();
    removeSearchKeyword(keyword);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.key !== 'ArrowDown' || searchKeywords.length === 0)
      return;

    event.preventDefault();
    setIsHistoryOpen(true);
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLButtonElement>('[data-history-select]')?.focus();
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.nativeEvent.isComposing || event.key !== 'Escape' || !isHistoryVisible) return;

    event.preventDefault();
    focusInput();
    setIsHistoryOpen(false);
  }

  return {
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
  };
}
