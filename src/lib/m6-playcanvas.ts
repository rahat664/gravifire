import type { MissionSessionState } from "@/lib/mission-session";

export type M6PlayCanvasStage = "MANIFEST" | "EVIDENCE" | "AIRLOCK" | "BOUNDARY" | "REFUSAL";
export type M6ReviewCameraPreset = { yaw: number; pitch: number; distance: number; targetHeight: number; lookAhead: number };

export const M6_REVIEW_MODULES = {
  manifest: ["lab-shell@0", "corridor@-4.15", "manifest-consoles"],
  evidence: ["lab-shell@-8.35", "evidence-consoles", "bulkhead@-11.85"],
  airlock: ["lab-shell@-8.35", "bulkhead@-11.85", "industrial-corridor@-16.7"],
  boundary: ["industrial-corridor@-16.7", "corridor-tail@-20.85", "heavy-bulkhead@-20.15", "boundary-racks"],
  refusal: ["industrial-corridor@-16.7", "corridor-tail@-20.85", "heavy-bulkhead@-20.15", "memo-console"],
} as const;

export const M6_REVIEW_HIDDEN_NODES = {
  evidence: [] as const,
  airlock: ["m6-evidence-screen", "service_panel_westA", "service_panel_eastA", "wall_south_l", "wall_south_r"] as const,
  boundary: ["analysis_wall", "ceiling_light"] as const,
  refusal: [] as const,
} as const;

export const M6_REVIEW_LAYOUT = {
  manifest: { spawn: { x: 0, z: 1.5 }, yaw: 0, room: { center: [0, 0, -0.4], bounds: [-3.6, 3.6, -3.2, 2.8] }, anchors: [[-2.35, 1.55, -0.35], [0, 1.55, -0.35], [2.35, 1.55, -0.35]] },
  evidence: { spawn: { x: -1.55, z: -7.7 }, yaw: 0, room: { center: [0, 0, -8.35], bounds: [-3.6, 3.6, -11.9, -4.25] }, anchors: [[-2.2, 1.42, -8.05], [0, 1.42, -8.05], [2.2, 1.42, -8.05]] },
  airlock: { spawn: { x: -1.15, z: -10.5 }, yaw: 0, room: { center: [0, 0, -10.2], bounds: [-3.6, 3.6, -12.2, -4.25] }, anchor: [0, 1.55, -12.08] },
  boundary: { spawn: { x: 0, z: -17.0 }, yaw: 0, room: { center: [0, 0, -16.7], bounds: [-3.6, 3.6, -21.2, -13.6] }, anchor: [0, 1.72, -20.35] },
  refusal: { spawn: { x: -2.15, z: -17.35 }, yaw: 0, room: { center: [0, 0, -20.0], bounds: [-3.4, 3.4, -21.2, -16.0] }, anchor: [0, 1.65, -20.32], memo: [2.55, 1.38, -19.65] },
} as const;

export const M6_REVIEW_CAMERA: Record<Exclude<Lowercase<M6PlayCanvasStage>, "corridor">, M6ReviewCameraPreset> = {
  manifest: { yaw: 0, pitch: 8, distance: 2.8, targetHeight: 1.18, lookAhead: 0.42 },
  evidence: { yaw: 0, pitch: 8, distance: 3.0, targetHeight: 1.28, lookAhead: 0.34 },
  airlock: { yaw: 0, pitch: 7, distance: 2.9, targetHeight: 1.24, lookAhead: 0.42 },
  boundary: { yaw: 0, pitch: 6, distance: 3.2, targetHeight: 1.35, lookAhead: 0.5 },
  refusal: { yaw: 0, pitch: 7, distance: 3.0, targetHeight: 1.3, lookAhead: 0.46 },
};

export type M6ReviewStage = keyof typeof M6_REVIEW_LAYOUT;

export function reviewCameraPosition(stage: M6ReviewStage) {
  const layout = M6_REVIEW_LAYOUT[stage];
  const camera = M6_REVIEW_CAMERA[stage];
  const angle = camera.yaw * Math.PI / 180;
  return {
    x: layout.spawn.x + Math.cos(angle) * 0.58 + Math.sin(angle) * camera.distance,
    y: 1.72 + Math.sin(camera.pitch * Math.PI / 180) * 0.42,
    z: layout.spawn.z - Math.sin(angle) * 0.58 + Math.cos(angle) * camera.distance,
  };
}

export function pointInsideM6RoomBounds(stage: M6ReviewStage, point: { x: number; z: number }) {
  const [minX, maxX, minZ, maxZ] = M6_REVIEW_LAYOUT[stage].room.bounds;
  return point.x >= minX && point.x <= maxX && point.z >= minZ && point.z <= maxZ;
}

export function m6ReviewSessionPatch(stage: Exclude<Lowercase<M6PlayCanvasStage>, "corridor">): Partial<MissionSessionState> {
  const patches: Record<string, Partial<MissionSessionState>> = {
    manifest: { phase: "MANIFEST", activeObjective: "REVIEW MISSION MANIFEST", reviewedStations: [] },
    evidence: { phase: "EVIDENCE", activeObjective: "ASSEMBLE EVIDENCE", reviewedStations: ["MANIFEST"] },
    airlock: { phase: "AIRLOCK", activeObjective: "ENTER EXPLORATION SECTION", reviewedStations: ["MANIFEST", "EVIDENCE"] },
    boundary: { phase: "BOUNDARY", activeObjective: "SCAN MARS BOUNDARY", reviewedStations: ["MANIFEST", "EVIDENCE", "AIRLOCK"] },
    refusal: { phase: "REFUSAL", activeObjective: "REVIEW REFUSAL", reviewedStations: ["MANIFEST", "EVIDENCE", "AIRLOCK", "BOUNDARY"] },
  };
  return patches[stage];
}

export function m6ReviewDoesNotPersist(patch: Partial<MissionSessionState>) {
  return !Object.prototype.hasOwnProperty.call(patch, "campaign") && !Object.prototype.hasOwnProperty.call(patch, "localStorage");
}
