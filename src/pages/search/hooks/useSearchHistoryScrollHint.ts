import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

export function useSearchHistoryScrollHint(searchKeywords: readonly string[]) {
  const listRef = useRef<HTMLUListElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const updateScrollHint = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    setHasMoreBelow(list.scrollHeight - list.clientHeight - list.scrollTop > 1);
  }, []);

  useLayoutEffect(() => {
    updateScrollHint();

    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(list);
    return () => observer.disconnect();
  }, [searchKeywords, updateScrollHint]);

  return useMemo(
    () => ({ listRef, hasMoreBelow, updateScrollHint }),
    [listRef, hasMoreBelow, updateScrollHint]
  );
}
