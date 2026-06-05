import type { ActiveModel } from './model';

export interface ApplyModelResponse {
  success: boolean;
  active_model: ActiveModel;
  gpu_warning: string | null;
}

export interface GetActiveModelResponse {
  active_model: ActiveModel | null;
}
