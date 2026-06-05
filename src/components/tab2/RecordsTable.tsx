import { useEffect, useState } from 'react';
import type { InspectionRecord } from '../../types/inspection';
import { RecordRow } from './RecordRow';

interface Props {
  records: InspectionRecord[];
  isLoading: boolean;
}

const PAGE_SIZE = 10;

const thClass = 'py-2.5 px-3 text-[13px] font-semibold text-gray-700 text-left border-b-2 border-gray-200 bg-slate-50 whitespace-nowrap';

export function RecordsTable({ records, isLoading }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [records]);

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const pageRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
      <div className="max-h-[226px] overflow-y-auto">
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
              pageRecords.map((r) => <RecordRow key={r.seq} record={r} />)
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 bg-slate-50">
          <span className="text-[12px] text-gray-500">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, records.length)} / {records.length}건
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-2 py-1 text-[12px] rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ‹
            </button>
            <span className="px-2 text-[12px] text-gray-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-2 py-1 text-[12px] rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
