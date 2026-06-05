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
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[13px] text-gray-500 mr-1">단위:</span>
        {UNITS.map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`py-[5px] px-3.5 text-[13px] rounded-md border cursor-pointer ${
              selectedUnit === u
                ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                : 'border-gray-300 bg-white text-gray-700 font-normal'
            }`}
          >
            {u}개
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 items-start">
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
