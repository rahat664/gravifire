import { describe, expect, it } from "vitest";
import { FIRE_VISUAL_PROFILES, fireProfileForEnvironment } from "@/lib/fire-visual-profiles";
import { mapFireVisualState } from "@/lib/fire-visual-mapping";

describe("representational fire profiles", () => {
  it("keeps visual profiles separate from scientific output", () => {
    expect(Object.keys(FIRE_VISUAL_PROFILES)).toEqual(["EARTH_REFERENCE_VISUAL", "LOW_G_REPRESENTATIONAL", "MICROGRAVITY_REPRESENTATIONAL", "SOURCE_REPLAY"]);
    expect(FIRE_VISUAL_PROFILES.MICROGRAVITY_REPRESENTATIONAL).toMatchObject({ smoke: false });
    expect(FIRE_VISUAL_PROFILES.EARTH_REFERENCE_VISUAL).toMatchObject({ smoke: true });
  });

  it("selects a presentation profile from environment context only", () => {
    expect(fireProfileForEnvironment("Microgravity")).toBe("MICROGRAVITY_REPRESENTATIONAL");
    expect(fireProfileForEnvironment("Earth reference")).toBe("EARTH_REFERENCE_VISUAL");
  });

  it("maps modified lab inputs deterministically without scientific outputs", () => {
    const input = { oxygenPercent: 21, airflowCmS: 20, pressureKPa: 101, geometry: "Slab", environment: "Earth" };
    const first = mapFireVisualState(input);
    expect(mapFireVisualState(input)).toEqual(first);
    expect(input).toEqual({ oxygenPercent: 21, airflowCmS: 20, pressureKPa: 101, geometry: "Slab", environment: "Earth" });
    expect(first).not.toHaveProperty("temperature");
    expect(first).not.toHaveProperty("burnTime");
    expect(first).not.toHaveProperty("prediction");
  });

  it("returns the same baseline when a modified configuration is reset", () => {
    const original = { oxygenPercent: 21, airflowCmS: 20, pressureKPa: 101, geometry: "Slab", environment: "Earth" };
    const modified = { ...original, oxygenPercent: 35 };
    expect(mapFireVisualState({ ...modified, oxygenPercent: original.oxygenPercent })).toEqual(mapFireVisualState(original));
  });

  it("keeps visual responses bounded and parameter-specific", () => {
    const low = mapFireVisualState({ oxygenPercent: -100, airflowCmS: -10, pressureKPa: -50, environment: "Earth" });
    const high = mapFireVisualState({ oxygenPercent: 1000, airflowCmS: 1000, pressureKPa: 1000, environment: "Earth" });
    expect(low.scale).toBeGreaterThanOrEqual(.86);
    expect(high.scale).toBeLessThanOrEqual(1.18);
    expect(high.lean).toBeGreaterThan(low.lean);
    expect(high.turbulence).toBeGreaterThan(low.turbulence);
    expect(high.glowStrength).toBeGreaterThan(low.glowStrength);
  });

  it("makes oxygen response monotonic without leaving the visual envelope", () => {
    const low = mapFireVisualState({ oxygenPercent: 10, airflowCmS: 20, pressureKPa: 101, environment: "Earth" });
    const baseline = mapFireVisualState({ oxygenPercent: 21, airflowCmS: 20, pressureKPa: 101, environment: "Earth" });
    const high = mapFireVisualState({ oxygenPercent: 50, airflowCmS: 20, pressureKPa: 101, environment: "Earth" });

    expect(low.intensity).toBeLessThan(baseline.intensity);
    expect(baseline.intensity).toBeLessThan(high.intensity);
    expect(low.coreIntensity).toBeLessThan(high.coreIntensity);
    expect(low.scale).toBeLessThan(high.scale);
    expect(high.scale).toBeLessThanOrEqual(1.18);
  });

  it("makes airflow the stronger directional control", () => {
    const low = mapFireVisualState({ oxygenPercent: 21, airflowCmS: 0, pressureKPa: 101, environment: "Earth" });
    const high = mapFireVisualState({ oxygenPercent: 21, airflowCmS: 100, pressureKPa: 101, environment: "Earth" });

    expect(high.lean - low.lean).toBeGreaterThanOrEqual(0.2);
    expect(high.turbulence).toBeGreaterThan(low.turbulence);
    expect(high.flickerSpeed).toBeGreaterThan(low.flickerSpeed);
  });

  it("keeps environment profiles visually distinct", () => {
    const earth = mapFireVisualState({ environment: "Earth" });
    const lowG = mapFireVisualState({ environment: "Low-g" });
    const micro = mapFireVisualState({ environment: "Microgravity" });
    expect(earth.profile).not.toBe(lowG.profile);
    expect(lowG.profile).not.toBe(micro.profile);
    expect(earth.buoyancyVisual).toBeGreaterThan(micro.buoyancyVisual);
    expect(earth.smokeAmount).toBeGreaterThan(micro.smokeAmount);
  });
});
