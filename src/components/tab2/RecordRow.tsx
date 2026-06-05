import type { InspectionRecord } from '../../types/inspection';

interface Props {
  record: InspectionRecord;
}

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  borderBottom: '1px solid #e5e7eb',
};

export function RecordRow({ record }: Props) {
  const isGood = record.verdict === '양품';
  const rowBg = isGood ? '#D6F5DD' : '#FFDDD6';

  return (
    <tr style={{ backgroundColor: rowBg }}>
      <td style={tdStyle}>{record.seq}</td>
      <td style={tdStyle}>{record.inspected_at}</td>
      <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {record.image_name}
      </td>
      <td
        style={{
          ...tdStyle,
          fontWeight: 600,
          color: isGood ? '#166534' : '#991b1b',
        }}
      >
        {record.verdict}
      </td>
      <td style={{ ...tdStyle, fontFamily: 'monospace' }}>
        {record.anomaly_score.toFixed(4)}
      </td>
    </tr>
  );
}
