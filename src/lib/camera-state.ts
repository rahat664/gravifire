export type CameraMode = "THIRD_PERSON" | "FIRST_PERSON";
export const CAMERA_MODE_STORAGE_KEY = "gravifire-camera-mode";
export type Shoulder = "RIGHT" | "LEFT";
export const SHOULDER_STORAGE_KEY = "gravifire-camera-shoulder";
export const thirdPersonCameraConfig = {
  distance: 3.35,
  height: 1.55,
  shoulderOffset: 0.48,
  targetHeight: 1.45,
  minimumDistance: 0.72,
  positionSmoothing: 18,
  visualSmoothing: 16,
  collisionInSmoothing: 24,
  collisionOutSmoothing: 8,
  focusDistance: 2.45,
  baseFov: 72,
  sprintFovDelta: 3,
  focusFovDelta: -4,
} as const;
export function parseCameraMode(value: string | null): CameraMode { return value === "FIRST_PERSON" ? "FIRST_PERSON" : "THIRD_PERSON"; }
export function toggleCameraMode(mode: CameraMode): CameraMode { return mode === "THIRD_PERSON" ? "FIRST_PERSON" : "THIRD_PERSON"; }
export function parseShoulder(value: string | null): Shoulder { return value === "LEFT" ? "LEFT" : "RIGHT"; }
export function toggleShoulder(shoulder: Shoulder): Shoulder { return shoulder === "RIGHT" ? "LEFT" : "RIGHT"; }
export function expSmoothing(speed: number, delta: number): number { return 1 - Math.exp(-Math.max(0, speed) * Math.max(0, delta)); }
export function smoothAngle(current: number, target: number, speed: number, delta: number): number {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * expSmoothing(speed, delta);
}
