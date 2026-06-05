import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useInspectionStore } from '../../store/inspectionStore';

interface Props {
  children: ReactNode;
}

export function NoModelGuard({ children }: Props) {
  const activeModel = useInspectionStore((s) => s.activeModel);

  if (activeModel !== null) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-gray-500">
      <p className="text-[15px]">
        검사에 사용할 모델이 선택되지 않았습니다.
      </p>
      <Link to="/models" className="text-blue-600 underline text-sm">
        모델 교체 탭에서 모델을 선택하세요 →
      </Link>
    </div>
  );
}
