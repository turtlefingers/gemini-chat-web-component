# Gemini Chat Web Component

Gemini AI와 대화할 수 있는 웹 컴포넌트입니다. 사용자 정의 HTML 요소로 구현되어 있어 간단하게 웹 페이지에 통합할 수 있습니다.

## 기능

- 🤖 다양한 Gemini 모델 지원 (attribute로 모델 선택 가능)
- 💬 대화 기록 유지 (컨텍스트 기반 대화)
- 🔐 API 키 로컬 스토리지 자동 저장
- 🎨 간단하고 깔끔한 UI
- 📱 반응형 디자인
- ⚡ 웹 컴포넌트 기반으로 쉽게 통합 가능

## 설치 및 사용법

### 1. 파일 다운로드

프로젝트의 다음 파일들을 다운로드하세요:
- `gemini-chat-web-component.js`
- `example.html` (사용 예시)

### 2. HTML에 통합

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemini Chat</title>
  <script src="gemini-chat-web-component.js"></script>
</head>
<body>
  <gemini-chat>
    <input type="text" placeholder="메시지를 입력하세요">
    <div></div>
  </gemini-chat>
</body>
</html>
```

### 3. API 키 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 Gemini API 키를 발급받으세요
2. 웹 컴포넌트의 API 키 입력 필드에 키를 입력하세요
3. API 키는 자동으로 로컬 스토리지에 저장됩니다

## 구조

```
gemini-chat-web-component/
├── gemini-chat-web-component.js  # 웹 컴포넌트 구현
├── example.html                  # 사용 예시
└── README.md                     # 이 파일
```

## 웹 컴포넌트 구조

`<gemini-chat>` 요소 내부에는 다음 두 개의 자식 요소가 필요합니다:

- `<input>`: 사용자 메시지 입력 필드
- `<div>`: 대화 내용이 표시되는 컨테이너

### 속성 (Attributes)

- `model`: 사용할 Gemini 모델명을 지정합니다 (기본값: `gemini-2.0-flash`)

```html
<!-- 기본 모델 사용 -->
<gemini-chat>
  <input type="text" placeholder="메시지를 입력하세요">
  <div></div>
</gemini-chat>

<!-- 특정 모델 지정 -->
<gemini-chat model="gemini-1.5-flash">
  <input type="text" placeholder="메시지를 입력하세요">
  <div></div>
</gemini-chat>

<!-- 다른 모델로 동적 변경 -->
<gemini-chat model="gemini-2.0-flash-exp">
  <input type="text" placeholder="메시지를 입력하세요">
  <div></div>
</gemini-chat>
```

## API 사용법

### 메시지 전송
- 입력 필드에 메시지를 입력하고 Enter 키를 누르면 전송됩니다
- 대화 기록이 유지되어 컨텍스트 기반 대화가 가능합니다

### 대화 기록
- 사용자와 AI의 모든 대화가 `conversationHistory` 배열에 저장됩니다
- 각 메시지는 `role`과 `parts` 속성을 가진 객체로 저장됩니다

## 스타일링

웹 컴포넌트는 Shadow DOM을 사용하여 스타일이 캡슐화되어 있습니다. 기본 스타일을 커스터마이징하려면 `gemini-chat-web-component.js` 파일의 `<style>` 섹션을 수정하세요.

## 브라우저 지원

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문제 해결

### API 키 오류
- API 키가 올바르게 입력되었는지 확인하세요
- Google AI Studio에서 API 키가 활성화되어 있는지 확인하세요

### 네트워크 오류
- 인터넷 연결을 확인하세요
- 브라우저의 개발자 도구에서 네트워크 탭을 확인하세요

### CORS 오류 (로컬 테스트 시)
- **중요**: 이 웹 컴포넌트는 Gemini API를 브라우저에서 직접 호출하므로 CORS 정책으로 인해 로컬에서 테스트할 때 API 호출이 차단됩니다
- 이는 보안상의 이유로 브라우저가 다른 도메인(Google API)에 직접 요청하는 것을 차단하기 때문입니다
- **참고**: Live Server나 일반 로컬 서버로도 CORS 문제는 해결되지 않습니다 (여전히 브라우저에서 다른 도메인으로 직접 요청하기 때문)

- 해결 방법:
  1. **프록시 서버 구축**: 백엔드 서버를 통해 API 요청을 우회 (가장 권장)
  2. **브라우저 보안 비활성화**: Chrome에서 `--disable-web-security --user-data-dir=/tmp/chrome_dev` 플래그 사용 (개발용으로만 권장)
  3. **CORS 프록시 서비스**: `cors-anywhere` 등의 프록시 서비스 사용 (임시 테스트용)

## 기여하기

버그 리포트나 기능 제안은 이슈를 통해 제출해 주세요.

---

**참고**: 이 프로젝트는 Google의 Gemini API를 사용합니다. API 사용량에 따른 비용이 발생할 수 있습니다. 