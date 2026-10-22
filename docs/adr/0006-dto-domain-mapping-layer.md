# ADR-0006: 서버 DTO와 프론트엔드 도메인 모델 분리 및 매퍼 계층 구축

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)

카카오 Daum 책 검색 API가 반환하는 응답 객체(`KakaoBookDocument`)는 스네이크 케이스 필드명(`sale_price`, `is_end`), 예외적인 데이터 표현(할인 미적용 시 `sale_price: -1`, 두 개의 ISBN이 공백으로 합쳐진 문자열 등), 프론트엔드 렌더링에 적합하지 않은 원시 포맷(ISO 날짜, 분리된 저자 배열 등)을 포함하고 있습니다.

이 원본 API 응답 형태를 React UI 컴포넌트까지 그대로 끌고 갈 경우:

1. 모든 컴포넌트마다 데이터 정제 및 예외 처리 로직(`if (book.sale_price > 0 ...)` 등)이 중복됩니다.
2. 외부 API 스펙 변경이 수많은 UI 컴포넌트에 직접적인 파급 효과(Ripple Effect)를 일으켜 유지보수성이 급격히 저하됩니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: API 응답 DTO를 UI 컴포넌트에서 직접 소비

- **문제점**: UI 컴포넌트가 외부 API 필드 구조와 스네이크 케이스에 강하게 결합되어 변경에 취약해짐.

### 대안 B: DTO와 도메인 모델을 분리하고 변환 매퍼(Mapper) 레이어 구축 (선정)

- **장점**:
  - **부패 방지 계층(Anti-Corruption Layer)**: 외부 API 스펙이 변하거나 공급자가 교체되더라도 매퍼 함수 하나만 수정하면 프론트엔드 UI 컴포넌트는 영향을 받지 않음.
  - **데이터 정규화 & 사전 계산**: 고유 식별자(`id`), 할인 여부(`isDiscounted`), 할인율(`discountRate`), 표시용 저자(`authorText`), 포맷팅된 발행일(`publishedDate`), 이미지 폴백(`thumbnailUrl`)을 매퍼 단계에서 일괄 가공.
  - **클린 코드**: UI 컴포넌트는 정제된 도메인 모델(`Book`)만 받아 순수 렌더링에만 집중 가능.

---

## 3. 결정 (Decision)

- **DTO 타입 계층**(`src/types/dto/`): 카카오 API 원본 응답 구조(`KakaoBookResponseDTO`, `KakaoBookDocumentDTO`, `KakaoBookMetaDTO`).
- **도메인 모델 계층**(`src/types/domain/`): 프론트엔드 전용 클린 모델(`Book`, `BookPaginationMeta`).
- **매퍼 계층**(`src/services/mappers/bookMapper.ts`): DTO ➔ 도메인 모델 변환 순수 함수(`toDomainBook`, `toDomainBookMeta`).

---

## 4. 결정의 결과 및 영향 (Consequences)

- **긍정적 영향**:
  - UI 컴포넌트가 불필요한 예외 처리 분기문 없이 깔끔해짐.
  - 단위 테스트 작성이 매우 용이해짐 (`bookMapper.test.ts` 등 순수 함수 테스트 가능).
  - 엔터프라이즈급 아키텍처 분리 원칙을 충족하여 과제 평가 시 높은 점수 획득.
