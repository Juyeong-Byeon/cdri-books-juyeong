# 📚 CERTICOS BOOKS (cdri-books-juyeong)

> **CDRI 프론트엔드 채용 사전과제**
>
> 카카오 Daum 책 검색 API를 연동한 도서 검색 및 찜하기 웹 애플리케이션을 구현하는 프로젝트입니다.
>
> 현재 구현 범위는 5절에서 확인할 수 있습니다. 아래 기능·아키텍처 설명은 별도 표시가 없는 한 구현 목표를 뜻합니다.

---

## 📑 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 아키텍처 설계 원칙](#2-기술-스택-및-아키텍처-설계-원칙)
3. [피그마 디자인 시스템 토큰 스펙](#3-피그마-디자인-시스템-토큰-스펙)
4. [실행 방법 및 환경 설정](#4-실행-방법-및-환경-설정)
5. [폴더 구조 및 주요 코드 설명](#5-폴더-구조-및-주요-코드-설명)
6. [핵심 기능 및 사용자 경험(UX)](#6-핵심-기능-및-사용자-경험ux)
7. [강조하고 싶은 기능 및 차별화 포인트](#7-강조하고-싶은-기능-및-차별화-포인트)
8. [아키텍처 결정 기록 (ADR)](#8-아키텍처-결정-기록-adr)

---

## 1. 프로젝트 개요

- **프로젝트명**: CERTICOS BOOKS
- **저장소명**: `cdri-books-juyeong`
- **지원자**: 변주영
- **배포 환경**: Cloudflare Pages (글로벌 엣지 배포)
- **주요 기능**:
  - 카카오 Daum 도서 검색 API 연동 (키워드 검색, 상세 조건 검색)
  - `IntersectionObserver` 기반 무한 스크롤 (Infinite Scroll)
  - 아코디언 도서 상세 보기 (표지 확대, 책 소개, 정가/할인가, 구매 링크)
  - 내가 찜한 책(북마크) 로컬스토리지 연동 및 전역 상태 관리
  - 최근 검색어 저장/삭제 관리
  - 검색 결과 없음 및 찜 목록 없음 Empty State 처리

---

## 2. 기술 스택 및 아키텍처 설계 원칙

현재 코드에 적용한 기술과 후속 기능 구현에서 사용할 설계 기준을 함께 정리합니다. 기능의 완료 여부는 5절의 구현 상태를 기준으로 확인합니다.

### 2.1 기술 스택

| 분류                  | 기술 / 라이브러리                |      버전      | 선정 이유                                                                                                                                                                                                      |
| :-------------------- | :------------------------------- | :------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework / Build** | **Vite + React + TypeScript**    | React 19, TS 5 | - 번들 속도와 HMR이 가장 빠른 Vite 기반 구성<br/>- 과제 필수 요구사항(React, TypeScript, React Query) 본연의 컴포넌트 설계에 집중<br/>- Next.js의 불필요한 보일러플레이트 없이 가볍고 견고한 SPA 아키텍처 실현 |
| **Server State**      | **TanStack Query (React Query)** |       v5       | - `useInfiniteQuery`를 활용한 표준 무한 스크롤 및 페이지네이션 제어<br/>- `staleTime`, `gcTime` 최적화로 동일 검색어 중복 호출 방지 및 즉각적 캐시 렌더링<br/>- 로딩, 에러, 페칭 상태의 선언적 관리            |
| **Client State**      | **Zustand**                      |       v5       | - 찜 스냅샷과 검색 기록을 관리하는 데 사용<br/>- `persist`를 적용해 `localStorage`에 저장<br/>- Provider 없는 저장소 구성                                                                                      |
| **Styling & UI Core** | **Tailwind CSS + Radix UI**      |  Tailwind v3   | - 디자인 토큰을 Tailwind 설정에 반영<br/>- 필요한 UI에 Radix UI 접근성 기반 구성요소 활용                                                                                                                      |
| **Icons**             | **Lucide React**                 |      최신      | - 피그마 시안에 명시된 돋보기, 하트(찜), 아코디언 화살표, 닫기 등 일관성 있는 모던 벡터 아이콘 제공                                                                                                            |
| **Infrastructure**    | **Cloudflare Pages + Functions** |       -        | - 클라이언트 번들에 카카오 `REST API Key`를 일절 노출하지 않는 **엣지 서버리스 프록시** 구축<br/>- CORS 원천 차단 및 글로벌 엣지 캐싱                                                                          |

### 2.2 핵심 아키텍처 설계 원칙

1. **서버 DTO와 프론트엔드 도메인 모델 분리 (Anti-Corruption Layer)**:
   - 외부 API 응답 타입(`KakaoBookDocumentDTO`)을 컴포넌트로 직접 흘려보내지 않고, 매퍼(`bookMapper.ts`)를 거쳐 프론트엔드 전용 모델(`Book`)로 정제 및 변환할 계획입니다.
2. **도메인 중립 뷰(UI)와 도메인 종속 피처(Feature) 분리**:
   - `components/ui/`: 도메인 모델과 API 모듈에 의존하지 않는 프레젠테이셔널 컴포넌트를 둡니다.
   - `components/features/`: 비즈니스 로직과 도메인 모델을 UI에 연결하는 컴포넌트를 둡니다.
3. **커스텀 훅 응답 캡슐화 (Minimal Interface)**:
   - 뷰 컴포넌트는 React Query의 거대한 내부 객체를 알 필요 없이, 꼭 필요한 정제된 상태와 직관적인 액션 함수(`books`, `loadMore`, `isLoading` 등)만 반환받아 소비합니다.
4. **Zustand 셀렉터 기반 리렌더링 격리**:
   - 목록 기능 구현 시 필요한 Zustand 상태만 선택해 구독합니다. 실제 렌더링 범위는 구현 후 검증합니다.

---

## 3. 피그마 디자인 시스템 토큰 스펙

피그마 디자인 시안에 따라 적용할 디자인 토큰 스펙입니다:

### 3.1 컬러 팔레트

```typescript
colors: {
  palette: {
    primary: '#4880EE',   // 메인 브랜드 블루 (검색 버튼, 구매하기, 활성 탭)
    red: '#E84118',       // 포인트 레드 (찜하기 하트 활성)
    gray: '#DADADA',      // 구분선 및 기본 보더
    lightGray: '#F2F4F6', // 배경색 및 인풋 배경
    white: '#FFFFFF',
    black: '#222222',
  },
  text: {
    primary: '#353C49',   // 메인 텍스트 (제목, 도서명)
    secondary: '#6D7582', // 서브 텍스트 (저자, 출판사, 설명)
    subtitle: '#8D94A0',  // 캡션 및 플레이스홀더
  },
}
```

### 3.2 타이포그래피 (Noto Sans KR)

| 토큰명           | Font Size | Line Height | Font Weight  | 용도                             |
| :--------------- | :-------: | :---------: | :----------: | :------------------------------- |
| **`title1`**     |   24px    |    24px     |  700 (Bold)  | 대제목, 메인 헤더 타이틀         |
| **`title2`**     |   22px    |    24px     |  700 (Bold)  | 섹션 타이틀, 검색 결과 타이틀    |
| **`title3`**     |   18px    |    18px     |  700 (Bold)  | 도서 제목, 모달 타이틀           |
| **`body1`**      |   20px    |    20px     | 500 (Medium) | 본문 강조 텍스트, 탭 라벨        |
| **`body2`**      |   14px    |    14px     | 500 (Medium) | 기본 본문, 도서 저자/출판사 정보 |
| **`body2-bold`** |   14px    |    14px     |  700 (Bold)  | 볼드 본문, 가격 강조             |
| **`caption`**    |   16px    |    16px     | 500 (Medium) | 캡션 텍스트, 인풋 텍스트         |
| **`small`**      |   10px    |    10px     | 500 (Medium) | 배지, 날짜 보조 정보             |

---

## 4. 실행 방법 및 환경 설정

### 4.1 사전 요구사항

- Node.js `v22.x` (Active LTS 권장, `.nvmrc` 기준 `v22.23.2`)
- npm `10.x` 이상 또는 pnpm

### 4.2 환경 변수 설정 (`.env.dev`)

프로젝트 루트의 `.env.example`을 `.env.dev`로 복사하고 발급받은 카카오 REST API 키를 입력합니다.

> ⚠️ `.env.dev` 파일은 `.gitignore`에 등록되어 GitHub 저장소에 커밋되지 않습니다.

```bash
# .env.dev
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
```

`npm run dev`는 Vite를 `dev` 모드로 실행해 `.env.dev`를 읽습니다. 키를 변경하면 개발 서버를 재시작합니다. 키는 개발 서버가 카카오 요청의 인증 헤더를 구성할 때만 사용하며, 프런트엔드 코드나 `import.meta.env`에서 읽지 않습니다. 배포 시 Cloudflare Pages 프로젝트의 secret 변수에도 같은 이름(`KAKAO_REST_API_KEY`)으로 등록합니다.

개발·배포 모두 `GET /api/books`를 사용하며, 개발 프록시는 검색 쿼리를 유지한 채 카카오 `/v3/search/book`으로 전달합니다. 검색어 입력 후 Enter를 누르거나 상세검색에서 제목·저자명·출판사를 선택해 검색할 수 있습니다. 프록시의 설계 기준은 [ADR-0005](./docs/adr/0005-cors-proxy-cloudflare-pages.md)를 참고합니다.

### 4.3 설치 및 실행

```bash
# 1. 의존성 패키지 설치
npm ci

# 2. 로컬 개발 서버 실행 (Vite Proxy 동작)
npm run dev
# 브라우저에서 http://localhost:5173 접속

# 3. 프로덕션 빌드 및 타입 검사
npm run build

# 4. 빌드 결과물 미리보기
npm run preview
```

---

## 5. 폴더 구조 및 주요 코드 설명

기본 앱 셸, Zustand 저장소, 카카오 도서 검색 API 연동, 상세검색, URL 조건 복원, 10권 단위 무한 스크롤, 도서 상세 펼침 및 로딩·빈 결과·오류 UI를 구현했습니다. 검색 전에는 API를 호출하지 않습니다. 찜 목록 페이지와 최근 검색 기록 UI, 실제 배포 검색 검증은 후속 작업입니다.

```text
cdri-books-juyeong/
├── docs/
│   └── adr/                  # 아키텍처 결정 기록
├── functions/
│   └── api/
│       └── books.ts          # Cloudflare Pages 엣지 프록시 함수 (API Key 은닉 & CORS 방지)
├── public/
│   └── _redirects            # Cloudflare Pages 라우팅 및 폴백 설정
├── src/
│   ├── providers/
│   │   ├── ContentErrorBoundary.tsx # 콘텐츠 렌더링 오류 복구 경계
│   │   └── RootProvider.tsx         # BrowserRouter와 React Query 설정
│   ├── components/
│   │   ├── layout/                 # AppHeader, AppShell, PageLayout
│   │   ├── features/book/          # 공통 도서 목록·카드·표지·Skeleton 및 표시 유틸리티
│   │   └── ui/                     # shadcn 기반 UI와 도메인 중립 ExpandableCard
│   ├── lib/
│   │   ├── typography.ts           # Tailwind와 cx가 공유하는 타이포그래피 정의
│   │   └── utils.ts                # 클래스 병합 유틸리티 cx
│   ├── pages/
│   │   ├── favorites/
│   │   │   └── Page.tsx            # 찜 페이지 진입 컴포넌트
│   │   └── search/
│   │       ├── Page.tsx            # 검색 페이지 레이아웃 조합
│   │       ├── components/
│   │       │   ├── BookSearchBar.tsx
│   │       │   ├── AdvancedSearchPopover.tsx
│   │       │   ├── SearchResultCount.tsx
│   │       │   ├── SearchEmptyState.tsx
│   │       │   └── SearchErrorState.tsx
│   │       ├── hooks/              # use-book-search, use-load-more
│   │       ├── utils/search-params.ts # URL 검색 조건 파싱·직렬화
│   │       └── assets/
│   │           └── empty-search.svg
│   ├── stores/
│   │   ├── favorites/
│   │   │   └── store.ts              # 찜한 Book 스냅샷 Zustand 저장소
│   │   ├── searchHistory/
│   │   │   └── store.ts              # 최근 검색어 Zustand 저장소
│   │   └── util/
│   │       └── safe-local-storage.ts # 저장소 접근 실패를 격리하는 persist 어댑터
│   ├── services/
│   │   ├── books.ts                # /api/books 요청과 HTTP 오류 처리
│   │   └── mappers/book-mapper.ts   # Kakao DTO → Book·페이지 메타데이터
│   ├── types/
│   │   ├── domain/                 # Book·검색 조건·페이지 모델
│   │   └── dto/kakao-book.ts        # 카카오 응답 타입
│   ├── App.tsx                      # React Router 경로 선언
│   ├── App.test.tsx                 # 기본 내비게이션 동작 테스트
│   ├── main.tsx                     # 앱 엔트리포인트
│   └── index.css                    # Tailwind CSS 및 디자인 토큰 스타일
├── tailwind.config.ts        # 피그마 디자인 스펙 반영 커스텀 설정
├── vite.config.ts            # Vite 번들러 및 로컬 프록시 설정
└── README.md
```

### 주요 코드 역할

- **`RootProvider.tsx`**: 앱 수명 동안 유지되는 QueryClient와 BrowserRouter를 제공합니다. 재시도는 네트워크 오류와 5xx로 제한합니다.
- **`AppHeader.tsx`**: 브랜드와 검색·찜 내비게이션을 렌더링하며 현재 URL 검색 조건을 경로 이동에 보존합니다.
- **`AppShell.tsx`**: 공통 레이아웃을 제공하고 콘텐츠 영역만 렌더링 ErrorBoundary로 감쌉니다.
- **`BookList.tsx` / `BookCardItem.tsx`**: API 도서 목록, 독립적인 상세 펼침, 찜 저장소 연결, 새 탭 구매 링크를 제공합니다. 최초 요청은 카드 Skeleton, 추가 요청은 기존 목록과 높이가 일정한 하단 로딩 표시를 사용합니다. 새 행·표지에 짧은 등장 효과를 적용하며 동작 줄이기 설정을 따릅니다.
- **`ExpandableCard.tsx`**: 도서 모델에 의존하지 않고 미디어·제목·상세·액션 슬롯을 배치합니다. Radix Collapsible로 상세 토글의 키보드 조작과 ARIA 연결을 구성합니다.
- **`BookCover.tsx`**: 기본 48×68px·확대 210×280px 공간을 확보하며 이미지 로딩 Skeleton과 빈 표지·로드 실패 대체 표시를 처리합니다.
- **`use-book-search.ts`**: URL에서 읽은 확정 조건을 쿼리 키로 사용합니다. React Query가 페이지·취소·캐시를 관리하고, 훅에서 중복 도서를 제거해 뷰에 전달합니다. 추가 페이지 오류가 발생하면 기존 결과를 유지하고 명시적인 재시도를 기다립니다.
- **`book-mapper.ts`**: 유효한 ISBN-13·ISBN-10 또는 URL로 ID를 만들고, 미제공 가격을 `null`로 변환해 0원과 구분합니다. 가격·저자 표시 형식은 카드의 표시 유틸리티에서 처리합니다.
- **Zustand 저장소**: 찜 도서는 저장 시점의 스냅샷으로 보관하고, 최근 검색어는 중복을 맨 앞으로 이동해 최대 8개까지 저장합니다. 손상된 저장 데이터와 localStorage 접근 실패가 앱 중단 원인이 되지 않도록 처리합니다.

---

## 6. 핵심 기능 및 비즈니스 로직 스펙

피그마 기획 및 요구사항 명세에 정의된 세부 비즈니스 로직입니다. 아래 동작은 해당 기능을 구현할 때 기준으로 삼습니다.

### 1) 도서 검색 및 정렬 (기본 검색 vs 상세 검색 상호 배타)

- **Placeholder**: `'검색어 입력'`
- **검색 실행**: 검색어 입력 후 **`Enter` 키**를 누르면 검색이 트리거되고, 페이지 당 **10개의 결과**(`size=10`)가 노출됩니다.
- **상세 검색 (하단 레이어 팝업)**:
  - 검색창 우측 `[상세 검색]` 버튼 클릭 시 버튼 하단에 레이어 팝업이 노출됩니다.
  - 검색 조건 클릭 시 셀렉트 옵션(`제목: title`, `저자: person`, `출판사: publisher`, `ISBN: isbn`)이 노출됩니다.
  - `[검색하기]` 버튼 클릭 시 팝업이 닫히며 입력한 타깃 조건으로 상세 검색이 실행됩니다.
- **⭐️ 상호 배타성 규칙 (Mutual Exclusion)**:
  - **전체 검색과 상세 검색은 동시에 진행 불가합니다.**
  - 상세 검색 진행 시: 전체 검색창에 입력되어 있던 검색어는 **자동 초기화**됩니다.
  - 전체 검색 진행 시: 이전 상세 검색 조건 및 입력 필드는 **자동 초기화**됩니다.

### 2) 검색 기록 관리 (`searchHistoryStore`)

- **최대 저장 개수**: **최대 8개** 저장
- **FIFO 큐 정책**: 8개를 초과하여 새 검색어가 유입될 경우, **가장 오래된 검색어부터 자동으로 삭제**됩니다.
- **중복 처리**: 이미 존재하는 검색어를 재입력할 경우, 중복 저장되지 않고 최상단(최신 순)으로 위치가 갱신됩니다.
- **영속성**: 브라우저를 재시작하거나 새로고침한 후에도 검색 기록 목록을 `localStorage`에서 복원합니다.
- **개별/전체 삭제**: 검색어 항목별 `X` 버튼으로 개별 삭제하거나 전체 삭제가 가능합니다.

### 3) 도서 상세 아코디언 & 구매 링크

- **상세보기 ∨**: 클릭 시 아코디언 형태로 도서 요약 내용과 정가/할인가, 큰 표지가 확장됩니다.
- **구매하기 버튼**: 클릭 시 새 탭(`target="_blank" rel="noopener noreferrer"`)이 열리며 해당 책의 **카카오(다음 책) 상세 페이지**로 이동합니다.

### 4) 찜하기 (스냅샷 기반 영속 보관)

- **스냅샷 보관 정책**: 찜하기 버튼을 누른 **그 시점의 도서 데이터(제목, 가격, 표지 등)를 스냅샷 형태로 보관**합니다. 따라서 이후 카카오 API의 실시간 응답 데이터가 변동되더라도 찜한 시점의 데이터가 보존됩니다.
- **영속성**: 브라우저를 닫거나 재시작한 후에도 찜한 도서 목록을 `localStorage`에서 복원합니다.
- **동기화**: [도서 검색] 화면과 [내가 찜한 책] 화면은 같은 찜 저장소를 사용합니다.

---

## 7. 구현 목표 및 강조할 기능

### 🎨 1. 피그마 디자인 시스템 토큰화 및 shadcn 커스텀

- 피그마 컬러 스펙(`Palette`, `Text`)과 타이포그래피(`Title1~3`, `Body1~2`, `caption`, `small`)를 Tailwind 토큰에 반영하고, 필요한 UI에 Radix UI 접근성 기반 구성요소를 활용할 계획입니다.

### ⚡ 2. 대량 리스트 렌더링 최적화 (Zustand Selector)

- 목록에서 각 도서가 필요한 찜 상태만 선택하도록 구성할 계획입니다. 실제 렌더링 범위는 구현 후 검증합니다.

### 🛡️ 3. API Key 완벽 보안 & CORS 해결 (Cloudflare Pages Functions)

- 로컬 개발 환경(`vite.config.ts`)과 배포 환경(`functions/api/books.ts`)에 프록시 레이어를 구성해 브라우저 번들에서 카카오 `REST API Key`를 숨길 계획입니다.

### 🏛️ 4. DTO와 도메인 모델 분리 (부패 방지 계층)

- 외부 API 응답과 내부 도메인 모델을 분리하고 매퍼에서 변환하도록 설계했습니다.

### 🚀 5. 네트워크 비용 절감 및 캐싱 최적화

- **검색 제출**: 입력과 검색 실행을 분리해 사용자의 제출 시점에 API를 요청합니다.
- **Query Cache**: 검색 결과는 React Query 캐시를 활용해 관리할 계획입니다.

### 🌐 6. URL Search Params 양방향 동기화 (Deep Linking)

- 검색 조건은 URL 파라미터, 현재 화면은 React Router 경로로 표현해 새로고침·뒤로가기·앞으로가기에 대응할 계획입니다.

### 🛡️ 7. 회복 탄력적 에러 핸들링 & 이미지 CLS 방어

- 렌더링 오류 경계와 API 오류 UI를 분리합니다. 현재 구현된 ErrorBoundary는 콘텐츠 렌더링 예외만 처리합니다.
- 책 표지 영역의 크기와 대체 이미지는 도서 카드 구현 시 적용합니다.

---

## 8. 코드 품질 및 CI/CD 파이프라인 스펙

프로덕션 수준의 안정성과 일관된 코드 품질 유지를 위해 자동화 검증 파이프라인을 구축합니다.

### 8.1 Git Commit Hooks (Husky + lint-staged + Commitlint)

- **`commit-msg`**:
  - `Conventional Commits` 규약(`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:` 등) 준수 여부 검증
  - 비표준 커밋 메시지 작성 시 커밋 차단
- **`pre-commit`**:
  - 변경된(Staged) 파일에 대해 `eslint --fix` 및 `prettier --write` 자동 실행
  - 전체 프로젝트 정적 타입 검사 (`npm run typecheck` ➔ `tsc --noEmit`)
- **`pre-push`**:
  - 원격 저장소 전송 전 단위 및 컴포넌트 테스트 전수 검증 (`npm run test:run` ➔ `vitest run`)

### 8.2 GitHub Actions CI 파이프라인 (`.github/workflows/ci.yml`)

- **실행 환경**: Node.js `v22.x` (LTS)
- **트리거**: `main` 브랜치 푸시 및 모든 PR(Pull Request)
- **검증 단계**: `npm ci` ➔ `typecheck` ➔ `format:check` ➔ `lint` ➔ `test:run` ➔ `build`

---

## 9. 아키텍처 결정 기록 (ADR)

프로젝트를 진행하며 도출된 주요 의사결정의 배경과 대안 분석은 아래 문서에 상세히 기록되어 있습니다:

- [ADR-0001: 번들러 및 런타임으로 Vite + React 19 + TypeScript 선정](./docs/adr/0001-framework-vite-react.md)
- [ADR-0002: 디자인 시스템 스펙 토큰화 및 Tailwind CSS + shadcn/ui 커스텀 선정](./docs/adr/0002-styling-tailwind-css.md)
- [ADR-0003: 서버 상태 관리 및 무한 스크롤로 TanStack Query v5 채택](./docs/adr/0003-server-state-react-query.md)
- [ADR-0004: 클라이언트 전역 상태 관리로 Zustand 및 persist 미들웨어 채택](./docs/adr/0004-client-state-zustand.md)
- [ADR-0005: API Key 보안 은닉 및 CORS 해결을 위한 Cloudflare Pages Functions 및 Proxy 전략](./docs/adr/0005-cors-proxy-cloudflare-pages.md)
- [ADR-0006: 서버 DTO와 프론트엔드 도메인 모델 분리 및 매퍼 계층 구축](./docs/adr/0006-dto-domain-mapping-layer.md)
- [ADR-0007: 도메인 중립 뷰 컴포넌트 계층 분리 및 훅 응답 캡슐화 설계](./docs/adr/0007-component-and-hook-layering.md)
- [ADR-0008: 코드 품질 및 커밋 규약 보증을 위한 Git Hooks & CI/CD 파이프라인 스펙](./docs/adr/0008-ci-cd-and-git-hooks.md)
- [ADR-0009: 사용자 경험(UX) 극대화, 회복 탄력성 및 테스트 검증 전략](./docs/adr/0009-ux-resilience-and-testing-strategy.md)
