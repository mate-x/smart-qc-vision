import { useInspectionStore } from '../../store/inspectionStore';

export function ModelStatusChip() {
  const activeModel = useInspectionStore((s) => s.activeModel);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    backgroundColor: activeModel ? '#e0f2e9' : '#f0f0f0',
    color: activeModel ? '#166534' : '#6b7280',
    border: `1px solid ${activeModel ? '#bbf7d0' : '#d1d5db'}`,
  };

  if (!activeModel) {
    return <span style={style}>모델 미선택</span>;
  }

  const shortId = activeModel.experiment_id.slice(0, 8);
  return (
    <span style={style}>
      모델: {activeModel.model_type} / {shortId}
    </span>
  );
}
