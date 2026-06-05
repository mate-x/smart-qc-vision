import type { TimeGroup } from '../../hooks/useStatCharts';

interface Props {
  groups: TimeGroup[];
  selectedGroupIndex: number;
  onSelect: (index: number) => void;
}

export function TimeRangeTable({ groups, selectedGroupIndex, onSelect }: Props) {
  if (groups.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#f8fafc',
        }}
      >
        데이터 없음
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#374151',
                  textAlign: 'left',
                  borderBottom: '2px solid #e5e7eb',
                  backgroundColor: '#f8fafc',
                  position: 'sticky',
                  top: 0,
                }}
              >
                시간 범위
              </th>
              <th
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#374151',
                  textAlign: 'right',
                  borderBottom: '2px solid #e5e7eb',
                  backgroundColor: '#f8fafc',
                  position: 'sticky',
                  top: 0,
                }}
              >
                건수
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const isSelected = g.index === selectedGroupIndex;
              return (
                <tr
                  key={g.index}
                  onClick={() => onSelect(g.index)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#eff6ff' : '#fff',
                    borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
                  }}
                >
                  <td
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#374151',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {g.label}
                    {g.isPartial && (
                      <span style={{ marginLeft: '4px', color: '#9ca3af', fontSize: '11px' }}>
                        (진행)
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#374151',
                      textAlign: 'right',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {g.records.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
