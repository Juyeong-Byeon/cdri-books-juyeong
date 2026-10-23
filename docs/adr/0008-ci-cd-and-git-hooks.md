# ADR-0008: Git Hooks와 GitHub Actions를 통한 반복 검증

- **상태**: 승인 (Accepted)
- **결정·개정 일자**: 2026-10-23
- **결정자**: 변주영

## 배경

개발 중 빠르게 오류를 확인하고 제출 시 동일한 명령으로 검증할 수 있어야 한다. 로컬 훅만으로 제출 품질을 판단하지 않고 CI에서도 타입·포맷·린트·테스트·빌드를 확인한다.

## 결정

- 기존 Husky, lint-staged, Commitlint, ESLint, Prettier, TypeScript 구성을 유지한다.
- 커밋 메시지는 Conventional Commits를 사용한다. pre-commit에서는 변경 파일의 린트·포맷과 타입 검사를 수행한다.
- GitHub Actions의 main 푸시와 PR 검증은 다음 명령을 사용한다.

```text
npm ci
npm run typecheck
npm run format:check
npm run lint
npm run test:run
npm run build
```

- 테스트 도구와 범위는 [ADR-0012](./0012-testing-and-deployment-validation.md)를 따른다. 테스트가 0개인 실행을 기능 검증 통과로 보지 않는다.
- `build`는 현재 타입 검사도 포함한다. CI 단계는 실패 원인을 분리해서 확인할 수 있게 유지한다.
- `build`에서 앱 빌드 후 문서도 생성한다. [ADR-0013](./0013-documentation-site.md)의 문서 산출물이 앱과 같은 출력 폴더에 포함되므로 기존 Pages 빌드 명령을 유지한다.
- Cloudflare 배포 환경 검증은 별도로 수행한다. GitHub Actions 설정이 있다는 이유만으로 자동 배포까지 구성됐다고 기록하지 않는다.
- 실제 호스팅은 Pages Git 연동으로 구성한다. Pages는 연결된 브랜치의 푸시를 받아 자체 빌드·배포하며, GitHub Actions 검증과 각각 실행된다. 설정 절차는 [README의 배포 안내](../../README.md#45-cloudflare-pages-배포)에서 관리한다.

## 대안과 선택 이유

| 대안                     | 평가                                                        |
| ------------------------ | ----------------------------------------------------------- |
| 로컬 수동 검사만 수행    | 구성이 적지만 검사 누락과 개발 환경 차이를 발견하기 어렵다. |
| 로컬 훅만 필수화         | 빠른 피드백을 주지만 훅 미설치·우회 가능성이 있다.          |
| 기존 훅과 CI 유지 (선택) | 개발 중 피드백과 제출 전 반복 검증을 함께 확보한다.         |

## 결과와 트레이드오프

타입 검사가 커밋·CI·빌드에서 중복될 수 있다. 이 과제에서는 검사 속도와 실패 위치를 확인한 후 필요한 경우 조정한다.

현재 pre-push와 CI는 모두 `npm run test:run`을 실행한다. `--passWithNoTests`를 사용하지 않으므로 테스트 파일이 없으면 실패한다. 현재 자동 테스트가 통과하더라도 [ADR-0012](./0012-testing-and-deployment-validation.md)의 필수 테스트 범위와 실제 배포 검증이 모두 완료됐다는 뜻은 아니다.

## 구현 시 확인

전체 검증 명령이 실제 테스트를 실행하고, 실패 시 0이 아닌 종료 코드를 반환하는지 확인한다. 배포 결과는 CI 성공과 별도로 기록한다.
