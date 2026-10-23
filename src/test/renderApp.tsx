import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/App';
import { RootProvider } from '@/providers/RootProvider';
import { QueryCleanup } from './QueryCleanup';

export function renderApp(url = '/') {
  window.history.replaceState(null, '', url);
  return {
    user: userEvent.setup(),
    ...render(
      <RootProvider>
        <QueryCleanup />
        <App />
      </RootProvider>
    ),
  };
}
