# ADR-0001: 번들러 및 런타임으로 Vite + React + TypeScript 선정

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)
본 프로젝트는 카카오 Daum 책 검색 API를 연동하여 도서를 검색하고, 상세 정보를 아코디언으로 확인하며, 찜하기(북마크) 및 최근 검색어를 관리하는 단일 페이지 웹 애플리케이션(SPA)입니다. 과제 필수 조건으로 `React.js`, `TypeScript`, `React Query`가 지정되어 있으며, 프로젝트를 구축하기 위한 기반 프레임워크/번들러로 **Next.js (App Router)**와 **Vite (SPA)** 중 하나를 결정해야 했습니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: Next.js (App Router)
- **장점**:
  - `app/api/...` 형태의 Route Handler(Node/Edge 서버)가 내장되어 있어 백엔드 프록시를 자체 구현할 수 있음.
  - API Key를 서버 사이드에 은닉하기 쉬움.
- **단점**:
  - React Query v5와 병용 시 `'use client'` 선언, `HydrationBoundary`, `dehydrate` 등 추가 보일러플레이트가 크게 증가함.
  - 검색 탭과 찜한 책 탭으로 구성된 인터랙티브 SPA 성격의 애플리케이션에 비해 프레임워크가 무겁고 복잡성이 높음.

### 대안 B: Vite + React 19 + TypeScript (선정)
- **장점**:
  - Esbuild 기반의 초고속 HMR(Hot Module Replacement)과 빠른 개발 빌드 속도.
  - 표준적인 React SPA 환경으로, TanStack Query(React Query)의 캐싱 및 라이프사이클(`useInfiniteQuery`)을 군더더기 없이 구현 가능.
  - 과제 필수 요구사항인 "React, TypeScript, React Query" 본연의 컴포넌트 설계 및 커스텀 훅 작성에 오롯이 집중할 수 있음.
  - 배포 시 Cloudflare Pages(`_redirects` 및 `Functions`)와의 완벽한 궁합으로 API 보안 및 CORS를 해결할 수 있음.
- **단점**:
  - 순수 브라우저 CSR이므로 개발 서버(`vite.config.ts`) 및 배포 환경(Cloudflare / Vercel)에서의 프록시 설정이 별도로 필요함.

---

## 3. 결정 (Decision)
**Vite + React 19 + TypeScript**를 프로젝트 기반 스택으로 채택합니다.

---

## 4. 결정의 결과 및 영향 (Consequences)
- **긍정적 영향**:
  - 과제 평가 기준인 **"재사용 가능한 컴포넌트 설계"**, **"클린 코드 및 가독성"**, **"React Query 상태 관리"** 역량을 가장 명확하게 보여줄 수 있습니다.
  - 프레임워크 특유의 종속성 없이 표준적인 모던 React 코딩 패턴을 유지할 수 있습니다.
- **대응 과제**:
  - API Key 은닉과 CORS 해결을 위해 로컬 개발 환경 프록시(`vite.config.ts`)와 배포 환경(Cloudflare Pages Functions / `_redirects`) 설정을 체계적으로 구성해야 합니다. (이는 [ADR-0005](./0005-cors-proxy-cloudflare-pages.md)에서 다룸)
