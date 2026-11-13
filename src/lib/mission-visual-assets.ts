export type MissionVisualAsset = {
  id: string;
  path: string | null;
  format: "GLB" | "GLTF" | "PROCEDURAL_FALLBACK";
  role: "CHARACTER" | "ENVIRONMENT" | "PROP";
  license: "SELF_CREATED" | "CC0" | "APPROVED_LICENSE" | "PENDING_REVIEW";
  enabled: boolean;
  status?: "APPROVED" | "REJECTED_FOR_PLAYER_CHARACTER" | "FALLBACK";
  reason?: string;
};

/**
 * Visual assets are deliberately separate from collision and mission data.
 * A null path keeps the current deterministic fallback active until a reviewed
 * asset is added under public/assets/mission-control.
 */
export const missionVisualAssets: MissionVisualAsset[] = [
  {
    id: "mission-engineer",
    path: "/assets/game/character/quaternius-human-astronaut.glb",
    format: "GLB",
    role: "CHARACTER",
    license: "CC0",
    enabled: true,
    status: "APPROVED",
  },
  {
    id: "quaternius-creature-astronaut-rejected",
    path: "/assets/game/character/quaternius-astronaut.glb",
    format: "GLB",
    role: "CHARACTER",
    license: "CC0",
    enabled: false,
    status: "REJECTED_FOR_PLAYER_CHARACTER",
    reason: "NON-HUMAN / CREATURE CHARACTER",
  },
  { id: "corridor-straight", path: null, format: "PROCEDURAL_FALLBACK", role: "ENVIRONMENT", license: "SELF_CREATED", enabled: false },
  { id: "saffire-research-bay", path: "/assets/game/environment/m1/", format: "GLB", role: "ENVIRONMENT", license: "CC0", enabled: true },
  { id: "materials-analysis-bay", path: null, format: "PROCEDURAL_FALLBACK", role: "ENVIRONMENT", license: "SELF_CREATED", enabled: false },
  { id: "m6-boundary-door", path: null, format: "PROCEDURAL_FALLBACK", role: "PROP", license: "SELF_CREATED", enabled: false },
];

export const visualAssetById = (id: string) => missionVisualAssets.find((asset) => asset.id === id);
