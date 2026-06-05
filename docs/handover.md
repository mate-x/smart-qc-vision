# 비전검사 대시보드 React 이전 — 구현 인수인계 문서

## 프로젝트 개요
- 현재 스택: Streamlit 단일 앱 (smart-qc-dashboard)
- 목표: 비전검사 대시보드만 React로 이전
- 방식: 현재 레포에 FastAPI `api/` 폴더 추가 + React는 별도 레포(smart-qc-web)

---

## 확정된 아키텍처

    smart-qc-dashboard/        ← 현재 레포 (Streamlit + api/ 폴더 추가)
    ├── app.py                 ← Streamlit 학습 플랫폼 유지
    ├── inspection/            ← TODO: [삭제 예정] React 이전 후 삭제
    ├── utils/                 ← FastAPI도 직접 재사용
    └── api/                   ← NEW: FastAPI 서버
        ├── main.py
        ├── state.py           ← 전역 상태 (모델 캐시, test pool, records)
        ├── routes/
        │   ├── inspection.py
        │   └── models.py
        └── ws/
            └── auto_inspection.py

    smart-qc-web/              ← 새 레포 (React + TypeScript, Vite)

---

## 확정된 설계 결정사항

### 1. 상태 관리
- 단일 사용자 → 전역 변수로 관리 (세션 불필요)
- st.session_state 대체: api/state.py에 전역 딕셔너리

### 2. Anomaly Map 이력
- A안 채택: 마지막 검사 1개만 메모리에 유지 (현재 Streamlit과 동일)
- 탭2 이력 테이블에는 텍스트만 표시 (이미지 없음)
- 별도 디스크 저장 없음

### 3. history.json (completed 실험 목록)
- GET /api/models → status == "completed" 필터만 반환
- React에서 폴링으로 충분 (WebSocket 불필요)
- Streamlit 학습 완료 시 자동으로 다음 폴링에 반영됨

### 4. GPU 메모리 관리
- 플래그 파일 방식 NOT 사용 (GPU를 쓰는 건 우리 코드만이 아님)
- 실제 GPU 메모리를 직접 체크: torch.cuda.mem_get_info()
- 적용 위치:
  a) Streamlit 탭5 (tab5_anomaly_map.py): 모델 로드 전 st.warning() 표시
  b) FastAPI POST /api/inspection/model: 응답에 gpu_warning 필드 포함
  c) React: 경고 메시지 배너로 표시
- OOM 발생 시 에러 캐치 → "GPU 메모리 부족" 메시지

### 5. Streamlit inspection 처리 (C안 선택)
- 코드는 그대로 유지, TODO 코멘트만 추가 완료
- 나중에 "TODO: [삭제 예정]" 검색으로 4곳 일괄 삭제
- 삭제 예정 파일: inspection/ 폴더 전체

### 6. 레포지토리 구조
- FastAPI: 현재 레포 api/ 폴더 (utils/ 공유 위해 분리 안 함)
- React: 별도 레포

### 7. 서버 실행
- Streamlit: streamlit run app.py → port 8501
- FastAPI: uvicorn api.main:app → port 8000
- 반드시 프로젝트 루트에서 실행 (storage.py 상대경로 의존)
- React dev: npm run dev → port 5173

---

## API 엔드포인트 목록

### 탭3 — 모델 교체
    GET  /api/models                  completed 실험 목록 (F1 내림차순)
    POST /api/inspection/model        모델 적용 (body: {experiment_id})
    GET  /api/inspection/model        현재 적용 모델 조회

### 탭1 — 실시간 검사
    POST /api/inspection/run          수동 검사 1회 실행
    GET  /api/inspection/image/last   마지막 검사 원본 이미지
    GET  /api/inspection/anomaly-map/last  마지막 Anomaly Map 히트맵 이미지
    GET  /api/inspection/overlay/last 마지막 이상 영역 오버레이 이미지
    WS   /ws/inspection/auto          자동 검사 (3초 루프)

### 탭2 — 검사 이력
    GET    /api/inspection/records      이력 목록 (query: verdict=양품|불량|전체)
    GET    /api/inspection/records/csv  CSV 다운로드
    DELETE /api/inspection/records      이력 초기화

---

## api/state.py 구조 (전역 상태)

st.session_state 및 @st.cache_resource 대체.

    _model_cache: dict = {}
    # key: (model_path, model_type, device) → model object

    _state: dict = {
        "insp_active_model":     None,   # dict | None (history.json 실험 레코드)
        "insp_records":          [],     # list[dict]
        "insp_seq_counter":      0,
        "insp_auto_active":      False,
        "insp_last_result":      None,   # dict | None
        "insp_last_anomaly_map": None,   # np.ndarray | None (H, W) float32
        "insp_defect_popup":     False,
        "insp_test_pool":        [],     # list[tuple[str, str]]
        "insp_pool_index":       0,
    }

---

## FastAPI에서 기존 utils 사용 가능 여부

### 직접 import 가능 (st 의존성 없음)
- utils/model_factory.py       ✅  load_model_for_inference, run_inference
- utils/storage.py             ✅  load_history() 사용 가능
                                    주의: check_disk_before_save() 호출 금지
                                    (내부에 import streamlit as st 있음)
                                    대신 check_disk_space() 사용 (순수 함수)
- utils/image_utils.py         ✅  anomaly_map_to_heatmap, apply_preprocessing
- utils/logger.py              ✅
- utils/messages.py            ✅
- utils/config_manager.py      ✅
- inspection/utils/test_sampler.build_test_pool  ✅  순수 파일시스템 탐색

### import 불가 (st.* 의존)
- inspection/utils/insp_session_init.py  ❌
  @st.cache_resource, st.session_state 전면 사용
  → 모델 캐시 로직은 api/state.py에서 재구현

- inspection/utils/test_sampler.sample_from_pool  ❌
  st.session_state 사용
  → pool 샘플링은 api/state.py에서 직접 구현

- inspection/tabs/*.py         ❌  모두 st.* 사용
- utils/cache_manager.py       ❌  st.session_state 사용
- utils/session_state_init.py  ❌

---

## 자동 검사 WebSocket 설계

현재 Streamlit 패턴 (insp_tab1_realtime.py):

    if is_auto:
        ok = _run_single_inspection()
        time.sleep(3)
        st.rerun()

FastAPI WebSocket 대체 (ws/auto_inspection.py):

    @app.websocket("/ws/inspection/auto")
    async def auto_inspection(websocket: WebSocket):
        await websocket.accept()
        while True:
            msg = await websocket.receive_text()  # "start" | "stop"
            if msg == "start":
                state["insp_auto_active"] = True
            if msg == "stop":
                state["insp_auto_active"] = False

            if state["insp_auto_active"]:
                result = await asyncio.to_thread(_run_single_inspection)
                await websocket.send_json(result)
                if result["verdict"] == "불량":
                    state["insp_auto_active"] = False
                await asyncio.sleep(3)

주의: run_inference()는 CPU/GPU 블로킹 작업 → asyncio.to_thread() 필수

---

## 이미지 서빙 방식

원본 이미지:
    image_path(절대경로)를 FileResponse로 반환

Anomaly Map (numpy array → PNG):
    state["insp_last_anomaly_map"] → anomaly_map_to_heatmap() → PNG bytes → StreamingResponse

오버레이:
    insp_tab1_realtime._make_anomaly_overlay() 로직을 api/routes/inspection.py에 이식
    (cv2 + PIL 사용, st 의존성 없음)

numpy array → PNG bytes 변환 유틸:

    import io
    from PIL import Image

    def numpy_to_png_bytes(arr: np.ndarray) -> bytes:
        img = Image.fromarray(arr)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

---

## GPU 메모리 체크 헬퍼

    WARN_THRESHOLD_MB = 1024  # 1GB 미만이면 경고

    def get_gpu_memory_info() -> dict:
        if not torch.cuda.is_available():
            return {"available": False}
        free, total = torch.cuda.mem_get_info()
        return {
            "available": True,
            "free_mb":   round(free / 1024**2),
            "total_mb":  round(total / 1024**2),
            "used_mb":   round((total - free) / 1024**2),
        }

Streamlit tab5 적용 위치:
    tabs/tab5_anomaly_map.py → render() 함수 내
    _ensure_anomaly_map_cache() 호출 전에 체크 → st.warning() 표시

FastAPI 적용 위치:
    POST /api/inspection/model 응답에 포함

    {
      "success": true,
      "active_model": {...},
      "gpu_warning": "GPU 여유 메모리 512 MB. 모델 로드에 실패할 수 있습니다."
    }

---

## 모델 적용 순서 (R-INSP-05 준수)

FastAPI POST /api/inspection/model 처리 순서:

    1. GPU 메모리 체크 → gpu_warning 여부 결정
    2. _model_cache.clear() — 기존 캐시 무효화
    3. state 초기화 (insp_active_model 제외 전체)
    4. insp_active_model 갱신
    5. build_test_pool(dataset_path) → insp_test_pool, insp_pool_index 설정
       실패 시 → 400 에러 반환
    6. 모델 로드 시도 (load_model_for_inference)
       실패 시 → 500 에러 반환
    7. 성공 응답 반환 (gpu_warning 포함)

threshold 계산:
    threshold_method == "absolute" → threshold_value 그대로 사용
    threshold_method == "percentile" → metrics.anomaly_scores 중 정상(label==0)
                                       분포의 percentile로 재계산
    (insp_tab3_model._resolve_threshold() 로직 그대로 이식)

---

## 현재까지 완료된 작업

TODO 코멘트 추가 완료 (4개 파일):

    app.py                      26번째 줄 inspection 라우팅 분기 위
    components/sidebar.py       비전검사 버튼 위
    utils/session_state_init.py insp_* 키 블록 위
    inspection/inspection_app.py 파일 최상단

검색어: "TODO: [삭제 예정]"

---

## CORS 설정

    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

---

## 다음 구현 순서

    1. api/state.py                  전역 상태 + 모델 캐시
    2. api/routes/models.py          GET /api/models
    3. api/routes/inspection.py      모델 적용 + 수동 검사 + 이력 + 이미지 서빙
    4. api/ws/auto_inspection.py     WebSocket 자동 검사
    5. api/main.py                   FastAPI 앱 조립 + CORS
    6. tabs/tab5_anomaly_map.py      GPU 메모리 체크 추가
    7. smart-qc-web/                 React 앱 (별도 레포)
