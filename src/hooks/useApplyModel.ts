import { useState, useCallback } from 'react';
import { modelsApi } from '../api/modelsApi';
import { useInspectionStore } from '../store/inspectionStore';

export function useApplyModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setActiveModel = useInspectionStore((s) => s.setActiveModel);

  const apply = useCallback(async (experimentId: string, sourcePath?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await modelsApi.applyModel(experimentId, sourcePath);
      setActiveModel(res.active_model, res.gpu_warning);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : '모델 적용에 실패했습니다.';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [setActiveModel]);

  return { apply, isLoading, error };
}
