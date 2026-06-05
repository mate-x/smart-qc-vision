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
      {/* 헤더 행 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>검사 이력</h2>
        <button
          onClick={downloadCsv}
          disabled={allRecords.length === 0}
          style={{
            padding: '7px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid #d1d5db',
            backgroundColor: allRecords.length === 0 ? '#f9fafb' : '#fff',
            color: allRecords.length === 0 ? '#9ca3af' : '#374151',
            cursor: allRecords.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          📥 CSV 내보내기
        </button>
      </div>

      <VerdictFilterBar value={verdictFilter} onChange={setVerdictFilter} />

      <RecordsTable records={filteredRecords} isLoading={isLoading} />

      <KpiCards allRecords={allRecords} />

      <StatCharts allRecords={allRecords} threshold={threshold} />

      {/* 이력 초기화 버튼 */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowClearDialog(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid #fca5a5',
            backgroundColor: '#fff1f2',
            color: '#dc2626',
            cursor: 'pointer',
          }}
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
