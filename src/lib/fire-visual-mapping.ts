import { FIRE_VISUAL_PROFILES, type FireVisualProfile } from "@/lib/fire-visual-profiles";

export type FireVisualInput = {
  oxygenPercent?: number;
  airflowCmS?: number;
  pressureKPa?: number;
  geometry?: string;
  environment: string;
  profile?: FireVisualProfile;
};

export type FireVisualState = {
  profile: FireVisualProfile;
  scale: number;
  intensity: number;
  coreIntensity: number;
  turbulence: number;
  flickerSpeed: number;
  lean: number;
  flowVector: [number, number];
  spread: number;
  opacity: number;
  smokeAmount: number;
  glowStrength: number;
  buoyancyVisual: number;
};

export const FIRE_VISUAL_LIMITS = {
  scale: [0.86, 1.18],
  intensity: [0.68, 1.28],
  coreIntensity: [0.72, 1.3],
  turbulence: [0.65, 1.55],
  flickerSpeed: [0.8, 1.35],
  lean: [-0.08, 0.42],
  spread: [0.78, 1.18],
  opacity: [0.72, 1],
  smokeAmount: [0, 0.7],
  glowStrength: [0.52, 1.05],
  buoyancyVisual: [0.08, 1.2],
} as const;

function clamp(value: number, min: number, max: number): number { return Math.min(max, Math.max(min, value)); }
function normalize(value: number | undefined, min: number, max: number, fallback: number): number { return clamp(((value ?? fallback) - min) / (max - min), 0, 1); }
function limit(value: number, range: readonly [number, number]): number { return clamp(value, range[0], range[1]); }

function geometryScale(geometry?: string): number {
  const value = geometry?.toLowerCase() ?? "";
  if (value.includes("rod")) return 0.9;
  if (value.includes("film")) return 0.94;
  if (value.includes("cylinder")) return 0.96;
  if (value.includes("slab")) return 1.04;
  return 1;
}

/** Display heuristics only. This function is not a combustion model or scientific predictor. */
export function mapFireVisualState(input: FireVisualInput): FireVisualState {
  const profile = input.profile ?? (input.environment.toLowerCase().includes("micro") ? "MICROGRAVITY_REPRESENTATIONAL" : input.environment.toLowerCase().includes("low") ? "LOW_G_REPRESENTATIONAL" : "EARTH_REFERENCE_VISUAL");
  const profileConfig = FIRE_VISUAL_PROFILES[profile];
  const oxygen = normalize(input.oxygenPercent, 10, 50, 21);
  const airflow = normalize(input.airflowCmS, 0, 100, 0);
  const pressure = normalize(input.pressureKPa, 50, 150, 101);
  const geometry = geometryScale(input.geometry);
  const profileSpread = profile === "MICROGRAVITY_REPRESENTATIONAL" ? 1.09 : profile === "LOW_G_REPRESENTATIONAL" ? 1.04 : 0.94;
  return {
    profile,
    scale: limit((0.9 + oxygen * 0.24) * geometry, FIRE_VISUAL_LIMITS.scale),
    intensity: limit(0.68 + oxygen * 0.6 + pressure * 0.04, FIRE_VISUAL_LIMITS.intensity),
    coreIntensity: limit(0.72 + oxygen * 0.72, FIRE_VISUAL_LIMITS.coreIntensity),
    turbulence: limit(profileConfig.turbulence + airflow * 0.5 + pressure * 0.04, FIRE_VISUAL_LIMITS.turbulence),
    flickerSpeed: limit(0.9 + airflow * 0.35 + pressure * 0.04, FIRE_VISUAL_LIMITS.flickerSpeed),
    lean: limit(profileConfig.flow[0] + airflow * 0.45, FIRE_VISUAL_LIMITS.lean),
    flowVector: [limit(profileConfig.flow[0] + airflow * 0.5, FIRE_VISUAL_LIMITS.lean), profileConfig.flow[1]],
    spread: limit(profileSpread + oxygen * 0.1 + airflow * 0.1 + (geometry - 1) * 0.3, FIRE_VISUAL_LIMITS.spread),
    opacity: limit(0.86 + pressure * 0.08, FIRE_VISUAL_LIMITS.opacity),
    smokeAmount: profile === "EARTH_REFERENCE_VISUAL" ? limit(0.25 + pressure * 0.12, FIRE_VISUAL_LIMITS.smokeAmount) : 0,
    glowStrength: limit(0.68 + oxygen * 0.18 + pressure * 0.06, FIRE_VISUAL_LIMITS.glowStrength),
    buoyancyVisual: limit(profileConfig.buoyancy * (0.9 + oxygen * 0.08), FIRE_VISUAL_LIMITS.buoyancyVisual),
  };
}
