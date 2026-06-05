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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        minHeight: '280px',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          padding: '6px 10px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#6b7280',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!url || imgError ? (
          <ImagePanelPlaceholder label={label} />
        ) : (
          <img
            src={url}
            alt={label}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        )}
      </div>
    </div>
  );
}
