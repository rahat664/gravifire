import { describe, expect, it } from "vitest";
import { canDesignNextExperiment, canReachM4Decision, canReachM6Boundary, canRevealM1Comparison, missionPhysicalRoutes, resolveM0ReviewStage, resolveM1ReviewStage, resolveM4ReviewStage, resolveM6ReviewStage, resolveMissionEngine } from "@/lib/mission-route";
import { M0_REVIEW_LAYOUT } from "@/lib/m0-playcanvas";

describe("Mission physical routes", () => {
  it("keeps distinct routes for each campaign chapter", () => {
    expect(missionPhysicalRoutes.m0).toEqual(["CREW CORRIDOR", "INCIDENT BAY", "ARCHIVE TERMINAL"]);
    expect(missionPhysicalRoutes.m1).toContain("COMPARISON ROOM");
    expect(missionPhysicalRoutes.m4).toContain("LOW-g FLIGHT RECORD BAY");
    expect(missionPhysicalRoutes.m6).toContain("MARS BOUNDARY DOOR");
  });
  it("requires both M1 source replays before comparison", () => {
    expect(canRevealM1Comparison(["S1"])).toBe(false);
    expect(canRevealM1Comparison(["S1", "S2"])).toBe(true);
  });
  it("requires the three supporting M4 sample reviews", () => {
    expect(canReachM4Decision(["sample-2-2", "sample-2-3"])).toBe(false);
    expect(canReachM4Decision(["sample-2-2", "sample-2-3", "sample-2-4"])).toBe(true);
  });
  it("gates the M6 boundary behind all manifest slots and refusal", () => {
    expect(canReachM6Boundary(2)).toBe(false);
    expect(canReachM6Boundary(3)).toBe(true);
    expect(canDesignNextExperiment(false)).toBe(false);
    expect(canDesignNextExperiment(true)).toBe(true);
  });
  it("dispatches canonical missions to PlayCanvas and legacy R3F only explicitly in development", () => {
    expect(resolveMissionEngine("development", "m0")).toBe("PLAYCANVAS_M0");
    expect(resolveMissionEngine("development", "m0", "r3f-legacy")).toBe("R3F_LEGACY");
    expect(resolveMissionEngine("production", "m0", "r3f-legacy")).toBe("PLAYCANVAS_M0");
    expect(resolveMissionEngine("development", "m1")).toBe("PLAYCANVAS_M1");
    expect(resolveMissionEngine("development", "m1", "r3f-legacy")).toBe("R3F_LEGACY");
    expect(resolveMissionEngine("production", "m1", "r3f-legacy")).toBe("PLAYCANVAS_M1");
    expect(resolveMissionEngine("development", "m4")).toBe("PLAYCANVAS_M4");
    expect(resolveMissionEngine("production", "m4", "r3f-legacy")).toBe("PLAYCANVAS_M4");
    expect(resolveMissionEngine("development", "m6")).toBe("PLAYCANVAS_M6");
    expect(resolveMissionEngine("development", "m6", "r3f-legacy")).toBe("R3F_LEGACY");
    expect(resolveMissionEngine("production", "m6", "r3f-legacy")).toBe("PLAYCANVAS_M6");
  });
  it("preserves development-only M0 review stages", () => {
    expect(resolveM0ReviewStage(true, "corridor")).toBe("corridor");
    expect(resolveM0ReviewStage(true, "incident")).toBe("incident");
    expect(resolveM0ReviewStage(true, "response")).toBe("response");
    expect(resolveM0ReviewStage(true, "archive")).toBe("archive");
    expect(resolveM0ReviewStage(false, "incident")).toBeUndefined();
    expect(resolveM0ReviewStage(true, ["archive"])).toBeUndefined();
  });
  it("keeps M0 review cameras and module subsets distinct", () => {
    expect(M0_REVIEW_LAYOUT.incident.spawn).not.toEqual(M0_REVIEW_LAYOUT.response.spawn);
    expect(M0_REVIEW_LAYOUT.archive.anchor).not.toEqual(M0_REVIEW_LAYOUT.incident.anchor);
    expect(M0_REVIEW_LAYOUT.incident.modules).toContain("incident-bay-shell");
    expect(M0_REVIEW_LAYOUT.archive.modules).toContain("archive-terminal");
  });
  it("preserves development-only M1 review stages", () => {
    expect(resolveM1ReviewStage(true, "replay")).toBe("replay");
    expect(resolveM1ReviewStage(true, "analysis")).toBe("analysis");
    expect(resolveM1ReviewStage(false, "analysis")).toBeUndefined();
    expect(resolveM1ReviewStage(true, ["analysis"])).toBeUndefined();
  });
  it("preserves development-only M4 review stages", () => {
    expect(resolveM4ReviewStage(true, "material")).toBe("material");
    expect(resolveM4ReviewStage(true, "ground")).toBe("ground");
    expect(resolveM4ReviewStage(true, "lowg")).toBe("lowg");
    expect(resolveM4ReviewStage(true, "samples")).toBe("samples");
    expect(resolveM4ReviewStage(true, "analysis")).toBe("analysis");
    expect(resolveM4ReviewStage(false, "analysis")).toBeUndefined();
  });
  it("preserves development-only M6 review stages", () => {
    expect(resolveM6ReviewStage(true, "manifest")).toBe("manifest");
    expect(resolveM6ReviewStage(true, "evidence")).toBe("evidence");
    expect(resolveM6ReviewStage(true, "airlock")).toBe("airlock");
    expect(resolveM6ReviewStage(true, "boundary")).toBe("boundary");
    expect(resolveM6ReviewStage(true, "refusal")).toBe("refusal");
    expect(resolveM6ReviewStage(false, "refusal")).toBeUndefined();
  });
});
