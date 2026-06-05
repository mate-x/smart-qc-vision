import { ImagePanel } from './ImagePanel';

interface Props {
  url: string | null;
  aspectRatio?: number | null;
}

export function OverlayPanel({ url, aspectRatio }: Props) {
  return <ImagePanel url={url} label="이상 영역 오버레이" aspectRatio={aspectRatio} />;
}
