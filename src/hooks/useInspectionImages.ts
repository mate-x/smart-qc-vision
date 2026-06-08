import { useInspectionStore } from '../store/inspectionStore';
import { inspectionApi } from '../api/inspectionApi';

export function useInspectionImages() {
  const imageStamp = useInspectionStore((s) => s.imageStamp);

  if (imageStamp === 0) {
    return { imageUrl: null, anomalyMapUrl: null, overlayUrl: null };
  }

  return {
    imageUrl: inspectionApi.getImageUrl(imageStamp),
    anomalyMapUrl: inspectionApi.getAnomalyMapUrl(imageStamp),
    overlayUrl: inspectionApi.getOverlayUrl(imageStamp),
  };
}
