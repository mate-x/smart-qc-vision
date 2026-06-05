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
  const isDisabled =
    !selectedId || selectedId === activeModelId || isLoading;

  const showWarning =
    selectedId !== null && selectedId !== activeModelId && !isLoading;

  return (
    <div>
      {showWarning && (
        <p
          style={{
            fontSize: '13px',
            color: '#92400e',
            backgroundColor: '#fef9c3',
            border: '1px solid #fde047',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '12px',
          }}
        >
          ⚠️ 모델을 교체하면 현재 세션의 모든 검사 이력이 삭제됩니다.
        </p>
      )}

      <button
        onClick={onApply}
        disabled={isDisabled}
        style={{
          padding: '10px 24px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDisabled ? '#e5e7eb' : '#2563eb',
          color: isDisabled ? '#9ca3af' : '#fff',
          transition: 'background-color 0.15s',
        }}
      >
        {isLoading ? '적용 중...' : '모델 적용'}
      </button>

      {error && (
        <p style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
