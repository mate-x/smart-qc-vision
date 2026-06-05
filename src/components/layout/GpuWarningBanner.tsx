import { useInspectionStore } from '../../store/inspectionStore';

export function GpuWarningBanner() {
  const gpuWarning = useInspectionStore((s) => s.gpuWarning);
  const setGpuWarning = useInspectionStore((s) => s.setGpuWarning);

  if (!gpuWarning) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        backgroundColor: '#fef9c3',
        borderBottom: '1px solid #fde047',
        color: '#713f12',
        fontSize: '13px',
      }}
    >
      <span>⚠️ {gpuWarning}</span>
      <button
        onClick={() => setGpuWarning(null)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#713f12',
          lineHeight: 1,
          padding: '0 4px',
        }}
        aria-label="배너 닫기"
      >
        ×
      </button>
    </div>
  );
}
