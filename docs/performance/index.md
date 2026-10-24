# PageSpeed 측정 기록

2026년 10월 24일 공개 배포에서 측정한 두 PageSpeed Insights 결과와, 이후 작업 트리에 반영한 개선을 기록한다.

개선 선택의 이유·대안·트레이드오프는 [ADR-0014](../adr/0014-pagespeed-guided-improvements.md)에 기록한다.

## 측정 대상과 결과

| 항목                     | 초기 화면                                                                                                  | 리액트 검색 결과                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 대상 URL                 | [초기 화면](https://cdri.y-one.org/)                                                                       | [리액트 검색](https://cdri.y-one.org/?q=%EB%A6%AC%EC%95%A1%ED%8A%B8)                                       |
| 측정 시각 (한국 시간)    | 2026-10-24 12:13:13                                                                                        | 2026-10-24 12:14:43                                                                                        |
| 원본 보고서              | [초기 화면 보고서](https://pagespeed.web.dev/analysis/https-cdri-y-one-org/dsq0rgwelh?form_factor=desktop) | [검색 결과 보고서](https://pagespeed.web.dev/analysis/https-cdri-y-one-org/a4bsw1287w?form_factor=desktop) |
| 성능                     | 97                                                                                                         | 98                                                                                                         |
| 접근성                   | 100                                                                                                        | 96                                                                                                         |
| 권장사항                 | 100                                                                                                        | 100                                                                                                        |
| 검색엔진 최적화          | 91                                                                                                         | 92                                                                                                         |
| First Contentful Paint   | 0.9초                                                                                                      | 0.9초                                                                                                      |
| Largest Contentful Paint | 0.9초                                                                                                      | 0.9초                                                                                                      |
| Total Blocking Time      | 0ms                                                                                                        | 0ms                                                                                                        |
| Cumulative Layout Shift  | 0                                                                                                          | 0                                                                                                          |
| Speed Index              | 1.4초                                                                                                      | 1.0초                                                                                                      |

두 보고서는 Lighthouse 13.5.0·HeadlessChromium 153.0.8010.36의 에뮬레이션된 데스크톱에서 초기 페이지 로드를 측정했다. 네트워크 조건은 보고서에 표시된 맞춤형 제한을 사용했다.

### 해석 범위

- 두 URL은 서로 다른 화면을 측정한 결과다. 개선 전·후의 비교 점수로 사용하지 않는다.
- 실제 사용자 경험 데이터는 두 보고서 모두 없다. 위 수치는 단일 실행의 실험실 측정값이며 실제 사용자 전체의 Core Web Vitals 통과를 뜻하지 않는다.
- 데스크톱 결과만 기록했다. 모바일, 추가 페이지를 읽는 동안의 상호작용, 상세 펼침·찜·뒤로가기의 성능을 이 점수로 대신하지 않는다.
- 접근성 점수는 자동 감사의 결과다. 키보드·포커스 등 수동 검토가 필요한 범위는 [ADR-0012](../adr/0012-testing-and-deployment-validation.md)를 따른다.

## 확인한 문제와 후속 개선

아래 변경은 보고서 확인 이후의 작업 트리에 반영했다. 원본 보고서의 점수와 캡처는 이 변경의 재측정 결과가 아니다.

### 1. Google Fonts 스타일시트 중복 선언 축소

두 보고서 모두 렌더링 차단 요청을 지적했다. 초기 화면 보고서에서 앱 CSS는 약 6KiB·50ms, Google Fonts CSS는 약 68.6KiB·340ms로 표시됐다. 미사용 CSS 절감 예상치도 대부분 Google Fonts에서 나왔다.

[index.html](../../index.html)의 개별 굵기 요청을 가변 굵기 범위 요청으로 변경했다. 같은 Chrome 사용자 에이전트로 Google Fonts 응답을 비교했을 때 실제 참조하는 폰트 파일 집합은 동일했다.

| 직접 비교한 값          | 변경 전       | 변경 후      |
| ----------------------- | ------------- | ------------ |
| CSS 원문                | 285,438 bytes | 95,642 bytes |
| CSS 로컬 gzip 압축      | 69,768 bytes  | 23,343 bytes |
| `@font-face` 선언       | 372개         | 124개        |
| 서로 다른 폰트 파일 URL | 124개         | 124개        |

CSS의 로컬 gzip 크기는 약 66.5% 줄었다. 이는 동일 요청 조건에서 응답 본문을 압축해 비교한 값이다. PageSpeed의 전송 크기나 변경 후 LCP 측정값과 동일시하지 않는다. 글꼴과 사용 굵기, `display=swap`, 사전 연결 설정은 유지한다. [Google Fonts 가변 굵기 범위 안내](https://developers.google.com/fonts/docs/css2#axis_ranges)

### 2. 빈 상태 아이콘의 내장 PNG 제거

기존 파일은 SVG 내부에 큰 PNG를 Base64로 포함하고 있었다. [빈 상태 아이콘](../../src/components/features/book/assets/empty-books.svg)의 원·책 표지·책장을 벡터 도형으로 다시 구성해, 원본 SVG 706,977 bytes를 811 bytes로 줄였다. 80×80 표시 공간은 유지하며, 기본 Vite 파비콘 경로도 이 아이콘을 사용하도록 수정했다.

이 크기 비교는 소스 파일 기준이다. 이번 프로덕션 빌드도 SVG를 0.81kB·gzip 0.43kB의 외부 자산으로 출력했다. 실제 전송량은 배포 후 압축·캐시 조건을 포함해 별도 확인해야 한다.

### 3. robots.txt의 SPA HTML 응답 수정

두 보고서 모두 `robots.txt`에서 HTML 문법을 읽고 25개 오류를 보고했다. 해당 파일이 없어 Cloudflare Pages의 SPA fallback이 앱 HTML을 반환한 것이 원인이다.

[public/robots.txt](../../public/robots.txt)를 추가해 일반 크롤링 규칙을 정적 텍스트로 제공한다. 앱의 경로 복원에 사용하는 SPA fallback은 유지한다. [Lighthouse robots.txt 감사 안내](https://developer.chrome.com/docs/lighthouse/seo/invalid-robots-txt/)

### 4. 검색 결과의 텍스트 대비 보완

검색 결과 보고서는 결과 건수의 파란색 텍스트, 구매 버튼의 흰색 글자, 상세보기 버튼의 글자 대비를 지적했다.

[Tailwind 토큰](../../tailwind.config.ts)에 일반 크기 텍스트와 흰색 버튼 글자를 위한 `primaryStrong`을 추가하고, 보조 텍스트를 조정했다. 결과·찜 건수와 공통 버튼, 검색 기록·가격 라벨·완료 안내에 적용했다. 원본 `primary`는 탐색 메뉴·포커스 표시 등에 유지한다.

| 색상 조합                       | 변경 전 대비율 | 변경 후 대비율 |
| ------------------------------- | -------------- | -------------- |
| 파란 배경과 흰색 버튼 글자      | 3.75:1         | 5.10:1         |
| 흰 배경과 결과 건수의 파란 글자 | 3.75:1         | 5.10:1         |
| 밝은 회색 배경과 보조 텍스트    | 4.22:1         | 4.89:1         |

값은 불투명한 기본 상태의 색상 토큰에서 계산했다. 기본 버튼의 hover 상태도 흰 배경 합성 기준 4.68:1이다. 일반 크기 텍스트의 4.5:1 기준을 충족하도록 조정했으며, 자동 접근성 점수 상승은 아직 재측정하지 않았다. [WCAG 텍스트 대비 기준](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## 남은 측정과 범위

- 검색 결과의 외부 표지는 API에서 받은 썸네일 URL을 사용한다. 보고서는 표시 크기보다 큰 이미지와 압축 효율을 지적했으며, 절감 예상치는 약 68KiB다. 제공되지 않은 작은 이미지 URL을 임의로 만들어 쓰거나 모든 표지를 더 낮은 해상도로 교체하지 않았다. 화면 배율과 펼친 표지 품질을 함께 고려해야 한다.
- 미사용 JavaScript 절감 예상치는 초기 화면 약 83KiB, 검색 결과 약 74KiB다. 해당 측정의 TBT는 두 화면 모두 0ms였다. 이 값만으로 추가 청크 분리의 효과를 단정하지 않으며, 상호작용과 실제 청크 사용량을 보고 후속 작업의 우선순위를 정한다.
- 제공된 두 보고서는 에이전트형 브라우징을 별도의 실험적 카테고리로 표시한다. 네 가지 주요 점수와 구분해 해석한다.
- 후속 변경을 재배포한 뒤 같은 두 URL·데스크톱 조건으로 다시 측정해야 한다. 새 보고서 링크와 측정 시각을 남기기 전에는 이 페이지의 점수를 개선 후 결과로 갱신하지 않는다.

### 후속 변경의 로컬 확인

앱·문서 프로덕션 빌드, 타입 검사, 린트, 포맷 검사를 통과했다. 빌드 결과 미리보기에서 실제 검색 결과와 변경한 버튼·건수 토큰, 가변 굵기 폰트 요청을 확인했다. `/robots.txt`는 HTTP 200·`text/plain`과 크롤링 규칙을 반환하며, `/favorites`의 SPA 진입과 성능 문서의 캡처 4장도 빌드 결과에 포함됐다. 이 확인은 Cloudflare 재배포와 개선 후 PageSpeed 측정을 대신하지 않는다.

## 초기 화면 캡처

[원본 초기 화면 보고서](https://pagespeed.web.dev/analysis/https-cdri-y-one-org/dsq0rgwelh?form_factor=desktop)

![초기 화면의 PageSpeed 데스크톱 결과: 성능 97, 접근성 100, 권장사항 100, SEO 91](./assets/2026-10-24-initial-desktop-overview.png)

![초기 화면의 FCP 0.9초, LCP 0.9초, TBT 0ms, CLS 0, Speed Index 1.4초와 측정 환경](./assets/2026-10-24-initial-desktop-metrics.png)

## 검색 결과 캡처

[원본 검색 결과 보고서](https://pagespeed.web.dev/analysis/https-cdri-y-one-org/a4bsw1287w?form_factor=desktop)

![리액트 검색 결과의 PageSpeed 데스크톱 결과: 성능 98, 접근성 96, 권장사항 100, SEO 92](./assets/2026-10-24-search-desktop-overview.png)

![검색 결과의 FCP 0.9초, LCP 0.9초, TBT 0ms, CLS 0, Speed Index 1.0초와 측정 환경](./assets/2026-10-24-search-desktop-metrics.png)
