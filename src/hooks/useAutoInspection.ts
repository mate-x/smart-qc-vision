import { useRef, useEffect, useCallback } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import type { WsMessage } from '../types/inspection';

const WS_URL = 'ws://localhost:8000/ws/inspection/auto';

export function useAutoInspection() {
  const wsRef = useRef<WebSocket | null>(null);

  const start = useCallback(() => {
    // 기존 소켓이 있으면 닫고 새로 연결 (단일 소켓 보장)
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send('start');
      useInspectionStore.getState().setAutoRunning(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      const msg: WsMessage = JSON.parse(event.data as string);
      const store = useInspectionStore.getState();

      if (msg.type === 'result') {
        store.setLastResult(msg);
        if (msg.was_reshuffled) store.showReshuffledToast();
      } else if (msg.type === 'defect_stopped') {
        store.setDefectStopped(true);
      } else if (msg.type === 'stopped') {
        // 서버의 stop 확인 — 클라이언트는 stop()에서 이미 처리
      } else if (msg.type === 'error') {
        store.setAutoRunning(false);
        // TODO(Phase 3): 에러 토스트 표시
        console.error('[WS] error:', msg.message);
      }
    };

    ws.onerror = () => {
      useInspectionStore.getState().setAutoRunning(false);
      // TODO(Phase 3): 에러 토스트 "서버에 연결할 수 없습니다"
    };

    ws.onclose = () => {
      useInspectionStore.getState().setAutoRunning(false);
    };
  }, []);

  const stop = useCallback(() => {
    wsRef.current?.send('stop');
    useInspectionStore.getState().setAutoRunning(false);
  }, []);

  // Tab1 언마운트 시 서버 루프 정리
  useEffect(() => {
    return () => {
      const { isAutoRunning } = useInspectionStore.getState();
      if (isAutoRunning) {
        wsRef.current?.send('stop');
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  return { start, stop };
}
