import { Link, NavLink } from 'react-router';
import { cx } from '../../lib/utils';

interface AppHeaderProps {
  currentSearch: string;
}

function getNavigationClassName(isActive: boolean) {
  return cx(
    'relative flex h-full items-center whitespace-nowrap text-body1 transition-colors',
    isActive
      ? 'font-bold text-palette-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-palette-primary'
      : 'text-text-secondary hover:text-text-primary'
  );
}

export function AppHeader({ currentSearch }: AppHeaderProps) {
  return (
    <header className={cx('bg-palette-white')}>
      <div
        className={cx(
          'relative mx-auto flex min-h-20 w-full max-w-[1920px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:block lg:h-20 lg:px-0 lg:py-0'
        )}
      >
        <Link
          to={{ pathname: '/', search: currentSearch }}
          className={cx(
            'text-title1 tracking-tight text-text-primary lg:absolute lg:left-[8.4%] lg:top-1/2 lg:-translate-y-1/2'
          )}
          aria-label="CERTICOS BOOKS 홈"
        >
          CERTICOS BOOKS
        </Link>

        <nav
          aria-label="주요 메뉴"
          className={cx(
            'flex h-8 items-center gap-4 lg:absolute lg:left-[40%] lg:top-1/2 lg:-translate-y-1/2 lg:gap-14'
          )}
        >
          <NavLink
            to={{ pathname: '/', search: currentSearch }}
            end
            className={({ isActive }) => getNavigationClassName(isActive)}
          >
            도서 검색
          </NavLink>
          <NavLink
            to={{ pathname: '/favorites', search: currentSearch }}
            className={({ isActive }) => getNavigationClassName(isActive)}
          >
            내가 찜한 책
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
