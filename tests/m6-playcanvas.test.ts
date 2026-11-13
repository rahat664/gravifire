import { describe, expect, it } from "vitest";
import { m6Mission } from "@/data/missions/m6-locked-door";
import { M6_REVIEW_CAMERA, M6_REVIEW_HIDDEN_NODES, M6_REVIEW_LAYOUT, M6_REVIEW_MODULES, m6ReviewDoesNotPersist, m6ReviewSessionPatch, pointInsideM6RoomBounds, reviewCameraPosition } from "@/lib/m6-playcanvas";

describe("M6 PlayCanvas review boundary", () => {
  it("uses the current archive-domain refusal wording", () => {
    const verdict = m6Mission.verdictDefinitions[0];
    expect(verdict.verdict).toBe("REFUSAL");
    expect(verdict.conclusion).toContain("currently ingested evidence");
    expect(verdict.limitations?.join(" ")).toContain("not a claim about all NASA science");
    expect(verdict.conclusion).not.toMatch(/NASA never|unflown/i);
  });

  it("keeps Mars gravity contextual and does not define a fire prediction", () => {
    expect(m6Mission.storyContext.gravity).toContain("0.38 g");
    expect(m6Mission.verdictDefinitions[0].evidence[0].evidenceRole).toBe("CONTEXT");
    expect(m6Mission.verdictDefinitions[0].conclusion).not.toMatch(/burn time|flame|spread rate/i);
  });

  it("initializes visual review stages without campaign persistence", () => {
    const stages = ["manifest", "evidence", "airlock", "boundary", "refusal"] as const;
    for (const stage of stages) {
      const patch = m6ReviewSessionPatch(stage);
      expect(patch.phase).toBe(stage.toUpperCase());
      expect(m6ReviewDoesNotPersist(patch)).toBe(true);
    }
  });

  it("keeps review anchors separated by room", () => {
    expect(M6_REVIEW_LAYOUT.manifest.anchors[1][2]).not.toBe(M6_REVIEW_LAYOUT.evidence.anchors[1][2]);
    expect(M6_REVIEW_LAYOUT.boundary.anchor[2]).not.toBe(M6_REVIEW_LAYOUT.refusal.memo[2]);
    expect(M6_REVIEW_LAYOUT.evidence.spawn.z).toBeGreaterThan(M6_REVIEW_LAYOUT.evidence.anchors[1][2]);
    expect(M6_REVIEW_LAYOUT.airlock.spawn.z).toBeGreaterThan(M6_REVIEW_LAYOUT.airlock.anchor[2]);
    expect(M6_REVIEW_LAYOUT.boundary.spawn.z).toBeGreaterThan(M6_REVIEW_LAYOUT.boundary.anchor[2]);
    expect(M6_REVIEW_CAMERA.evidence).not.toEqual(M6_REVIEW_CAMERA.airlock);
    expect(M6_REVIEW_CAMERA.boundary).not.toEqual(M6_REVIEW_CAMERA.refusal);
  });

  it("places interior review cameras in the intended stage envelope while anchors remain inside", () => {
    for (const stage of ["evidence", "airlock", "boundary"] as const) {
      expect(pointInsideM6RoomBounds(stage, reviewCameraPosition(stage))).toBe(true);
      const anchor = stage === "evidence" ? M6_REVIEW_LAYOUT.evidence.anchors[1] : M6_REVIEW_LAYOUT[stage].anchor;
      expect(pointInsideM6RoomBounds(stage, { x: anchor[0], z: anchor[2] })).toBe(true);
    }
    expect(pointInsideM6RoomBounds("refusal", reviewCameraPosition("refusal"))).toBe(false);
  });

  it("uses deterministic stage-specific review module subsets", () => {
    expect(M6_REVIEW_MODULES.evidence).not.toContain("corridor@-4.15");
    expect(M6_REVIEW_MODULES.airlock).toContain("bulkhead@-11.85");
    expect(M6_REVIEW_MODULES.boundary).toContain("heavy-bulkhead@-20.15");
    expect(M6_REVIEW_MODULES.refusal).toContain("memo-console");
    expect(M6_REVIEW_HIDDEN_NODES.airlock).toContain("m6-evidence-screen");
    expect(M6_REVIEW_HIDDEN_NODES.boundary).toContain("analysis_wall");
  });
});
