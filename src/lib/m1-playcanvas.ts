import type { MissionSessionState } from "@/lib/mission-session";

export type M1DisplayAnchor = readonly [number, number, number];

export const M1_PLAYCANVAS_DISPLAY_ANCHORS = {
  replay: {
    s1: [-2.25, 1.34, -8.84],
    s2: [2.25, 1.34, -8.84],
    header: [0, 2.18, -20.34],
    limit: [0, 0.62, -20.34],
  },
  analysis: {
    s1: [-1.35, 1.42, -20.38],
    s2: [1.35, 1.42, -20.38],
    header: [0, 2.18, -20.34],
    limit: [0, 0.62, -20.34],
  },
} as const satisfies Record<string, Record<string, M1DisplayAnchor>>;

export function m1ReviewSessionPatch(stage: "replay" | "analysis"): Partial<MissionSessionState> {
  return stage === "analysis"
    ? { phase: "ANALYSIS", activeObjective: "REVIEW SOURCE COMPARISON", reviewedStations: ["S1", "S2"] }
    : { phase: "REPLAY_S1", activeObjective: "INSPECT S1 RUN" };
}
