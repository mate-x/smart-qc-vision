import { apiClient } from './client';
import type { ExperimentRecord } from '../types/model';
import type { ApplyModelResponse, GetActiveModelResponse } from '../types/api';

export const modelsApi = {
  getModels(): Promise<ExperimentRecord[]> {
    return apiClient.get<ExperimentRecord[]>('/api/models').then((r) => r.data);
  },

  applyModel(experimentId: string, sourcePath?: string): Promise<ApplyModelResponse> {
    const body: Record<string, string> = { experiment_id: experimentId };
    if (sourcePath && sourcePath.trim()) body.source_path = sourcePath.trim();
    return apiClient
      .post<ApplyModelResponse>('/api/inspection/model', body)
      .then((r) => r.data);
  },

  getActiveModel(): Promise<GetActiveModelResponse> {
    return apiClient
      .get<GetActiveModelResponse>('/api/inspection/model')
      .then((r) => r.data);
  },
};
