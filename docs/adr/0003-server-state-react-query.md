# ADR-0003: 서버 상태 관리 및 무한 스크롤로 TanStack Query v5 채택

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)
카카오 도서 검색 API는 페이징 파라미터(`page`, `size`)와 함께 `meta.is_end` 플래그를 제공합니다. 사용자가 스크롤을 내릴 때마다 다음 페이지의 도서 데이터를 지속적으로 로딩하는 매끄러운 **무한 스크롤(Infinite Scroll)** 사용자 경험(UX)을 구현해야 합니다. 또한, 동일 검색어에 대한 중복 네트워크 호출을 방지하고 로딩/에러/빈 결과 상태를 선언적으로 처리해야 합니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: 단순 `useEffect` + 로컬 `useState`로 수동 페이징 구현
- **문제점**:
  - 로딩 상태, 에러 상태, 이전 데이터 누적, 페이지 번호 증가, 레이스 컨디션(Race Condition) 처리를 모두 수동으로 관리해야 하여 코드가 복잡해짐.
  - 캐싱 메커니즘이 없어 다른 탭 이동 후 복귀 시 매번 불필요한 API 재호출이 발생함.

### 대안 B: TanStack Query v5 (`useInfiniteQuery`) (선정)
- **장점**:
  - `useInfiniteQuery`를 통해 `data.pages` 구조로 다음 페이지 데이터를 자동 누적 및 관리.
  - `getNextPageParam`에서 카카오 API의 `meta.is_end` 값을 검사하여 마지막 페이지 도달 여부를 깔끔하게 판단.
  - 강력한 캐싱(`staleTime`, `gcTime`)으로 불필요한 중복 호출 방지 및 탭 전환 시 즉각적인 캐시 데이터 표시.
  - `isPending`, `isFetchingNextPage`, `isError`, `error` 등 상태 플래그를 표준화하여 스켈레톤 UI 및 에러 바운더리와 직관적으로 결합 가능.

---

## 3. 결정 (Decision)
**TanStack Query (React Query) v5**의 `useInfiniteQuery`를 채택하고, 브라우저 표준 `IntersectionObserver` API를 감싼 커스텀 훅(`useIntersectionObserver`)을 구현하여 감지 영역(Sentinel) 도달 시 `fetchNextPage()`를 자동 호출하도록 설계합니다.

---

## 4. 결정의 결과 및 영향 (Consequences)
- **긍정적 영향**:
  - 네트워크 통신 관련 로직이 컴포넌트 뷰에서 분리되어 클린 아키텍처 달성.
  - 캐싱을 통한 성능 최적화 및 쾌적한 반응 속도 제공.
  - 검색어 디바운싱(Debounce) 훅과 결합 시 불필요한 API 요청 수를 획기적으로 절감.
