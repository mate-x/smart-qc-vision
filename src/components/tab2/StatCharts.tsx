import type { InspectionRecord } from '../../types/inspection';
import { useStatCharts } from '../../hooks/useStatCharts';
import { TimeRangeTable } from './TimeRangeTable';
import { ScoreHistogram } from './ScoreHistogram';
import { ScoreScatter } from './ScoreScatter';

interface Props {
  allRecords: InspectionRecord[];
  threshold: number;
}

const UNITS = [20, 40, 100] as const;

const unitBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  fontSize: '13px',
  borderRadius: '6px',
  border: `1px solid ${active ? '#2563eb' : '#d1d5db'}`,
  backgroundColor: active ? '#2563eb' : '#fff',
  color: active ? '#fff' : '#374151',
  cursor: 'pointer',
  fontWeight: active ? 600 : 400,
});

export function StatCharts({ allRecords, threshold }: Props) {
  const {
    selectedUnit,
    setUnit,
    groups,
    selectedGroupIndex,
    setSelectedGroupIndex,
    selectedGroupRecords,
  } = useStatCharts({ allRecords });

  const selectedLabel = groups[selectedGroupIndex]?.label ?? '';

  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '13px', color: '#6b7280', marginRight: '4px' }}>단위:</span>
        {UNITS.map((u) => (
          <button key={u} onClick={() => setUnit(u)} style={unitBtnStyle(selectedUnit === u)}>
            {u}개
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 2fr',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        <TimeRangeTable
          groups={groups}
          selectedGroupIndex={selectedGroupIndex}
          onSelect={setSelectedGroupIndex}
        />
        <ScoreHistogram
          records={selectedGroupRecords}
          threshold={threshold}
          title={`Anomaly Score 분포 — ${selectedLabel}`}
        />
        <ScoreScatter
          records={selectedGroupRecords}
          threshold={threshold}
          title={`Anomaly Score 추이 — ${selectedLabel}`}
          selectedUnit={selectedUnit}
        />
      </div>
    </div>
  );
}
