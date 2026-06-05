import { useState, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { modelsApi } from '../api/modelsApi';
import { useInspectionStore } from '../store/inspectionStore';

export function useUpdateSourcePath() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setActiveModelDatasetPath = useInspectionStore((s) => s.setActiveModelDatasetPath);

  const updatePath = useCallback(async (sourcePath: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await modelsApi.updateSourcePath(sourcePath);
      setActiveModelDatasetPath(res.source_path);
    } catch (e: unknown) {
      const msg =
        isAxiosError(e) && e.response?.data?.detail
          ? e.response.data.detail
          : e instanceof Error ? e.message : '경로 적용에 실패했습니다.';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [setActiveModelDatasetPath]);

  return { updatePath, isLoading, error };
}
