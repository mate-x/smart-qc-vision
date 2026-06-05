import type { InspectionResult } from '../../types/inspection';

interface Props {
  result: InspectionResult | null;
}

export function VerdictCard({ result }: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '280px',
    borderRadius: '8px',
    border: '1px solid',
    padding: '24px 12px',
    gap: '8px',
  };

  if (!result) {
    return (
      <div
        style={{
          ...containerStyle,
          backgroundColor: '#f8fafc',
          borderColor: '#e2e8f0',
          color: '#9ca3af',
        }}
      >
        <p style={{ fontSize: '13px', textAlign: 'center' }}>
          검사 버튼을 눌러 시작하세요.
        </p>
      </div>
    );
  }

  const isGood = result.verdict === '양품';

  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: isGood ? '#f0fdf4' : '#fff1f2',
        borderColor: isGood ? '#86efac' : '#fca5a5',
      }}
    >
      <span style={{ fontSize: '40px' }}>{isGood ? '✅' : '❌'}</span>
      <span
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: isGood ? '#166534' : '#991b1b',
        }}
      >
        {result.verdict}
      </span>
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
          Anomaly Score
        </p>
        <p
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: isGood ? '#166534' : '#991b1b',
          }}
        >
          {result.anomaly_score.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
