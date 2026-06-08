import { useInspectionStore } from '../../store/inspectionStore';

export function GpuWarningBanner() {
  const gpuWarning = useInspectionStore((s) => s.gpuWarning);
  const setGpuWarning = useInspectionStore((s) => s.setGpuWarning);

  if (!gpuWarning) return null;

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-[13px]">
      <span>⚠️ {gpuWarning}</span>
      <button
        onClick={() => setGpuWarning(null)}
        className="bg-transparent border-0 cursor-pointer text-base text-yellow-900 leading-none px-1"
        aria-label="배너 닫기"
      >
        ×
      </button>
    </div>
  );
}
