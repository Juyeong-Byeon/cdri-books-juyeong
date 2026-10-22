import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { parseSearchConditions } from '../utils/search-params';

export function useSearchConditions() {
  const [searchParams] = useSearchParams();
  return useMemo(() => parseSearchConditions(searchParams), [searchParams]);
}
