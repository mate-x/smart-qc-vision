import { useEffect } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useManualInspection } from '../hooks/useManualInspection';
import { useAutoInspection } from '../hooks/useAutoInspection';
import { useInspectionImages } from '../hooks/useInspectionImages';
import { NoModelGuard } from '../components/layout/NoModelGuard';
import { AutoRunningBanner } from '../components/tab1/AutoRunningBanner';
import { InspectionControls } from '../components/tab1/InspectionControls';
import { VerdictCard } from '../components/tab1/VerdictCard';
import { ImagePanel } from '../components/tab1/ImagePanel';
import { AnomalyMapPanel } from '../components/tab1/AnomalyMapPanel';
import { OverlayPanel } from '../components/tab1/OverlayPanel';
import { DefectPopup } from '../components/tab1/DefectPopup';

export default function Tab1Realtime() {
  const { run: runManual, isLoading: isManualLoading, error: manualError } = useManualInspection();
  const { start, stop } = useAutoInspection();
  const { imageUrl, anomalyMapUrl, overlayUrl } = useInspectionImages();

  const isAutoRunning = useInspectionStore((s) => s.isAutoRunning);
  const lastResult = useInspectionStore((s) => s.lastResult);
  const defectStopped = useInspectionStore((s) => s.defectStopped);
  const setDefectStopped = useInspectionStore((s) => s.setDefectStopped);
  const reshuffledToast = useInspectionStore((s) => s.reshuffledToast);
  const dismissReshuffledToast = useInspectionStore((s) => s.dismissReshuffledToast);

  useEffect(() => {
    if (!reshuffledToast) return;
    const timer = setTimeout(dismissReshuffledToast, 3000);
    return () => clearTimeout(timer);
  }, [reshuffledToast, dismissReshuffledToast]);

  return (
    <NoModelGuard>
      {isAutoRunning && <AutoRunningBanner />}

      <InspectionControls
        isAutoRunning={isAutoRunning}
        isLoading={isManualLoading}
        error={manualError}
        onManual={runManual}
        onStart={start}
        onStop={stop}
      />

      <div className="grid grid-cols-[1fr_2fr_2fr_2fr] gap-4">
        <VerdictCard result={lastResult} />
        <ImagePanel url={imageUrl} label="원본 이미지" />
        <AnomalyMapPanel url={anomalyMapUrl} />
        <OverlayPanel url={overlayUrl} />
      </div>

      {defectStopped && (
        <DefectPopup
          onResume={() => {
            setDefectStopped(false);
            start();
          }}
          onClose={() => setDefectStopped(false)}
        />
      )}

      {reshuffledToast && (
        <div className="fixed bottom-6 right-6 py-3 px-5 bg-slate-800 text-white rounded-lg text-[13px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[999]">
          이미지 풀이 소진되어 재셔플되었습니다.
        </div>
      )}
    </NoModelGuard>
  );
}
