import type { ExperimentRecord } from '../../types/model';

interface Props {
  model: ExperimentRecord;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '13px',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'middle',
};

export function ModelRow({ model, isActive, isSelected, onClick }: Props) {
  return (
    <tr
      onClick={onClick}
      style={{
        cursor: 'pointer',
        backgroundColor: isSelected ? '#eff6ff' : '#fff',
        borderLeft: `3px solid ${isSelected ? '#2563eb' : 'transparent'}`,
        outline: 'none',
      }}
    >
      <td style={tdStyle}>
        <span style={{ color: '#111827', fontWeight: isSelected ? 600 : 400 }}>
          {model.name ?? model.experiment_id}
        </span>
      </td>
      <td style={tdStyle}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#f1f5f9',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          {model.model_type}
        </span>
      </td>
      <td style={{ ...tdStyle, fontFamily: 'monospace' }}>
        {model.metrics.f1_score.toFixed(4)}
      </td>
      <td style={{ ...tdStyle, fontFamily: 'monospace' }}>
        {model.metrics.auc.toFixed(4)}
      </td>
      <td style={{ ...tdStyle, color: '#6b7280' }}>
        {model.created_at.slice(0, 16)}
      </td>
      <td style={{ ...tdStyle, textAlign: 'center' }}>
        {isActive && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            ✅ 현재
          </span>
        )}
      </td>
    </tr>
  );
}
