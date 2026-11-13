export const missionPhysicalRoutes = {
  m0: ["CREW CORRIDOR", "INCIDENT BAY", "ARCHIVE TERMINAL"],
  m1: ["PREPARATION BAY", "SAFFIRE REPLAY CHAMBER", "COMPARISON ROOM"],
  m4: ["MATERIAL STORAGE", "GROUND REFERENCE BAY", "LOW-g FLIGHT RECORD BAY", "SAMPLE ANALYSIS WALL"],
  m6: ["MANIFEST CONTROL ROOM", "EVIDENCE ASSEMBLY WALL", "TRANSITION AIRLOCK", "EXPLORATION CORRIDOR", "MARS BOUNDARY DOOR"]
} as const;

export type MissionEngine = "PLAYCANVAS_M0" | "PLAYCANVAS_M1" | "PLAYCANVAS_M4" | "PLAYCANVAS_M6" | "R3F_LEGACY" | "R3F_CAMPAIGN";

export function resolveMissionEngine(nodeEnv: string | undefined, missionId: string, requestedEngine?: string): MissionEngine {
  if (missionId === "m0") {
    if (nodeEnv !== "production" && requestedEngine === "r3f-legacy") return "R3F_LEGACY";
    return "PLAYCANVAS_M0";
  }
  if (missionId === "m1") {
    if (nodeEnv !== "production" && requestedEngine === "r3f-legacy") return "R3F_LEGACY";
    return "PLAYCANVAS_M1";
  }
  if (missionId === "m4") {
    if (nodeEnv !== "production" && requestedEngine === "r3f-legacy") return "R3F_LEGACY";
    return "PLAYCANVAS_M4";
  }
  if (missionId === "m6") {
    if (nodeEnv !== "production" && requestedEngine === "r3f-legacy") return "R3F_LEGACY";
    return "PLAYCANVAS_M6";
  }
  return "R3F_CAMPAIGN";
}

export function resolveM0ReviewStage(reviewMode: boolean, value: string | string[] | undefined): "corridor" | "incident" | "response" | "archive" | undefined {
  if (!reviewMode || Array.isArray(value)) return undefined;
  return value === "corridor" || value === "incident" || value === "response" || value === "archive" ? value : undefined;
}

export function resolveM1ReviewStage(reviewMode: boolean, value: string | string[] | undefined): "replay" | "analysis" | undefined {
  if (!reviewMode || Array.isArray(value)) return undefined;
  return value === "replay" || value === "analysis" ? value : undefined;
}

export function resolveM4ReviewStage(reviewMode: boolean, value: string | string[] | undefined): "material" | "ground" | "lowg" | "samples" | "analysis" | undefined {
  if (!reviewMode || Array.isArray(value)) return undefined;
  return value === "material" || value === "ground" || value === "lowg" || value === "samples" || value === "analysis" ? value : undefined;
}

export function resolveM6ReviewStage(reviewMode: boolean, value: string | string[] | undefined): "manifest" | "evidence" | "airlock" | "boundary" | "refusal" | undefined {
  if (!reviewMode || Array.isArray(value)) return undefined;
  return value === "manifest" || value === "evidence" || value === "airlock" || value === "boundary" || value === "refusal" ? value : undefined;
}

export function canRevealM1Comparison(viewed: string[]): boolean {
  return viewed.includes("S1") && viewed.includes("S2");
}

export function canReachM4Decision(reviewed: string[]): boolean {
  return ["sample-2-2", "sample-2-3", "sample-2-4"].every((sample) => reviewed.includes(sample));
}

export function canReachM6Boundary(selectedManifestSlots: number, requiredSlots = 3): boolean {
  return selectedManifestSlots >= requiredSlots;
}

export function canDesignNextExperiment(refusalViewed: boolean): boolean {
  return refusalViewed;
}
