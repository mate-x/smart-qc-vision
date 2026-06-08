import type { ExperimentRecord } from '../../types/model';
import { ModelRow } from './ModelRow';

interface Props {
  models: ExperimentRecord[];
  isLoading: boolean;
  activeModelId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const thClass = 'py-2.5 px-3 text-[13px] font-semibold text-gray-700 text-left border-b-2 border-gray-200 bg-slate-50 whitespace-nowrap';

export function ModelTable({
  models,
  isLoading,
  activeModelId,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-5">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={`${thClass} text-center w-10`}></th>
            <th className={thClass}>실험명</th>
            <th className={thClass}>검사 제품</th>
            <th className={thClass}>모델타입</th>
            <th className={thClass}>F1</th>
            <th className={thClass}>AUC</th>
            <th className={thClass}>실행시각</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400">
                로딩 중...
              </td>
            </tr>
          ) : models.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400">
                사용 가능한 완료된 실험이 없습니다.
              </td>
            </tr>
          ) : (
            models.map((m) => (
              <ModelRow
                key={m.experiment_id}
                model={m}
                isActive={m.experiment_id === activeModelId}
                isSelected={m.experiment_id === selectedId}
                onClick={() => onSelect(m.experiment_id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
