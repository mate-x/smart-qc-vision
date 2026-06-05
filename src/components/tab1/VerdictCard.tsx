import type { InspectionResult } from '../../types/inspection';

interface Props {
  result: InspectionResult | null;
}

const baseClass = 'flex flex-col items-center justify-center h-full min-h-[280px] rounded-lg border py-6 px-3 gap-2';

export function VerdictCard({ result }: Props) {
  if (!result) {
    return (
      <div className={`${baseClass} bg-slate-50 border-slate-200 text-gray-400`}>
        <p className="text-[13px] text-center">검사 버튼을 눌러 시작하세요.</p>
      </div>
    );
  }

  const isGood = result.verdict === '양품';

  return (
    <div className={`${baseClass} ${isGood ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
      <span className="text-[40px]">{isGood ? '✅' : '❌'}</span>
      <span className={`text-[22px] font-bold ${isGood ? 'text-green-800' : 'text-red-800'}`}>
        {result.verdict}
      </span>
      <div className="mt-3 text-center">
        <p className="text-[11px] text-gray-500 mb-1">Anomaly Score</p>
        <p className={`text-xl font-semibold ${isGood ? 'text-green-800' : 'text-red-800'}`}>
          {result.anomaly_score.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
