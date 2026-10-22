import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';
import { BookSearchError } from '@/services/books';

interface SearchErrorStateProps {
  error: unknown;
  title: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export function SearchErrorState({ error, title, onRetry, isRetrying }: SearchErrorStateProps) {
  const message =
    error instanceof BookSearchError
      ? error.message
      : error instanceof TypeError
        ? '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
        : '검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
  const canRetry = !(
    error instanceof BookSearchError && [400, 401, 403].includes(error.status ?? 0)
  );

  return (
    <Alert className={cx('mt-8')}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {canRetry && (
          <Button
            type="button"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className={cx('mt-3')}
          >
            {isRetrying ? '다시 불러오는 중' : '다시 시도'}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
