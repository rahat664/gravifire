import { describe, expect, it } from "vitest";
import { campaignMissions } from "@/data/missions";
import { createInitialCampaign, parseCampaignState, serializeCampaignState } from "@/lib/mission-state";
import { gameScienceDashboardHref, getGameScienceContext, resolveGameMissionRunIds } from "@/lib/game-science-context";
import { resolveAuthoritativeGameAudit } from "@/lib/game-science-audit";

describe("game to NASA science dashboard integration", () => {
  it("creates contextual dashboard links without changing persistent campaign state", () => {
    const state = createInitialCampaign(campaignMissions);
    const before = serializeCampaignState(state);
    expect(gameScienceDashboardHref("m0")).toContain("gameMission=m0");
    expect(gameScienceDashboardHref("m1")).toContain("investigation=saffire-i");
    expect(gameScienceDashboardHref("m4")).toContain("record=2-1");
    expect(gameScienceDashboardHref("m6")).toContain("mission=MARS_HABITAT");
    expect(serializeCampaignState(parseCampaignState(before, campaignMissions))).toBe(before);
    expect(serializeCampaignState(state)).toBe(before);
  });

  it("maps campaign chapters only to verified NASA source run identifiers", () => {
    expect(resolveGameMissionRunIds("m0")).toEqual([]);
    expect(resolveGameMissionRunIds("m1")).toEqual(["S1", "S2"]);
    expect(resolveGameMissionRunIds("m4")).toEqual(["2-1"]);
    expect(resolveGameMissionRunIds("m6")).toEqual(["2"]);
    expect(getGameScienceContext("m0").notice).toContain("fictional");
    expect(getGameScienceContext("m6").notice).toContain("partial-gravity");
  });

  it("uses the authoritative engine for linked NASA evidence, with citations and limitations", () => {
    const m1 = resolveAuthoritativeGameAudit("m1");
    expect(m1?.targetType).toBe("COMPARISON");
    expect(m1?.evidence.map((source) => source.citation)).toEqual(expect.arrayContaining(["PSI-98:Sample-S1", "PSI-98:Sample-S2"]));

    const m4 = resolveAuthoritativeGameAudit("m4");
    expect(m4?.targetType).toBe("RUN");
    expect(m4?.evidence[0]?.citation).toBe("PSI-99:Sample-2-1");
    expect(m4?.limitations.length).toBeGreaterThan(0);

    const m6 = resolveAuthoritativeGameAudit("m6");
    expect(m6?.targetType).toBe("RUN");
    expect(m6?.evidence[0]?.citation).toBe("PSI-69:Test-2");
    expect(resolveAuthoritativeGameAudit("m0")).toBeNull();
  });
});
