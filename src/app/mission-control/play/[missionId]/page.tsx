import MissionGameLoader from "@/components/mission-control/MissionGameLoader";
import PlayCanvasMissionLoader from "@/components/mission-control/PlayCanvasMissionLoader";
import { isDevelopmentReviewMode } from "@/lib/mission-review";
import { resolveM0ReviewStage, resolveM1ReviewStage, resolveM4ReviewStage, resolveM6ReviewStage, resolveMissionEngine } from "@/lib/mission-route";

export default async function MissionPlayPage({ params, searchParams }: { params: Promise<{ missionId: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { missionId } = await params;
  const query = await searchParams;
  const reviewMode = isDevelopmentReviewMode(process.env.NODE_ENV, query.review);
  const engine = resolveMissionEngine(process.env.NODE_ENV, missionId, query.engine === "r3f-legacy" ? query.engine : undefined);
  if (engine === "PLAYCANVAS_M0") return <PlayCanvasMissionLoader missionId="m0" reviewMode={reviewMode} reviewStage={resolveM0ReviewStage(reviewMode, query.stage)} />;
  if (engine === "PLAYCANVAS_M1") return <PlayCanvasMissionLoader missionId="m1" reviewMode={reviewMode} reviewStage={resolveM1ReviewStage(reviewMode, query.stage)} />;
  if (engine === "PLAYCANVAS_M4") return <PlayCanvasMissionLoader missionId="m4" reviewMode={reviewMode} reviewStage={resolveM4ReviewStage(reviewMode, query.stage)} />;
  if (engine === "PLAYCANVAS_M6") return <PlayCanvasMissionLoader missionId="m6" reviewMode={reviewMode} reviewStage={resolveM6ReviewStage(reviewMode, query.stage)} />;
  return <MissionGameLoader missionId={missionId} reviewMode={reviewMode} />;
}
