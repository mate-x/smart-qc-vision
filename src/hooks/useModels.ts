import { useState, useEffect, useCallback } from 'react';
import { modelsApi } from '../api/modelsApi';
import type { ExperimentRecord } from '../types/model';

const POLL_INTERVAL_MS = 30_000;

export function useModels() {
  const [models, setModels] = useState<ExperimentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await modelsApi.getModels();
      setModels(data);
    } catch {
      setError('모델 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetch]);

  return { models, isLoading, error, refetch: fetch };
}
