import type { MissionSessionState } from "@/lib/mission-session";

export type M4PlayCanvasStage = "MATERIAL" | "GROUND" | "LOWG" | "SAMPLES" | "ANALYSIS";

export const M4_REVIEW_LAYOUT = {
  material: { spawn: { x: 0, z: 1.2 }, anchor: [0, 1.9, 0.8] },
  ground: { spawn: { x: -2.1, z: -7.7 }, anchor: [-2.1, 1.18, -6.42] },
  lowg: { spawn: { x: 1.2, z: -10.1 }, anchor: [2.1, 1.18, -10.42] },
  samples: { spawn: { x: 0, z: -12.35 }, anchors: [[-3, 1.18, -14.97], [-1, 1.18, -14.97], [1, 1.18, -14.97], [3, 1.18, -14.97]] },
  analysis: { spawn: { x: -1.35, z: -17.4 }, left: [-1.35, 1.42, -20.38], right: [1.35, 1.42, -20.38], header: [0, 2.18, -20.34], limit: [0, 0.62, -20.34] },
} as const;

export function m4ReviewSessionPatch(stage: "material" | "ground" | "lowg" | "samples" | "analysis"): Partial<MissionSessionState> {
  if (stage === "material") return { phase: "MATERIAL", activeObjective: "INSPECT SILICONE SAMPLE" };
  if (stage === "ground") return { phase: "GROUND", activeObjective: "REVIEW 1-g REFERENCE" };
  if (stage === "lowg") return { phase: "LOWG", activeObjective: "REVIEW LOW-g FLIGHT RECORD" };
  if (stage === "samples") return { phase: "SAMPLES", activeObjective: "INSPECT SAMPLES 2-1 THROUGH 2-4" };
  return { phase: "ANALYSIS", activeObjective: "REVIEW SOURCE COMPARISON", reviewedStations: ["2-1", "2-2", "2-3", "2-4"] };
}
export function m4ReviewDoesNotPersist(patch: Partial<MissionSessionState>) {
  return !Object.prototype.hasOwnProperty.call(patch, "campaign") && !Object.prototype.hasOwnProperty.call(patch, "localStorage");
}
