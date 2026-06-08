import { apiClient } from './client';
import type { InspectionRecord, VerdictFilter } from '../types/inspection';

export const recordsApi = {
  getRecords(verdict: VerdictFilter): Promise<InspectionRecord[]> {
    return apiClient
      .get<InspectionRecord[]>('/api/inspection/records', { params: { verdict } })
      .then((r) => r.data);
  },

  downloadCsv(): void {
    window.open('http://localhost:8000/api/inspection/records/csv');
  },

  deleteRecords(): Promise<void> {
    return apiClient.delete('/api/inspection/records').then(() => undefined);
  },
};
