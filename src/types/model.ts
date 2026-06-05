export interface ExperimentRecord {
  experiment_id: string;
  name?: string;
  model_type: string;
  model_path: string;
  dataset_path: string;
  created_at: string;
  threshold_method: string;
  threshold_value: number;
  metrics: {
    f1_score: number;
    auc: number;
    anomaly_scores: number[];
    image_labels: number[];
  };
  preprocessing_method: string;
  preprocessing_params: Record<string, unknown>;
  image_size: number;
  status: string;
}

export interface ActiveModel {
  experiment_id: string;
  model_path: string;
  model_type: string;
  threshold: number;
  dataset_path: string;
  preprocessing_config: {
    method: string;
    params: Record<string, unknown>;
    image_size: number;
  };
  score_min: number;
  score_max: number;
  device: string;
}
