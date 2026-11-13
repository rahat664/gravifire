import type { MissionEvidenceReference } from "@/features/mission-control/types";
import type { NASAExperimentRun } from "@/types/experiment";
import type { FLEX2ConfigurationEnvelope } from "@/types/configuration";
import { nasaExperimentConfigurations } from "@/data/nasa-experiment-configurations";
import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import type { ApplicabilityCondition, ApplicabilityConditionSet, ApplicabilityDimension, ApplicabilityRow, ConditionOrigin, ConditionScalar, EvidenceApplicability, GravityRegime, MissionScenario, MissionScenarioKind, NASAConditionEvidence, ScientificContentClass } from "@/types/applicability";

const dimensions: ApplicabilityDimension[] = ["gravity", "oxygenFraction", "pressure", "airflow", "fuel", "sampleGeometry", "sampleSize", "measurementType"];
const empty = (origin: ConditionOrigin = "NOT_REPORTED"): ApplicabilityCondition => ({ value: null, unit: null, origin, rawValue: null, sourceUnit: null, sourceField: null, provenance: null });

function condition(value: ConditionScalar, unit: string | null, rawValue: string | null, sourceUnit: string | null, sourceField: string, reference: MissionEvidenceReference, origin: ConditionOrigin = "SOURCE_REPORTED", note?: string): ApplicabilityCondition {
  return { value, unit, rawValue, sourceUnit, sourceField, provenance: reference, origin, ...(note ? { note } : {}) };
}

function ref(run: NASAExperimentRun, field: string, raw: string, normalized: string, unit: string, role: MissionEvidenceReference["evidenceRole"] = "DIRECT"): MissionEvidenceReference {
  return { id: `${run.investigationId}:${run.sourceExperimentId}:${field}`, type: "NASA_SOURCE_REPORTED_CONDITION", investigationId: run.investigationId, family: run.family, sourceRecordId: run.sourceExperimentId, sourcePathOrCitation: run.provenance.sourceUrl ?? run.source.url, sourceField: field, rawValue: raw, normalizedValue: normalized, unit, evidenceRole: role, notes: `Source file ${run.provenance.sourceFile ?? "unavailable"}; row ${run.provenance.sourceRow ?? "unavailable"}; SHA-256 ${run.provenance.sourceSha256 ?? "unavailable"}.` };
}

function fromMeasurement(run: NASAExperimentRun, field: string, raw: string, value: number | null | undefined, sourceUnit: string | null, targetUnit: string, conversion?: (value: number) => number): ApplicabilityCondition {
  if (value == null || !Number.isFinite(value)) return empty();
  const normalized = conversion ? conversion(value) : value;
  const evidenceRef = ref(run, field, raw, String(normalized), sourceUnit ?? targetUnit);
  return condition(normalized, targetUnit, raw, sourceUnit, field, evidenceRef, conversion ? "DERIVED_FROM_SOURCE" : "SOURCE_REPORTED", conversion ? `Unit conversion: ${sourceUnit} to ${targetUnit}.` : undefined);
}

function gravity(run: NASAExperimentRun): ApplicabilityCondition {
  if (/microgravity/i.test(run.environment)) {
    const evidenceRef = ref(run, "environment", run.environment, "MICROGRAVITY (context only)", "qualitative investigation context", "CONTEXT");
    return condition("MICROGRAVITY", null, run.environment, null, "environment", evidenceRef, "SOURCE_CONTEXT", "Qualitative investigation context only; no numeric acceleration measurement is present in this record.");
  }
  return empty();
}

function sizeAndGeometry(run: NASAExperimentRun): { size: ApplicabilityCondition; geometry: ApplicabilityCondition } {
  const p = run.parameters;
  const dims = ["sampleLengthCm", "sampleWidthCm", "sampleThicknessCm"].filter((key) => typeof p[key] === "number" && Number.isFinite(p[key]));
  if (dims.length) {
    const values = dims.map((key) => `${key.replace("sample", "").replace("Cm", "")}=${p[key]} cm`);
    const raw = values.join("; ");
    const field = dims.join(", ");
    const evidenceRef = ref(run, field, raw, raw, "cm");
    return { size: condition(raw, "cm", raw, "cm", field, evidenceRef), geometry: empty() };
  }
  const diameter = run.flexData?.dropletInitialDiameter;
  if (diameter?.parsedValue != null && diameter.status === "EXACT_SOURCE_VALUE") {
    const evidenceRef = ref(run, diameter.sourceField, diameter.rawValue, `${diameter.parsedValue} mm`, "mm");
    return { size: condition(diameter.parsedValue, "mm", diameter.rawValue, "mm", diameter.sourceField, evidenceRef), geometry: condition("DROPLET", null, "droplet", null, "FLEX experimental configuration", ref(run, "FLEX experimental configuration", "droplet", "DROPLET", "categorical", "CONTEXT"), "SOURCE_CONTEXT") };
  }
  return { size: empty(), geometry: empty() };
}

export function extractNASAConditionEvidence(run: NASAExperimentRun): NASAConditionEvidence {
  const conditions: ApplicabilityConditionSet = {
    gravity: gravity(run), oxygenFraction: empty(), pressure: empty(), airflow: empty(), fuel: empty(), sampleGeometry: empty(), sampleSize: empty(), measurementType: empty(),
  };
  const p = run.parameters;
  const saffire = run.saffireData;
  const saffireII = run.saffireIIData;
  const saffireIII = run.saffireIIIData;
  const same = run.sameData;
  const sameR = run.sameRData;
  const flex = run.flexData;

  const oxygenPercent = saffire?.oxygenMeasurement.parsedValue ?? saffireII?.oxygenMeasurement.parsedValue;
  if (oxygenPercent != null && Number.isFinite(oxygenPercent)) {
    const measurement = saffire?.oxygenMeasurement ?? saffireII!.oxygenMeasurement;
    if (measurement.status === "EXACT") conditions.oxygenFraction = fromMeasurement(run, measurement.sourceField, measurement.rawValue, oxygenPercent, "%", "%");
  } else if (flex?.ambientComposition.oxygen.parsedValue != null && flex.ambientComposition.oxygen.status === "EXACT_SOURCE_VALUE") {
    conditions.oxygenFraction = fromMeasurement(run, flex.ambientComposition.oxygen.sourceField, flex.ambientComposition.oxygen.rawValue, flex.ambientComposition.oxygen.parsedValue * 100, "mole fraction", "%", (v) => v);
  } else if (p.oxygenPercent != null && run.family === "BASS-II" && run.measurements?.initialOxygenPercent.status === "EXACT") {
    const m = run.measurements.initialOxygenPercent;
    conditions.oxygenFraction = fromMeasurement(run, "Calibrated initial O2 % by vol", m.rawValue, m.parsedValue, "%", "%");
  }

  const pressureMmHg = flex?.ambientPressure;
  if (pressureMmHg?.parsedValue != null && pressureMmHg.status === "EXACT_SOURCE_VALUE") conditions.pressure = fromMeasurement(run, pressureMmHg.sourceField, pressureMmHg.rawValue, pressureMmHg.parsedValue * 0.133322368, "mmHg", "kPa");
  else if (p.pressureKPa != null && Number.isFinite(p.pressureKPa)) conditions.pressure = fromMeasurement(run, "parameters.pressureKPa", String(p.pressureKPa), p.pressureKPa, "kPa", "kPa");

  const airflow = saffire?.airflowCmS ?? saffireII?.airflowCmS ?? saffireIII?.airflow ?? same?.airflowCmS;
  if (airflow?.parsedValue != null && (airflow.status === "EXACT" || airflow.status === "EXACT_IN_SOURCE")) {
    const sourceUnit = "unit" in airflow ? airflow.unit ?? "cm/s" : airflow.sourceUnit;
    conditions.airflow = fromMeasurement(run, airflow.sourceField, airflow.rawValue, airflow.parsedValue, sourceUnit, "cm/s");
  }
  else if (sameR?.inletVelocityCmS.parsedValue != null && sameR.inletVelocityCmS.status === "EXACT") conditions.airflow = fromMeasurement(run, sameR.inletVelocityCmS.sourceField, sameR.inletVelocityCmS.rawValue, sameR.inletVelocityCmS.parsedValue, "cm/s", "cm/s");
  // BASS-II fan/air display values are not physical airflow measurements.

  if (flex?.rawFuel && flex.fuel) conditions.fuel = condition(flex.fuel, null, flex.rawFuel, null, "Fuel", ref(run, "Fuel", flex.rawFuel, flex.fuel, "categorical"));
  else if (run.material) conditions.fuel = condition(run.material, null, run.material, null, "Material", ref(run, "Material", run.material, run.material, "categorical"), "SOURCE_REPORTED", "Material description; not necessarily a fuel classification.");

  const { size, geometry } = sizeAndGeometry(run);
  conditions.sampleSize = size;
  conditions.sampleGeometry = geometry;
  const measuredFields = new Set(Object.entries(run.observations ?? {}).filter(([, value]) => value !== undefined && value !== null).map(([key]) => key));
  if (run.measurements) for (const [key, measurement] of Object.entries(run.measurements)) if (measurement.status === "EXACT") measuredFields.add(key);
  if (saffire) for (const [key, measurement] of Object.entries(saffire)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT") measuredFields.add(key);
  if (saffireII) for (const [key, measurement] of Object.entries(saffireII)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT") measuredFields.add(key);
  if (saffireIII) for (const [key, measurement] of Object.entries(saffireIII)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT_IN_SOURCE") measuredFields.add(key);
  if (same) for (const [key, measurement] of Object.entries(same)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT") measuredFields.add(key);
  if (sameR) for (const [key, measurement] of Object.entries(sameR)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT") measuredFields.add(key);
  if (flex) for (const [key, measurement] of Object.entries(flex)) if (typeof measurement === "object" && measurement !== null && "status" in measurement && measurement.status === "EXACT_SOURCE_VALUE") measuredFields.add(key);
  if (measuredFields.size) {
    const raw = [...measuredFields].join(", ");
    conditions.measurementType = condition(raw, null, raw, null, "normalized source measurement fields", ref(run, "normalized source measurement fields", raw, raw, "source measurement fields", "CONTEXT"), "SOURCE_CONTEXT", "Lists only populated fields whose normalized status is exact in the source. The listed measurements may be environmental inputs, aging/sensor observations, or combustion outcomes; their roles must not be conflated.");
  }

  const contentClasses: ScientificContentClass[] = ["SOURCE_REPORTED_CONDITION"];
  if (measuredFields.size) contentClasses.push("MEASURED_RESULT");
  return { run, source: { recordId: run.sourceExperimentId, investigationId: run.investigationId, family: run.family, sourceUrl: run.source.url, recordType: "EXPERIMENT_RUN" }, conditions, contentClasses };
}

export function extractFLEX2ConfigurationEvidence(configuration: FLEX2ConfigurationEnvelope): NASAConditionEvidence {
  const source = { recordId: configuration.id, investigationId: configuration.investigationId, family: "FLEX-2", sourceUrl: configuration.provenance.sourceUrl, recordType: "EXPERIMENT_CONFIGURATION_ENVELOPE" as const };
  const conditions = Object.fromEntries(dimensions.map((dimension) => [dimension, empty()])) as ApplicabilityConditionSet;
  const envelopeCondition = (field: string, raw: string, normalized: string, unit: string, note: string, sourceUnit = unit): ApplicabilityCondition => {
    const evidenceRef: MissionEvidenceReference = { id: `${source.investigationId}:${source.recordId}:${field}`, type: source.recordType, investigationId: source.investigationId, family: source.family, sourceRecordId: source.recordId, sourcePathOrCitation: source.sourceUrl, sourceField: field, rawValue: raw, normalizedValue: normalized, unit: sourceUnit, evidenceRole: "CONTEXT", notes: `Configuration envelope; ${note} Source ${configuration.provenance.sourceFile}, row ${configuration.provenance.sourceRow}, SHA-256 ${configuration.provenance.sourceSha256}.` };
    return condition(normalized, unit, raw, sourceUnit, field, evidenceRef, "SOURCE_REPORTED", note);
  };
  conditions.gravity = empty();
  conditions.oxygenFraction = envelopeCondition(configuration.oxygenMoleFractionOptions.sourceField, configuration.oxygenMoleFractionOptions.rawValue, configuration.oxygenMoleFractionOptions.values.map((value) => `${value * 100}%`).join(", "), "%", "Discrete source option set; not a run-level selected condition or measured result.", "mole fraction");
  conditions.pressure = envelopeCondition(configuration.ambientPressureOptions.sourceField, configuration.ambientPressureOptions.rawValue, configuration.ambientPressureOptions.values.map((value) => `${(value * 101.325).toFixed(3)} kPa`).join(", "), "kPa", "Discrete source option set converted from atm; not a run-level selected condition or measured result.", "atm");
  conditions.airflow = envelopeCondition(configuration.flowVelocityRange.sourceField, configuration.flowVelocityRange.rawValue, `${configuration.flowVelocityRange.minValue}–${configuration.flowVelocityRange.maxValue} cm/s`, "cm/s", "Source operating range; no individual run value is assigned.");
  conditions.fuel = envelopeCondition("Fuel", configuration.rawFuelDescription, configuration.fuelConfiguration.normalizedMaterial ?? configuration.rawFuelDescription, "categorical", "Source configuration fuel description; mixture fractions retain the source-stated basis limitation.");
  conditions.sampleGeometry = envelopeCondition("Ambient gas and droplet configuration", configuration.ambientGasMixtureRaw, "DROPLET; " + configuration.ambientGasMixtureRaw, "categorical", "Droplet geometry is explicit for this FLEX-2 configuration envelope.");
  conditions.sampleSize = envelopeCondition(configuration.initialDropletDiameterRange.sourceField, configuration.initialDropletDiameterRange.rawValue, `${configuration.initialDropletDiameterRange.minValue}–${configuration.initialDropletDiameterRange.maxValue} mm`, "mm", "Source range; no individual run value is assigned.");
  return { source, conditions, contentClasses: ["CONFIGURATION_ENVELOPE", "SOURCE_REPORTED_CONDITION"] };
}

export function nasaApplicabilityEvidence(): NASAConditionEvidence[] {
  return [
    ...nasaExperimentRuns.map(extractNASAConditionEvidence),
    ...nasaExperimentConfigurations.map(extractFLEX2ConfigurationEvidence),
  ];
}

export function createMissionScenario(kind: MissionScenarioKind): MissionScenario {
  const gravityValue: GravityRegime | null = kind === "SPACECRAFT" ? "MICROGRAVITY" : kind === "LUNAR_HABITAT" || kind === "MARS_HABITAT" ? "PARTIAL_GRAVITY" : null;
  const conditions = Object.fromEntries(dimensions.map((dimension) => [dimension, { ...empty("HYPOTHETICAL_SCENARIO"), ...(dimension === "gravity" ? { value: gravityValue, rawValue: gravityValue, note: "Qualitative planning assumption; no numeric gravity or habitat environmental setpoint is supplied." } : {}) }])) as ApplicabilityConditionSet;
  const labels: Record<MissionScenarioKind, string> = { SPACECRAFT: "Spacecraft", LUNAR_HABITAT: "Lunar habitat", MARS_HABITAT: "Mars habitat", PRESSURIZED_ROVER: "Pressurized rover" };
  return { kind, label: labels[kind], conditions };
}

function comparison(evidence: ApplicabilityCondition, mission: ApplicabilityCondition, dimension: ApplicabilityDimension): Pick<ApplicabilityRow, "status" | "explanation"> {
  if (evidence.value == null || mission.value == null) return { status: "UNKNOWN", explanation: evidence.value == null ? "Experimental condition is not reported or verified in this record." : "Mission condition is unspecified in this hypothetical profile." };
  if (dimension === "gravity") {
    if (evidence.value === "MICROGRAVITY" && mission.value === "PARTIAL_GRAVITY") return { status: "MISMATCHED", explanation: "Microgravity evidence does not directly establish behavior under lunar or Martian partial gravity." };
    return evidence.value === mission.value ? { status: "MATCHED", explanation: "Qualitative gravity regimes match; this is not numeric validation." } : { status: "MISMATCHED", explanation: "Qualitative gravity regimes differ." };
  }
  if (typeof evidence.value === "number" && typeof mission.value === "number") {
    const matched = evidence.value === mission.value;
    return { status: matched ? "MATCHED" : "MISMATCHED", explanation: matched ? "Normalized values are exactly equal; source measurement uncertainty is not characterized here." : "Normalized values are not exactly equal; no uncertainty-based tolerance is available, and this is not an outcome transferability judgment." };
  }
  if (typeof evidence.value !== typeof mission.value) return { status: "UNKNOWN", explanation: "The evidence and mission values are not comparable scalars (for example, a source option set or range versus one scenario value)." };
  const matched = String(evidence.value).trim().toLowerCase() === String(mission.value).trim().toLowerCase();
  return { status: matched ? "MATCHED" : "MISMATCHED", explanation: matched ? "Labels match textually; this does not establish equivalent materials or geometry." : "Labels differ; equivalence is not inferred." };
}

export function compareApplicability(evidence: NASAConditionEvidence, scenario: MissionScenario): EvidenceApplicability {
  const rows = dimensions.map((dimension): ApplicabilityRow => {
    const experimental = evidence.conditions[dimension];
    const mission = scenario.conditions[dimension];
    const result = comparison(experimental, mission, dimension);
    return { dimension, evidence: experimental, mission, ...result };
  });
  const limitations = ["This comparison reports condition similarity only; it does not predict fire behavior or establish material safety.", "GRAVIFIRE does not certify materials or habitats, and NASA investigation records are not NASA safety certification.", "Unknown inputs remain unknown; the comparison does not impute missing experimental or mission conditions."];
  if (evidence.conditions.gravity.value === "MICROGRAVITY" && scenario.conditions.gravity.value === "PARTIAL_GRAVITY") limitations.unshift("Microgravity evidence is not direct validation for lunar or Martian partial gravity.");
  return { rows, contentClass: "INTERPRETATION", limitations, resultClassification: "NO_SAFETY_OR_CERTIFICATION_CONCLUSION" };
}

export function setScenarioValue(scenario: MissionScenario, dimension: ApplicabilityDimension, value: ConditionScalar): MissionScenario {
  const current = scenario.conditions[dimension];
  const scenarioUnits: Partial<Record<ApplicabilityDimension, string>> = { oxygenFraction: "%", pressure: "kPa", airflow: "cm/s" };
  return { ...scenario, conditions: { ...scenario.conditions, [dimension]: { ...current, value, unit: scenarioUnits[dimension] ?? current.unit, rawValue: value == null ? null : String(value), origin: "HYPOTHETICAL_SCENARIO", sourceField: null, sourceUnit: null, provenance: null } } };
}

export function validateConditionSet(value: ApplicabilityConditionSet): boolean {
  return dimensions.every((dimension) => {
    const item = value?.[dimension];
    if (!item || !(item.value == null || typeof item.value === "string" || (typeof item.value === "number" && Number.isFinite(item.value)))) return false;
    if (item.origin === "NOT_REPORTED") return item.value == null && item.provenance == null;
    if (item.origin === "HYPOTHETICAL_SCENARIO") return item.provenance == null;
    return item.value != null && item.sourceField != null && item.provenance != null;
  });
}

export function validateNASAConditionEvidence(value: NASAConditionEvidence): boolean {
  if (!value || !validateConditionSet(value.conditions) || !value.source.recordId || !value.source.investigationId || !value.source.family) return false;
  try {
    const sourceUrl = new URL(value.source.sourceUrl);
    if (sourceUrl.protocol !== "http:" && sourceUrl.protocol !== "https:") return false;
  } catch { return false; }
  if (value.run && (value.run.dataStatus !== "REAL_NASA_DATA" || value.source.recordType !== "EXPERIMENT_RUN" || value.source.recordId !== value.run.sourceExperimentId || value.source.investigationId !== value.run.investigationId || value.source.family !== value.run.family)) return false;
  const ids = dimensions.map((dimension) => value.conditions[dimension].provenance?.id).filter((id): id is string => id != null);
  if (new Set(ids).size !== ids.length) return false;
  return dimensions.every((dimension) => {
    const item = value.conditions[dimension];
    const ref = item.provenance;
    if (!ref) return true;
    try {
      const url = new URL(ref.sourcePathOrCitation);
      return (url.protocol === "https:" || url.protocol === "http:") && ref.id.length > 0 && ref.investigationId === value.source.investigationId && ref.family === value.source.family && ref.sourceRecordId === value.source.recordId && ref.sourceField === item.sourceField && ref.rawValue === item.rawValue && ref.unit.length > 0;
    } catch { return false; }
  });
}
