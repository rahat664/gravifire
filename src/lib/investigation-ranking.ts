import { nasaInvestigationCoverage } from "@/data/nasa-investigation-coverage";
import { nasaInvestigations } from "@/data/nasa-investigations";
import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import { nasaExperimentConfigurations } from "@/data/nasa-experiment-configurations";
import { nasaApplicabilityEvidence, compareApplicability, createMissionScenario, setScenarioValue } from "@/lib/evidence-applicability";
import type { ApplicabilityDimension, ConditionScalar, MissionScenarioKind } from "@/types/applicability";
import type { ResearchPillar } from "@/types/investigation-coverage";
import type { InvestigationCoverage } from "@/types/investigation-coverage";
import type { InvestigationRankingRequest, InvestigationRankingResult, RankedInvestigation, RankingFactor } from "@/types/investigation-ranking";

export const INVESTIGATION_RANKING_ALGORITHM_VERSION = "NASA Investigation Relevance v1" as const;
export const INVESTIGATION_RANKING_WEIGHTS = { missionRelevance: 0.3, materialPhenomenonApplicability: 0.25, environmentalConditionMatch: 0.2, evidenceCompleteness: 0.25 } as const;

const missionPillarRelevance: Record<MissionScenarioKind, Record<ResearchPillar, number>> = {
  SPACECRAFT: { spacecraft_material_flammability: 1, smoke_and_aerosol_detection: 0.9, solid_material_flammability: 0.85, droplet_combustion_and_extinguishment: 0.7 },
  LUNAR_HABITAT: { spacecraft_material_flammability: 0.8, smoke_and_aerosol_detection: 1, solid_material_flammability: 0.9, droplet_combustion_and_extinguishment: 0.75 },
  MARS_HABITAT: { spacecraft_material_flammability: 0.8, smoke_and_aerosol_detection: 1, solid_material_flammability: 0.9, droplet_combustion_and_extinguishment: 0.75 },
  PRESSURIZED_ROVER: { spacecraft_material_flammability: 0.8, smoke_and_aerosol_detection: 0.95, solid_material_flammability: 0.9, droplet_combustion_and_extinguishment: 0.75 },
};

const stopWords = new Set(["about", "after", "again", "against", "and", "are", "does", "from", "into", "that", "the", "their", "them", "this", "through", "under", "using", "what", "when", "where", "which", "with", "would", "how", "for", "can", "does"]);
const conditionEvidenceByInvestigation = new Map<string, ReturnType<typeof nasaApplicabilityEvidence>>();
const sourceMaterialLabelsByInvestigation = new Map<string, Set<string>>();
for (const record of nasaApplicabilityEvidence()) {
  const current = conditionEvidenceByInvestigation.get(record.source.investigationId) ?? [];
  current.push(record);
  conditionEvidenceByInvestigation.set(record.source.investigationId, current);
}
function addSourceMaterial(investigationId: string, label: string | null | undefined) {
  if (!label) return;
  const values = sourceMaterialLabelsByInvestigation.get(investigationId) ?? new Set<string>();
  values.add(label);
  sourceMaterialLabelsByInvestigation.set(investigationId, values);
}
for (const run of nasaExperimentRuns) {
  addSourceMaterial(run.investigationId, run.sourceMetadata?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.sameData?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.sameRData?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.saffireData?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.saffireIIData?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.saffireIIIData?.normalizedMaterial);
  addSourceMaterial(run.investigationId, run.flexData?.fuel);
}
for (const configuration of nasaExperimentConfigurations) for (const component of configuration.fuelConfiguration.components) addSourceMaterial(configuration.investigationId, component.material);

function tokens(text: string): string[] {
  return [...new Set(text.toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) ?? [])].filter((token) => token.length > 2 && !stopWords.has(token)).sort();
}

function normalizeLabel(text: string): string { return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " "); }

export function getInvestigationRankingMaterialOptions(): string[] {
  return [...new Set([...nasaInvestigations.flatMap((item) => item.materials), ...[...sourceMaterialLabelsByInvestigation.values()].flatMap((items) => [...items])])].sort((a, b) => a.localeCompare(b));
}

function factor(score: number, explanation: string, matched: string[] = [], missing: string[] = []): RankingFactor {
  return { score, explanation, matched, missing };
}

export function scoreEvidenceCompleteness(entry: InvestigationCoverage): RankingFactor {
  if (entry.integrationStatus === "unavailable_or_unverified") return factor(0, "No verified integration evidence is available; absence of metadata receives no credit.", [], ["verified source integration"]);
  if (entry.integrationStatus === "reference_only") return factor(0.2, "Research reference is cataloged, but there are no verified normalized run/configuration records.", [], ["verified normalized records"]);
  const items = [
    ["source manifest", entry.provenance.sourceManifests.length > 0 && entry.provenance.sourceManifests.every((item) => item.sha256 !== null)],
    ["raw source", entry.provenance.rawSourceFiles.length > 0 && entry.provenance.rawSourceFiles.every((item) => item.sha256 !== null)],
    ["normalized artifact", entry.provenance.normalizedArtifacts.length > 0],
    ["ingestion report", entry.provenance.ingestionReportPath !== null],
  ] as const;
  const matched = items.filter(([, present]) => present).map(([label]) => label);
  const missing = items.filter(([, present]) => !present).map(([label]) => label);
  const score = matched.length / items.length;
  return factor(score, `${matched.length} of ${items.length} registry integration artifacts are present and hashed where applicable. Record count describes local ingestion coverage, not scientific confidence.`, matched, missing);
}

function applicabilityFactor(metadataText: string, catalogMaterials: string[], question: string, selectedMaterial: string): { result: RankingFactor; matchedTerms: string[] } {
  const queryTerms = tokens(question);
  const metadataTokens = new Set(tokens(metadataText));
  const questionMatched = queryTerms.filter((term) => metadataTokens.has(term));
  const questionScore = queryTerms.length ? questionMatched.length / queryTerms.length : 0.5;
  const materialNames = !selectedMaterial || selectedMaterial === "ALL" ? [] : [selectedMaterial];
  const materialMatched = materialNames.length && catalogMaterials.some((line) => normalizeLabel(line) === normalizeLabel(selectedMaterial)) ? materialNames : [];
  const materialScore = !selectedMaterial || selectedMaterial === "ALL" ? 0.5 : (materialMatched.length > 0 ? 1 : 0);
  const hasQuestion = queryTerms.length > 0;
  const hasMaterial = Boolean(selectedMaterial && selectedMaterial !== "ALL");
  const score = (questionScore + materialScore) / 2;
  const matched = [...new Set([...questionMatched.map((term) => `question:${term}`), ...materialMatched.map((term) => `material:${term}`)])];
  const missing = [...new Set([...queryTerms.filter((term) => !questionMatched.includes(term)).map((term) => `question:${term}`), ...materialNames.filter((term) => !materialMatched.includes(term)).map((term) => `material:${term}`)])];
  const explanation = hasQuestion || hasMaterial
    ? `${hasQuestion ? `Matched ${questionMatched.length}/${queryTerms.length} informative question terms` : "No informative question terms supplied (question component is neutral at 0.50)"}; ${hasMaterial ? (materialMatched.length ? "selected material label matches exactly" : "selected material label is absent") : "no explicit material filter (material component is neutral at 0.50)"}. Only cataloged title, family, pillar, category, material and capability text is searched; this is lexical matching, not semantic inference.`
    : "No question or material filter was supplied; a neutral 0.50 factor is used equally for all candidates.";
  return { result: factor(score, explanation, matched, missing), matchedTerms: questionMatched };
}

function environmentalFactor(investigationId: string, missionType: MissionScenarioKind, conditions: Partial<Record<ApplicabilityDimension, ConditionScalar>>): { result: RankingFactor; summary: RankedInvestigation["conditionSummary"]; hasExactMatch: boolean } {
  let scenario = createMissionScenario(missionType);
  for (const [key, value] of Object.entries(conditions)) if (value != null) scenario = setScenarioValue(scenario, key as ApplicabilityDimension, value);
  const targets = Object.entries(scenario.conditions).filter(([, item]) => item.value !== null);
  const catalogEntry = nasaInvestigationCoverage.find((entry) => entry.id === investigationId);
  const aliases = new Set([investigationId, ...(catalogEntry ? [catalogEntry.psiId] : [])]);
  const relevantRecords = [...aliases].flatMap((alias) => conditionEvidenceByInvestigation.get(alias) ?? []);
  if (!targets.length) return { result: factor(0, "No mission environmental conditions were supplied; this factor receives no match credit.", [], ["mission condition inputs"]), summary: { matched: [], mismatched: [], unknown: [], comparedRecordId: null }, hasExactMatch: false };
  if (!relevantRecords.length) return { result: factor(0, "No verified run or configuration-envelope conditions are linked to this investigation; missing metadata receives no match credit.", [], targets.map(([dimension]) => dimension)), summary: { matched: [], mismatched: [], unknown: targets.map(([dimension]) => dimension), comparedRecordId: null }, hasExactMatch: false };
  const comparisons = relevantRecords.map((record) => ({ record, rows: compareApplicability(record, scenario).rows.filter((row) => targets.some(([dimension]) => dimension === row.dimension)) }));
  comparisons.sort((left, right) => {
    const matchedDelta = right.rows.filter((row) => row.status === "MATCHED").length - left.rows.filter((row) => row.status === "MATCHED").length;
    if (matchedDelta) return matchedDelta;
    const knownDelta = (right.rows.filter((row) => row.status !== "UNKNOWN").length) - left.rows.filter((row) => row.status !== "UNKNOWN").length;
    return knownDelta || left.record.source.recordId.localeCompare(right.record.source.recordId);
  });
  const best = comparisons[0];
  const matched = best.rows.filter((row) => row.status === "MATCHED").map((row) => row.dimension);
  const mismatched = best.rows.filter((row) => row.status === "MISMATCHED").map((row) => row.dimension);
  const unknown = best.rows.filter((row) => row.status === "UNKNOWN").map((row) => row.dimension);
  const score = matched.length / targets.length;
  return { result: factor(score, `Best linked record ${best.record.source.recordId}: ${matched.length}/${targets.length} active profile/input conditions match exactly; ${mismatched.length} mismatch and ${unknown.length} unknown. Unknown values earn no points.`, matched, [...mismatched.map((item) => `mismatch:${item}`), ...unknown.map((item) => `unknown:${item}`)]), summary: { matched, mismatched, unknown, comparedRecordId: best.record.source.recordId }, hasExactMatch: matched.length === targets.length && targets.length > 0 };
}

export function rankNASAInvestigations(request: InvestigationRankingRequest): InvestigationRankingResult {
  const metadataById = new Map(nasaInvestigations.map((item) => [item.id, item]));
  const question = request.scientificQuestion?.trim() ?? "";
  const questionTerms = tokens(question);
  const selectedMaterial = request.material ?? "ALL";
  const materialNeedle = selectedMaterial === "ALL" ? "" : normalizeLabel(selectedMaterial);
  const selectedPillars = request.researchPillar === undefined || request.researchPillar === "ALL" ? null : Array.isArray(request.researchPillar) ? request.researchPillar : [request.researchPillar];
  const candidates = nasaInvestigationCoverage.flatMap((entry) => {
    const metadata = metadataById.get(entry.id);
    if (!metadata) return [];
    if (selectedPillars && !entry.researchPillars.some((pillar) => selectedPillars.includes(pillar))) return [];
    const sourceMaterials = [...(sourceMaterialLabelsByInvestigation.get(entry.id) ?? [])];
    const catalogMaterials = [...new Set([...metadata.materials, ...sourceMaterials])];
    const text = [metadata.title, metadata.family, metadata.category, metadata.shortDescription, ...catalogMaterials, ...metadata.capabilities, ...entry.researchPillars].join(" ");
    const metadataTokens = new Set(tokens(text));
    if (materialNeedle && !catalogMaterials.some((item) => normalizeLabel(item) === materialNeedle)) return [];
    const matchedQuestionTerms = questionTerms.filter((term) => metadataTokens.has(term));
    if (request.requireQuestionMatch && questionTerms.length > 0 && matchedQuestionTerms.length === 0) return [];
    const missionScore = Math.max(0, ...entry.researchPillars.filter((pillar) => !selectedPillars || selectedPillars.includes(pillar)).map((pillar) => missionPillarRelevance[request.missionType][pillar]));
    const materialPhenomenon = applicabilityFactor(text, catalogMaterials, question, selectedMaterial);
    if (request.requireAllConditionsMatch && Object.values(request.conditions ?? {}).some((value) => value != null)) {
      const conditionResult = environmentalFactor(entry.id, request.missionType, request.conditions ?? {});
      if (!conditionResult.hasExactMatch) return [];
    }
    const environmental = environmentalFactor(entry.id, request.missionType, request.conditions ?? {});
    const completeness = scoreEvidenceCompleteness(entry);
    const factors = {
      missionRelevance: factor(missionScore, `Research pillar assignment maps to the ${request.missionType.replaceAll("_", " ")} mission profile.`, entry.researchPillars, []),
      materialPhenomenonApplicability: materialPhenomenon.result,
      environmentalConditionMatch: environmental.result,
      evidenceCompleteness: completeness,
    };
    const score = factors.missionRelevance.score * INVESTIGATION_RANKING_WEIGHTS.missionRelevance
      + factors.materialPhenomenonApplicability.score * INVESTIGATION_RANKING_WEIGHTS.materialPhenomenonApplicability
      + factors.environmentalConditionMatch.score * INVESTIGATION_RANKING_WEIGHTS.environmentalConditionMatch
      + factors.evidenceCompleteness.score * INVESTIGATION_RANKING_WEIGHTS.evidenceCompleteness;
    return [{ entry, metadata, score, factors, questionMatchedTerms: materialPhenomenon.matchedTerms, conditionSummary: environmental.summary }];
  });
  candidates.sort((left, right) => right.score - left.score || left.entry.id.localeCompare(right.entry.id));
  const limit = Number.isInteger(request.topN) && (request.topN ?? 0) > 0 ? request.topN! : candidates.length;
  const results: RankedInvestigation[] = candidates.slice(0, limit).map((candidate, index) => ({
    id: candidate.entry.id, title: candidate.entry.title, psiId: candidate.entry.psiId, family: candidate.entry.family, score: Number(candidate.score.toFixed(6)), rank: index + 1,
    integrationStatus: candidate.entry.integrationStatus, runtimeRecordKind: candidate.entry.runtimeRecordKind, runtimeRecordCount: candidate.entry.runtimeRecordCount, researchPillars: candidate.entry.researchPillars, sourceUrl: candidate.entry.references.nasaPsiUrl,
    factors: candidate.factors, questionMatchedTerms: candidate.questionMatchedTerms, conditionSummary: candidate.conditionSummary,
    limitations: ["This ranking is for research discovery; it does not indicate material safety, fire safety, predicted performance, or NASA certification.", ...candidate.entry.limitations, ...(candidate.entry.integrationStatus === "reference_only" ? ["Reference-only research can inform discovery but is not verified run-level evidence."] : [])],
  }));
  return { algorithmVersion: INVESTIGATION_RANKING_ALGORITHM_VERSION, weights: INVESTIGATION_RANKING_WEIGHTS, request, candidatesConsidered: candidates.length, results };
}
