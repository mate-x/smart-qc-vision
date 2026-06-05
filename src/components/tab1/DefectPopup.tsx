interface Props {
  onResume: () => void;
  onClose: () => void;
}

const btnBase: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
};

export function DefectPopup({ onResume, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
          overflow: 'hidden',
          width: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#fee2e2',
            borderBottom: '1px solid #fca5a5',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#991b1b' }}>
            ❌ 불량이 감지되었습니다! 자동 검사가 중지되었습니다.
          </p>
        </div>
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              ...btnBase,
              backgroundColor: '#f3f4f6',
              color: '#374151',
            }}
          >
            🛑 검사 종료
          </button>
          <button
            onClick={onResume}
            style={{
              ...btnBase,
              backgroundColor: '#16a34a',
              color: '#fff',
            }}
          >
            ✅ 확인 및 재개
          </button>
        </div>
      </div>
    </div>
  );
}
