import { useEffect, useState } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useManualInspection } from '../hooks/useManualInspection';
import { useAutoInspection } from '../hooks/useAutoInspection';
import { useInspectionImages } from '../hooks/useInspectionImages';
import { NoModelGuard } from '../components/layout/NoModelGuard';
import { AutoRunningBanner } from '../components/tab1/AutoRunningBanner';
import { InspectionControls } from '../components/tab1/InspectionControls';
import { ImagePanel } from '../components/tab1/ImagePanel';
import { AnomalyMapPanel } from '../components/tab1/AnomalyMapPanel';
import { OverlayPanel } from '../components/tab1/OverlayPanel';
import { DefectPopup } from '../components/tab1/DefectPopup';

export default function Tab1Realtime() {
  const { run: runManual, isLoading: isManualLoading, error: manualError } = useManualInspection();
  const { start, stop } = useAutoInspection();
  const { imageUrl, anomalyMapUrl, overlayUrl } = useInspectionImages();

  const [imageRatio, setImageRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!imageUrl) setImageRatio(null);
  }, [imageUrl]);

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
      <div className="flex flex-col h-full">
        {isAutoRunning && <AutoRunningBanner />}

        <div className="flex items-center justify-between mb-4 shrink-0">
          <InspectionControls
            isAutoRunning={isAutoRunning}
            isLoading={isManualLoading}
            error={manualError}
            onManual={runManual}
            onStart={start}
            onStop={stop}
          />
          {lastResult && (
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-base font-bold shrink-0 border ${
              lastResult.verdict === '양품'
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
            }`}>
              <span>{lastResult.verdict === '양품' ? '✅' : '❌'}</span>
              <span>{lastResult.verdict}</span>
              <span className="text-sm font-normal opacity-60">{lastResult.anomaly_score.toFixed(4)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <ImagePanel url={imageUrl} label="원본 이미지" onRatioDetected={setImageRatio} aspectRatio={imageRatio} />
          <AnomalyMapPanel url={anomalyMapUrl} aspectRatio={imageRatio} />
          <OverlayPanel url={overlayUrl} aspectRatio={imageRatio} />
        </div>
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
