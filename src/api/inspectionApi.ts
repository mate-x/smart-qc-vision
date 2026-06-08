import { apiClient } from './client';
import type { InspectionJobStarted, InspectionJobStatus, RunInspectionRequest } from '../types/inspection';

export const inspectionApi = {
  startInspection(req: RunInspectionRequest = {}): Promise<InspectionJobStarted> {
    return apiClient.post<InspectionJobStarted>('/api/inspection/run', req).then((r) => r.data);
  },

  getJobStatus(jobId: string): Promise<InspectionJobStatus> {
    return apiClient.get<InspectionJobStatus>(`/api/inspection/job/${jobId}`).then((r) => r.data);
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
