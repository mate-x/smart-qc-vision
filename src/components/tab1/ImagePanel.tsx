import { useState, useEffect } from 'react';
import { ImagePanelPlaceholder } from './ImagePanelPlaceholder';

interface Props {
  url: string | null;
  label: string;
}

export function ImagePanel({ url, label }: Props) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (url) setImgError(false);
  }, [url]);

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 overflow-hidden min-h-[280px] bg-white">
      <div className="py-1.5 px-2.5 text-xs font-medium text-gray-500 border-b border-slate-200 bg-slate-50 shrink-0">
        {label}
      </div>
      <div className="flex-1 relative overflow-hidden">
        {!url || imgError ? (
          <ImagePanelPlaceholder label={label} />
        ) : (
          <img
            src={url}
            alt={label}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain block"
          />
        )}
      </div>
    </div>
  );
}
