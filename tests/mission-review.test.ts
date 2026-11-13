import { describe, expect, it } from "vitest";
import { canEnterMission, isDevelopmentReviewMode } from "@/lib/mission-review";

describe("development mission review mode", () => {
  it("requires development and review=1", () => {
    expect(isDevelopmentReviewMode("development", "1")).toBe(true);
    expect(isDevelopmentReviewMode("development", "0")).toBe(false);
    expect(isDevelopmentReviewMode("development", ["1"])).toBe(false);
  });

  it("is disabled in production", () => {
    expect(isDevelopmentReviewMode("production", "1")).toBe(false);
    expect(canEnterMission("LOCKED", false)).toBe(false);
  });

  it("bypasses only the route lock in development review mode", () => {
    expect(canEnterMission("LOCKED", true)).toBe(true);
    expect(canEnterMission("AVAILABLE", false)).toBe(true);
  });

  it("does not alter campaign or scientific definitions", async () => {
    const { createInitialCampaign } = await import("@/lib/mission-state");
    const { campaignMissions } = await import("@/data/missions");
    const state = createInitialCampaign(campaignMissions);
    expect(state.missions.m1.status).toBe("LOCKED");
    expect(campaignMissions.find((mission) => mission.id === "m1")?.id).toBe("m1");
    const { m1Mission } = await import("@/data/missions/m1-sibal");
    expect(m1Mission.verdictDefinitions[0].evidence.map((ref) => ref.sourceRecordId)).toEqual(["S1", "S2"]);
  });
});
