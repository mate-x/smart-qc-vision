import { create } from 'zustand';
import type { ActiveModel } from '../types/model';
import type { InspectionResult } from '../types/inspection';

interface InspectionState {
  activeModel: ActiveModel | null;
  gpuWarning: string | null;

  lastResult: InspectionResult | null;
  imageStamp: number;

  isAutoRunning: boolean;
  defectStopped: boolean;

  reshuffledToast: boolean;

  setActiveModel: (model: ActiveModel | null, gpuWarning?: string | null) => void;
  setLastResult: (result: InspectionResult) => void;
  setAutoRunning: (v: boolean) => void;
  setDefectStopped: (v: boolean) => void;
  clearHistory: () => void;
  showReshuffledToast: () => void;
  dismissReshuffledToast: () => void;
  setGpuWarning: (warning: string | null) => void;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  activeModel: null,
  gpuWarning: null,

  lastResult: null,
  imageStamp: 0,

  isAutoRunning: false,
  defectStopped: false,

  reshuffledToast: false,

  setActiveModel: (model, gpuWarning = null) =>
    set({
      activeModel: model,
      gpuWarning,
      lastResult: null,
      imageStamp: 0,
      isAutoRunning: false,
      defectStopped: false,
    }),

  setLastResult: (result) =>
    set({
      lastResult: result,
      imageStamp: Date.now(),
    }),

  setAutoRunning: (v) => set({ isAutoRunning: v }),

  setDefectStopped: (v) => set({ defectStopped: v }),

  clearHistory: () =>
    set({
      lastResult: null,
      imageStamp: 0,
    }),

  showReshuffledToast: () => set({ reshuffledToast: true }),

  dismissReshuffledToast: () => set({ reshuffledToast: false }),

  setGpuWarning: (warning) => set({ gpuWarning: warning }),
}));
