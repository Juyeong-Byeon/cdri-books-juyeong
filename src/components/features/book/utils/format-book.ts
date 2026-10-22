const priceFormatter = new Intl.NumberFormat('ko-KR');

export function formatBookTitle(title: string): string {
  return (
    title.replace(/&(?:lt|gt);|&#(?:0*(?:60|62)|x0*3[ce]);|[<>]/gi, '').trim() || '제목 정보 없음'
  );
}

export function formatAuthors(authors: readonly string[]): string {
  const names = authors.map((author) => author.trim()).filter(Boolean);
  if (names.length === 0) return '저자 정보 없음';

  // 이름이 글자 단위 배열로 제공된 경우 표시할 때만 복원합니다.
  // 원본 저자 배열과 저장되는 도서 데이터는 유지합니다.
  return names.every((name) => [...name].length === 1) ? names.join('') : names.join(', ');
}

export function formatPrice(price: number | null): string {
  return price === null ? '가격 정보 없음' : `${priceFormatter.format(price)}원`;
}

export function getPurchaseUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol) ? parsedUrl.href : null;
  } catch {
    return null;
  }
}
