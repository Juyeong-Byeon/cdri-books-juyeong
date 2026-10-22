# ADR-0002: 디자인 시스템 스펙 토큰화 및 Tailwind CSS + shadcn/ui 커스텀 선정

- **상태 (Status)**: 승인 (Accepted)
- **일자 (Date)**: 2026-10-22
- **결정자 (Deciders)**: 변주영

---

## 1. 배경 및 맥락 (Context)

피그마(Figma) 디자인 시안에 정의된 정밀한 컬러 팔레트(`Primary #4880EE`, `Red #E84118`, `Gray #DADADA`, `LightGray #F2F4F6`, `Text/Primary #353C49` 등)와 타이포그래피 계층(`Title1~3`, `Body1~2`, `caption`, `small`), 그리고 인터랙티브 컴포넌트(상세검색 모달, 아코디언 도서 카드, 버튼 등)를 1px 및 1hex 오차 없이 구현해야 합니다.

또한, 모달과 아코디언의 접근성(WAI-ARIA, 포커스 트랩, 키보드 인터랙션)을 보장하면서도 기성 UI 라이브러리의 블랙박스 스타일에 종속되지 않아야 합니다.

---

## 2. 고려한 대안 (Alternatives Considered)

### 대안 A: 단순 Pure Tailwind CSS로 모든 UI 직접 처음부터 제작

- **문제점**: 모달(`Dialog`)이나 아코디언(`Collapsible`)의 ESC 닫기, 포커스 트랩, 스크린 리더 ARIA 속성 처리를 처음부터 순수 구현해야 하여 접근성 결함 위험 및 작업 비용 증가.

### 대안 B: MUI / AntD 등 완전 기성 컴포넌트 라이브러리 사용

- **문제점**: 디자인 시안과 괴리가 크고, 과제 평가 기준인 *"재사용 가능한 컴포넌트 직접 설계"*에 위배되며 번들 사이즈가 비대해짐.

### 대안 C: Tailwind CSS + shadcn/ui (Radix UI 프리미티브) 커스텀 수정 (선정)

- **장점**:
  - **접근성 코어 계승**: Radix UI 기반의 완전한 WAI-ARIA, 포커스 관리, 키보드 내비게이션을 기본 탑재.
  - **코드 소유권 및 피그마 100% 일치**: `components/ui/`에 소스코드를 직접 복사한 뒤, CVA(Class Variance Authority)와 Tailwind config를 수정하여 피그마 디자인 토큰을 100% 반영.
  - **무오버헤드 정적 CSS**: 빌드 타임에 사용된 CSS만 정적 생성되어 런타임 성능 최상 유지.

---

## 3. 피그마 디자인 토큰 스펙 (Design Tokens Specification)

### 3.1 컬러 팔레트 (Color Palette)

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

### 3.2 타이포그래피 (Typography)

기본 글꼴: `'Noto Sans KR', sans-serif`

| 토큰명           | Font Size | Line Height | Font Weight  | 설명                             |
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

## 4. 결정의 결과 및 영향 (Consequences)

- 피그마 디자인 토큰을 `tailwind.config.ts`에 정의하여 클래스명(`text-title1`, `text-palette-primary`, `bg-palette-lightGray` 등)으로 일관성 있게 사용.
- shadcn/ui 기반 컴포넌트(`Button`, `Input`, `Dialog`, `Collapsible`)를 피그마 스펙의 치수, 라운드, 패딩에 맞춰 커스텀하여 **"접근성"**과 **"완벽한 피그마 UI 재현"**을 동시에 달성.
