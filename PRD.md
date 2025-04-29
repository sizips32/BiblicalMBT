# Bible-based MBTI 프로젝트 구조 및 설명

```
/brain-mbti/
├── index.html            # 메인 인트로 및 설문 선택 화면
├── style.css             # 메인 및 설문 선택 스타일
├── adult_survey.html     # 성인용 설문(미구현시 추후 추가)
├── student_survey.html   # 학생용 설문(미구현시 추후 추가)
├── result.html           # MBTI 결과 및 SWOT, PDF 저장 화면
├── result_style.css      # 결과 화면 전용 스타일
├── result_script.js       # 결과 화면 로직(차트, SWOT, PDF 저장 등)
├── index.js              # 설문 진행 로직(메인화면에서 참조)
└── assets/               # 이미지 및 기타 리소스
    └── cross_bible_icon.png  # 서비스 로고

## 주요 기능 및 라이브러리
- Chart.js: MBTI 결과를 Radar 차트로 시각화
- jsPDF, html2canvas: 결과 화면을 PDF로 저장
- LocalStorage: 설문 결과 임시 저장 및 결과 페이지 전달

## 화면 흐름
1. index.html: 서비스 소개, 설문 유형(성인/학생) 선택
2. 설문 페이지(adult_survey.html, student_survey.html): 문항 응답
3. result.html: Radar 차트, SWOT 해석, PDF 저장 기능 제공

## 기타
- assets 폴더에 서비스 로고 등 이미지 관리
- (필요시) 설문지 파일 추가 및 기능 확장 가능
