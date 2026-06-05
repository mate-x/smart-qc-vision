import type { TimeGroup } from '../../hooks/useStatCharts';

interface Props {
  groups: TimeGroup[];
  selectedGroupIndex: number;
  onSelect: (index: number) => void;
}

const thBase = 'py-2 px-3 text-xs font-semibold text-gray-700 border-b-2 border-gray-200 bg-slate-50 sticky top-0';
const tdBase = 'py-2 px-3 text-xs text-gray-700 border-b border-gray-100';

export function TimeRangeTable({ groups, selectedGroupIndex, onSelect }: Props) {
  if (groups.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 text-[13px] border border-slate-200 rounded-lg bg-slate-50">
        데이터 없음
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden h-full">
      <div className="overflow-y-auto max-h-[300px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${thBase} text-left`}>시간 범위</th>
              <th className={`${thBase} text-right`}>건수</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const isSelected = g.index === selectedGroupIndex;
              return (
                <tr
                  key={g.index}
                  onClick={() => onSelect(g.index)}
                  className={`cursor-pointer border-l-[3px] ${
                    isSelected ? 'bg-blue-50 border-l-blue-600' : 'bg-white border-l-transparent'
                  }`}
                >
                  <td className={tdBase}>
                    {g.label}
                    {g.isPartial && (
                      <span className="ml-1 text-gray-400 text-[11px]">(진행)</span>
                    )}
                  </td>
                  <td className={`${tdBase} text-right`}>{g.records.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
