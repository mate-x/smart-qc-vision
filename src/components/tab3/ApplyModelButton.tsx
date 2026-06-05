interface Props {
  selectedId: string | null;
  activeModelId: string | null;
  isLoading: boolean;
  error: string | null;
  onApply: () => void;
}

export function ApplyModelButton({
  selectedId,
  activeModelId,
  isLoading,
  error,
  onApply,
}: Props) {
  const isDisabled = !selectedId || selectedId === activeModelId || isLoading;
  const showWarning = selectedId !== null && selectedId !== activeModelId && !isLoading;

  return (
    <div>
      {showWarning && (
        <p className="text-[13px] text-amber-800 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 mb-3">
          ⚠️ 모델을 교체하면 현재 세션의 모든 검사 이력이 삭제됩니다.
        </p>
      )}

      <button
        onClick={onApply}
        disabled={isDisabled}
        className={`py-2.5 px-6 rounded-md text-sm font-semibold border-0 transition-colors duration-150 ${
          isDisabled
            ? 'cursor-not-allowed bg-gray-200 text-gray-400'
            : 'cursor-pointer bg-blue-600 text-white'
        }`}
      >
        {isLoading ? '적용 중...' : '모델 적용'}
      </button>

      {error && (
        <p className="mt-2 text-red-600 text-[13px]">{error}</p>
      )}
    </div>
  );
}
