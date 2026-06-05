import { apiClient } from './client';
import type { InspectionResult } from '../types/inspection';

export const inspectionApi = {
  runInspection(): Promise<InspectionResult> {
    return apiClient.post<InspectionResult>('/api/inspection/run').then((r) => r.data);
  },

  getImageUrl(stamp: number): string {
    return `http://localhost:8000/api/inspection/image/last?t=${stamp}`;
  },

  getAnomalyMapUrl(stamp: number): string {
    return `http://localhost:8000/api/inspection/anomaly-map/last?t=${stamp}`;
  },

  getOverlayUrl(stamp: number): string {
    return `http://localhost:8000/api/inspection/overlay/last?t=${stamp}`;
  },
};
