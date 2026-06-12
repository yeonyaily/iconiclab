# Iconic Lab

매일 쓰고 싶은 앱을 만드는 스튜디오, **아이코닉 랩(Iconic Lab)**의 공식 홈페이지입니다.
정적(static) 사이트로 빌드 과정 없이 그대로 동작하며, GitHub Pages에 바로 올릴 수 있습니다.

## ✨ 특징

- **딥네이비 + 시안/블루** 오로라 배경, 글래스모피즘, 스크롤 애니메이션의 프리미엄 디자인
- **4개 국어 지원** — 한국어 · English · 中文 · 日本語 (우측 상단에서 전환, 선택 기억)
- **앱별 서브페이지** — 각 앱의 대표 도메인으로 연결되는 전용 소개 페이지
- 빌드 도구·프레임워크 없이 순수 HTML/CSS/JS

## 📁 구조

```
.
├── index.html            # 메인 홈페이지
├── 404.html              # 404 페이지
├── favicon.svg           # 브랜드 아이콘
├── apps/
│   ├── pulse/index.html  # 앱 1 — Pulse
│   ├── nimbus/index.html # 앱 2 — Nimbus
│   └── orbit/index.html  # 앱 3 — Orbit
└── assets/
    ├── css/styles.css    # 디자인 시스템
    ├── js/i18n.js        # 4개 국어 번역 사전
    ├── js/main.js        # 언어 전환 + 인터랙션
    └── img/*.svg         # 앱 아이콘
```

## 🛠 내용 바꾸기

- **앱 텍스트(이름·소개·기능)**: [`assets/js/i18n.js`](assets/js/i18n.js) 의 4개 언어 블록에서 같은 키를 함께 수정하세요.
- **앱 대표 도메인**: 각 페이지에서 `iconiclab.app` 으로 된 자리표시자 링크를 찾아 실제 도메인으로 교체하세요. (`<!-- TODO: replace ... -->` 주석 표시)
- **연락처 이메일**: `index.html` 의 `shka5.dev@gmail.com` 을 수정하세요.
- **새 앱 추가**: `apps/<이름>/index.html` 을 기존 앱 페이지 복사해서 만들고, `index.html` 의 앱 그리드에 카드를 추가하세요.

## 🚀 로컬에서 보기

```bash
python3 -m http.server 8080
# http://localhost:8080 접속
```

## 📦 GitHub Pages 배포

저장소 **Settings → Pages → Branch: `main` / root** 선택 후 저장하면
`https://yeonyaily.github.io/iconiclab/` 에서 공개됩니다.
