import { useState } from 'react';
import { useInspectionStore } from '../store/inspectionStore';
import { useInspectionRecords } from '../hooks/useInspectionRecords';
import { NoModelGuard } from '../components/layout/NoModelGuard';
import { VerdictFilterBar } from '../components/tab2/VerdictFilter';
import { RecordsTable } from '../components/tab2/RecordsTable';
import { KpiCards } from '../components/tab2/KpiCards';
import { StatCharts } from '../components/tab2/StatCharts';
import { ClearHistoryDialog } from '../components/tab2/ClearHistoryDialog';

export default function Tab2History() {
  const activeModel = useInspectionStore((s) => s.activeModel);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const {
    allRecords,
    filteredRecords,
    isLoading,
    verdictFilter,
    setVerdictFilter,
    clearRecords,
    downloadCsv,
  } = useInspectionRecords();

  const threshold = activeModel?.threshold ?? 0;

  const handleClearConfirm = async () => {
    await clearRecords();
    setShowClearDialog(false);
  };

  return (
    <NoModelGuard>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">검사 이력</h2>
        <button
          onClick={downloadCsv}
          disabled={allRecords.length === 0}
          className={`py-[7px] px-4 rounded-md text-[13px] font-medium border border-gray-300 ${
            allRecords.length === 0
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 cursor-pointer'
          }`}
        >
          📥 CSV 내보내기
        </button>
      </div>

      <VerdictFilterBar value={verdictFilter} onChange={setVerdictFilter} />

      <RecordsTable records={filteredRecords} isLoading={isLoading} />

      <KpiCards allRecords={allRecords} />

      <StatCharts allRecords={allRecords} threshold={threshold} />

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowClearDialog(true)}
          className="py-2 px-4 rounded-md text-[13px] font-medium border border-red-300 bg-red-50 text-red-600 cursor-pointer"
        >
          🗑 이력 초기화
        </button>
      </div>

      {showClearDialog && (
        <ClearHistoryDialog
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearDialog(false)}
        />
      )}
    </NoModelGuard>
  );
}
