import type { MissionScenarioKind } from "@/types/applicability";

export type GameScienceMissionId = "m0" | "m1" | "m4" | "m6";
export type GameScienceObjective = "PREVENTION" | "DETECTION" | "SUPPRESSION";

export type GameScienceContext = {
  missionId: GameScienceMissionId;
  environment: MissionScenarioKind;
  objective: GameScienceObjective;
  investigationId?: string;
  question?: string;
  recordId?: string;
  comparisonIds?: readonly string[];
  notice: string;
};

const contexts: Record<GameScienceMissionId, GameScienceContext> = {
  m0: {
    missionId: "m0", environment: "SPACECRAFT", objective: "DETECTION",
    question: "smoke aerosol detection sensor",
    notice: "M0 is a fictional ISV Vesta alarm scenario. No NASA record represents this event; use the NASA sources below as independent context only.",
  },
  m1: {
    missionId: "m1", environment: "SPACECRAFT", objective: "PREVENTION", investigationId: "saffire-i",
    question: "SIBAL fabric flame spread flow direction",
    comparisonIds: ["S1", "S2"], recordId: "S1",
    notice: "The ISV Vesta campaign is fictional. PSI-98 S1 and S2 are real NASA SAFFIRE-I records, not events aboard Vesta.",
  },
  m4: {
    missionId: "m4", environment: "SPACECRAFT", objective: "PREVENTION", investigationId: "saffire-ii",
    question: "silicone material flame propagation microgravity",
    recordId: "2-1",
    notice: "The Aegis gasket scenario is fictional. PSI-99 silicone records are real NASA evidence; they do not certify other silicone products or applications.",
  },
  m6: {
    missionId: "m6", environment: "MARS_HABITAT", objective: "SUPPRESSION", investigationId: "flex",
    question: "droplet combustion extinction suppressant",
    recordId: "2",
    notice: "The Mars habitat review is hypothetical. FLEX records are microgravity evidence and do not validate Martian partial-gravity outcomes.",
  },
};

export function getGameScienceContext(missionId: GameScienceMissionId): GameScienceContext {
  return contexts[missionId];
}

export function gameScienceDashboardHref(missionId: GameScienceMissionId): string {
  const context = contexts[missionId];
  const params = new URLSearchParams({
    mission: context.environment,
    objective: context.objective,
    gameMission: context.missionId,
  });
  if (context.investigationId) params.set("investigation", context.investigationId);
  if (context.question) params.set("question", context.question);
  if (context.recordId) params.set("record", context.recordId);
  return `/dashboard?${params.toString()}`;
}

export function resolveGameMissionRunIds(missionId: GameScienceMissionId): readonly string[] {
  return contexts[missionId].comparisonIds ?? (contexts[missionId].recordId ? [contexts[missionId].recordId!] : []);
}

