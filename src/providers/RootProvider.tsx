import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { useState, type PropsWithChildren } from 'react';

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if ('response' in error && typeof error.response === 'object' && error.response !== null) {
    if ('status' in error.response && typeof error.response.status === 'number') {
      return error.response.status;
    }
  }

  return undefined;
}

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 1) {
    return false;
  }

  const status = getHttpStatus(error);

  if (status === undefined) {
    return error instanceof TypeError;
  }

  return status >= 500 && status < 600;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
    },
  });
}

export function RootProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
}
