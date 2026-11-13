import type { Metadata } from "next";
import ChallengeDashboard from "@/components/dashboard/ChallengeDashboard";
import type { MissionScenarioKind } from "@/types/applicability";
import type { GameScienceMissionId } from "@/lib/game-science-context";

const missionTypes: MissionScenarioKind[] = ["SPACECRAFT", "LUNAR_HABITAT", "MARS_HABITAT", "PRESSURIZED_ROVER"];
const objectives = ["PREVENTION", "DETECTION", "SUPPRESSION"] as const;
const gameMissions: GameScienceMissionId[] = ["m0", "m1", "m4", "m6"];
function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export const metadata: Metadata = {
  title: "Mission Fire Evidence Dashboard | GRAVIFIRE",
  description: "Explore NASA combustion investigations, inspect source records, and compare reported experiment conditions with mission environments.",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const mission = first(params.mission);
  const objective = first(params.objective);
  const gameMission = first(params.gameMission);
  return <ChallengeDashboard
    initialMission={missionTypes.includes(mission as MissionScenarioKind) ? mission as MissionScenarioKind : undefined}
    initialObjective={objectives.includes(objective as typeof objectives[number]) ? objective as typeof objectives[number] : undefined}
    initialInvestigationId={first(params.investigation) ?? null}
    initialRecordId={first(params.record)}
    initialQuestion={first(params.question)}
    gameMission={gameMissions.includes(gameMission as GameScienceMissionId) ? gameMission as GameScienceMissionId : null}
  />;
}
