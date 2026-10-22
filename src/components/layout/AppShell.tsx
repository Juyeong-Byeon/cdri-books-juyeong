import { Outlet, useLocation } from 'react-router';
import { cx } from '../../lib/utils';
import { ContentErrorBoundary } from '../../providers/ContentErrorBoundary';
import { AppHeader } from './AppHeader';

export function AppShell() {
  const location = useLocation();
  const currentSearch = location.search;

  return (
    <div className={cx('min-h-screen bg-palette-white text-text-primary')}>
      <AppHeader currentSearch={currentSearch} />
      <main className={cx('mx-auto max-w-5xl px-4 py-8')}>
        <ContentErrorBoundary key={location.pathname}>
          <Outlet />
        </ContentErrorBoundary>
      </main>
    </div>
  );
}
