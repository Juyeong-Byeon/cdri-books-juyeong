import { cx } from '@/lib/utils';

interface BookDescriptionProps {
  contents: string;
}

export function BookDescription({ contents }: BookDescriptionProps) {
  return (
    <div className={cx('flex flex-col gap-4')}>
      <h3 className={cx('text-body2-bold text-text-primary')}>책 소개</h3>
      <p className={cx('whitespace-pre-line break-words text-small leading-4 text-text-primary')}>
        {contents.trim() || '책 소개가 없습니다.'}
      </p>
    </div>
  );
}
