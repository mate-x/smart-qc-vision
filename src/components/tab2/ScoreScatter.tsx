import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { InspectionRecord } from '../../types/inspection';

interface Props {
  records: InspectionRecord[];
  threshold: number;
  title: string;
  selectedUnit: number;
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: { verdict: '양품' | '불량' };
}

function ColoredDot({ cx = 0, cy = 0, payload, index }: DotProps) {
  const color = payload?.verdict === '양품' ? '#2563eb' : '#dc2626';
  return (
    <circle
      key={`dot-${index}`}
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="#fff"
      strokeWidth={1}
    />
  );
}

export function ScoreScatter({ records, threshold, title, selectedUnit }: Props) {
  const data = records.map((r, i) => ({
    idx: i + 1,
    score: r.anomaly_score,
    verdict: r.verdict,
  }));

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
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="idx"
              type="number"
              domain={[1, selectedUnit]}
              label={{ value: '순번', position: 'insideBottom', offset: -12, fontSize: 11 }}
              tick={{ fontSize: 11 }}
              allowDataOverflow={false}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => v.toFixed(1)}
            />
            <Tooltip
              formatter={(value: number) => [value.toFixed(4), 'Score']}
              labelFormatter={(label) => `순번: ${label}`}
            />
            <ReferenceLine
              y={threshold}
              stroke="#dc2626"
              strokeDasharray="4 4"
              label={{ value: `τ=${threshold.toFixed(2)}`, position: 'right', fontSize: 10, fill: '#dc2626' }}
            />
            <Line
              dataKey="score"
              stroke="#cbd5e1"
              strokeWidth={1}
              dot={ColoredDot}
              activeDot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
