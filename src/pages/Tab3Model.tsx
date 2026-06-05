import { useState } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useModels } from '../hooks/useModels';
import { useApplyModel } from '../hooks/useApplyModel';
import { useUpdateSourcePath } from '../hooks/useUpdateSourcePath';
import { ModelTable } from '../components/tab3/ModelTable';
import { ApplyModelButton } from '../components/tab3/ApplyModelButton';

export default function Tab3Model() {
  const activeModel = useInspectionStore((s) => s.activeModel);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourcePath, setSourcePath] = useState('');

  const { models, isLoading: modelsLoading } = useModels();
  const { apply, isLoading: applyLoading, error: applyError } = useApplyModel();
  const { updatePath, isLoading: pathLoading, error: pathError } = useUpdateSourcePath();

  const handleApply = async () => {
    if (!selectedId) return;
    try {
      await apply(selectedId);
      setSelectedId(null);
    } catch {
      // error already surfaced via useApplyModel
    }
  };

  const handleUpdatePath = async () => {
    try {
      await updatePath(sourcePath.trim() || '');
    } catch {
      // error already surfaced via useUpdateSourcePath
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

      <ApplyModelButton
        selectedId={selectedId}
        activeModelId={activeModel?.experiment_id ?? null}
        isLoading={applyLoading}
        error={applyError}
        onApply={handleApply}
      />

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-1">이미지 소스 경로</p>
        <p className="text-xs text-gray-400 mb-2">
          비우면 선택한 모델의 학습 데이터셋 경로를 사용합니다. 현재: {activeModel?.dataset_path ?? '—'}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={sourcePath}
            onChange={(e) => setSourcePath(e.target.value)}
            disabled={!activeModel}
            placeholder="변경할 경로 입력"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          />
          <button
            onClick={handleUpdatePath}
            disabled={!activeModel || pathLoading}
            className={`px-4 py-2 rounded-md text-sm font-semibold border-0 transition-colors duration-150 whitespace-nowrap ${
              !activeModel || pathLoading
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'cursor-pointer bg-blue-600 text-white'
            }`}
          >
            {pathLoading ? '적용 중...' : '경로 적용'}
          </button>
        </div>
        {pathError && <p className="mt-2 text-red-600 text-[13px]">{pathError}</p>}
      </div>
    </div>
  );
}
