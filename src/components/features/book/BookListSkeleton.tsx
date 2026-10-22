import { BookCardSkeleton } from './BookCardSkeleton';

interface BookListSkeletonProps {
  count: number;
}

export function BookListSkeleton({ count }: BookListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <li key={`loading:${index}`} aria-hidden="true">
          <BookCardSkeleton />
        </li>
      ))}
    </>
  );
}
