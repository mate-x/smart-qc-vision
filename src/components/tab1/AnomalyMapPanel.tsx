import { ImagePanel } from './ImagePanel';

interface Props {
  url: string | null;
  aspectRatio?: number | null;
}

export function AnomalyMapPanel({ url, aspectRatio }: Props) {
  return <ImagePanel url={url} label="Anomaly Map" aspectRatio={aspectRatio} />;
}
