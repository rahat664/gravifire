import { describe, expect, it } from "vitest";
import { expSmoothing, parseCameraMode, parseShoulder, smoothAngle, thirdPersonCameraConfig, toggleCameraMode, toggleShoulder } from "@/lib/camera-state";

describe("camera preference", () => {
  it("defaults to third person", () => expect(parseCameraMode(null)).toBe("THIRD_PERSON"));
  it("toggles without touching mission state", () => { expect(toggleCameraMode("THIRD_PERSON")).toBe("FIRST_PERSON"); expect(toggleCameraMode("FIRST_PERSON")).toBe("THIRD_PERSON"); });
  it("recovers invalid stored values safely", () => expect(parseCameraMode("unexpected")).toBe("THIRD_PERSON"));
  it("keeps third-person camera values grounded and frame-rate independent", () => { expect(thirdPersonCameraConfig.distance).toBeGreaterThan(thirdPersonCameraConfig.minimumDistance); expect(expSmoothing(18, 0)).toBe(0); expect(expSmoothing(18, 1)).toBeGreaterThan(0.99); });
  it("supports stable shoulder selection and angle wrapping", () => { expect(parseShoulder("bad")).toBe("RIGHT"); expect(toggleShoulder("RIGHT")).toBe("LEFT"); expect(Math.abs(smoothAngle(Math.PI - 0.1, -Math.PI + 0.1, 10, 1) - (Math.PI + 0.1))).toBeLessThan(0.01); });
});
