import { useState } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useModels } from '../hooks/useModels';
import { useApplyModel } from '../hooks/useApplyModel';
import { ModelTable } from '../components/tab3/ModelTable';
import { ApplyModelButton } from '../components/tab3/ApplyModelButton';

export default function Tab3Model() {
  const activeModel = useInspectionStore((s) => s.activeModel);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { models, isLoading: modelsLoading } = useModels();
  const { apply, isLoading: applyLoading, error: applyError } = useApplyModel();

  const handleApply = async () => {
    if (!selectedId) return;
    try {
      await apply(selectedId);
      setSelectedId(null);
    } catch {
      // error already surfaced via useApplyModel
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        {activeModel ? '모델 교체' : '모델 선택'}
      </h2>

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
    </div>
  );
}
