import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function QueryCleanup() {
  const client = useQueryClient();
  useEffect(() => () => client.clear(), [client]);
  return null;
}
