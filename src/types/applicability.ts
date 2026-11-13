import type { NASAExperimentRun } from "@/types/experiment";
import type { MissionEvidenceReference } from "@/features/mission-control/types";

export type ApplicabilityDimension = "gravity" | "oxygenFraction" | "pressure" | "airflow" | "fuel" | "sampleGeometry" | "sampleSize" | "measurementType";
export type ConditionOrigin = "SOURCE_REPORTED" | "SOURCE_CONTEXT" | "DERIVED_FROM_SOURCE" | "NOT_REPORTED" | "HYPOTHETICAL_SCENARIO";
export type ScientificContentClass = "MEASURED_RESULT" | "MODELED_RESULT" | "INTERPRETATION" | "HYPOTHETICAL_SCENARIO" | "SOURCE_REPORTED_CONDITION" | "CONFIGURATION_ENVELOPE";
export type GravityRegime = "MICROGRAVITY" | "PARTIAL_GRAVITY" | "NORMAL_GRAVITY" | "UNKNOWN";
export type ConditionScalar = number | string | GravityRegime | null;

export type ApplicabilityCondition = {
  value: ConditionScalar;
  unit: string | null;
  origin: ConditionOrigin;
  rawValue: string | null;
  sourceUnit: string | null;
  sourceField: string | null;
  provenance: MissionEvidenceReference | null;
  note?: string;
};

export type ApplicabilityConditionSet = Record<ApplicabilityDimension, ApplicabilityCondition>;
export type ApplicabilityMatch = "MATCHED" | "MISMATCHED" | "UNKNOWN";
export type ApplicabilityRow = { dimension: ApplicabilityDimension; evidence: ApplicabilityCondition; mission: ApplicabilityCondition; status: ApplicabilityMatch; explanation: string };
export type MissionScenarioKind = "SPACECRAFT" | "LUNAR_HABITAT" | "MARS_HABITAT" | "PRESSURIZED_ROVER";
export type MissionScenario = { kind: MissionScenarioKind; label: string; conditions: ApplicabilityConditionSet };
export type EvidenceApplicability = { rows: ApplicabilityRow[]; contentClass: ScientificContentClass; limitations: string[]; resultClassification: "NO_SAFETY_OR_CERTIFICATION_CONCLUSION" };
export type NASAConditionEvidence = { run?: NASAExperimentRun; source: { recordId: string; investigationId: string; family: string; sourceUrl: string; recordType: "EXPERIMENT_RUN" | "EXPERIMENT_CONFIGURATION_ENVELOPE" }; conditions: ApplicabilityConditionSet; contentClasses: ScientificContentClass[] };
