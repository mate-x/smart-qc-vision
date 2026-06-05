import { useInspectionStore } from '../../store/inspectionStore';

export function ModelStatusChip() {
  const activeModel = useInspectionStore((s) => s.activeModel);

  const chipClass = `inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap border ${
    activeModel
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-500 border-gray-300'
  }`;

  if (!activeModel) {
    return <span className={chipClass}>모델 미선택</span>;
  }

  return (
    <span className={chipClass}>
      모델: {activeModel.name} / {activeModel.model_type}
    </span>
  );
}
