import { useState } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useModels } from '../hooks/useModels';
import { useApplyModel } from '../hooks/useApplyModel';
import { ModelTable } from '../components/tab3/ModelTable';
import { ApplyModelButton } from '../components/tab3/ApplyModelButton';

export default function Tab3Model() {
  const activeModel = useInspectionStore((s) => s.activeModel);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourcePath, setSourcePath] = useState('');

  const { models, isLoading: modelsLoading } = useModels();
  const { apply, isLoading: applyLoading, error: applyError } = useApplyModel();

  const handleApply = async () => {
    if (!selectedId) return;
    try {
      await apply(selectedId, sourcePath || undefined);
      setSelectedId(null);
    } catch {
      // error already surfaced via useApplyModel
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">검사 설정</h2>

      <p className="text-sm font-semibold text-gray-700 mb-2">모델 선택</p>
      <ModelTable
        models={models}
        isLoading={modelsLoading}
        activeModelId={activeModel?.experiment_id ?? null}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">이미지 소스 경로</p>
        <p className="text-xs text-gray-400 mb-2">비우면 선택한 모델의 학습 데이터셋 경로를 사용합니다.</p>
        <input
          type="text"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
          placeholder={activeModel?.dataset_path ?? '예) C:/images/production/line-A'}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ApplyModelButton
        selectedId={selectedId}
        activeModelId={activeModel?.experiment_id ?? null}
        isLoading={applyLoading}
        error={applyError}
        onApply={handleApply}
      />
    </div>
  );
}
