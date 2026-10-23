import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  enabled,
  onIntersect,
  rootMargin,
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<T>(null);
  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onIntersect();
      },
      { rootMargin }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);
  return targetRef;
}
