import type { ExperimentRecord } from '../../types/model';
import { ModelRow } from './ModelRow';

interface Props {
  models: ExperimentRecord[];
  isLoading: boolean;
  activeModelId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
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

export function ModelTable({
  models,
  isLoading,
  activeModelId,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>실험명</th>
            <th style={thStyle}>모델타입</th>
            <th style={thStyle}>F1</th>
            <th style={thStyle}>AUC</th>
            <th style={thStyle}>실행시각</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>상태</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}
              >
                로딩 중...
              </td>
            </tr>
          ) : models.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}
              >
                사용 가능한 완료된 실험이 없습니다.
              </td>
            </tr>
          ) : (
            models.map((m) => (
              <ModelRow
                key={m.experiment_id}
                model={m}
                isActive={m.experiment_id === activeModelId}
                isSelected={m.experiment_id === selectedId}
                onClick={() => onSelect(m.experiment_id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
