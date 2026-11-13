import PlayCanvasMissionLoader from "@/components/mission-control/PlayCanvasMissionLoader";
import { isDevelopmentReviewMode } from "@/lib/mission-review";
import { resolveM1ReviewStage } from "@/lib/mission-route";

export default async function PlayCanvasM1Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const reviewMode = isDevelopmentReviewMode(process.env.NODE_ENV, query.review);
  return <PlayCanvasMissionLoader missionId="m1" reviewMode={reviewMode} reviewStage={resolveM1ReviewStage(reviewMode, query.stage)} />;
}
