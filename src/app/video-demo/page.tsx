import { loadR7VideoData } from "@/lib/r7/adapter";
import VideoDemoClient from "@/components/video-demo/VideoDemoClient";

export default function VideoDemoPage() {
  return <VideoDemoClient data={loadR7VideoData()} />;
}
