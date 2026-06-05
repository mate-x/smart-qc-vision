export function AutoRunningBanner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        marginBottom: '16px',
        backgroundColor: '#fef9c3',
        border: '1px solid #fde047',
        borderRadius: '8px',
        color: '#713f12',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      🔄 자동 검사 진행 중...
    </div>
  );
}
