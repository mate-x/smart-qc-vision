import { Link, useLocation } from 'react-router-dom';
import { ModelStatusChip } from './ModelStatusChip';

const TABS = [
  { path: '/', label: '실시간 검사' },
  { path: '/history', label: '검사 이력' },
  { path: '/models', label: '모델 교체' },
];

export function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '52px',
        backgroundColor: '#1e293b',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', gap: '4px' }}>
        {TABS.map(({ path, label }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#334155' : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <ModelStatusChip />
    </nav>
  );
}
