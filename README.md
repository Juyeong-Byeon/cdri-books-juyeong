# 📚 CERTICOS BOOKS (cdri-books-juyeong)

> **CDRI 프론트엔드 채용 사전과제**
>
> 카카오 Daum 책 검색 API를 연동한 도서 검색 및 찜하기 웹 애플리케이션입니다.
>
> 현재 코드의 기능과 구조를 설명합니다. 남은 구현·검증 항목은 5절에 정리했습니다.

---

## 📑 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 아키텍처 설계 원칙](#2-기술-스택-및-아키텍처-설계-원칙)
3. [피그마 디자인 시스템 토큰 스펙](#3-피그마-디자인-시스템-토큰-스펙)
4. [실행 방법 및 환경 설정](#4-실행-방법-및-환경-설정)
5. [폴더 구조 및 주요 코드 설명](#5-폴더-구조-및-주요-코드-설명)
6. [핵심 기능 및 비즈니스 로직](#6-핵심-기능-및-비즈니스-로직)
7. [강조하고 싶은 기능](#7-강조하고-싶은-기능)
8. [코드 품질 및 CI 파이프라인](#8-코드-품질-및-ci-파이프라인)
9. [아키텍처 결정 기록 (ADR)](#9-아키텍처-결정-기록-adr)

---

## 1. 프로젝트 개요

- **프로젝트명**: CERTICOS BOOKS
- **저장소명**: `cdri-books-juyeong`
- **지원자**: 변주영
- **배포 대상**: Cloudflare Pages + Functions
- **주요 기능**:
  - 카카오 Daum 도서 검색 API 연동 (키워드 검색, 상세 조건 검색)
  - `IntersectionObserver` 기반 무한 스크롤 (Infinite Scroll)
  - 아코디언 도서 상세 보기 (표지 확대, 책 소개, 정가/할인가, 구매 링크)
  - 내가 찜한 책(북마크) 로컬스토리지 연동 및 전역 상태 관리
  - 최근 검색어 저장/삭제 관리
  - URL 검색 조건 복원과 뒤로가기·앞으로가기 지원
  - 검색 결과 없음 및 찜 목록 없음 Empty State 처리

---

## 2. 기술 스택 및 아키텍처 설계 원칙

현재 코드에 적용한 기술과 각 계층의 역할을 정리합니다.

### 2.1 기술 스택

| 분류                   | 기술 / 라이브러리                |       버전        | 선정 이유                                                                                                                                               |
| :--------------------- | :------------------------------- | :---------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework / Build**  | **Vite + React + TypeScript**    |  React 19, TS 5   | - 검색·찜 화면으로 구성된 CSR 앱에 필요한 개발 서버·HMR·빌드 제공<br/>- TypeScript로 도서 데이터와 컴포넌트·훅 인터페이스 정의                          |
| **Server State**       | **TanStack Query (React Query)** |        v5         | - `useInfiniteQuery`로 페이지·요청 취소·캐시 관리<br/>- `staleTime` 설정과 검색 조건별 쿼리 키로 캐시 재사용<br/>- 최초 로딩·추가 로딩·오류 상태 구분   |
| **Client State**       | **Zustand**                      |        v5         | - 찜 스냅샷과 검색 기록을 관리하는 데 사용<br/>- `persist`를 적용해 `localStorage`에 저장<br/>- Provider 없는 저장소 구성                               |
| **Routing**            | **React Router**                 |        v8         | - 검색·찜 경로와 브라우저 방문 기록 관리<br/>- `useSearchParams`로 확정 검색 조건을 URL에서 읽고 갱신                                                   |
| **Styling & UI Core**  | **Tailwind CSS + Radix UI**      |    Tailwind v3    | - 디자인 토큰을 Tailwind 설정에 반영<br/>- 필요한 UI에 Radix UI 접근성 기반 구성요소 활용                                                               |
| **Keyboard Shortcuts** | **Hotkeys.js**                   |        v4         | - 검색 기록의 방향키·Home·End 바인딩과 해제를 라이브러리에 위임<br/>- 목록에 포커스가 있을 때만 실행하고, 항목 간 포커스 이동 규칙은 페이지 훅에서 관리 |
| **Icons**              | **Lucide React + 제공된 SVG**    |         -         | - 돋보기·화살표·닫기 등 공통 아이콘은 Lucide React 사용<br/>- 하트와 빈 상태 아이콘은 제공된 SVG로 디자인 반영                                          |
| **Infrastructure**     | **Cloudflare Pages + Functions** |         -         | - 배포용 서버 프록시에서 카카오 인증 헤더 구성<br/>- 개발·배포에서 브라우저가 같은 출처의 `/api/books`를 호출하도록 구성                                |
| **Testing**            | **Vitest + RTL + MSW**           | Vitest v3, MSW v2 | - 사용자 조작과 HTTP 요청 경계를 함께 검증<br/>- 실제 API 키 없이 오류·재시도·추가 페이지 응답 재현<br/>- 앱의 실제 Provider 설정으로 재시도 정책 검증  |

### 2.2 핵심 아키텍처 설계 원칙

1. **서버 DTO와 프론트엔드 도메인 모델 분리 (Anti-Corruption Layer)**:
   - 외부 API 응답 타입(`KakaoBookDocumentDTO`)을 매퍼(`bookMapper.ts`)에서 프론트엔드 전용 모델(`Book`)로 변환합니다.
2. **도메인 중립 뷰(UI)와 도메인 종속 피처(Feature) 분리**:
   - `components/ui/`: 도메인 모델과 API 모듈에 의존하지 않는 프레젠테이셔널 컴포넌트를 둡니다.
   - `components/features/`: 비즈니스 로직과 도메인 모델을 UI에 연결하는 컴포넌트를 둡니다.
3. **커스텀 훅 응답 캡슐화 (Minimal Interface)**:
   - 뷰 컴포넌트는 React Query의 거대한 내부 객체를 알 필요 없이, 꼭 필요한 정제된 상태와 직관적인 액션 함수(`books`, `loadMore`, `isLoading` 등)만 반환받아 소비합니다.
4. **Zustand 셀렉터 기반 리렌더링 격리**:
   - 각 찜 버튼은 해당 도서의 찜 여부와 토글 액션을 선택해 구독합니다. 도서 카드는 `memo`로 감싸 같은 도서 props에 대한 부모 렌더링의 영향을 줄입니다.

---

## 3. 피그마 디자인 시스템 토큰 스펙

피그마 디자인 시안을 반영한 디자인 토큰입니다:

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

- Node.js `v22.x` (`.nvmrc`에 지정한 버전 사용 권장)
- npm `10.x` 이상 (`package-lock.json` 기준으로 설치)

### 4.2 환경 변수 설정 (`.env.dev`)

프로젝트 루트의 `.env.example`을 `.env.dev`로 복사하고 발급받은 카카오 REST API 키를 입력합니다.

> ⚠️ `.env.dev` 파일은 `.gitignore`에 등록되어 GitHub 저장소에 커밋되지 않습니다.

```bash
# .env.dev
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
```

`npm run dev`는 Vite를 `dev` 모드로 실행해 `.env.dev`를 읽습니다. 키를 변경하면 개발 서버를 재시작합니다. 키는 개발 서버가 카카오 요청의 인증 헤더를 구성할 때만 사용하며, 프런트엔드 코드나 `import.meta.env`에서 읽지 않습니다. 배포 시 Cloudflare Pages 프로젝트의 secret 변수에도 같은 이름(`KAKAO_REST_API_KEY`)으로 등록합니다.

개발·배포 모두 `GET /api/books`를 사용하며, 개발 프록시는 검색 쿼리를 유지한 채 카카오 `/v3/search/book`으로 전달합니다. 검색어 입력 후 Enter를 누르거나 상세검색에서 제목·저자명·출판사를 선택해 검색할 수 있습니다. 프록시의 설계 기준은 [ADR-0005](./docs/adr/0005-cors-proxy-cloudflare-pages.md)를 참고합니다.

키가 없으면 개발·배포 모두 카카오를 호출하지 않고 HTTP 503과 `Book search API is not configured` 오류를 반환합니다. 이 응답은 공통 서버 함수에서 생성합니다.

### 4.3 설치 및 실행

```bash
# 1. 저장소 복제 및 이동
git clone https://github.com/Juyeong-Byeon/cdri-books-juyeong.git
cd cdri-books-juyeong

# 2. 의존성 패키지 설치
npm ci

# 3. 환경 변수 파일 생성 후 KAKAO_REST_API_KEY 입력
cp .env.example .env.dev

# 4. 로컬 개발 서버 실행 (Vite Proxy 동작)
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

### 4.4 빌드 및 로컬 미리보기

```bash
# 프로덕션 빌드 및 타입 검사
npm run build

# .env.dev의 키를 Vite 프록시에 사용해 빌드 결과물 미리보기
npm run preview -- --mode dev
```

기본 `npm run preview`는 production 모드로 실행되어 `.env.dev`를 읽지 않습니다. 위 명령은 `dev` 모드로 환경 변수를 읽고 Vite 프록시를 사용합니다. Pages Functions는 실행하지 않으므로 실제 배포 함수의 동작은 Cloudflare 실행·배포 환경에서 별도로 확인해야 합니다.

---

## 5. 폴더 구조 및 주요 코드 설명

기본 앱 셸, Zustand 저장소, 카카오 도서 검색 API 연동, 상세검색, 최근 검색 기록 UI, 찜 목록 페이지, URL 조건 복원, 10권 단위 무한 스크롤, 도서 상세 펼침 및 로딩·빈 결과·오류 UI를 구현했습니다. 검색 전과 찜 목록 페이지에서는 API를 호출하지 않습니다. 아래 트리는 주요 폴더와 파일을 나타냅니다.

```text
cdri-books-juyeong/
├── docs/
│   └── adr/                  # 아키텍처 결정 기록
├── functions/
│   └── api/
│       └── books.ts          # Cloudflare Pages 엣지 프록시 함수 (API Key 은닉 & CORS 방지)
├── public/
│   └── _redirects            # Cloudflare Pages 라우팅 및 폴백 설정
├── server/
│   └── createBookSearchConfigurationError.ts # 개발·배포의 키 누락 응답
├── src/
│   ├── providers/
│   │   ├── ContentErrorBoundary.tsx # 콘텐츠 렌더링 오류 복구 경계
│   │   └── RootProvider.tsx         # BrowserRouter와 React Query 설정
│   ├── components/
│   │   ├── layout/                 # AppHeader, AppShell, PageLayout
│   │   ├── features/book/          # 공통 도서 목록·카드·표지·빈 화면·Skeleton 및 에셋·유틸리티
│   │   └── ui/                     # shadcn 기반 UI와 도메인 중립 ExpandableCard
│   ├── lib/
│   │   ├── typography.ts           # Tailwind와 cx가 공유하는 타이포그래피 정의
│   │   └── utils.ts                # 클래스 병합 유틸리티 cx
│   ├── pages/
│   │   ├── favorites/
│   │   │   ├── Page.tsx            # 찜 페이지 레이아웃 조합
│   │   │   └── components/         # 찜 건수와 저장된 도서 목록·빈 화면
│   │   └── search/
│   │       ├── Page.tsx            # 검색 페이지 레이아웃 조합
│   │       ├── components/
│   │       │   ├── BookSearchBar.tsx
│   │       │   ├── AdvancedSearchPopover.tsx
│   │       │   ├── SearchResultCount.tsx
│   │       │   └── SearchErrorState.tsx
│   │       ├── hooks/              # URL 조건·검색 제출·조회·스크롤·검색 기록
│   │       └── utils/              # URL 검색 조건 파싱·직렬화와 쿼리 키 생성
│   ├── stores/
│   │   ├── favorites/
│   │   │   └── store.ts              # 찜한 Book 스냅샷 Zustand 저장소
│   │   ├── searchHistory/
│   │   │   └── store.ts              # 최근 검색어 Zustand 저장소
│   │   └── util/
│   │       └── safeLocalStorage.ts # 저장소 접근 실패를 격리하는 persist 어댑터
│   ├── services/
│   │   ├── books.ts                # /api/books 요청과 HTTP 오류 처리
│   │   └── mappers/bookMapper.ts   # Kakao DTO → Book·페이지 메타데이터
│   ├── types/
│   │   ├── domain/                 # Book·검색 조건·페이지 모델
│   │   └── dto/kakao-book.ts        # 카카오 응답 타입
│   ├── test/                       # MSW 서버·고정 응답·공통 렌더·프록시 테스트
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
- **`BookList.tsx` / `BookCardItem.tsx`**: 검색 결과와 찜 스냅샷 목록, 독립적인 상세 펼침, 찜 저장소 연결, 새 탭 구매 링크를 제공합니다. 최초 요청은 카드 Skeleton, 추가 요청은 기존 목록과 높이가 일정한 하단 로딩 표시를 사용합니다. 새 행·표지에 짧은 등장 효과를 적용하며 동작 줄이기 설정을 따릅니다.
- **`ExpandableCard.tsx`**: 도서 모델에 의존하지 않고 미디어·제목·상세·액션 슬롯을 배치합니다. Radix Collapsible로 상세 토글의 키보드 조작과 ARIA 연결을 구성합니다.
- **`BookCover.tsx`**: 기본 48×68px·확대 210×280px 공간을 확보하며 이미지 로딩 Skeleton과 빈 표지·로드 실패 대체 표시를 처리합니다.
- **`useBookSearch.ts`**: URL에서 읽은 확정 조건을 쿼리 키로 사용합니다. React Query가 페이지·취소·캐시를 관리하고, 훅에서 중복 도서를 제거해 뷰에 전달합니다. 추가 페이지 오류가 발생하면 기존 결과를 유지하고 명시적인 재시도를 기다립니다.
- **`useSearchConditions.ts` / `useSearchSubmit.ts`**: URL에서 확정 조건을 읽고, 검색 제출 시 URL과 최근 검색어를 갱신합니다. 같은 조건을 다시 제출하면 현재 검색을 명시적으로 갱신합니다.
- **`useSearchHistoryHotkeys.ts` / `useSearchHistoryScrollHint.ts`**: 검색 기록의 키 바인딩과 하단 스크롤 힌트를 관리합니다. 목록 안에서만 키 동작을 실행하고, 더 내려갈 기록이 있으면 하단을 흐리게 표시합니다.
- **`bookMapper.ts`**: 유효한 ISBN-13·ISBN-10 또는 URL로 ID를 만들고, 미제공 가격을 `null`로 변환해 0원과 구분합니다. 가격·저자 표시 형식은 카드의 표시 유틸리티에서 처리합니다.
- **Zustand 저장소**: 찜 도서는 저장 시점의 스냅샷으로 보관하고, 최근 검색어는 중복을 맨 앞으로 이동해 최대 8개까지 저장합니다. 손상된 저장 데이터와 localStorage 접근 실패가 앱 중단 원인이 되지 않도록 처리합니다.

### 자동 검증 현황

`npm run test:run`으로 실행합니다. 2026-10-23 로컬 실행에서 **13개 파일·72개 테스트가 통과**했습니다. 테스트는 실제 API 키를 사용하지 않으며, 처리하지 않은 네트워크 요청이 있으면 실패합니다.

- **도메인·저장소**: ISBN·URL ID, 가격·빈 필드·표시 형식, 찜 스냅샷·해제·저장 복원, 손상·차단된 저장소, 검색 기록 중복 이동·최대 8개·삭제·이전 형식 복원.
- **검색 UI·URL**: 입력과 제출 구분, 공백 처리, 상세검색 대상 전달·상호 초기화·취소·포커스, 검색 기록 키보드 이동·선택·삭제, URL 정규화·push·replace·뒤로가기·앞으로가기·탭 조건 보존·캐시 재사용.
- **요청·복구**: 크기 10, 다음 페이지·중복 요청/도서 제거·종료, 조건 변경 시 이전 요청 취소, 초기·갱신·추가 페이지 오류와 기존 결과 유지, 400·401·403·429 자동 재시도 방지, 네트워크·5xx 최대 1회 재시도와 수동 복구.
- **공통 UI·프록시**: 카드 펼침·ARIA·표지 오류·찜·구매 링크, 렌더링 오류 경계 복구와 헤더 유지, 실제 Vite 서버와 배포 함수 핸들러의 키 누락 503·쿼리 전달·HTTP 상태 보존. 카카오 응답은 MSW로 모의 처리합니다.

테스트 구성과 필수 범위는 [ADR-0012](./docs/adr/0012-testing-and-deployment-validation.md)를 참고합니다. 공통 렌더 헬퍼는 실제 `RootProvider`를 사용하고 종료 시 QueryClient를 정리합니다. Zustand·localStorage·MSW 핸들러와 현재 URL은 각 테스트 후 초기화합니다. 브라우저 방문 기록 전체를 지우는 것은 JSDOM에서도 지원하지 않으므로 테스트는 현재 진입점에서의 이동과 상대적인 기록 증가를 확인합니다.

### 남은 구현·검증

- **실제 환경 검증**: Cloudflare 키 바인딩과 배포 후 검색·추가 페이지 로딩, 브라우저 재시작 후 저장 복원, 기준 디자인·키보드·포커스 동작 검증은 미완료입니다. 빌드나 현재 테스트의 성공으로 이 범위의 완료를 대신하지 않습니다.

---

## 6. 핵심 기능 및 비즈니스 로직

현재 코드에 구현한 검색·저장·상세 보기 동작입니다.

### 1) 도서 검색 및 정렬 (기본 검색 vs 상세 검색 상호 배타)

- **Placeholder**: 전체검색은 `검색어를 입력하세요`, 상세검색은 `검색어 입력`
- **검색 실행**: 검색어 입력 후 **`Enter` 키**를 누르면 검색이 트리거되고, 페이지 당 **10개의 결과**(`size=10`)가 노출됩니다.
- **상세 검색 (하단 레이어 팝업)**:
  - 검색창 우측 `[상세 검색]` 버튼 클릭 시 버튼 하단에 레이어 팝업이 노출됩니다.
  - 검색 조건 클릭 시 셀렉트 옵션(`제목: title`, `저자명: person`, `출판사: publisher`)이 노출됩니다.
  - `[검색하기]` 버튼 클릭 시 팝업이 닫히며 입력한 타깃 조건으로 상세 검색이 실행됩니다.
- **⭐️ 상호 배타성 규칙 (Mutual Exclusion)**:
  - **전체 검색과 상세 검색은 동시에 진행 불가합니다.**
  - 상세 검색 진행 시: 전체 검색창에 입력되어 있던 검색어는 **자동 초기화**됩니다.
  - 전체 검색 진행 시: 이전 상세 검색 조건 및 입력 필드는 **자동 초기화**됩니다.
- **정렬 조건**: URL의 `sort`를 사용하며 `accuracy`가 기본값이고 `latest`를 허용합니다. 별도의 정렬 선택 UI는 제공하지 않습니다.

### 2) 검색 기록 관리 (`searchHistoryStore`)

- **최대 저장 개수**: **최대 8개** 저장
- **FIFO 큐 정책**: 8개를 초과하여 새 검색어가 유입될 경우, **가장 오래된 검색어부터 자동으로 삭제**됩니다.
- **중복 처리**: 이미 존재하는 검색어를 재입력할 경우, 중복 저장되지 않고 최상단(최신 순)으로 위치가 갱신됩니다.
- **영속성**: 브라우저를 재시작하거나 새로고침한 후에도 검색 기록 목록을 `localStorage`에서 복원합니다.
- **기록 선택**: 저장된 기록이 있을 때 검색창에 포커스하면 목록이 열립니다. 항목을 선택하면 해당 검색어로 전체 검색을 실행합니다. 방향키·Tab·Home·End로 이동하고 Escape나 바깥 클릭으로 닫을 수 있습니다.
- **스크롤 힌트**: 목록 아래에 더 볼 기록이 있으면 하단 그라데이션을 표시하고, 끝까지 스크롤하면 숨깁니다.
- **삭제**: 항목별 `X` 버튼은 검색을 실행하지 않고 해당 기록만 삭제합니다. 저장소는 전체 기록을 비우는 `clearSearchHistory` 액션도 제공합니다.

### 3) 도서 상세 아코디언 & 구매 링크

- **상세보기 ∨**: 클릭 시 아코디언 형태로 도서 요약 내용과 정가/할인가, 큰 표지가 확장됩니다.
- **구매하기 버튼**: API가 제공한 도서 URL을 새 탭(`target="_blank" rel="noopener noreferrer"`)으로 엽니다.

### 4) 찜하기 (스냅샷 기반 영속 보관)

- **스냅샷 보관 정책**: 찜하기 버튼을 누른 **그 시점의 도서 데이터(제목, 가격, 표지 등)를 스냅샷 형태로 보관**합니다. 따라서 이후 카카오 API의 실시간 응답 데이터가 변동되더라도 찜한 시점의 데이터가 보존됩니다.
- **영속성**: 브라우저를 닫거나 재시작한 후에도 찜한 도서 목록을 `localStorage`에서 복원합니다.
- **동기화**: [도서 검색] 화면과 [내가 찜한 책] 화면은 같은 찜 저장소를 사용합니다.
- **찜 목록 화면**: 저장된 도서 건수와 카드를 표시하며 상세 펼침·구매·찜 해제를 지원합니다. 마지막 도서를 해제하면 건수가 0으로 갱신되고, 공통 도서 아이콘과 `찜한 책이 없습니다.` 안내를 표시합니다.

---

## 7. 강조하고 싶은 기능

### 1. 디자인 토큰과 재사용 가능한 UI

- 피그마 색상·타이포그래피를 Tailwind 토큰에 반영했습니다. 타이포그래피 정의는 Tailwind와 클래스 병합 함수 `cx`가 공유합니다.
- Popover·Select·Collapsible는 Radix 프리미티브를 사용하고, 범용 `ExpandableCard`와 도서 데이터 연결 컴포넌트를 분리했습니다. 검색과 찜 목록에서 같은 도서 카드를 재사용합니다.

### 2. 도서별 찜 상태 구독

- 각 찜 버튼은 해당 도서의 찜 여부와 액션을 Zustand 셀렉터로 구독합니다. 전체 찜 배열을 모든 도서 카드의 props로 전달하지 않습니다.

### 3. 서버 프록시를 통한 API 키 관리

- 브라우저는 같은 출처의 `/api/books`를 호출합니다. 개발에서는 Vite 프록시, 배포에서는 Pages Function이 서버 전용 키로 카카오 인증 헤더를 구성합니다.

### 4. 데이터 의미를 유지하는 매퍼와 찜 스냅샷

- 매퍼에서 ISBN·URL 식별자를 정리하고 미제공 가격을 `null`로 바꿔 유효한 0원과 구분합니다. 금액·저자·제목의 표시 형식은 별도 유틸리티에서 처리합니다.
- 찜한 책은 저장 시점의 `Book` 스냅샷으로 보관하며, 저자·번역자 배열도 복사합니다.

### 5. 제출 기반 검색과 조건별 캐시

- 입력 중에는 요청하지 않고 Enter·상세검색 제출·기록 선택으로 검색을 확정합니다.
- React Query가 조건별 캐시와 페이지를 관리합니다. 같은 조건의 캐시는 재사용하고, 같은 조건을 명시적으로 다시 제출하면 갱신합니다.

### 6. URL을 기준으로 한 검색 조건 복원

- 검색 조건은 URL의 `q`·`target`·`sort`, 현재 화면은 `/`·`/favorites` 경로로 관리합니다. 화면을 이동해도 조건을 유지하고, 뒤로가기·앞으로가기 시 URL에서 입력값을 복원합니다.

### 7. 요청 종류별 오류 복구와 표지 영역 확보

- API 오류 UI와 콘텐츠 렌더링 ErrorBoundary를 분리했습니다. 다음 페이지 요청이 실패해도 기존 결과를 유지하고 재시도 동작을 제공합니다.
- 표지 로딩 전부터 크기를 확보하고, 로딩 중에는 Skeleton, 빈 URL·로드 실패에는 대체 표시를 사용합니다. 추가 로딩은 기존 목록과 높이가 일정한 하단 표시를 사용합니다.

### 8. 검색 기록의 키보드 이동과 스크롤 힌트

- Hotkeys.js로 방향키·Home·End를 바인딩하고 목록이 닫히면 해제합니다. 목록 안에서만 포커스 이동을 실행하며, 한글 조합 중에는 무시합니다.
- 기록이 더 이어질 때만 하단 그라데이션을 표시해 스크롤 가능 여부를 알려줍니다.

---

## 8. 코드 품질 및 CI 파이프라인

Git 훅과 GitHub Actions에서 아래 검증 명령을 실행합니다.

### 8.1 Git Commit Hooks (Husky + lint-staged + Commitlint)

- **`commit-msg`**:
  - `Conventional Commits` 규약(`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:` 등) 준수 여부 검증
  - 비표준 커밋 메시지 작성 시 커밋 차단
- **`pre-commit`**:
  - 변경된(Staged) 파일에 대해 `eslint --fix` 및 `prettier --write` 자동 실행
  - 앱·설정의 TypeScript 빌드 검사와 Pages Functions 타입 검사 (`npm run typecheck`)
- **`pre-push`**:
  - 원격 저장소 전송 전 단위 및 컴포넌트 테스트 전수 검증 (`npm run test:run` ➔ `vitest run`)

### 8.2 GitHub Actions CI 파이프라인 (`.github/workflows/ci.yml`)

- **실행 환경**: Node.js `v22.x`
- **트리거**: `main` 브랜치 푸시 및 `main`을 대상으로 하는 PR(Pull Request)
- **검증 단계**: `npm ci` ➔ `typecheck` ➔ `format:check` ➔ `lint` ➔ `test:run` ➔ `build`

---

## 9. 아키텍처 결정 기록 (ADR)

의사결정의 배경·대안·트레이드오프와 ADR-0001~0012 전체 목록은 [ADR 인덱스](./docs/adr/README.md)에서 확인할 수 있습니다. 각 ADR의 Accepted는 설계 결정의 승인을 뜻합니다. 현재 구현 범위와 남은 작업은 이 README의 [5절](#5-폴더-구조-및-주요-코드-설명)에 정리합니다.
