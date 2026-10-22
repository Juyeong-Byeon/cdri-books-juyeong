import { useState, type ReactNode } from 'react';
import { BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cx } from '@/lib/utils';

interface BookCoverProps {
  title?: string;
  thumbnail?: string | null;
  expanded?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

export function BookCover({
  title = '',
  thumbnail,
  expanded = false,
  isLoading = false,
  children,
}: BookCoverProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const dimensions = expanded ? { width: 210, height: 280 } : { width: 48, height: 68 };
  const hasImage = thumbnail && thumbnail !== failedSource;

  return (
    <div className={cx('relative shrink-0')} style={dimensions}>
      {isLoading ? (
        <Skeleton className={cx('size-full')} />
      ) : hasImage ? (
        <>
          {loadedSource !== thumbnail && <Skeleton className={cx('absolute inset-0 size-full')} />}
          <img
            src={thumbnail}
            alt={`${title} 표지`}
            width={dimensions.width}
            height={dimensions.height}
            loading="lazy"
            onLoad={() => setLoadedSource(thumbnail)}
            onError={() => setFailedSource(thumbnail)}
            className={cx(
              'relative size-full object-contain transition-opacity duration-200 motion-reduce:transition-none',
              loadedSource === thumbnail ? 'opacity-100' : 'opacity-0'
            )}
          />
        </>
      ) : (
        <div
          role="img"
          aria-label={`${title} 표지 없음`}
          className={cx(
            'flex size-full items-center justify-center rounded-sm bg-palette-lightGray text-text-subtitle'
          )}
        >
          <BookOpen aria-hidden="true" className={cx(expanded ? 'size-12' : 'size-5')} />
        </div>
      )}
      {children}
    </div>
  );
}
