import type { VerdictFilter } from '../../types/inspection';

interface Props {
  value: VerdictFilter;
  onChange: (v: VerdictFilter) => void;
}

const OPTIONS: { value: VerdictFilter; label: string }[] = [
  { value: '전체', label: '전체' },
  { value: '양품', label: '양품만' },
  { value: '불량', label: '불량만' },
];

export function VerdictFilterBar({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '20px', margin: '12px 0' }}>
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#374151',
          }}
        >
          <input
            type="radio"
            name="verdictFilter"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ cursor: 'pointer' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
