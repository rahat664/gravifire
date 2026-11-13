import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import { challengeComparison, challengeRun } from "@/lib/challenge-engine";
import { getGameScienceContext, resolveGameMissionRunIds, type GameScienceMissionId } from "@/lib/game-science-context";
import type { ScientificChallengeResult } from "@/types/challenge";

/** Audits only verified NASA rows explicitly mapped to the campaign chapter. */
export function resolveAuthoritativeGameAudit(missionId: GameScienceMissionId): ScientificChallengeResult | null {
  const context = getGameScienceContext(missionId);
  if (!context.investigationId) return null;
  const runs = resolveGameMissionRunIds(missionId).map((sourceId) => nasaExperimentRuns.find((run) =>
    run.investigationId === context.investigationId && run.sourceExperimentId === sourceId
  )).filter((run) => Boolean(run));
  if (runs.length === 2) return challengeComparison(runs[0]!, runs[1]!);
  return runs[0] ? challengeRun(runs[0]) : null;
}
