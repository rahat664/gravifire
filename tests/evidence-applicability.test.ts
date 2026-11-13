import { describe, expect, it } from "vitest";
import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import { compareApplicability, createMissionScenario, extractFLEX2ConfigurationEvidence, extractNASAConditionEvidence, setScenarioValue, validateConditionSet, validateNASAConditionEvidence } from "@/lib/evidence-applicability";
import { nasaExperimentConfigurations } from "@/data/nasa-experiment-configurations";
import type { NASAConditionEvidence } from "@/types/applicability";

describe("NASA evidence applicability contract", () => {
  it("produces structurally valid, unique source references for every verified run", () => {
    for (const run of nasaExperimentRuns) {
      expect(validateNASAConditionEvidence(extractNASAConditionEvidence(run)), `${run.family}/${run.sourceExperimentId}`).toBe(true);
    }
  });

  it("retains valid HTTP source links and the normalized record identity", () => {
    const run = nasaExperimentRuns.find((item) => item.flexData?.fuel != null)!;
    const evidence = extractNASAConditionEvidence(run);
    const fuel = evidence.conditions.fuel;
    expect(fuel.provenance?.sourcePathOrCitation).toMatch(/^https?:\/\//);
    expect(fuel.provenance?.sourceRecordId).toBe(run.sourceExperimentId);
    expect(fuel.provenance?.investigationId).toBe(run.investigationId);
    expect(fuel.provenance?.sourceField).toBe(fuel.sourceField);
    expect(fuel.rawValue).toBe(run.flexData?.rawFuel);
  });

  it("rejects duplicate source-reference IDs and inconsistent reported/unknown states", () => {
    const source = extractNASAConditionEvidence(nasaExperimentRuns.find((item) => item.flexData?.fuel != null)!);
    const duplicate = structuredClone(source) as NASAConditionEvidence;
    duplicate.conditions.pressure.provenance!.id = duplicate.conditions.fuel.provenance!.id;
    expect(validateNASAConditionEvidence(duplicate)).toBe(false);
    expect(validateConditionSet({ ...source.conditions, gravity: { ...source.conditions.gravity, origin: "SOURCE_REPORTED" } })).toBe(false);
  });

  it("keeps scenario assumptions hypothetical and unknown comparisons explicit", () => {
    const run = nasaExperimentRuns.find((item) => item.environment.includes("ISS"))!;
    const evidence = extractNASAConditionEvidence(run);
    let scenario = createMissionScenario("MARS_HABITAT");
    expect(scenario.conditions.gravity.value).toBe("PARTIAL_GRAVITY");
    expect(scenario.conditions.gravity.origin).toBe("HYPOTHETICAL_SCENARIO");
    expect(scenario.conditions.oxygenFraction.value).toBeNull();
    expect(compareApplicability(evidence, scenario).rows.every((row) => row.status === "UNKNOWN" || row.dimension === "gravity")).toBe(true);
    scenario = setScenarioValue(scenario, "oxygenFraction", 20.9);
    expect(scenario.conditions.oxygenFraction.value).toBe(20.9);
    expect(scenario.conditions.oxygenFraction.unit).toBe("%");
    expect(scenario.conditions.oxygenFraction.provenance).toBeNull();
    expect(scenario.conditions.oxygenFraction.sourceUnit).toBeNull();
    expect(setScenarioValue(scenario, "pressure", 101.3).conditions.pressure.unit).toBe("kPa");
    expect(setScenarioValue(scenario, "airflow", 2).conditions.airflow.unit).toBe("cm/s");
    for (const kind of ["SPACECRAFT", "LUNAR_HABITAT", "MARS_HABITAT", "PRESSURIZED_ROVER"] as const) {
      const profile = createMissionScenario(kind);
      expect(profile.conditions.oxygenFraction.value).toBeNull();
      expect(profile.conditions.pressure.value).toBeNull();
      expect(profile.conditions.airflow.value).toBeNull();
    }
  });

  it("warns on microgravity-to-partial-gravity transfer and cannot return a safety verdict", () => {
    const run = nasaExperimentRuns.find((item) => /microgravity/i.test(item.environment))!;
    const result = compareApplicability(extractNASAConditionEvidence(run), createMissionScenario("LUNAR_HABITAT"));
    expect(result.rows.find((row) => row.dimension === "gravity")?.status).toBe("MISMATCHED");
    expect(result.limitations.some((item) => item.includes("not direct validation"))).toBe(true);
    expect(result.resultClassification).toBe("NO_SAFETY_OR_CERTIFICATION_CONCLUSION");
    expect(result.contentClass).toBe("INTERPRETATION");
  });

  it("normalizes only source-backed FLEX oxygen and pressure with raw units preserved", () => {
    const run = nasaExperimentRuns.find((item) => item.flexData?.ambientPressure.status === "EXACT_SOURCE_VALUE")!;
    const conditions = extractNASAConditionEvidence(run).conditions;
    expect(conditions.oxygenFraction.value).toBeCloseTo((run.flexData!.ambientComposition.oxygen.parsedValue ?? 0) * 100);
    expect(conditions.oxygenFraction.sourceUnit).toBe("mole fraction");
    expect(conditions.oxygenFraction.provenance?.unit).toBe("mole fraction");
    expect(conditions.pressure.unit).toBe("kPa");
    expect(conditions.pressure.sourceUnit).toBe("mmHg");
    expect(conditions.pressure.provenance?.unit).toBe("mmHg");
    expect(conditions.pressure.rawValue).toBe(run.flexData!.ambientPressure.rawValue);
  });

  it("retains FLEX-2 options and ranges as a configuration envelope, not as run measurements", () => {
    const evidence = extractFLEX2ConfigurationEvidence(nasaExperimentConfigurations[0]);
    expect(validateNASAConditionEvidence(evidence)).toBe(true);
    expect(evidence.source.recordType).toBe("EXPERIMENT_CONFIGURATION_ENVELOPE");
    expect(evidence.contentClasses).toContain("CONFIGURATION_ENVELOPE");
    expect(evidence.conditions.oxygenFraction.value).toContain("%");
    expect(evidence.conditions.oxygenFraction.note).toContain("not a run-level");
    expect(evidence.conditions.pressure.unit).toBe("kPa");
    expect(evidence.conditions.pressure.sourceUnit).toBe("atm");
    expect(evidence.conditions.airflow.value).toContain("–");
    expect(evidence.conditions.gravity.value).toBeNull();
    const result = compareApplicability(evidence, setScenarioValue(createMissionScenario("SPACECRAFT"), "oxygenFraction", 21));
    expect(result.rows.find((row) => row.dimension === "oxygenFraction")?.status).toBe("UNKNOWN");
  });
});
