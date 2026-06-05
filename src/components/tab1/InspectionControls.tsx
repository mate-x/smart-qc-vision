interface Props {
  isAutoRunning: boolean;
  isLoading: boolean;
  error: string | null;
  onManual: () => void;
  onStart: () => void;
  onStop: () => void;
}

const btnBase: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

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
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onManual}
          disabled={allDisabled || isAutoRunning}
          style={{
            ...btnBase,
            backgroundColor: '#2563eb',
            color: '#fff',
            opacity: allDisabled || isAutoRunning ? 0.5 : 1,
            cursor: allDisabled || isAutoRunning ? 'not-allowed' : 'pointer',
          }}
        >
          🔍 수동 검사 (1개 검사)
        </button>

        <button
          onClick={onStart}
          disabled={allDisabled || isAutoRunning}
          style={{
            ...btnBase,
            backgroundColor: '#16a34a',
            color: '#fff',
            opacity: allDisabled || isAutoRunning ? 0.5 : 1,
            cursor: allDisabled || isAutoRunning ? 'not-allowed' : 'pointer',
          }}
        >
          ▶ 자동 검사 (3초마다 1개)
        </button>

        <button
          onClick={onStop}
          disabled={allDisabled || !isAutoRunning}
          style={{
            ...btnBase,
            backgroundColor: '#dc2626',
            color: '#fff',
            opacity: allDisabled || !isAutoRunning ? 0.5 : 1,
            cursor: allDisabled || !isAutoRunning ? 'not-allowed' : 'pointer',
          }}
        >
          ⏹ 자동 검사 중지
        </button>
      </div>

      {isLoading && (
        <p style={{ marginTop: '8px', color: '#6b7280', fontSize: '13px' }}>
          ⏳ 검사 중... 잠시 기다려 주세요
        </p>
      )}
      {error && (
        <p style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
