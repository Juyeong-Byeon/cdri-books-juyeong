# ADR-0002: Tailwind CSS 토큰과 Radix 기반 UI, 상세검색 Popover 채택

- **상태**: 승인 (Accepted)
- **결정·개정 일자**: 2026-10-23
- **결정자**: 변주영

## 배경

디자인의 색상·타이포그래피·간격을 일관되게 적용하고, 상세검색 팝업과 도서 상세 펼침을 키보드로도 사용할 수 있어야 한다. 첨부 기획은 상세검색 버튼 하단에 팝업이 열리고, 검색 대상을 선택해 제출하면 닫히는 동작을 요구한다.

## 결정

- 아래 색상·타이포그래피 명세를 구현 기준으로 사용하고, `tailwind.config.ts`의 `theme.extend`에 동일한 이름과 값으로 유지한다. 컴포넌트에서는 해당 토큰의 Tailwind 클래스를 사용한다.
- 타이포그래피 값은 `src/lib/typography.ts`에 선언하고, Tailwind의 `fontSize`와 `cx`의 글자 크기 판별이 이 정의를 공유한다. 사용자 정의 글자 크기를 글자색과 함께 병합해도 제거되지 않게 한다.
- Tailwind CSS의 토큰과 shadcn/ui 방식의 소스 소유 구조를 유지한다. 접근성 동작이 필요한 UI는 Radix 프리미티브를 활용한다.
- 상세검색은 버튼에 연결된 Popover와 검색 대상 선택 입력으로 구현한다. 중앙 Dialog는 사용하지 않는다.
- 팝업 입력은 임시 상태다. 제출할 때만 검색 조건을 적용하며, 취소하거나 Esc로 닫으면 적용하지 않는다.
- Esc로 닫기, 트리거로 포커스 복귀, 선택 입력의 키보드 조작을 검증한다. 라이브러리 사용만으로 접근성 검증을 대체하지 않는다.
- 범용 UI와 도메인 바인딩의 책임은 [ADR-0007](./0007-component-and-hook-layering.md)을 따른다.

## 디자인 토큰 명세

### 색상

`tailwind.config.ts`의 `theme.extend.colors`에 다음 값을 사용한다.

```typescript
colors: {
  palette: {
    primary: '#4880EE',   // 메인 브랜드 블루 (버튼, 활성 탭 등)
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

사용 예: `bg-palette-primary`, `text-palette-red`, `border-palette-gray`, `bg-palette-lightGray`, `text-text-primary`, `text-text-secondary`, `placeholder:text-text-subtitle`.

### 타이포그래피

기본 글꼴은 `'Noto Sans KR', sans-serif`다. 아래 크기·행간·굵기를 함께 `theme.extend.fontSize`에 정의한다.

| 토큰명           | Font Size | Line Height | Font Weight  | 설명                             |
| ---------------- | --------- | ----------- | ------------ | -------------------------------- |
| **`title1`**     | 24px      | 24px        | 700 (Bold)   | 대제목, 메인 헤더 타이틀         |
| **`title2`**     | 22px      | 24px        | 700 (Bold)   | 섹션 타이틀, 검색 결과 타이틀    |
| **`title3`**     | 18px      | 18px        | 700 (Bold)   | 도서 제목, 모달 타이틀           |
| **`body1`**      | 20px      | 20px        | 500 (Medium) | 본문 강조 텍스트, 탭 라벨        |
| **`body2`**      | 14px      | 14px        | 500 (Medium) | 기본 본문, 도서 저자/출판사 정보 |
| **`body2-bold`** | 14px      | 14px        | 700 (Bold)   | 볼드 본문, 가격 강조             |
| **`caption`**    | 16px      | 16px        | 500 (Medium) | 캡션 텍스트, 인풋 텍스트         |
| **`small`**      | 10px      | 10px        | 500 (Medium) | 배지, 날짜 보조 정보             |

사용 예: `text-title1`, `text-title2`, `text-title3`, `text-body1`, `text-body2`, `text-body2-bold`, `text-caption`, `text-small`. 개별 컴포넌트에서 동일한 값을 임의의 크기·색상으로 다시 선언하지 않는다.

## 대안과 선택 이유

| 대안                            | 평가                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Tailwind와 직접 작성한 인터랙션 | 스타일 제어는 쉽지만 팝업의 포커스·키보드 처리를 직접 구현해야 한다.            |
| MUI·Ant Design 등 완성형 UI     | 사용 가능하지만 이번 디자인에 맞게 기본 스타일을 수정하는 비용을 고려해야 한다. |
| Tailwind와 Radix 기반 UI (선택) | 디자인 제어와 기본 인터랙션을 함께 확보한다.                                    |
| 중앙 Dialog                     | 모달 흐름에는 적합하지만 버튼 아래 팝업이라는 기획과 다르다.                    |

## 결과와 트레이드오프

프리미티브를 조합하고 스타일을 직접 관리해야 한다. Popover·Select·Collapsible는 공통 UI에 구현되어 있으며 상세검색과 도서 카드에서 조합한다. 포커스·레이어 충돌과 실제 키보드 동작은 별도로 확인한다.

색상·폰트 토큰의 기준은 디자인 스펙이다. 색상은 `tailwind.config.ts`, 타이포그래피는 `src/lib/typography.ts`에서 관리한다. 목록 폭 960px, 작은 표지 48×68px, 펼친 표지 210×280px를 각각 반영한다. 추출된 absolute 좌표는 Grid/Flex 배치로 재구성한다.

## 구현 시 확인

- 색상 9개와 타이포그래피 8개의 이름·값이 위 명세와 Tailwind 설정에서 일치하는지 확인한다.
- 기준 화면의 기본 카드·펼친 카드·팝업·빈 화면을 디자인과 비교한다.
- 제목색·구분선 등 토큰 누락과 줄바꿈을 확인한다.
- 팝업을 열고 취소해도 URL과 확정 검색 조건은 바뀌지 않는다.
- 키보드로 열기·선택·제출·Esc 닫기·포커스 복귀를 확인한다.
