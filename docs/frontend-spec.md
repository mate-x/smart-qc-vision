# smart-qc-vision — 프론트엔드 설계 명세서

> **대상 레포**: `smart-qc-vision` (Vite + React + TypeScript)  
> **작성일**: 2026-06-05  
> **의존 서버**: `smart-qc-dashboard/api/` (FastAPI, port 8000)  
> **개발 포트**: 5173

---

## 목차

1. [디렉토리 구조](#1-디렉토리-구조)
2. [라우팅 구조](#2-라우팅-구조)
3. [전역 상태 관리](#3-전역-상태-관리)
4. [API 레이어](#4-api-레이어)
5. [Hooks 레이어](#5-hooks-레이어)
6. [탭별 컴포넌트 트리](#6-탭별-컴포넌트-트리)
7. [WebSocket 생명주기](#7-websocket-생명주기)
8. [이미지 서빙 전략](#8-이미지-서빙-전략)
9. [탭간 공통 동작 규칙](#9-탭간-공통-동작-규칙)
10. [UI 시각 명세](#10-ui-시각-명세)

---

## 1. 디렉토리 구조

```
smart-qc-vision/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx                    ← ReactDOM.createRoot + Router
    ├── App.tsx                     ← 레이아웃 루트: TabBar + Route 출력
    │
    ├── pages/                      ← 라우트와 1:1 대응하는 최상위 페이지
    │   ├── Tab1Realtime.tsx        ← 실시간 검사
    │   ├── Tab2History.tsx         ← 검사 이력
    │   └── Tab3Model.tsx           ← 모델 교체
    │
    ├── components/
    │   ├── layout/
    │   │   ├── TabBar.tsx          ← 탭 네비게이션 바
    │   │   ├── ModelStatusChip.tsx ← TabBar 우측: 현재 모델명 표시
    │   │   └── GpuWarningBanner.tsx← gpu_warning 배너 (전역)
    │   │
    │   ├── tab1/
    │   │   ├── InspectionControls.tsx  ← 버튼 3개: 수동/자동시작/자동중지
    │   │   ├── AutoRunningBanner.tsx   ← 자동 검사 중 안내 배너
    │   │   ├── VerdictCard.tsx         ← 판정카드: ✅양품/❌불량 + 점수
    │   │   ├── ImagePanel.tsx          ← 원본 이미지 패널
    │   │   ├── AnomalyMapPanel.tsx     ← Anomaly Map 히트맵 패널
    │   │   ├── OverlayPanel.tsx        ← 이상 영역 오버레이 패널
    │   │   ├── ImagePanelPlaceholder.tsx ← 검사 전 placeholder
    │   │   └── DefectPopup.tsx         ← 불량 감지 모달
    │   │
    │   ├── tab2/
    │   │   ├── KpiCards.tsx            ← 총검사/양품/불량/불량률 카드 4개
    │   │   ├── VerdictFilter.tsx       ← 라디오: 전체/양품/불량
    │   │   ├── RecordsTable.tsx        ← 이력 테이블
    │   │   ├── RecordRow.tsx           ← 행 1개 (행 색상 포함)
    │   │   ├── ClearHistoryDialog.tsx  ← 초기화 확인 다이얼로그
    │   │   ├── StatCharts.tsx          ← 3분할 통계 차트 영역 (E.5)
    │   │   ├── TimeRangeTable.tsx      ← 좌측: 시간 범위 그룹 테이블
    │   │   ├── ScoreHistogram.tsx      ← 중앙: Anomaly Score 히스토그램
    │   │   └── ScoreScatter.tsx        ← 우측: Anomaly Score 산점도
    │   │
    │   └── tab3/
    │       ├── ModelTable.tsx          ← 실험 목록 테이블
    │       ├── ModelRow.tsx            ← 행 1개 (현재 모델 표시 포함)
    │       └── ApplyModelButton.tsx    ← "이 모델로 검사 시작" 버튼
    │
    ├── hooks/
    │   ├── useModels.ts            ← GET /api/models 폴링
    │   ├── useActiveModel.ts       ← GET /api/inspection/model + 상태 동기화
    │   ├── useApplyModel.ts        ← POST /api/inspection/model
    │   ├── useManualInspection.ts  ← POST /api/inspection/run
    │   ├── useAutoInspection.ts    ← WS /ws/inspection/auto 생명주기 관리
    │   ├── useInspectionImages.ts  ← 이미지 3종 URL 관리 (cache-bust)
    │   ├── useInspectionRecords.ts ← GET /api/inspection/records + CSV + 삭제
    │   └── useStatCharts.ts        ← 통계 차트 그룹 계산 (단위·선택 그룹 관리)
    │
    ├── api/
    │   ├── client.ts               ← axios 인스턴스 (baseURL, timeout)
    │   ├── modelsApi.ts            ← /api/models, /api/inspection/model
    │   ├── inspectionApi.ts        ← /api/inspection/run, /image/last, etc.
    │   └── recordsApi.ts           ← /api/inspection/records, /csv
    │
    ├── store/
    │   └── inspectionStore.ts      ← Zustand 전역 스토어
    │
    └── types/
        ├── model.ts                ← ExperimentRecord, ActiveModel
        ├── inspection.ts           ← InspectionResult, InspectionRecord, WsMessage
        └── api.ts                  ← API 응답 타입
```

### 의도적 결정사항

| 결정 | 이유 |
|------|------|
| `pages/` vs `components/` 분리 | 라우트 진입점과 재사용 가능 컴포넌트를 명확히 구분 |
| `api/` 레이어 별도 분리 | fetch 로직이 hook에 묻히면 테스트·교체 어려움 |
| `hooks/` 레이어 분리 | 서버 상태 동기화 로직과 렌더 로직을 분리 |
| Zustand 단일 스토어 | 3탭이 공유하는 전역 상태(모델·검사 결과)를 Context boilerplate 없이 관리 |

---

## 2. 라우팅 구조

### 사용 라이브러리

`react-router-dom` v6 (hash 방식 아닌 history 방식)

### 라우트 정의

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | `Tab1Realtime` | 실시간 검사 (기본 화면) |
| `/history` | `Tab2History` | 검사 이력 |
| `/models` | `Tab3Model` | 모델 교체 |

```tsx
// src/main.tsx
<BrowserRouter>
  <App />
</BrowserRouter>

// src/App.tsx
<>
  <TabBar />
  <GpuWarningBanner />
  <main>
    <Routes>
      <Route path="/"        element={<Tab1Realtime />} />
      <Route path="/history" element={<Tab2History />} />
      <Route path="/models"  element={<Tab3Model />} />
      <Route path="*"        element={<Navigate to="/" replace />} />
    </Routes>
  </main>
</>
```

### TabBar 동작

- `useLocation()`으로 현재 경로 감지 → 해당 탭 활성 스타일 적용
- `<Link>` 사용 (전체 리마운트 없이 라우트 전환)
- 우측에 `<ModelStatusChip>` 배치 (현재 적용 모델명 표시)

### Vite SPA 히스토리 라우팅 설정

```ts
// vite.config.ts
export default defineConfig({
  server: {
    historyApiFallback: true,   // dev server에서 새로고침 지원
  },
})
```

---

## 3. 전역 상태 관리

### 상태 분류 원칙

| 종류 | 저장 위치 | 이유 |
|------|-----------|------|
| 현재 적용 모델 (`activeModel`) | Zustand | 3탭 모두 참조 |
| GPU 경고 문자열 (`gpuWarning`) | Zustand | 전역 배너에서 표시 |
| 마지막 검사 결과 (`lastResult`) | Zustand | 탭1 렌더 + 탭 전환 후 유지 |
| 자동 검사 실행 여부 (`isAutoRunning`) | Zustand | 탭 이동 중에도 루프 유지 |
| 불량 팝업 표시 여부 (`defectStopped`) | Zustand | WebSocket 이벤트 → UI 트리거 |
| 이미지 URL timestamp (`imageStamp`) | Zustand | 검사 완료 후 강제 재요청 |
| 실험 목록 (`models`) | hook 로컬 + 반환 | Tab3에서만 사용 |
| 검사 이력 목록 (`records`) | hook 로컬 + 반환 | Tab2에서만 사용 |
| verdict 필터 (`filter`) | Tab2 로컬 state | Tab2 내부만 사용 |
| 선택된 실험 ID (`selectedId`) | Tab3 로컬 state | Tab3 내부만 사용 |

### Zustand 스토어 정의

```ts
// src/store/inspectionStore.ts

interface InspectionState {
  // 현재 적용 모델
  activeModel: ActiveModel | null;
  gpuWarning: string | null;

  // 검사 결과
  lastResult: InspectionResult | null;
  imageStamp: number;               // Date.now() 값으로 이미지 URL cache-bust

  // 자동 검사
  isAutoRunning: boolean;
  defectStopped: boolean;           // true → DefectPopup 표시

  // reshuffled 토스트
  reshuffledToast: boolean;

  // 액션
  setActiveModel: (model: ActiveModel | null, gpuWarning?: string | null) => void;
  setLastResult: (result: InspectionResult) => void;
  setAutoRunning: (v: boolean) => void;
  setDefectStopped: (v: boolean) => void;
  clearHistory: () => void;         // 이력 초기화 시 lastResult·imageStamp 리셋
  showReshuffledToast: () => void;
  dismissReshuffledToast: () => void;
}
```

### 주요 상태 전이 시나리오

```
[탭3 모델 적용]
  POST /api/inspection/model 성공
  → setActiveModel(response.active_model, response.gpu_warning)
  → lastResult = null, imageStamp = 0  (clearHistory)

[탭1 수동 검사]
  POST /api/inspection/run 성공
  → setLastResult(result)
  → imageStamp = Date.now()  (이미지 재요청 트리거)

[탭1 자동 검사 — WS type:"result"]
  → setLastResult(result)
  → imageStamp = Date.now()
  → was_reshuffled == true → showReshuffledToast()

[탭1 자동 검사 — WS type:"defect_stopped"]
  → setAutoRunning(false)
  → setDefectStopped(true)  → DefectPopup 표시

[DefectPopup "확인 및 재개"]
  → setDefectStopped(false)

[DefectPopup "검사 종료"]
  → setDefectStopped(false)  (팝업만 닫음, 루프는 이미 중지)

[탭2 이력 초기화 확인]
  → DELETE /api/inspection/records
  → clearHistory()  (lastResult, imageStamp 리셋)
```

---

## 4. API 레이어

### 기본 설정

```ts
// src/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30_000,     // 모델 적용(POST /api/inspection/model)은 로드 포함 → 넉넉히
});
```

### modelsApi.ts

```ts
// 실험 목록 조회
getModels(): Promise<ExperimentRecord[]>
  GET /api/models

// 모델 적용
applyModel(experimentId: string): Promise<ApplyModelResponse>
  POST /api/inspection/model
  body: { experiment_id: string }

// 현재 모델 조회
getActiveModel(): Promise<{ active_model: ActiveModel | null }>
  GET /api/inspection/model
```

### inspectionApi.ts

```ts
// 수동 검사 1회
runInspection(): Promise<InspectionResult>
  POST /api/inspection/run

// 이미지 URL 생성 (실제 fetch 아님 — src 속성에 직접 사용)
getImageUrl(stamp: number): string
  → `http://localhost:8000/api/inspection/image/last?t=${stamp}`

getAnomalyMapUrl(stamp: number): string
  → `http://localhost:8000/api/inspection/anomaly-map/last?t=${stamp}`

getOverlayUrl(stamp: number): string
  → `http://localhost:8000/api/inspection/overlay/last?t=${stamp}`
```

### recordsApi.ts

```ts
// 이력 조회
getRecords(verdict: '전체' | '양품' | '불량'): Promise<InspectionRecord[]>
  GET /api/inspection/records?verdict={verdict}

// CSV 다운로드 (브라우저 다운로드 트리거)
downloadCsv(): void
  → window.open('http://localhost:8000/api/inspection/records/csv')

// 이력 초기화
deleteRecords(): Promise<void>
  DELETE /api/inspection/records
```

### WebSocket 엔드포인트

```
ws://localhost:8000/ws/inspection/auto

Client → Server:
  "start"   자동 검사 시작
  "stop"    자동 검사 중지

Server → Client (JSON):
  { type: "result",         seq, inspected_at, image_name, verdict, anomaly_score, was_reshuffled }
  { type: "defect_stopped" }     불량 감지 → 서버가 루프 중지
  { type: "stopped" }            "stop" 수신 확인
  { type: "error", message }
```

### 에러 처리 규칙

| HTTP 상태 | 의미 | UI 처리 |
|-----------|------|---------|
| 400 | 모델 미선택 · 풀 없음 | 에러 토스트 표시 |
| 404 | 실험 없음 | 에러 토스트 표시 |
| 500 | 모델 로드 실패 | 에러 토스트 + 모델 상태 초기화 |
| network error | 서버 미실행 | 에러 토스트 "서버에 연결할 수 없습니다" |

---

## 5. Hooks 레이어

### `useModels()`

```ts
// src/hooks/useModels.ts
반환: {
  models: ExperimentRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

동작:
  - 마운트 시 즉시 GET /api/models
  - 30초 주기 폴링 (setInterval)
  - Tab3 마운트 시에만 폴링 활성 (unmount 시 interval 정리)
  - 탭3 벗어나면 폴링 중지 (useEffect cleanup)

폴링 주기 근거:
  Streamlit 학습 완료 → history.json 업데이트 → 다음 폴링에 반영
  30초는 학습 완료 감지 지연으로 허용 가능한 범위
```

### `useActiveModel()`

```ts
// src/hooks/useActiveModel.ts
반환: { activeModel: ActiveModel | null }

동작:
  - 앱 최초 마운트 시 GET /api/inspection/model 1회 호출
  - 응답으로 Zustand activeModel 동기화
  - 모델 적용 후에는 useApplyModel()이 스토어를 직접 갱신하므로
    추가 폴링 불필요
  - useActiveModel은 App.tsx 레벨에서 1회 호출 (새로고침 복원용)
```

### `useApplyModel()`

```ts
// src/hooks/useApplyModel.ts
반환: {
  apply: (experimentId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

동작:
  - POST /api/inspection/model 호출
  - 성공: setActiveModel(response.active_model, response.gpu_warning)
  - 실패: error 상태 설정 → Tab3에서 에러 메시지 표시
  - isLoading 중 버튼 비활성 (중복 클릭 방지)
```

### `useManualInspection()`

```ts
// src/hooks/useManualInspection.ts
반환: {
  run: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

동작:
  - POST /api/inspection/run 호출
  - 성공: setLastResult(result) + imageStamp = Date.now()
  - isLoading 중 수동/자동 버튼 비활성
```

### `useAutoInspection()`

```ts
// src/hooks/useAutoInspection.ts
반환: {
  start: () => void;
  stop: () => void;
}

내부 상태: ws ref (WebSocket | null)

동작:
  - start():
      1. ws = new WebSocket('ws://localhost:8000/ws/inspection/auto')
      2. ws.onopen → ws.send("start") + setAutoRunning(true)
      3. ws.onmessage → dispatch 처리 (아래 참조)
      4. ws.onerror → setAutoRunning(false) + 에러 토스트
      5. ws.onclose → setAutoRunning(false)

  - stop():
      ws?.send("stop")
      setAutoRunning(false)

  - onmessage dispatch:
      type "result"        → setLastResult + imageStamp 갱신
                             was_reshuffled → showReshuffledToast
      type "defect_stopped"→ setDefectStopped(true) (루프는 서버가 이미 중지)
      type "stopped"       → (무시, setAutoRunning은 stop()에서 이미 처리)
      type "error"         → 에러 토스트

  - 컴포넌트 언마운트 시:
      isAutoRunning이 true이면 ws.send("stop") 후 ws.close()
      → Tab1 밖으로 이동해도 서버 루프 정리

  - 소켓 재연결 정책:
      onerror/onclose 후 재연결 없음 (사용자가 직접 다시 시작)
      → 단순성 우선 (단일 사용자 로컬 대시보드)
```

### `useInspectionImages()`

```ts
// src/hooks/useInspectionImages.ts
반환: {
  imageUrl: string | null;
  anomalyMapUrl: string | null;
  overlayUrl: string | null;
}

동작:
  - Zustand imageStamp 구독
  - imageStamp > 0 이면 URL 생성 (getImageUrl(stamp) 등)
  - imageStamp === 0 이면 null 반환 → placeholder 표시
  - stamp를 쿼리 파라미터로 포함하므로 브라우저 캐시 무효화됨
```

### `useInspectionRecords()`

```ts
// src/hooks/useInspectionRecords.ts
반환: {
  allRecords: InspectionRecord[];    // 전체 기준 (KPI·통계 차트용)
  filteredRecords: InspectionRecord[]; // verdictFilter 적용 (테이블용)
  isLoading: boolean;
  verdictFilter: VerdictFilter;
  setVerdictFilter: (v: VerdictFilter) => void;
  refetch: () => Promise<void>;
  clearRecords: () => Promise<void>;
  downloadCsv: () => void;
}

동작:
  - Tab2 마운트 시 GET /api/inspection/records?verdict=전체 1회 호출 → allRecords 저장
  - filteredRecords = verdictFilter에 따라 allRecords를 클라이언트 필터링
      '전체'  → allRecords 그대로
      '양품'  → allRecords.filter(r => r.verdict === '양품')
      '불량'  → allRecords.filter(r => r.verdict === '불량')
  - setVerdictFilter: 서버 재요청 없이 클라이언트 필터만 변경
  - clearRecords(): DELETE /api/inspection/records → Zustand clearHistory()
                    → allRecords = [], filteredRecords = []
  - 폴링 없음; Tab2 마운트 시 자동 갱신됨
```

### `useStatCharts()`

```ts
// src/hooks/useStatCharts.ts
입력: { allRecords: InspectionRecord[]; threshold: number }

반환: {
  selectedUnit: 20 | 40 | 100;
  setUnit: (unit: 20 | 40 | 100) => void;
  groups: TimeGroup[];
  selectedGroupIndex: number;
  setSelectedGroupIndex: (i: number) => void;
  selectedGroupRecords: InspectionRecord[];
}

interface TimeGroup {
  index: number;
  label: string;       // "YYYY-MM-DD HH:MM~HH:MM"
  records: InspectionRecord[];
  isPartial: boolean;  // 마지막 그룹이 selectedUnit 미만인 경우
}

동작:
  - groups = useMemo(() => chunkByN(allRecords, selectedUnit), [allRecords, selectedUnit])
      allRecords를 seq 오름차순으로 N개씩 분할
      각 그룹의 label = 첫 번째 inspected_at ~ 마지막 inspected_at 시간 범위
      마지막 그룹 records.length < selectedUnit → isPartial = true
  - selectedUnit 변경 시 groups 재계산 + selectedGroupIndex = groups.length - 1 리셋
  - allRecords 변경 시 groups 재계산 (마지막 그룹에 새 레코드 반영), selectedGroupIndex 유지
  - selectedGroupRecords = groups[selectedGroupIndex]?.records ?? []
```

---

## 6. 탭별 컴포넌트 트리

### 탭1 — 실시간 검사 (`Tab1Realtime.tsx`)

```
Tab1Realtime
│
├── [모델 미선택 guard]
│   └── <NoModelGuard>
│       "모델을 먼저 선택해주세요 → 모델 교체 탭으로"
│       (activeModel === null 일 때만 렌더, 이하 컴포넌트 미렌더)
│
├── <AutoRunningBanner>             isAutoRunning === true 일 때만 표시
│   "자동 검사 진행 중..."
│
├── <InspectionControls>
│   ├── 수동 검사(1개) 버튼         onClick → run()
│   ├── 자동 검사(3초) 버튼         onClick → start()  / isAutoRunning 시 disabled
│   └── 자동 검사 중지 버튼         onClick → stop()   / !isAutoRunning 시 disabled
│   (isLoading 중 전체 버튼 비활성)
│
└── 4열 그리드 [비율: 1 : 2 : 2 : 2]
    ├── col1: <VerdictCard>
    │     lastResult === null → placeholder "검사 전"
    │     verdict === "양품"  → ✅ 양품 (초록)
    │     verdict === "불량"  → ❌ 불량 (빨강)
    │     anomaly_score 수치 표시
    │
    ├── col2: <ImagePanel>
    │     imageUrl === null → <ImagePanelPlaceholder label="원본 이미지" />
    │     imageUrl !== null → <img src={imageUrl} />
    │
    ├── col3: <AnomalyMapPanel>
    │     anomalyMapUrl === null → <ImagePanelPlaceholder label="Anomaly Map" />
    │     anomalyMapUrl !== null → <img src={anomalyMapUrl} />
    │
    └── col4: <OverlayPanel>
          overlayUrl === null → <ImagePanelPlaceholder label="이상 영역" />
          overlayUrl !== null → <img src={overlayUrl} />

모달 (defectStopped === true):
└── <DefectPopup>
    "불량 감지. 자동 검사가 중지되었습니다."
    ├── "확인 및 재개" → setDefectStopped(false) + start()
    └── "검사 종료"    → setDefectStopped(false)

토스트 (reshuffledToast === true):
└── 자동 3초 후 dismissReshuffledToast()
    "이미지 풀이 소진되어 재셔플되었습니다."
```

### 탭2 — 검사 이력 (`Tab2History.tsx`)

```
Tab2History
│
├── [모델 미선택 guard]
│   └── <NoModelGuard>  (activeModel === null 시)
│
├── 헤더 행 (flex, space-between)
│   ├── "검사 이력" 제목
│   └── "CSV 내보내기" 버튼
│         records.length === 0 → disabled
│         onClick → downloadCsv()
│
├── <VerdictFilter>
│   라디오 3개: "전체" / "양품만" / "불량만"
│   onChange → verdictFilter 로컬 state 갱신 (클라이언트 필터링)
│
├── <RecordsTable>
│   헤더: 번호 | 시각 | 이미지명 | 판정결과 | Anomaly Score
│   isLoading → 로딩 스피너
│   filteredRecords.length === 0 → "아직 검사 기록이 없습니다." 빈 상태 메시지
│   → filteredRecords.map(r => <RecordRow key={r.seq} record={r} />)
│       verdict === '불량' → 행 배경 #FFDDD6
│       verdict === '양품' → 행 배경 #D6F5DD
│
├── <KpiCards>           ← 테이블 하단, 항상 allRecords(전체) 기준
│   ├── 총 검사: allRecords.length
│   ├── 양품:   allRecords.filter(r => r.verdict === '양품').length
│   ├── 불량:   allRecords.filter(r => r.verdict === '불량').length
│   └── 불량률: (불량 / 총검사 * 100).toFixed(1) + '%'
│   (verdictFilter 무관, 기록 없어도 0 표시)
│
├── <StatCharts>         ← KPI 하단 (E.5), allRecords 기준
│   ├── 단위 선택: [20개 단위] [40개 단위] [100개 단위]  (기본: 20)
│   │
│   └── 3분할 레이아웃  [1 : 2 : 2]
│       ├── <TimeRangeTable>             ← 좌측
│       │   allRecords를 seq 오름차순으로 N개씩 그룹핑
│       │   각 행: 날짜 + "HH:MM~HH:MM" 시간범위
│       │   마지막 그룹이 N 미만 → "(진행)" 표시
│       │   행 클릭 → selectedGroupIndex 갱신
│       │   기본 선택: 마지막 그룹 (가장 최근)
│       │
│       ├── <ScoreHistogram>             ← 중앙
│       │   selectedGroup 레코드 기준
│       │   x축: 0~1 고정 (Score), y축: 동적
│       │   파란 bar: 양품, 빨간 bar: 불량
│       │   수직 점선: activeModel.threshold
│       │   제목: "Anomaly Score 분포 — {시간범위}"
│       │
│       └── <ScoreScatter>               ← 우측
│           selectedGroup 레코드 기준
│           x축: 1~N 고정 (그룹 내 인덱스), y축: 0~1 고정
│           파란 원: 양품, 빨간 원: 불량, 앞뒤 점 연결선
│           수평 빨간 점선: activeModel.threshold
│           제목: "Anomaly Score 추이 — {시간범위}"
│
└── "🗑 이력 초기화" 버튼
      onClick → <ClearHistoryDialog> 열기

<ClearHistoryDialog>
  "이력을 초기화하면 모든 검사 기록이 삭제됩니다."
  ├── "취소"    → 다이얼로그 닫기
  └── "초기화"  → clearRecords() → 다이얼로그 닫기
```

### 탭3 — 모델 교체 (`Tab3Model.tsx`)

```
Tab3Model
│
├── <GpuWarningBanner>      gpuWarning !== null 시 표시 (탭 진입 시)
│
├── <ModelTable>
│   헤더: 실험명 | 모델타입 | F1 | AUC | 실행시각
│   isLoading → 로딩 스피너
│   models.length === 0 → "완료된 학습 결과가 없습니다." 빈 상태 메시지
│   → models.map(m => <ModelRow key={m.experiment_id} model={m} ... />)
│
│   <ModelRow>
│     m.experiment_id === activeModel?.experiment_id
│       → 행 우측에 "✅ 현재" 배지 표시
│     onClick → selectedId = m.experiment_id (로컬 state)
│     선택 시 → 행 강조 (배경 or 테두리)
│
└── <ApplyModelButton>
    selectedId === null → disabled
    selectedId === activeModel?.experiment_id → disabled
    ("이 모델로 검사 시작" 버튼)
    isLoading → "적용 중..." + disabled
    onClick → apply(selectedId)
              성공: selectedId = null (선택 해제)
              실패: error 메시지 표시

적용 경고 (선택된 실험이 현재와 다를 때):
└── "모델 교체 시 검사 이력이 초기화됩니다." 안내 텍스트 (버튼 위)
```

---

## 7. WebSocket 생명주기

```
컴포넌트 마운트
     │
     ▼
[start() 클릭]
     │
     ├─ new WebSocket('ws://localhost:8000/ws/inspection/auto')
     │
     ├─ onopen → ws.send("start")
     │            setAutoRunning(true)
     │
     ├─ onmessage → type 분기 (§5 useAutoInspection 참조)
     │
     └─ onerror / onclose
           → setAutoRunning(false)
              에러 토스트

[stop() 클릭]
     │
     ├─ ws.send("stop")
     └─ setAutoRunning(false)
        (서버 "stopped" 메시지 수신 후 ws.close() 가능하나 무시해도 무방)

컴포넌트 언마운트 (useEffect cleanup)
     │
     └─ isAutoRunning === true
           → ws.send("stop"), ws.close()
        isAutoRunning === false
           → ws.close() only
```

### 주의사항

- **Tab1 이탈 시 자동 검사 중지**: 사용자가 자동 검사 중 다른 탭으로 이동하면
  `useAutoInspection`의 useEffect cleanup이 "stop"을 서버에 전송함.
  → 서버 루프가 Tab1 없이 계속 돌지 않음.

- **재연결 없음**: onerror/onclose 후 자동 재연결하지 않음.
  서버가 재시작된 경우 사용자가 다시 "자동 검사" 버튼을 누르도록 유도.

- **단일 소켓 보장**: `start()`를 호출할 때 기존 ws ref가 null이 아니면
  `.close()` 후 새 연결 생성 (중복 연결 방지).

---

## 8. 이미지 서빙 전략

### 문제

`/api/inspection/image/last`는 항상 "가장 최근 1개"를 반환한다.
URL이 동일하면 브라우저가 이전 이미지를 캐시에서 반환한다.

### 해결

`imageStamp` (Zustand)를 쿼리 파라미터로 URL에 포함.

```ts
// src/api/inspectionApi.ts
export const getImageUrl = (stamp: number) =>
  `http://localhost:8000/api/inspection/image/last?t=${stamp}`;
```

검사 완료 → `imageStamp = Date.now()` 갱신 → `<img src>` URL 변경 → 강제 재요청.

### imageStamp 초기값

- `0` (앱 초기 / 이력 초기화 후)
- `useInspectionImages`에서 `stamp === 0`이면 URL을 `null`로 반환 → placeholder 표시

### 이미지 로딩 실패 처리

```tsx
<img
  src={imageUrl}
  onError={() => setImageError(true)}
  alt="원본 이미지"
/>
```

`imageError === true` → placeholder로 대체 표시 (네트워크 오류 등 방어).

---

## 9. 탭간 공통 동작 규칙

### 9-1. 모델 미선택 Guard

탭1, 탭2는 `activeModel === null`이면 주요 기능을 차단한다.

```tsx
// src/components/layout/NoModelGuard.tsx
function NoModelGuard({ children }: { children: ReactNode }) {
  const activeModel = useInspectionStore(s => s.activeModel);
  if (activeModel !== null) return <>{children}</>;
  return (
    <div>
      <p>검사할 모델이 선택되지 않았습니다.</p>
      <Link to="/models">모델 교체 탭에서 모델을 선택하세요 →</Link>
    </div>
  );
}
```

적용 위치:
- `Tab1Realtime` 전체를 `<NoModelGuard>`로 감쌈
- `Tab2History` 전체를 `<NoModelGuard>`로 감쌈
- `Tab3Model`은 guard 불필요 (모델 선택하는 탭이므로)

### 9-2. GPU 경고 배너

`gpuWarning !== null`이면 `<GpuWarningBanner>` 표시.

- 탭3에서 모델 적용 후 response.gpu_warning이 문자열이면 스토어에 저장.
- `<GpuWarningBanner>`는 `App.tsx`에서 TabBar 바로 아래 렌더 (모든 탭에서 보임).
- 사용자가 직접 닫기(X) 버튼으로 `gpuWarning = null` 처리.

### 9-3. 현재 모델 표시 (`ModelStatusChip`)

TabBar 우측에 항상 표시:

```
activeModel !== null  → "모델: {model_type} / {experiment_id 앞 8자}"
activeModel === null  → "모델 미선택" (회색)
```

### 9-4. 자동 검사 중 탭 이동

- 탭1에서 자동 검사 중 다른 탭으로 이동: `useEffect cleanup`이 서버에 "stop" 전송.
- `isAutoRunning`은 스토어에서 `false`로 변경.
- 사용자가 탭1로 돌아오면 자동 검사가 중지된 상태로 진입 (재시작 필요).

### 9-5. 이력 초기화 시 상태 동기화

탭2에서 이력 초기화:
1. `DELETE /api/inspection/records` 호출
2. Zustand `clearHistory()` → `lastResult = null`, `imageStamp = 0`
3. 탭1의 4열 패널이 자동으로 placeholder로 돌아감

### 9-6. 모델 교체 시 상태 동기화

탭3에서 모델 교체 완료:
1. Zustand `setActiveModel(newModel, gpuWarning)` 내부에서:
   - `activeModel` 갱신
   - `gpuWarning` 갱신
   - `lastResult = null`
   - `imageStamp = 0`
   - `isAutoRunning = false` (모델 교체 전 자동 검사는 서버에서 리셋됨)
   - `defectStopped = false`
2. 탭1은 자동으로 빈 패널(placeholder) 상태로 돌아감
3. 탭2는 다음 마운트 시 빈 이력 테이블을 반환받음 (서버가 records 초기화)

### 9-7. 폴링 요약

| 엔드포인트 | 폴링 여부 | 주기 / 트리거 |
|------------|-----------|---------------|
| `GET /api/models` | O | Tab3 마운트 후 30초 주기 |
| `GET /api/inspection/model` | X | 앱 최초 마운트 1회 |
| `GET /api/inspection/records` | X | Tab2 마운트 시 1회 (filter는 클라이언트 처리) |
| 이미지 3종 | X | imageStamp 변경 시 (URL 변경으로 재요청) |

---

## 부록 — 주요 타입 정의

```ts
// src/types/model.ts

interface ExperimentRecord {
  experiment_id: string;
  name: string;
  model_type: string;
  model_path: string;
  dataset_path: string;
  created_at: string;         // "YYYY-MM-DD HH:MM:SS"
  threshold_method: string;
  threshold_value: number;
  metrics: {
    f1_score: number;
    auc: number;
    anomaly_scores: number[];
    image_labels: number[];
  };
  preprocessing_method: string;
  preprocessing_params: Record<string, unknown>;
  image_size: number;
  status: string;
}

interface ActiveModel {
  experiment_id: string;
  model_path: string;
  model_type: string;
  threshold: number;           // [0, 1] 정규화
  dataset_path: string;
  preprocessing_config: {
    method: string;
    params: Record<string, unknown>;
    image_size: number;
  };
  score_min: number;
  score_max: number;
  device: string;
}

// src/types/inspection.ts

interface InspectionResult {
  seq: number;
  inspected_at: string;
  image_name: string;
  image_path: string;
  verdict: '양품' | '불량';
  anomaly_score: number;
  was_reshuffled: boolean;
}

interface InspectionRecord {
  seq: number;
  inspected_at: string;
  image_name: string;
  verdict: '양품' | '불량';
  anomaly_score: number;
}

type VerdictFilter = '전체' | '양품' | '불량';

interface WsMessage {
  type: 'result' | 'defect_stopped' | 'stopped' | 'error';
  seq?: number;
  inspected_at?: string;
  image_name?: string;
  verdict?: '양품' | '불량';
  anomaly_score?: number;
  was_reshuffled?: boolean;
  message?: string;
}
```

---

## 10. UI 시각 명세

### 10-1. 레이아웃 비율

| 위치 | 비율 |
|------|------|
| 탭1 결과 4열 | `[1, 2, 2, 2]` (판정카드 : 원본 : Anomaly Map : 오버레이) |
| 탭2 통계 차트 3분할 | `[1, 2, 2]` (시간범위 테이블 : 히스토그램 : 산점도) |
| 탭2 헤더 | flex `space-between` (제목 좌측, CSV 버튼 우측) |

### 10-2. 색상 규칙

| 용도 | 색상 |
|------|------|
| 양품 텍스트·아이콘 | 초록 (`green-600` 계열) |
| 불량 텍스트·아이콘 | 빨강 (`red-600` 계열) |
| 탭2 불량 행 배경 | `#FFDDD6` |
| 탭2 양품 행 배경 | `#D6F5DD` |
| 정보/안내 메시지 | 파랑 (`info` 계열) |
| 자동 검사 배너 | 노랑 (`warning` 계열) |
| GPU 경고 배너 | 노랑 (`warning` 계열) |
| 불량 감지 팝업 배경 | 빨강 (`error` 계열) |
| 통계 차트 — 양품 | 파란색 (bar·점) |
| 통계 차트 — 불량 | 빨간색 (bar·점) |
| 히스토그램 threshold 선 | 수직 점선 |
| 산점도 threshold 선 | 수평 빨간 점선 |

### 10-3. 숫자 포맷

| 필드 | 포맷 |
|------|------|
| `anomaly_score` (탭1 판정카드) | `.toFixed(4)` |
| `anomaly_score` (탭2 테이블) | `.toFixed(4)` |
| `f1_score` (탭3 테이블) | `.toFixed(4)` |
| `auc` (탭3 테이블) | `.toFixed(4)` |
| 불량률 (KPI) | `.toFixed(1) + '%'` |

### 10-4. 날짜·시간 포맷

| 필드 | 포맷 |
|------|------|
| `inspected_at` (탭2 테이블) | `YYYY-MM-DD HH:MM:SS` (서버 값 그대로) |
| `created_at` (탭3 테이블) | `YYYY-MM-DD HH:MM` (초 생략) |
| 통계 차트 시간 범위 label | `YYYY-MM-DD HH:MM~HH:MM` |

### 10-5. 버튼 레이블 및 비활성 조건

| 버튼 | 레이블 | `disabled` 조건 |
|------|--------|----------------|
| 수동 검사 | `🔍 수동 검사 (1개 검사)` | `isAutoRunning \|\| isLoading` |
| 자동 검사 시작 | `▶ 자동 검사 (3초마다 1개)` | `isAutoRunning` |
| 자동 검사 중지 | `⏹ 자동 검사 중지` | `!isAutoRunning` |
| 모델 적용 | `✅ 이 모델로 검사 시작` | `!selectedId \|\| selectedId === activeModel?.experiment_id \|\| isLoading` |
| CSV 내보내기 | `📥 CSV 내보내기` | `allRecords.length === 0` |
| 이력 초기화 | `🗑 이력 초기화` | — (항상 활성) |

### 10-6. Guard·빈 상태 문구

| 상황 | 문구 |
|------|------|
| 모델 미선택 (탭1·탭2) | "검사에 사용할 모델이 선택되지 않았습니다." + 모델 교체 탭 링크 |
| 검사 전 판정카드 | "검사 버튼을 눌러 시작하세요." |
| 검사 전 이미지 패널 | 패널 레이블 텍스트 ("원본 이미지" / "Anomaly Map" / "이상 영역 오버레이") |
| 이력 없음 (탭2) | "아직 검사 기록이 없습니다." |
| 완료 실험 없음 (탭3) | "사용 가능한 완료된 실험이 없습니다." |

### 10-7. 배너·팝업·토스트 문구

| 컴포넌트 | 문구 |
|----------|------|
| `AutoRunningBanner` | "🔄 자동 검사 진행 중..." |
| `DefectPopup` 본문 | "❌ 불량이 감지되었습니다! 자동 검사가 중지되었습니다." |
| `DefectPopup` 버튼1 | "✅ 확인 및 재개" |
| `DefectPopup` 버튼2 | "🛑 검사 종료" |
| `ReshuffledToast` | "이미지 풀이 소진되어 재셔플되었습니다." (자동 3초 후 소멸) |
| 탭3 모델 교체 경고 | "⚠️ 모델을 교체하면 현재 세션의 모든 검사 이력이 삭제됩니다." |
| `ClearHistoryDialog` 본문 | "이력을 초기화하면 모든 검사 기록이 삭제됩니다." |
| `ClearHistoryDialog` 버튼 | "취소" / "초기화" |

### 10-8. 통계 차트 축·시각 규칙

| 항목 | 히스토그램 (중앙) | 산점도 (우측) |
|------|-----------------|-------------|
| x축 범위 | 0~1 고정 (Score) | 1~N 고정 (N = selectedUnit) |
| y축 범위 | 동적 (데이터 기반) | 0~1 고정 |
| 양품 표현 | 파란 bar | 파란 원 |
| 불량 표현 | 빨간 bar | 빨간 원 |
| threshold 표시 | 수직 점선 | 수평 빨간 점선 |
| 연결선 | 없음 | 앞뒤 점 연결 |
| 차트 제목 | `Anomaly Score 분포 — {시간범위}` | `Anomaly Score 추이 — {시간범위}` |
| threshold 값 | `activeModel.threshold` ([0,1] 정규화, `anomaly_score`와 동일 스케일) |
