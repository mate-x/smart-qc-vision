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
    <div className="flex gap-5 my-3">
      {OPTIONS.map((opt) => (
        <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
          <input
            type="radio"
            name="verdictFilter"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="cursor-pointer"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
