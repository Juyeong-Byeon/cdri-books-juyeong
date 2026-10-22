import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { parseSearchConditions } from '../utils/searchParams';

export function useSearchConditions() {
  const [searchParams] = useSearchParams();
  return useMemo(() => parseSearchConditions(searchParams), [searchParams]);
}
