import { ImagePanel } from './ImagePanel';

interface Props {
  url: string | null;
}

export function AnomalyMapPanel({ url }: Props) {
  return <ImagePanel url={url} label="Anomaly Map" />;
}
