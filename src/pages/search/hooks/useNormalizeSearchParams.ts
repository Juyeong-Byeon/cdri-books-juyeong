import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { serializeSearchConditions } from '../utils/searchParams';
import { useSearchConditions } from './useSearchConditions';

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
