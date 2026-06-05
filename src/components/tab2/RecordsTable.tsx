import type { InspectionRecord } from '../../types/inspection';
import { RecordRow } from './RecordRow';

interface Props {
  records: InspectionRecord[];
  isLoading: boolean;
}

const thClass = 'py-2.5 px-3 text-[13px] font-semibold text-gray-700 text-left border-b-2 border-gray-200 bg-slate-50 whitespace-nowrap';

export function RecordsTable({ records, isLoading }: Props) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-[1]">
            <tr>
              <th className={thClass}>번호</th>
              <th className={thClass}>시각</th>
              <th className={thClass}>이미지명</th>
              <th className={thClass}>판정결과</th>
              <th className={thClass}>Anomaly Score</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  로딩 중...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  아직 검사 기록이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((r) => <RecordRow key={r.seq} record={r} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
