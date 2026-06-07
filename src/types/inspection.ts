export interface InspectionResult {
  seq: number;
  inspected_at: string;
  image_name: string;
  image_path: string;
  verdict: '양품' | '불량';
  anomaly_score: number;
  was_reshuffled: boolean;
}

export interface InspectionRecord {
  seq: number;
  inspected_at: string;
  image_name: string;
  verdict: '양품' | '불량';
  anomaly_score: number;
}

export type VerdictFilter = '전체' | '양품' | '불량';

export interface InspectionJobStarted {
  job_id: string;
}

export interface RunInspectionRequest {
  defect_only?: boolean;
}

export type InspectionJobStatus =
  | { status: 'pending' | 'running' }
  | { status: 'completed'; result: InspectionResult }
  | { status: 'failed'; error: string };

export type WsMessage =
  | {
      type: 'result';
      seq: number;
      inspected_at: string;
      image_name: string;
      image_path: string;
      verdict: '양품' | '불량';
      anomaly_score: number;
      was_reshuffled: boolean;
    }
  | { type: 'defect_stopped' }
  | { type: 'stopped' }
  | { type: 'error'; message: string };
