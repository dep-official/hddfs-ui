# HDDFS UI Components

## URL 확인

`https://hddfs.dep.team` (설정중)

## 설치

```bash
npm install
```

## 빌드

```bash
npm run build
```

## 결과물 확인방법

```bash
# Python 3를 사용하는 경우
npm run serve

# 또는 npx serve를 사용하는 경우
npx serve .

# 또는 Node.js의 http-server를 사용하는 경우
npx http-server -p 8000
```

서버 실행 후 브라우저에서 `http://localhost:8000/src/pages/event/event.html`로 접속하세요.

## 파일 구조

```
src/
  ├── shared/          # 공용 컴포넌트
  ├── features/        # 기능별 컴포넌트
  ├── widgets/         # 위젯 컴포넌트
  └── pages/           # 페이지
build/
  └── css/             # 컴파일된 CSS 파일
```

## 주의사항

- HTML 파일을 직접 열면 (`file://` 프로토콜) CORS 에러가 발생합니다.
- 반드시 로컬 서버를 사용하여 파일을 열어야 합니다.
- 또는 hddfs.dep.team 사이트를 접속하여 확인해주세요.

# hddfs-ui
