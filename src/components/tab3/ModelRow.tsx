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
      <td style={{ ...tdStyle, textAlign: 'center', width: '40px' }}>
        <input
          type="radio"
          name="model-select"
          checked={isSelected}
          onChange={onClick}
          style={{ cursor: 'pointer', accentColor: '#2563eb', width: '16px', height: '16px' }}
        />
      </td>
      <td style={tdStyle}>
        <span style={{ color: '#111827', fontWeight: isSelected ? 600 : 400, marginRight: '6px' }}>
          {model.name ?? model.experiment_id}
        </span>
        {isActive && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            적용됨
          </span>
        )}
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
    </tr>
  );
}
