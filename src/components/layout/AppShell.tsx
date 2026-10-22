import { Outlet, useLocation } from 'react-router';
import { cx } from '../../lib/utils';
import { ContentErrorBoundary } from '../../providers/ContentErrorBoundary';
import { AppHeader } from './AppHeader';

export function AppShell() {
  const location = useLocation();
  const currentSearch = location.search;

  return (
    <div className={cx('flex min-h-screen flex-col bg-palette-white text-text-primary')}>
      <AppHeader currentSearch={currentSearch} />
      <main className={cx('w-full flex-1')}>
        <ContentErrorBoundary key={location.pathname}>
          <Outlet />
        </ContentErrorBoundary>
      </main>
    </div>
  );
}
