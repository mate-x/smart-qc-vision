import { useState, useCallback, useRef, useEffect } from 'react';
import { inspectionApi } from '../api/inspectionApi';
import { useInspectionStore } from '../store/inspectionStore';

const POLL_INTERVAL_MS = 1_000;
const POLL_TIMEOUT_MS = 120_000;
const WARNING_DISMISS_MS = 3_000;

export function useDefectOnlyInspection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const setLastResult = useInspectionStore((s) => s.setLastResult);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!warning) return;
    const t = setTimeout(() => setWarning(null), WARNING_DISMISS_MS);
    return () => clearTimeout(t);
  }, [warning]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setWarning(null);

    let started;
    try {
      started = await inspectionApi.startInspection({ defect_only: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '검사 시작에 실패했습니다.');
      setIsLoading(false);
      return;
    }

    const { job_id } = started;
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    const poll = async () => {
      if (Date.now() > deadline) {
        setError('검사 시간이 초과됐습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const status = await inspectionApi.getJobStatus(job_id);

        if (status.status === 'completed') {
          setLastResult(status.result);
          setIsLoading(false);
        } else if (status.status === 'failed') {
          if (status.error?.includes('불량 이미지가 없습니다')) {
            setWarning(status.error);
          } else {
            setError(status.error ?? '검사 실패');
          }
          setIsLoading(false);
        } else {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : '검사 상태 조회에 실패했습니다.');
        setIsLoading(false);
      }
    };

    timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
  }, [setLastResult]);

  return { run, isLoading, error, warning, clearError };
}
