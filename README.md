# 🎬 Netflix Clone Frontend Repository

초급프로젝트 두 번째 과제! 넷플릭스 클론 프로젝트 - TMDB API를 활용한 영화 스트리밍 플랫폼

---

## 🚀 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [진행 현황](#-진행-현황-progress)
- [개발 사이클](#-개발-사이클-development-workflow)
- [Git 커밋 메시지 컨벤션](#-git-커밋-메시지-컨벤션)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)

---

## 📖 프로젝트 소개

Netflix UI/UX를 참고하여 제작한 영화 정보 플랫폼입니다. TMDB(The Movie Database) API를 활용하여 실시간 영화 데이터를 제공하며, 사용자 친화적인 인터페이스와 다양한 기능을 제공합니다.

---

## ✨ 주요 기능

### 🎯 핵심 기능

- **영화 탐색**: 인기 영화, 최신 영화, 장르별 영화 검색
- **위시리스트**: 관심있는 영화를 찜하고 관리
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **무한 스크롤**: 끊김 없는 영화 목록 탐색
- **페이지네이션**: 테이블 뷰에서 체계적인 페이지 이동
- **검색 기능**: 영화 제목으로 빠른 검색

### 🎨 UI/UX 특징

- Netflix 스타일의 다크 테마
- 부드러운 애니메이션 효과
- 호버 시 상세 정보 표시
- 로딩 상태 시각화
- 맨 위로 가기 버튼

---

## 🛠 기술 스택

### Frontend

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **CSS3** - 스타일링

### API

- **TMDB API** - 영화 데이터 제공

### Development Tools

- **Vite** - 빌드 도구
- **ESLint** - 코드 품질
- **Git/GitHub** - 버전 관리

---

## 📆 진행 현황 (Progress)

| 기능             | 상태    | 설명                                |
| ---------------- | ------- | ----------------------------------- |
| 프로젝트 세팅    | ✅ 완료 | React + TypeScript + Vite 환경 구성 |
| 폴더 구조 세팅   | ✅ 완료 | 컴포넌트, 페이지, 유틸리티 구조화   |
| TMDB API 연동    | ✅ 완료 | Axios 기반 API 서비스 구축          |
| 메인 페이지      | ✅ 완료 | 히어로 섹션, 영화 슬라이더 구현     |
| 인기 영화 페이지 | ✅ 완료 | 테이블뷰/무한스크롤 듀얼 모드       |
| 위시리스트 기능  | ✅ 완료 | LocalStorage 기반 찜 관리           |
| 검색 기능        | ✅ 완료 | 실시간 영화 검색                    |
| 반응형 디자인    | ✅ 완료 | 모바일/태블릿/데스크톱 대응         |
| 무한 스크롤 로딩 | ✅ 완료 | 스크롤 끝 도달 시 로딩 효과         |
| 사용자 인증      | ✅ 완료 | 회원가입/로그인 기능                |
| 배포             | ✅ 완료 | Github pages 자동 배포 설정         |

> 🟡 : 개발 중 / ⏳ : 예정 / ✅ : 완료

---

## 🔄 개발 사이클 (Development Workflow)

이 프로젝트는 **GitHub Flow**를 기반으로 하며, 다음과 같은 절차로 개발을 진행합니다.

### 📌 브랜치 전략

| 브랜치명           | 용도                                        |
| ------------------ | ------------------------------------------- |
| `main`             | 운영 배포용 (배포되는 안정 버전)            |
| `develop`          | 개발용 통합 브랜치                          |
| `feature/(기능명)` | 기능 개발 브랜치 (`feature/wishlist` 등)    |
| `fix/(수정명)`     | 버그 수정 브랜치 (`fix/infinite-scroll` 등) |

---

### 👨‍💻 기능 개발 절차

```bash
# 1. dev에서 기능 브랜치 생성
git switch develop
git pull origin develop
git switch -c feature/movie-detail  # 기능명 기준

# 2. 코드 작성 & 커밋
git add .
git commit -m "feat: 영화 상세 페이지 구현"

# 3. 원격 브랜치 푸시
git push origin feat/movie-detail

# 4. GitHub에서 PR 생성 → 대상 브랜치: dev
```

> **PR 제목 예시:**  
> `feat: 영화 상세 페이지 구현`  
> `fix: 무한 스크롤 로딩 표시 버그 수정`  
> `refactor: API 호출 로직 개선`

---

### 🧼 브랜치 정리

- PR 병합 완료 후, `feature/*`, `fix/*` 브랜치는 **삭제**
- `dev` 브랜치에 병합
- `main` 브랜치는 항상 **배포 가능한 상태 유지**

---

## 🔐 Git 커밋 메시지 컨벤션

| 태그       | 설명                          | 예시                                   |
| ---------- | ----------------------------- | -------------------------------------- |
| `add`      | 새로운 파일 추가              | `add: API 유틸리티 파일 추가`          |
| `feat`     | 새로운 기능 추가              | `feat: 위시리스트 기능 구현`           |
| `fix`      | 버그 수정                     | `fix: 무한 스크롤 로딩 표시 오류 수정` |
| `docs`     | 문서 수정                     | `docs: README 설치 가이드 추가`        |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 | `style: 코드 포맷팅 적용`              |
| `refactor` | 코드 리팩토링                 | `refactor: API 호출 로직 개선`         |
| `test`     | 테스트 추가                   | `test: API 서비스 테스트 추가`         |
| `chore`    | 빌드, 설정 관련 작업          | `chore: Vite 설정 업데이트`            |

### 커밋 메시지 작성 규칙

```
<태그>: <제목>

<본문 (선택사항)>

<푸터 (선택사항)>
```

> **예시:**
>
> ```
> feat: 영화 검색 기능 구현
>
> - TMDB API 검색 엔드포인트 연동
> - 실시간 검색 결과 표시
> - 검색 결과 없을 때 안내 메시지 추가
>
> Closes #12
> ```

---

## 💻 설치 및 실행

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- TMDB API Key ([발급 방법](https://www.themoviedb.org/settings/api))

### 설치

```bash
# 1. 레포지토리 클론
git clone https://github.com/oneieo/Demo_Project.git
cd netflix-clone

# 2. 의존성 설치
npm install

```

### 실행

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build


# 빌드 결과물 미리보기
npm run preview

```

---

## 🌐 배포

### Github pages 배포

---

## 📝 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

---

## 👨‍💻 개발자

**ONEIEO**

- GitHub: [@oneieo](https://github.com/oneieo)
- Email: boywonderof@jbnu.ac.kr

---

## 🙏 감사의 말

- [TMDB](https://www.themoviedb.org/) - 영화 데이터 제공
- [Netflix](https://www.netflix.com/) - UI/UX 영감

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
