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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 2fr 2fr',
          gap: '16px',
        }}
      >
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
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            backgroundColor: '#1e293b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 999,
          }}
        >
          이미지 풀이 소진되어 재셔플되었습니다.
        </div>
      )}
    </NoModelGuard>
  );
}
