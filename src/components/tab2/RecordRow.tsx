import type { InspectionRecord } from '../../types/inspection';

interface Props {
  record: InspectionRecord;
}

const tdClass = 'py-2 px-3 text-[13px] border-b border-gray-200';

export function RecordRow({ record }: Props) {
  const isGood = record.verdict === '양품';

  return (
    <tr className={isGood ? 'bg-[#D6F5DD]' : 'bg-[#FFDDD6]'}>
      <td className={tdClass}>{record.seq}</td>
      <td className={tdClass}>{record.inspected_at}</td>
      <td className={`${tdClass} truncate max-w-[200px]`}>{record.image_name}</td>
      <td className={`${tdClass} font-semibold ${isGood ? 'text-green-800' : 'text-red-800'}`}>
        {record.verdict}
      </td>
      <td className={`${tdClass} font-mono`}>
        {record.anomaly_score.toFixed(4)}
      </td>
    </tr>
  );
}
