import type { InspectionRecord } from '../../types/inspection';

interface Props {
  allRecords: InspectionRecord[];
}

export function KpiCards({ allRecords }: Props) {
  const total = allRecords.length;
  const good = allRecords.filter((r) => r.verdict === '양품').length;
  const bad = allRecords.filter((r) => r.verdict === '불량').length;
  const defectRate = total === 0 ? '0.0%' : `${((bad / total) * 100).toFixed(1)}%`;

  const cards = [
    { label: '총 검사', value: String(total), colorClass: 'text-blue-600' },
    { label: '양품', value: String(good), colorClass: 'text-green-600' },
    { label: '불량', value: String(bad), colorClass: bad > 0 ? 'text-red-600' : 'text-gray-500' },
    { label: '불량률', value: defectRate, colorClass: bad > 0 ? 'text-red-600' : 'text-gray-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 my-5">
      {cards.map((card) => (
        <div key={card.label} className="p-4 rounded-lg border border-slate-200 bg-white text-center">
          <p className="text-xs text-gray-500 mb-2">{card.label}</p>
          <p className={`text-[26px] font-bold ${card.colorClass}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
