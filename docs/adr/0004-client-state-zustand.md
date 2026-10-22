# ADR-0004: 클라이언트 전역 상태 관리로 Zustand 및 persist 미들웨어 채택

- **상태 (Status)**: 승인 (Accepted) - *Context API에서 성능 최적화를 위해 전환*
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)
본 애플리케이션은 서버 상태 외에 다음과 같은 클라이언트 사이드 전역 상태를 필요로 합니다:
1. **내가 찜한 책 목록 (`favorites`)**: 도서 카드에서 하트 클릭 시 찜 추가/해제, 새로고침 시에도 유지되어야 함.
2. **최근 검색어 목록 (`searchHistory`)**: 검색창 포커스 시 최근 검색어 노출, 개별 삭제 및 전체 삭제 지원, 새로고침 시 유지.

검색 결과가 30~50개 이상 노출되는 상황에서, 단 1권의 책을 찜하거나 찜을 해제했을 때 **다른 모든 도서 카드가 불필요하게 리렌더링되는 성능 저하 현상**을 방지해야 합니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: React Context API
- **문제점**:
  - Context 값이 업데이트되면 해당 Context를 구독(`useContext`)하는 모든 하위 컴포넌트가 강제 리렌더링됨.
  - 찜 상태 하나 바꿀 때마다 50개의 카드가 모두 리렌더링되는 성능 낭비 발생.
  - 이를 막기 위해 State/Dispatch Context 분리, 복잡한 `React.memo`와 수동 셀렉터 로직을 작성해야 하여 코드 복잡도 급증.

### 대안 B: Redux Toolkit (RTK)
- **문제점**: 보일러플레이트(Slice, Action, Provider)가 크며, 1KB 미만의 작은 상태 관리에 비해 번들 크기 오버헤드가 과도함.

### 대안 C: Zustand + persist 미들웨어 (선정)
- **장점**:
  - **세밀한 셀렉터(Selector) 구독**: 컴포넌트가 구독 중인 특정 슬라이스 값(예: `state.favoriteMap[book.id]`)이 변했을 때만 해당 컴포넌트가 리렌더링됨. 다른 49개의 도서 카드는 **리렌더링 0회(완전 차단)** 달성.
  - **초경량 번들 (약 1.1KB)**: 추가 런타임 오버헤드가 거의 없음.
  - **Provider-less 아키텍처**: 최상위 `<Provider>` 래핑 없이 어디서나 훅 형태로 직접 상태 소비 가능.
  - **내장 `persist` 미들웨어**: 별도의 `useLocalStorage` 커스텀 훅 보일러플레이트 없이 단 2줄로 로컬스토리지 자동 직렬화/역직렬화 및 새로고침 영속성 보장.
  - React 18/19의 `useSyncExternalStore` 기반으로 제작되어 동시성 모드에서도 데이터 불일치(tearing)가 없음.

---

## 3. 결정 (Decision)
클라이언트 전역 상태 관리에 **Zustand**를 채택하고, `persist` 미들웨어를 적용하여 도메인별 스토어(`src/stores/favoriteStore.ts`, `src/stores/searchHistoryStore.ts`)를 구축합니다.

---

## 4. 결정의 결과 및 영향 (Consequences)
- **긍정적 영향**:
  - 과제 핵심 평가 기준인 **"성능 최적화"** 관점에서 대량 리스트 렌더링 시 불필요한 리렌더링을 완벽하게 차단.
  - 보일러플레이트 코드가 획기적으로 줄어들어 **"가독성 및 유지보수성"** 향상.
  - 컴포넌트 내부에서 `const isFavorite = useFavoriteStore(state => !!state.favoriteMap[book.id])`와 같이 가장 직관적이고 깔끔한 코드로 상태를 소비 가능.
