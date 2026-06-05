interface Props {
  label: string;
}

export function ImagePanelPlaceholder({ label }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#9ca3af',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '32px', opacity: 0.4 }}>🖼</div>
      <span style={{ fontSize: '13px' }}>{label}</span>
    </div>
  );
}
