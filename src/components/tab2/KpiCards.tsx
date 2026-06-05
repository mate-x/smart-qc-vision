import type { InspectionRecord } from '../../types/inspection';

interface Props {
  allRecords: InspectionRecord[];
}

export function KpiCards({ allRecords }: Props) {
  const total = allRecords.length;
  const good = allRecords.filter((r) => r.verdict === '양품').length;
  const bad = allRecords.filter((r) => r.verdict === '불량').length;
  const defectRate =
    total === 0 ? '0.0%' : `${((bad / total) * 100).toFixed(1)}%`;

  const cards = [
    { label: '총 검사', value: String(total), color: '#2563eb' },
    { label: '양품', value: String(good), color: '#16a34a' },
    { label: '불량', value: String(bad), color: bad > 0 ? '#dc2626' : '#6b7280' },
    { label: '불량률', value: defectRate, color: bad > 0 ? '#dc2626' : '#6b7280' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        margin: '20px 0',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            {card.label}
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: card.color }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
