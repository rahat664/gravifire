import { describe, expect, it } from "vitest";
import { getInvestigationRankingMaterialOptions, rankNASAInvestigations, scoreEvidenceCompleteness } from "@/lib/investigation-ranking";
import { nasaInvestigationCoverage } from "@/data/nasa-investigation-coverage";
import type { InvestigationRankingRequest } from "@/types/investigation-ranking";

describe("deterministic NASA investigation relevance ranking", () => {
  const example: InvestigationRankingRequest = {
    missionType: "SPACECRAFT",
    researchPillar: "solid_material_flammability",
    material: "PMMA",
    scientificQuestion: "How does oxygen affect PMMA flame spread?",
    conditions: { oxygenFraction: 22.2 },
  };

  it("is reproducible and returns stable tie-break ordering", () => {
    const first = rankNASAInvestigations(example);
    const second = rankNASAInvestigations(example);
    expect(first).toEqual(second);
    expect(first.algorithmVersion).toBe("NASA Investigation Relevance v1");
    expect(first.results.map((item) => item.id)).toEqual([...first.results.map((item) => item.id)].sort((left, right) => {
      const l = first.results.find((item) => item.id === left)!;
      const r = first.results.find((item) => item.id === right)!;
      return r.score - l.score || left.localeCompare(right);
    }));
  });

  it("filters by mission pillar, material and question terms", () => {
    const result = rankNASAInvestigations({ ...example, requireQuestionMatch: true });
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.every((item) => item.researchPillars.includes("solid_material_flammability"))).toBe(true);
    expect(result.results.every((item) => item.id === "bass-ii")).toBe(true);
    expect(result.results[0].questionMatchedTerms).toEqual(["flame", "oxygen", "pmma", "spread"]);
    expect(result.results[0].score).toBe(0.93);
    expect(result.results[0].conditionSummary.comparedRecordId).toBe("B1");
    expect(result.results[0].factors.missionRelevance.score * result.weights.missionRelevance
      + result.results[0].factors.materialPhenomenonApplicability.score * result.weights.materialPhenomenonApplicability
      + result.results[0].factors.environmentalConditionMatch.score * result.weights.environmentalConditionMatch
      + result.results[0].factors.evidenceCompleteness.score * result.weights.evidenceCompleteness).toBeCloseTo(result.results[0].score);
  });

  it("includes exact normalized material labels from verified run records", () => {
    expect(getInvestigationRankingMaterialOptions()).toContain("NOMEX");
    const result = rankNASAInvestigations({ missionType: "SPACECRAFT", material: "NOMEX" });
    expect(result.results.map((item) => item.id)).toContain("bass-ii");
    expect(result.results.find((item) => item.id === "bass-ii")?.factors.materialPhenomenonApplicability.matched).toContain("material:NOMEX");
  });

  it("gives no environmental match credit to absent investigation records", () => {
    const referenceOnly = rankNASAInvestigations({ missionType: "SPACECRAFT", researchPillar: "solid_material_flammability" }).results.find((item) => item.id === "bass")!;
    expect(referenceOnly.integrationStatus).toBe("reference_only");
    expect(referenceOnly.factors.environmentalConditionMatch.score).toBe(0);
    expect(referenceOnly.factors.evidenceCompleteness.score).toBe(0.2);
    expect(referenceOnly.limitations.some((item) => item.includes("not verified run-level evidence"))).toBe(true);
  });

  it("assigns zero completeness to unavailable or unverified metadata", () => {
    const exampleEntry = structuredClone(nasaInvestigationCoverage[0]);
    exampleEntry.integrationStatus = "unavailable_or_unverified";
    expect(scoreEvidenceCompleteness(exampleEntry).score).toBe(0);
  });

  it("keeps unknown condition dimensions at zero and supports exact-match filtering", () => {
    const ranked = rankNASAInvestigations({ missionType: "MARS_HABITAT", conditions: { oxygenFraction: 21 } });
    expect(ranked.results.length).toBeGreaterThan(0);
    const noConditionsAvailable = ranked.results.find((item) => item.id === "saffire-iii")!;
    expect(noConditionsAvailable.factors.environmentalConditionMatch.score).toBe(0);
    expect(noConditionsAvailable.conditionSummary.unknown).toContain("oxygenFraction");
    const filtered = rankNASAInvestigations({ ...example, requireAllConditionsMatch: true });
    expect(filtered.results.every((item) => item.conditionSummary.matched.includes("oxygenFraction"))).toBe(true);
  });

  it("does not allow absent query metadata to increase a candidate score", () => {
    const result = rankNASAInvestigations({ missionType: "SPACECRAFT", scientificQuestion: "flame spread oxygen" });
    const bass = result.results.find((item) => item.id === "bass")!;
    const bassII = result.results.find((item) => item.id === "bass-ii")!;
    expect(bass.factors.materialPhenomenonApplicability.score).toBeLessThan(bassII.factors.materialPhenomenonApplicability.score);
    expect(bass.factors.evidenceCompleteness.score).toBeLessThan(bassII.factors.evidenceCompleteness.score);
  });
});
