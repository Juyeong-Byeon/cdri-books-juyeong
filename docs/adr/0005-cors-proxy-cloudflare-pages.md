# ADR-0005: API Key 보안 은닉 및 CORS 해결을 위한 Cloudflare Pages Functions 및 Proxy 전략

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)

카카오 REST API는 서버-투-서버 호출을 기본 전제로 설계되어 있습니다. 브라우저에서 직접 `https://dapi.kakao.com/v3/search/book`을 호출할 경우:

1. 브라우저의 Network 탭에 카카오 `REST API Key`가 평문으로 노출되는 심각한 보안 위협이 발생합니다.
2. 도메인 간 리소스 공유(CORS) 정책에 의해 요청이 차단될 수 있습니다.
3. 과제 가이드라인에서도 **"API Key 보안: .env 파일을 사용하고 노출 방지"**를 중요 유의사항으로 명시하고 있습니다.

따라서 로컬 개발 환경과 배포 환경 모두에서 **브라우저에 API Key를 노출하지 않으면서도 CORS를 완벽히 해결하는 프록시 아키텍처**를 수립해야 합니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: 프론트엔드 코드에서 직접 `dapi.kakao.com` 호출

- **문제점**:
  - `VITE_KAKAO_REST_API_KEY`가 클라이언트 번들에 번들링되어 브라우저 Network 탭 및 소스코드에 그대로 노출됨.
  - 과제 보안 평가 기준에 크게 저촉됨.

### 대안 B: 별도의 Express/Nest.js 백엔드 서버 구축 후 배포

- **장점**: 전통적인 백엔드 프록시.
- **단점**: 과제 스펙을 넘어서는 인프라 관리 비용(서버 호스팅, 도메인 세팅 등)이 발생하며 배포/평가 환경이 복잡해짐.

### 대안 C: Vite 개발 프록시 + Cloudflare Pages Functions 엣지 서버리스 (선정)

- **장점**:
  - **로컬 개발 환경**: `vite.config.ts`의 `server.proxy`를 설정하여 로컬 브라우저 ➔ 로컬 Vite dev server (`/api/search/book`) ➔ 카카오 API로 포워딩. 로컬에서도 API Key가 브라우저에 직접 노출되지 않음.
  - **배포 환경 (Cloudflare Pages)**: `functions/api/books.ts`에 경량 엣지 함수(Cloudflare Worker 기반)를 배치하여, Cloudflare 환경변수(`context.env.KAKAO_REST_API_KEY`)를 엣지에서 안전하게 주입하여 카카오와 통신.
  - 브라우저는 같은 도메인의 `/api/books`만 호출하므로 **CORS 문제가 원천적으로 발생하지 않으며**, 클라이언트 자바스크립트 번들에 API Key가 0% 포함되어 **보안 요구사항을 완벽히 충족**함.
  - 추가 서버 인프라 없이 Cloudflare Pages 무료 플랜에서 글로벌 엣지 속도로 즉시 동작함.

---

## 3. 결정 (Decision)

- **로컬 환경**: Vite 내장 프록시(`vite.config.ts`) 구성.
- **배포 환경**: Cloudflare Pages Functions (`functions/api/books.ts`) 및 `public/_redirects` 대체 경로 구성.
- API 엔드포인트 URL은 환경에 따라 유연하게 전환되도록 `src/services/api/client.ts`에 추상화합니다.

---

## 4. 결정의 결과 및 영향 (Consequences)

- **긍정적 영향**:
  - 과제 요구사항 중 가장 중요한 "API Key 보안" 부문에서 최고 수준의 보안 아키텍처 증명.
  - 개발 환경과 배포 환경 모두 CORS 이슈 없이 일관된 API 호출 흐름 확보.
  - 풀스택 프레임워크(Next.js) 없이도 정적 SPA + 엣지 서버리스의 최신 모던 웹 아키텍처 구현.
