import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { InspectionRecord } from '../../types/inspection';

interface Props {
  records: InspectionRecord[];
  threshold: number;
  title: string;
}

function buildBins(records: InspectionRecord[]) {
  const bins = Array.from({ length: 10 }, (_, i) => ({
    range: (i / 10).toFixed(1),
    양품: 0,
    불량: 0,
  }));
  records.forEach((r) => {
    const idx = Math.min(Math.floor(r.anomaly_score * 10), 9);
    if (r.verdict === '양품') bins[idx].양품++;
    else bins[idx].불량++;
  });
  return bins;
}

export function ScoreHistogram({ records, threshold, title }: Props) {
  const data = buildBins(records);
  // 카테고리 x축이므로 threshold가 속한 bin 레이블로 스냅
  const thresholdBin = (Math.floor(threshold * 10) / 10).toFixed(1);

  return (
    <div>
      <p className="text-[13px] font-semibold text-gray-700 mb-2 text-center">{title}</p>
      {records.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-gray-400 text-[13px] border border-slate-200 rounded-lg">
          데이터 없음
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="range"
              label={{ value: 'Score', position: 'insideBottom', offset: -12, fontSize: 11 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Legend verticalAlign="top" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              x={thresholdBin}
              stroke="#6b7280"
              strokeDasharray="4 4"
              label={{ value: `τ=${threshold.toFixed(2)}`, position: 'top', fontSize: 10, fill: '#6b7280' }}
            />
            <Bar dataKey="양품" fill="#2563eb" maxBarSize={24} />
            <Bar dataKey="불량" fill="#dc2626" maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
