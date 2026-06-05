import { useState, useEffect, useCallback, useMemo } from 'react';
import { recordsApi } from '../api/recordsApi';
import { useInspectionStore } from '../store/inspectionStore';
import type { InspectionRecord, VerdictFilter } from '../types/inspection';

export function useInspectionRecords() {
  const [allRecords, setAllRecords] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilter>('전체');
  const clearHistory = useInspectionStore((s) => s.clearHistory);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recordsApi.getRecords('전체');
      setAllRecords(data);
    } catch {
      // 에러 처리는 컴포넌트 레이어에서 (TODO: Phase 3 토스트)
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tab2 마운트 시 1회 로드
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 클라이언트 필터링 — 서버 재요청 없음
  const filteredRecords = useMemo(() => {
    if (verdictFilter === '전체') return allRecords;
    return allRecords.filter((r) => r.verdict === verdictFilter);
  }, [allRecords, verdictFilter]);

  const clearRecords = useCallback(async () => {
    await recordsApi.deleteRecords();
    clearHistory();
    setAllRecords([]);
  }, [clearHistory]);

  return {
    allRecords,
    filteredRecords,
    isLoading,
    verdictFilter,
    setVerdictFilter,
    refetch: fetchAll,
    clearRecords,
    downloadCsv: recordsApi.downloadCsv,
  };
}
