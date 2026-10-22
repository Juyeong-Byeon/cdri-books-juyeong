import { Link, NavLink } from 'react-router';
import { cx } from '../../lib/utils';

interface AppHeaderProps {
  currentSearch: string;
}

function getNavigationClassName(isActive: boolean) {
  return cx(
    'relative flex h-full items-center whitespace-nowrap text-xs leading-6 transition-colors sm:text-sm lg:text-[18px]',
    isActive
      ? 'font-bold text-palette-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-palette-primary'
      : 'text-text-secondary hover:text-text-primary'
  );
}

export function AppHeader({ currentSearch }: AppHeaderProps) {
  return (
    <header className={cx('h-20 bg-palette-white')}>
      <div className={cx('relative mx-auto h-full w-full max-w-[1920px]')}>
        <Link
          to={{ pathname: '/', search: currentSearch }}
          className={cx(
            'absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold tracking-tight text-text-primary sm:left-6 sm:text-title1 lg:left-[8.4%]'
          )}
          aria-label="CERTICOS BOOKS 홈"
        >
          CERTICOS BOOKS
        </Link>

        <nav
          aria-label="주요 메뉴"
          className={cx(
            'absolute right-4 top-1/2 flex h-8 -translate-y-1/2 items-center gap-2 sm:right-6 sm:gap-4 lg:left-[40%] lg:right-auto lg:gap-14'
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
