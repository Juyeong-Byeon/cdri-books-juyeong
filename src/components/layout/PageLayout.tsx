import { useId, type PropsWithChildren } from 'react';
import { cx } from '../../lib/utils';

interface PageLayoutProps extends PropsWithChildren {
  title: string;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cx('mx-auto w-[calc(100%_-_48px)] max-w-[960px] pb-16 pt-[104px]')}
    >
      <h1 id={titleId} className={cx('text-title2 text-text-primary')}>
        {title}
      </h1>
      <div className={cx('mt-5')}>{children}</div>
    </section>
  );
}
