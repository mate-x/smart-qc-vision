interface Props {
  onResume: () => void;
  onClose: () => void;
}

const btnBase = 'py-2.5 px-6 rounded-md text-sm font-semibold border-0 cursor-pointer';

export function DefectPopup({ onResume, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl overflow-hidden w-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
        <div className="py-5 px-6 bg-red-100 border-b border-red-300">
          <p className="text-base font-bold text-red-800">
            ❌ 불량이 감지되었습니다! 자동 검사가 중지되었습니다.
          </p>
        </div>
        <div className="py-5 px-6 flex gap-3 justify-end">
          <button onClick={onClose} className={`${btnBase} bg-gray-100 text-gray-700`}>
            🛑 검사 종료
          </button>
          <button onClick={onResume} className={`${btnBase} bg-green-600 text-white`}>
            ✅ 확인 및 재개
          </button>
        </div>
      </div>
    </div>
  );
}
