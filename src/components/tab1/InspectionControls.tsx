interface Props {
  isAutoRunning: boolean;
  isLoading: boolean;
  error: string | null;
  onManual: () => void;
  onStart: () => void;
  onStop: () => void;
}

const btnBase = 'py-2 px-[18px] rounded-md text-sm font-medium border-0 transition-opacity duration-150';

export function InspectionControls({
  isAutoRunning,
  isLoading,
  error,
  onManual,
  onStart,
  onStop,
}: Props) {
  const allDisabled = isLoading;

  return (
    <div>
      <div className="flex gap-2.5 flex-wrap">
        <button
          onClick={onManual}
          disabled={allDisabled || isAutoRunning}
          className={`${btnBase} bg-blue-600 text-white ${allDisabled || isAutoRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          수동 검사 (1개 검사)
        </button>

        <button
          onClick={onStart}
          disabled={allDisabled || isAutoRunning}
          className={`${btnBase} bg-green-600 text-white ${allDisabled || isAutoRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          ▶ 자동 검사 (3초마다 1개)
        </button>

        <button
          onClick={onStop}
          disabled={allDisabled || !isAutoRunning}
          className={`${btnBase} bg-red-600 text-white ${allDisabled || !isAutoRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          ⏹ 자동 검사 중지
        </button>
      </div>

      {isLoading && (
        <p className="mt-2 text-gray-500 text-[13px]">⏳ 검사 중... 잠시 기다려 주세요</p>
      )}
      {error && (
        <p className="mt-2 text-red-600 text-[13px]">{error}</p>
      )}
    </div>
  );
}
