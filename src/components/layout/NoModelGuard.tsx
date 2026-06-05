import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/inspectionStore';

interface Props {
  children: ReactNode;
}

export function NoModelGuard({ children }: Props) {
  const activeModel = useInspectionStore((s) => s.activeModel);
  const navigate = useNavigate();

  if (activeModel !== null) return <>{children}</>;

  return (
    <>
      {children}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
        <div className="bg-white rounded-xl w-[380px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="py-5 px-6 border-b border-gray-200">
            <p className="text-[15px] font-semibold text-gray-900 mb-2">모델 미선택</p>
            <p className="text-sm text-gray-500">
              검사에 사용할 모델이 선택되지 않았습니다.
              <br />
              설정 페이지에서 모델을 먼저 선택해 주세요.
            </p>
          </div>
          <div className="py-4 px-6 flex justify-end">
            <button
              onClick={() => navigate('/settings')}
              className="py-2 px-5 rounded-md text-sm font-medium border-0 cursor-pointer bg-gray-800 text-white"
            >
              설정 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
