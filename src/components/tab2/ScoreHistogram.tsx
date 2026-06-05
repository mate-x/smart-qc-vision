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
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {title}
      </p>
      {records.length === 0 ? (
        <div
          style={{
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '13px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
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
