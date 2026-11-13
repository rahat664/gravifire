export type M0PlayCanvasStage = "corridor" | "incident" | "response" | "archive";

export const M0_REVIEW_LAYOUT: Record<M0PlayCanvasStage, { spawn: { x: number; z: number }; yaw: number; anchor: readonly [number, number, number]; modules: readonly string[] }> = {
  corridor: { spawn: { x: 0, z: 1.5 }, yaw: 0, anchor: [0, 1.8, -5.2], modules: ["crew-corridor", "incident-door"] },
  incident: { spawn: { x: -1.25, z: -5.15 }, yaw: 0, anchor: [0, 2.2, -7.1], modules: ["incident-bay-shell", "inspection-stations", "incident-vfx"] },
  response: { spawn: { x: -1.15, z: -7.05 }, yaw: 0, anchor: [0, 1.55, -9.3], modules: ["incident-bay-shell", "response-stations", "incident-vfx"] },
  archive: { spawn: { x: -1.25, z: -12.35 }, yaw: 0, anchor: [0, 1.65, -14.8], modules: ["archive-corridor", "archive-terminal"] },
};

export function m0ReviewLayout(stage: M0PlayCanvasStage | undefined): typeof M0_REVIEW_LAYOUT[M0PlayCanvasStage] {
  return M0_REVIEW_LAYOUT[stage ?? "corridor"];
}
