# 헤리스톤 분양금 관리 시스템

TypeScript와 React로 구현된 스마트한 분양금 관리 애플리케이션입니다.

## 🚀 주요 기능

- **중도금 계획 관리**: 각 중도금별 개별 이자율 설정 가능
- **납부 기록**: 언제든 납부 금액을 기록하고 관리
- **자동 계산**: 진행률, 이자, 남은 금액 자동 계산
- **옵션 관리**: 분양 옵션 추가/삭제/수정
- **시각적 대시보드**: 직관적인 UI로 현황 파악
- **실시간 D-Day**: 다음 납부일까지 남은 일수 표시

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Data Storage**: JSON 파일 + localStorage

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트들
│   ├── Dashboard.tsx    # 대시보드 카드들
│   ├── EditableCell.tsx # 편집 가능한 셀 컴포넌트
│   ├── Header.tsx       # 헤더 및 프로젝트 정보
│   ├── PaymentHistory.tsx # 납부 내역 표시
│   ├── PaymentModal.tsx # 납부 추가 모달
│   ├── PaymentTable.tsx # 중도금 계획 테이블
│   └── Sidebar.tsx      # 사이드바 (진행률, 옵션 등)
├── hooks/
│   └── useAppData.ts    # 데이터 관리 커스텀 훅
├── types/
│   └── index.ts         # TypeScript 타입 정의
├── utils/
│   ├── calculations.ts  # 이자, 진행률 등 계산 유틸리티
│   ├── currency.ts      # 통화 포맷팅 유틸리티
│   └── date.ts          # 날짜 포맷팅 유틸리티
├── data/
│   └── initial-data.json # 초기 데이터
├── App.tsx              # 메인 애플리케이션 컴포넌트
└── main.tsx             # 애플리케이션 진입점
```

## 🏗️ 설치 및 실행

### 1. 패키지 설치

```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

### 3. 빌드

```bash
pnpm build
```

### 4. 프리뷰

```bash
pnpm preview
```

## 🎯 단일 책임 원칙 적용

각 컴포넌트와 유틸리티는 명확한 단일 책임을 가집니다:

### 컴포넌트 책임 분리

- **Header**: 프로젝트 기본 정보 표시 및 편집
- **Dashboard**: 요약 통계 표시
- **PaymentTable**: 중도금 계획 및 현황 테이블
- **PaymentHistory**: 납부 내역 상세 표시
- **PaymentModal**: 납부 추가 폼
- **Sidebar**: 진행률, 옵션, 이자 현황
- **EditableCell**: 인라인 편집 기능

### 유틸리티 책임 분리

- **currency.ts**: 통화 포맷팅 및 파싱
- **date.ts**: 날짜 포맷팅 및 D-Day 계산
- **calculations.ts**: 이자, 진행률 등 복잡한 계산

### 훅 책임 분리

- **useAppData**: 데이터 상태 관리 및 localStorage 동기화

## 💾 데이터 관리

- **초기 데이터**: `src/data/initial-data.json`에서 로드
- **상태 관리**: React useState + 커스텀 훅
- **영구 저장**: localStorage 자동 동기화
- **타입 안전성**: TypeScript 인터페이스로 타입 보장

## 🔧 주요 기능 설명

### 1. 편집 가능한 UI
모든 텍스트와 숫자를 클릭하면 바로 편집할 수 있습니다.

### 2. 스마트한 계산
납부를 기록하면 이자, 진행률, 남은 금액이 자동으로 계산됩니다.

### 3. 유연한 이자율
각 중도금별로 개별 이자율을 설정할 수 있습니다.

### 4. 옵션 관리
분양 옵션을 동적으로 추가/수정/삭제할 수 있습니다.

### 5. 시각적 피드백
진행률 바, D-Day 표시, 색상 코딩으로 직관적인 정보 제공

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- **직관적 색상**: 완료(녹색), 경고(주황), 위험(빨강)
- **부드러운 애니메이션**: Tailwind CSS 트랜지션
- **접근성**: 명확한 라벨과 적절한 대비

## 📝 개발 가이드

### 새로운 컴포넌트 추가

1. `src/components/` 폴더에 `.tsx` 파일 생성
2. 필요한 타입을 `src/types/index.ts`에 추가
3. 컴포넌트는 props 인터페이스와 함께 정의
4. 단일 책임 원칙에 따라 명확한 목적 부여

### 새로운 계산 로직 추가

1. `src/utils/calculations.ts`에 순수 함수로 추가
2. 필요한 타입 매개변수 정의
3. 단위 테스트 고려

### 데이터 구조 수정

1. `src/types/index.ts`에서 인터페이스 수정
2. `src/data/initial-data.json`에서 초기 데이터 업데이트
3. 관련 컴포넌트 및 유틸리티 함수 업데이트

이 구조는 확장성과 유지보수성을 고려하여 설계되었습니다. 각 부분이 명확한 책임을 가지므로 새로운 기능 추가나 버그 수정이 용이합니다.