# Architecture Decision Records (ADR)

이 문서는 **CDRI 프론트엔드 사전과제 (CERTICOS BOOKS - `cdri-books-juyeong`)**의 주요 기술적 의사결정과 그 배경, 대안 분석 및 결과를 기록한 아키텍처 결정 기록(ADR)입니다.

---

## 📋 ADR 목록

| 번호 | 제목 | 상태 | 결정 일자 |
| :--- | :--- | :---: | :---: |
| [ADR-0001](./0001-framework-vite-react.md) | 번들러 및 런타임으로 Vite + React 19 + TypeScript 선정 (Next.js 비교) | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0002](./0002-styling-tailwind-css.md) | 디자인 시스템 스펙 토큰화 및 Tailwind CSS + shadcn/ui 커스텀 선정 | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0003](./0003-server-state-react-query.md) | 서버 상태 관리 및 무한 스크롤로 TanStack Query v5 채택 | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0004](./0004-client-state-zustand.md) | 클라이언트 전역 상태 관리로 Zustand 및 persist 미들웨어 채택 (리렌더링 최적화) | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0005](./0005-cors-proxy-cloudflare-pages.md) | API Key 보안 은닉 및 CORS 해결을 위한 Cloudflare Pages Functions 및 Proxy 전략 | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0006](./0006-dto-domain-mapping-layer.md) | 서버 DTO와 프론트엔드 도메인 모델 분리 및 매퍼 계층 구축 (부패 방지 계층) | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0007](./0007-component-and-hook-layering.md) | 도메인 중립 뷰 컴포넌트 계층 분리 및 훅 응답 캡슐화 설계 | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0008](./0008-ci-cd-and-git-hooks.md) | 코드 품질 및 커밋 규약 보증을 위한 Git Hooks & CI/CD 파이프라인 스펙 | **승인 (Accepted)** | 2026-10-22 |
| [ADR-0009](./0009-ux-resilience-and-testing-strategy.md) | 사용자 경험(UX) 극대화, 회복 탄력성 및 테스트 검증 전략 | **승인 (Accepted)** | 2026-10-22 |
