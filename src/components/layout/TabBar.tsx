import { Link, useLocation } from 'react-router-dom';
import { ModelStatusChip } from './ModelStatusChip';

const TABS = [
  { path: '/', label: '실시간 검사' },
  { path: '/history', label: '검사 이력' },
  { path: '/models', label: '⚙️설정' },
];

export function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center justify-between px-6 h-13 bg-slate-800 shrink-0">
      <div className="flex gap-1">
        {TABS.map(({ path, label }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`py-1.5 px-4 rounded-md text-sm no-underline transition-colors duration-150 ${
                isActive
                  ? 'font-semibold text-white bg-slate-700'
                  : 'font-normal text-slate-400 bg-transparent'
              }`}
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
