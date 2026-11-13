export const canonicalRuntimeSources = {
  missions: {
    m1: ["src/lib/m1-evidence.ts", "src/data/missions/m1-sibal.ts", "data/nasa/normalized/saffire-i/valid-runs.json"],
    m4: ["src/lib/m4-evidence.ts", "src/data/missions/m4-silicone.ts", "data/nasa/normalized/saffire-ii/valid-runs.json"],
    m6: ["src/lib/m6-state.ts", "src/data/missions/m6-locked-door.ts", "src/lib/mission-state.ts"],
  },
  datasetRegistry: "data/nasa/integration-registry.json",
  documentContext: ["src/data/nasa-document-data.ts", "src/lib/m4-evidence.ts"],
  r7Presentation: ["src/lib/r7/adapter.ts", "Gravifier_research/R7_HANDOVER/engine/outputs/seed_verdicts.json"],
} as const;

export type CanonicalSourceArea = keyof typeof canonicalRuntimeSources;
