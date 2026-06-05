import { ImagePanel } from './ImagePanel';

interface Props {
  url: string | null;
}

export function OverlayPanel({ url }: Props) {
  return <ImagePanel url={url} label="이상 영역 오버레이" />;
}
