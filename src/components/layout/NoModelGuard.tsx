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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '48px 24px',
        color: '#6b7280',
      }}
    >
      <p style={{ fontSize: '15px' }}>
        검사에 사용할 모델이 선택되지 않았습니다.
      </p>
      <Link
        to="/models"
        style={{
          color: '#2563eb',
          textDecoration: 'underline',
          fontSize: '14px',
        }}
      >
        모델 교체 탭에서 모델을 선택하세요 →
      </Link>
    </div>
  );
}
