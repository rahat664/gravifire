import { describe, expect, it } from "vitest";
import { createMissionSession } from "@/lib/mission-session";
import { campaignEvidenceDTO, isR7PresentationVerdict } from "@/lib/verdict-model";
import { canonicalRuntimeSources } from "@/data/canonical-sources";
import { createInitialCampaign, parseCampaignState } from "@/lib/mission-state";
import { campaignMissions } from "@/data/missions";

describe("architecture boundaries", () => {
  it("creates transient mission state without scientific or campaign fields", () => {
    const session = createMissionSession("m1");
    expect(session).toMatchObject({ missionId: "m1", phase: "INSERTION", reviewedStations: [], interactionLocked: false });
    expect("predictions" in session).toBe(false);
  });

  it("resets malformed and unknown campaign state without inventing completion", () => {
    expect(parseCampaignState("{bad", campaignMissions).missions.m1.status).toBe("LOCKED");
    expect(parseCampaignState(JSON.stringify({ schemaVersion: 999, missions: { m1: { status: "COMPLETE" } } }), campaignMissions).missions.m1.status).toBe("LOCKED");
  });

  it("keeps R7 presentation verdicts explicit", () => {
    expect(isR7PresentationVerdict("SUPPORTED")).toBe(true);
    expect(isR7PresentationVerdict("EXACT")).toBe(false);
  });

  it("reduces campaign evidence references to a UI DTO", () => {
    const reference = createInitialCampaign(campaignMissions);
    expect(reference.schemaVersion).toBe(2);
    const dto = campaignEvidenceDTO({ id: "x", type: "EXPERIMENT_RECORD", investigationId: "PSI-98", family: "SAFFIRE-I", sourceRecordId: "S1", sourcePathOrCitation: "file.csv:row-2", sourceField: "row", rawValue: "raw", normalizedValue: "normalized", unit: "", evidenceRole: "DIRECT" });
    expect(dto).toEqual({ id: "x", family: "SAFFIRE-I", investigationId: "PSI-98", sourceRecordId: "S1", sourcePathOrCitation: "file.csv:row-2", evidenceRole: "DIRECT" });
  });

  it("exposes canonical M1/M4/M6 source ownership", () => {
    expect(canonicalRuntimeSources.missions.m1).toContain("src/lib/m1-evidence.ts");
    expect(canonicalRuntimeSources.missions.m4).toContain("src/lib/m4-evidence.ts");
    expect(canonicalRuntimeSources.r7Presentation[0]).toBe("src/lib/r7/adapter.ts");
  });
});
