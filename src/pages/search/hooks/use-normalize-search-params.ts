import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { serializeSearchConditions } from '../utils/search-params';
import { useSearchConditions } from './use-search-conditions';

export function useNormalizeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const conditions = useSearchConditions();
  const canonicalSearch = serializeSearchConditions(conditions).toString();

  useEffect(() => {
    if (searchParams.toString() !== canonicalSearch) {
      setSearchParams(canonicalSearch, { replace: true });
    }
  }, [canonicalSearch, searchParams, setSearchParams]);
}
