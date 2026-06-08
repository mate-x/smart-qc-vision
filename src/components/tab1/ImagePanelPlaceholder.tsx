interface Props {
  label: string;
}

export function ImagePanelPlaceholder({ label }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-gray-400 gap-2">
      <div className="text-[32px] opacity-40">🖼</div>
      <span className="text-[13px]">{label}</span>
    </div>
  );
}
