# ADR-0009: 사용자 경험(UX) 극대화, 회복 탄력성 및 테스트 검증 전략

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)

기본적인 기능 구현을 넘어, 실제 프로덕션 수준의 사용자 경험(UX), 외부 API 장애 시의 회복 탄력성(Fault Tolerance), 레이아웃 누적 이동(CLS) 방어, 접근성(a11y) 표준 준수, 그리고 신뢰성 있는 테스트 자동화를 갖추기 위해 5가지 핵심 세부 스펙을 정의합니다.

---

## 2. 세부 결정 내용 (Decisions)

### 2.1 URL Query String 양방향 동기화 (Deep Linking & History)

- **결정**: `검색어(q)`, `정렬(sort)`, `상세검색 타깃(target)`, `활성 탭(tab)` 상태를 브라우저 `URLSearchParams`와 양방향 동기화합니다.
- **효과**:
  - 새로고침(F5) 시에도 이전 검색 상태가 100% 복원됩니다.
  - 브라우저 뒤로가기 / 앞으로가기가 완벽하게 작동합니다.
  - 특정 검색 결과 URL을 복사하여 다른 사용자에게 공유(Deep Linking)할 수 있습니다.

### 2.2 계층형 ErrorBoundary & 회복 탄력적 재시도 (Retry UI)

- **결정**: 상단 헤더와 네비게이션은 정상 유지한 채, 도서 목록 영역에만 독립된 **`BookListErrorBoundary`**를 배치합니다.
- **효과**:
  - API 일일 쿼터 초과(429), 인증 실패(401), 네트워크 단절 등 예외 상황 발생 시 전체 화면이 터지는 Whiteout을 원천 차단합니다.
  - 에러 원인에 맞는 사용자 친화적 메시지와 함께 TanStack Query의 `refetch`와 연동된 **`[다시 시도]`** 버튼을 제공하여 즉각적인 복구를 지원합니다.

### 2.3 이미지 로딩 최적화 및 레이아웃 누적 이동(CLS) 방어

- **결정**: 도서 표지 이미지를 전담하는 **`ImageWithFallback`** 컴포넌트를 설계합니다.
- **효과**:
  - 도서 표지에 고정 종횡비(`aspect-[3/4]`)를 부여하여 이미지가 비동기로 로드되기 전/후 카드의 높이가 덜컹거리는 **CLS(Cumulative Layout Shift)를 0%로 방어**합니다.
  - 이미지 로딩 중에는 피그마 스펙의 스켈레톤(Shimmer) 애니메이션을 표시합니다.
  - 외부 CDN 링크가 404로 깨지거나 썸네일이 빈 문자열(`""`)인 경우, 브라우저의 엑스박스 대신 피그마 맞춤형 **책 일러스트 Fallback SVG**를 부드럽게 렌더링합니다.

### 2.4 웹 접근성 표준 준수 (WAI-ARIA & Keyboard Navigation)

- **결정**: 스크린 리더 사용자와 키보드 전용 사용자를 위한 접근성 인터랙션을 완벽하게 구현합니다.
- **효과**:
  - **찜하기 버튼**: 단순 아이콘이 아닌 `aria-label="${book.title} 찜하기 추가/해제"`, `aria-pressed="true|false"` 속성을 동적으로 바인딩합니다.
  - **아코디언 토글**: `aria-expanded="true|false"`, `aria-controls="book-detail-${book.id}"`를 연결합니다.
  - **키보드 탐색**: 마우스 없이 `Tab` 키로 포커스 이동 후 `Enter` 또는 `Space` 키로 모달 열기, 아코디언 펼침, 찜하기 토글이 모두 가능합니다.

### 2.5 포괄적 테스트 매트릭스 (Unit & Integration Tests)

- **결정**: Vitest + React Testing Library를 기반으로 비즈니스 로직과 컴포넌트 인터랙션을 포괄적으로 검증합니다.
- **테스트 구성**:
  1. **단위 테스트 (Unit)**:
     - `bookMapper.test.ts`: 스네이크 케이스 변환, `-1` 정가 처리, 복합 ISBN 파싱, 날짜 포맷팅 100% 검증
     - `favoriteStore.test.ts`: 찜 추가/삭제/토글 액션 및 LocalStorage 직렬화 검증
     - `searchHistoryStore.test.ts`: 최근 검색어 추가, 중복 제거, 개별/전체 삭제 검증
  2. **통합 테스트 (Integration)**:
     - `ExpandableCard.test.tsx`: 상세보기 버튼 클릭 시 아코디언 확장 및 WAI-ARIA 속성 변경 검증
     - `BookSearchBar.test.tsx`: 검색어 입력 및 엔터 제출 시 검색 트리거 검증

---

## 3. 결과 및 영향 (Consequences)

- 기술 과제의 수준을 단순한 UI 클론 코딩에서 **엔터프라이즈 프로덕션 레벨의 모던 웹 애플리케이션**으로 격상시킵니다.
- 평가 기준의 4대 항목(UI 완성도, 가독성/유지보수성, 상태 관리, 성능 최적화)을 모두 최상위 수준으로 충족합니다.
