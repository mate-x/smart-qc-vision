import type { InspectionRecord } from '../../types/inspection';
import { RecordRow } from './RecordRow';

interface Props {
  records: InspectionRecord[];
  isLoading: boolean;
}

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  textAlign: 'left',
  borderBottom: '2px solid #e5e7eb',
  backgroundColor: '#f8fafc',
  whiteSpace: 'nowrap',
};

export function RecordsTable({ records, isLoading }: Props) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}
    >
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={thStyle}>번호</th>
              <th style={thStyle}>시각</th>
              <th style={thStyle}>이미지명</th>
              <th style={thStyle}>판정결과</th>
              <th style={thStyle}>Anomaly Score</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                  로딩 중...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                  아직 검사 기록이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((r) => <RecordRow key={r.seq} record={r} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
