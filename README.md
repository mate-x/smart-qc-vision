# smart-qc-vision

비전 검사 시스템의 React 프론트엔드 대시보드

---

## 개요

| 항목 | 내용 |
|------|------|
| 프론트엔드 | Vite + React + TypeScript (포트 `5173`) |
| 백엔드 | FastAPI — `smart-qc-dashboard` 레포, `feature/api` 브랜치 (포트 `8000`) |
| 상태 관리 | Zustand |
| 차트 | Recharts |
| 라우팅 | react-router-dom v6 |

---

## 화면 구성

| 경로 | 탭 | 기능 |
|------|----|------|
| `/` | 실시간 검사 | 수동/자동 비전 검사, 원본·Anomaly Map·오버레이 이미지 표시 |
| `/history` | 검사 이력 | KPI 카드, 이력 테이블, 통계 차트(히스토그램·산점도), CSV 내보내기 |
| `/models` | 모델 교체 | 학습 완료된 모델 목록 조회 및 적용 |

---

## 시작하기

### 사전 조건

- Node.js 18 이상
- `smart-qc-dashboard` 의 FastAPI 서버가 먼저 실행되어 있어야 함

### 백엔드 서버 실행

```bash
# smart-qc-dashboard 레포 루트에서
uvicorn api.main:app --reload --port 8000
```

### 프론트엔드 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

---

## 주요 기능

### 탭1 — 실시간 검사

- **수동 검사**: 버튼 클릭 시 이미지 1장 검사
- **자동 검사**: WebSocket으로 3초마다 자동 검사 (불량 감지 시 자동 중지 + 팝업)
- **이미지 패널**: 원본 이미지 / Anomaly Map / 이상 영역 오버레이 3종 실시간 표시
- **판정 카드**: 양품/불량 판정 결과 + Anomaly Score

### 탭2 — 검사 이력

- **KPI 카드**: 총 검사 수, 양품 수, 불량 수, 불량률
- **이력 테이블**: 판정 결과별 행 색상 구분 (양품 초록 / 불량 빨강), 필터링
- **통계 차트**: N개 단위(20/40/100) 그룹별 Anomaly Score 히스토그램 + 산점도
- **CSV 내보내기** 및 **이력 초기화**

### 탭3 — 모델 교체

- 학습 완료된 실험 목록 조회 (30초 폴링)
- 현재 적용 모델 배지 표시
- 모델 적용 시 검사 이력 자동 초기화

---

## 프로젝트 구조

```
src/
├── main.tsx                  # ReactDOM.createRoot + BrowserRouter
├── App.tsx                   # TabBar + Route 출력
│
├── pages/
│   ├── Tab1Realtime.tsx      # 실시간 검사 페이지
│   ├── Tab2History.tsx       # 검사 이력 페이지
│   └── Tab3Setting.tsx         # 검사 설정 페이지
│
├── components/
│   ├── layout/               # TabBar, ModelStatusChip, GpuWarningBanner, NoModelGuard
│   ├── tab1/                 # InspectionControls, VerdictCard, ImagePanel 등
│   ├── tab2/                 # KpiCards, RecordsTable, ScoreHistogram, ScoreScatter 등
│   └── tab3/                 # ModelTable, ModelRow, ApplyModelButton
│
├── hooks/
│   ├── useActiveModel.ts     # 현재 적용 모델 조회 (앱 최초 1회)
│   ├── useModels.ts          # 실험 목록 폴링 (30초)
│   ├── useApplyModel.ts      # 모델 적용 POST
│   ├── useManualInspection.ts# 수동 검사 POST
│   ├── useAutoInspection.ts  # WebSocket 자동 검사
│   ├── useInspectionImages.ts# 이미지 URL 관리 (cache-bust)
│   ├── useInspectionRecords.ts# 검사 이력 조회·삭제·CSV
│   └── useStatCharts.ts      # 통계 차트 그룹 계산
│
├── api/
│   ├── client.ts             # axios 인스턴스 (baseURL, timeout)
│   ├── modelsApi.ts          # /api/models, /api/inspection/model
│   ├── inspectionApi.ts      # /api/inspection/run, 이미지 URL
│   └── recordsApi.ts         # /api/inspection/records, CSV
│
├── store/
│   └── inspectionStore.ts    # Zustand 전역 스토어
│
└── types/
    ├── model.ts              # ExperimentRecord, ActiveModel
    ├── inspection.ts         # InspectionResult, InspectionRecord, WsMessage
    └── api.ts                # API 응답 타입
```

---

## API 연동

백엔드 서버 주소: `http://localhost:8000`

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/models` | 실험 목록 조회 |
| GET | `/api/inspection/model` | 현재 적용 모델 조회 |
| POST | `/api/inspection/model` | 모델 적용 |
| POST | `/api/inspection/run` | 수동 검사 1회 실행 |
| GET | `/api/inspection/records` | 검사 이력 조회 |
| DELETE | `/api/inspection/records` | 검사 이력 초기화 |
| GET | `/api/inspection/records/csv` | CSV 다운로드 |
| GET | `/api/inspection/image/last` | 마지막 검사 원본 이미지 |
| GET | `/api/inspection/anomaly-map/last` | Anomaly Map 이미지 |
| GET | `/api/inspection/overlay/last` | 오버레이 이미지 |
| WS | `/ws/inspection/auto` | 자동 검사 WebSocket |

---

## 관련 레포지토리

- **백엔드**: `smart-qc-dashboard` — FastAPI 서버, 모델 학습/추론 로직
