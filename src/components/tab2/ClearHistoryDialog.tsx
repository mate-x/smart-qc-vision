interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const btnBase = 'py-2 px-5 rounded-md text-sm font-medium border-0 cursor-pointer';

export function ClearHistoryDialog({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl w-[380px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="py-5 px-6 border-b border-gray-200">
          <p className="text-[15px] font-semibold text-gray-900 mb-2">이력 초기화</p>
          <p className="text-sm text-gray-500">이력을 초기화하면 모든 검사 기록이 삭제됩니다.</p>
        </div>
        <div className="py-4 px-6 flex gap-2.5 justify-end">
          <button onClick={onCancel} className={`${btnBase} bg-gray-100 text-gray-700`}>
            취소
          </button>
          <button onClick={onConfirm} className={`${btnBase} bg-red-600 text-white`}>
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
