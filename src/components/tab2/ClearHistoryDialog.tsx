interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const btnBase: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};

export function ClearHistoryDialog({ onConfirm, onCancel }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '380px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
            이력 초기화
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            이력을 초기화하면 모든 검사 기록이 삭제됩니다.
          </p>
        </div>
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            style={{ ...btnBase, backgroundColor: '#f3f4f6', color: '#374151' }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            style={{ ...btnBase, backgroundColor: '#dc2626', color: '#fff' }}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
