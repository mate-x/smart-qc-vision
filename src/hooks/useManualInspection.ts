import { useState, useCallback } from 'react';
import { inspectionApi } from '../api/inspectionApi';
import { useInspectionStore } from '../store/inspectionStore';

export function useManualInspection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setLastResult = useInspectionStore((s) => s.setLastResult);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await inspectionApi.runInspection();
      setLastResult(result);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : '검사 실행에 실패했습니다.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [setLastResult]);

  return { run, isLoading, error };
}
