import { useState, useCallback, useRef } from 'react';
import { inspectionApi } from '../api/inspectionApi';
import { useInspectionStore } from '../store/inspectionStore';

const POLL_INTERVAL_MS = 1_000;
const POLL_TIMEOUT_MS = 120_000;

export function useManualInspection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setLastResult = useInspectionStore((s) => s.setLastResult);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let started;
    try {
      started = await inspectionApi.startInspection();
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
          setError(status.error);
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

  const cancel = useCallback(() => {
    clearTimer();
    setIsLoading(false);
    setError(null);
  }, []);

  return { run, cancel, isLoading, error };
}
