# Architecture Decision Records

이 디렉터리는 CERTICOS BOOKS 과제에서 선택한 설계와 그 이유·대안·트레이드오프를 기록한다.

**Accepted는 설계 결정의 승인을 뜻하며 구현 완료나 검증 통과를 뜻하지 않는다.** 2026-10-22에 사용자 답변으로 아래 9개 결정을 확정했다. 기존 ADR 번호를 유지하며 충돌하는 내용을 개정하고, URL·오류·테스트는 별도 ADR로 분리했다.

## 확정한 결정과 근거 문서

| 선택             | 확정 내용                                                                           | ADR                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1. 구현 범위     | 기본 기능·디자인·핵심 테스트에 URL 동기화를 필수로 포함                             | [0009](./0009-ux-resilience-and-testing-strategy.md), [0010](./0010-url-search-state-and-history.md) |
| 2. 계층 분리     | ExpandableCard와 도메인 바인딩, DTO·도메인·매퍼를 별도 계층으로 유지                | [0006](./0006-dto-domain-mapping-layer.md), [0007](./0007-component-and-hook-layering.md)            |
| 3. API 실행·배포 | Vite 프록시와 Cloudflare Pages Functions 유지, /api/books 통일, 실제 배포 검색 검증 | [0005](./0005-cors-proxy-cloudflare-pages.md)                                                        |
| 4. 영속 상태     | Zustand + persist로 찜 스냅샷과 최근 검색어 관리                                    | [0004](./0004-client-state-zustand.md)                                                               |
| 5. 오류          | API 오류는 React Query 상태 UI, ErrorBoundary는 렌더링 오류 담당                    | [0011](./0011-query-errors-and-render-boundary.md)                                                   |
| 6. 테스트        | Vitest·RTL·MSW 핵심 테스트와 실제 배포 검증, Playwright는 필수에서 제외             | [0012](./0012-testing-and-deployment-validation.md)                                                  |
| 7. 방문 기록     | 검색 제출·화면 전환은 push, 화면 전환 시 검색 조건 유지, 스크롤은 URL에서 제외      | [0010](./0010-url-search-state-and-history.md)                                                       |
| 8. 상세검색 UI   | 버튼 아래 Popover와 검색 대상 선택, 제출 시 적용, Esc와 포커스 복귀                 | [0002](./0002-styling-tailwind-css.md)                                                               |
| 9. 도메인 데이터 | 숫자·배열·날짜 의미 유지, 표시 포맷 별도, Book 스냅샷 저장                          | [0006](./0006-dto-domain-mapping-layer.md)                                                           |

기획의 Enter 검색·10개씩 무한 스크롤·최근 검색어 최대 8개·찜 시점 데이터 보관은 선택 사항이 아닌 구현 전제다.

## 상태별 관리 위치

| 상태                                  | 기준 위치          |
| ------------------------------------- | ------------------ |
| 현재 화면(경로)·확정 검색 조건        | URL                |
| 입력값·상세검색 임시값·팝업·카드 펼침 | 컴포넌트 로컬 상태 |
| 검색 결과·요청·페이지                 | React Query        |
| 찜 스냅샷·최근 검색어                 | Zustand + persist  |

## ADR 목록

모든 문서의 설계 상태는 승인 (Accepted)이다. 결정·개정 일자는 각 문서에서 관리한다.

| 번호                                                 | 결정                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| [0001](./0001-framework-vite-react.md)               | Vite + React + TypeScript 유지                |
| [0002](./0002-styling-tailwind-css.md)               | Tailwind·Radix 기반 UI와 상세검색 Popover     |
| [0003](./0003-server-state-react-query.md)           | 제출 기반 검색과 React Query 무한 스크롤      |
| [0004](./0004-client-state-zustand.md)               | Zustand 영속 상태의 범위와 스냅샷 정책        |
| [0005](./0005-cors-proxy-cloudflare-pages.md)        | /api/books 서버 프록시와 키 주입              |
| [0006](./0006-dto-domain-mapping-layer.md)           | DTO·도메인·매퍼와 별도 표시 포맷              |
| [0007](./0007-component-and-hook-layering.md)        | 범용 UI·도메인 바인딩과 검색 훅 계약          |
| [0008](./0008-ci-cd-and-git-hooks.md)                | 기존 훅·CI 유지와 검증 명령                   |
| [0009](./0009-ux-resilience-and-testing-strategy.md) | 구현 범위·디자인·접근성                       |
| [0010](./0010-url-search-state-and-history.md)       | URL 단일 기준과 브라우저 방문 기록            |
| [0011](./0011-query-errors-and-render-boundary.md)   | API 오류 UI와 렌더링 경계                     |
| [0012](./0012-testing-and-deployment-validation.md)  | 핵심 자동 테스트와 실제 환경 검증             |
| [0013](./0013-documentation-site.md)                 | 원본 Markdown 기반 문서 사이트 동시 배포      |
| [0014](./0014-pagespeed-guided-improvements.md)      | PageSpeed 근거로 자산·크롤링·텍스트 대비 개선 |

## 구현과 검증 현황

현재 구현 범위와 남은 작업은 [프로젝트 README의 5절](../../README.md#5-폴더-구조-및-주요-코드-설명)에서 관리한다.

공개 사이트 주소는 README 최상단, 배포 방법은 [실행·배포 안내](../../README.md#45-cloudflare-pages-배포), 확인한 범위는 [배포 및 실제 환경 확인](../../README.md#배포-및-실제-환경-확인)을 참고한다. 주소·테스트 수·실행 결과를 ADR마다 중복 기록하지 않는다.

Git 훅·CI의 검증 명령은 [ADR-0008](./0008-ci-cd-and-git-hooks.md), 필요한 자동 테스트와 실제 환경 검증의 범위는 [ADR-0012](./0012-testing-and-deployment-validation.md)를 따른다.

현재 동작이나 테스트 결과를 기록할 때에는 이 설계 문서와 구분하고, 미실행을 통과로 표시하지 않는다.
