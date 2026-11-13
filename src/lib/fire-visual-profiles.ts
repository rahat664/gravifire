export type FireVisualProfile = "EARTH_REFERENCE_VISUAL" | "LOW_G_REPRESENTATIONAL" | "MICROGRAVITY_REPRESENTATIONAL" | "SOURCE_REPLAY";

export type FireVisualProfileConfig = { flow: [number, number]; buoyancy: number; turbulence: number; elongation: number; smoke: boolean };

/** Presentation presets only. They are not gravity-to-flame models or scientific predictions. */
export const FIRE_VISUAL_PROFILES: Record<FireVisualProfile, FireVisualProfileConfig> = {
  EARTH_REFERENCE_VISUAL: { flow: [0.02, 1], buoyancy: 1, turbulence: 0.92, elongation: 1.08, smoke: true },
  LOW_G_REPRESENTATIONAL: { flow: [0.08, 0.42], buoyancy: 0.42, turbulence: 1.12, elongation: 0.82, smoke: false },
  MICROGRAVITY_REPRESENTATIONAL: { flow: [0.16, 0.16], buoyancy: 0.16, turbulence: 1.18, elongation: 0.68, smoke: false },
  SOURCE_REPLAY: { flow: [0, 1], buoyancy: 1, turbulence: 1, elongation: 1, smoke: false },
};

export function fireProfileForEnvironment(environment: string): FireVisualProfile { return environment.toLowerCase().includes("micro") ? "MICROGRAVITY_REPRESENTATIONAL" : "EARTH_REFERENCE_VISUAL"; }
