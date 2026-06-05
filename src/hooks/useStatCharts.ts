import { useState, useRef, useEffect, useMemo } from 'react';
import type { InspectionRecord } from '../types/inspection';

export interface TimeGroup {
  index: number;
  label: string;
  records: InspectionRecord[];
  isPartial: boolean;
}

type Unit = 20 | 40 | 100;

function makeLabel(records: InspectionRecord[]): string {
  if (records.length === 0) return '';
  const first = records[0].inspected_at;
  const last = records[records.length - 1].inspected_at;
  const date = first.substring(0, 10);        // "YYYY-MM-DD"
  const startTime = first.substring(11, 16);  // "HH:MM"
  const endTime = last.substring(11, 16);     // "HH:MM"
  return `${date} ${startTime}~${endTime}`;
}

function chunkByN(records: InspectionRecord[], n: number): TimeGroup[] {
  if (records.length === 0) return [];
  const groups: TimeGroup[] = [];
  for (let i = 0; i < records.length; i += n) {
    const chunk = records.slice(i, i + n);
    groups.push({
      index: groups.length,
      label: makeLabel(chunk),
      records: chunk,
      isPartial: chunk.length < n,
    });
  }
  return groups;
}

interface UseStatChartsInput {
  allRecords: InspectionRecord[];
}

export function useStatCharts({ allRecords }: UseStatChartsInput) {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(20);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const prevUnitRef = useRef<Unit>(20);

  // impl_notes.md: records는 최신순(내림차순) 수신 → 오름차순 정렬 후 그룹핑
  const sortedRecords = useMemo(
    () => [...allRecords].sort((a, b) => a.seq - b.seq),
    [allRecords],
  );

  const groups = useMemo(
    () => chunkByN(sortedRecords, selectedUnit),
    [sortedRecords, selectedUnit],
  );

  // selectedUnit 변경 시 → 마지막 그룹으로 리셋
  // allRecords 변경 시 → 현재 인덱스 유지 (범위 초과 시 클램프)
  useEffect(() => {
    const unitChanged = prevUnitRef.current !== selectedUnit;
    prevUnitRef.current = selectedUnit;

    if (unitChanged) {
      setSelectedGroupIndex(groups.length > 0 ? groups.length - 1 : 0);
    } else {
      setSelectedGroupIndex((prev) =>
        groups.length === 0 ? 0 : Math.min(prev, groups.length - 1),
      );
    }
  }, [selectedUnit, groups]);

  const selectedGroupRecords = groups[selectedGroupIndex]?.records ?? [];

  return {
    selectedUnit,
    setUnit: setSelectedUnit,
    groups,
    selectedGroupIndex,
    setSelectedGroupIndex,
    selectedGroupRecords,
  };
}
