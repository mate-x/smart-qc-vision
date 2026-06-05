import type { ExperimentRecord } from '../../types/model';

interface Props {
  model: ExperimentRecord;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const tdClass = 'py-2.5 px-3 text-[13px] border-b border-gray-100 align-middle';

export function ModelRow({ model, isActive, isSelected, onClick }: Props) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer outline-none border-l-[3px] ${
        isSelected
          ? 'bg-blue-50 border-l-blue-600'
          : 'bg-white border-l-transparent'
      }`}
    >
      <td className={`${tdClass} text-center w-10`}>
        <input
          type="radio"
          name="model-select"
          checked={isSelected}
          onChange={onClick}
          className="cursor-pointer accent-blue-600 w-4 h-4"
        />
      </td>
      <td className={tdClass}>
        <span className={`mr-1.5 text-gray-900 ${isSelected ? 'font-semibold' : 'font-normal'}`}>
          {model.name ?? model.experiment_id}
        </span>
        {isActive && (
          <span className="py-px px-1.5 rounded-[10px] bg-green-100 text-green-800 text-[11px] font-semibold whitespace-nowrap">
            적용됨
          </span>
        )}
      </td>
      <td className={tdClass}>
        <span className="py-0.5 px-2 rounded bg-slate-100 text-xs text-slate-600">
          {model.model_type}
        </span>
      </td>
      <td className={`${tdClass} font-mono`}>
        {model.metrics.f1_score.toFixed(4)}
      </td>
      <td className={`${tdClass} font-mono`}>
        {model.metrics.auc.toFixed(4)}
      </td>
      <td className={`${tdClass} text-gray-500`}>
        {model.created_at.slice(0, 16)}
      </td>
    </tr>
  );
}
