import { useEffect } from 'react';
import { modelsApi } from '../api/modelsApi';
import { useInspectionStore } from '../store/inspectionStore';
import type { ActiveModel } from '../types/model';

export function useActiveModel(): { activeModel: ActiveModel | null } {
  const setActiveModel = useInspectionStore((s) => s.setActiveModel);
  const activeModel = useInspectionStore((s) => s.activeModel);

  useEffect(() => {
    modelsApi.getActiveModel()
      .then(({ active_model }) => setActiveModel(active_model))
      .catch(() => {
        // 앱 최초 로드 실패는 조용히 처리 (서버 미실행 등)
      });
  }, [setActiveModel]);

  return { activeModel };
}
