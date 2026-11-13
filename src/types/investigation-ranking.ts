import type { ApplicabilityDimension, ConditionScalar, MissionScenarioKind } from "@/types/applicability";
import type { InvestigationIntegrationStatus, InvestigationRecordKind, ResearchPillar } from "@/types/investigation-coverage";

export type InvestigationRankingWeights = {
  missionRelevance: number;
  materialPhenomenonApplicability: number;
  environmentalConditionMatch: number;
  evidenceCompleteness: number;
};

export type InvestigationRankingRequest = {
  missionType: MissionScenarioKind;
  researchPillar?: ResearchPillar | ResearchPillar[] | "ALL";
  material?: string | "ALL";
  scientificQuestion?: string;
  conditions?: Partial<Record<ApplicabilityDimension, ConditionScalar>>;
  requireAllConditionsMatch?: boolean;
  requireQuestionMatch?: boolean;
  topN?: number;
};

export type RankingFactor = { score: number; explanation: string; matched: string[]; missing: string[] };
export type RankedInvestigation = {
  id: string;
  title: string;
  psiId: string;
  family: string;
  score: number;
  rank: number;
  integrationStatus: InvestigationIntegrationStatus;
  runtimeRecordKind: InvestigationRecordKind;
  runtimeRecordCount: number | null;
  researchPillars: ResearchPillar[];
  sourceUrl: string;
  factors: {
    missionRelevance: RankingFactor;
    materialPhenomenonApplicability: RankingFactor;
    environmentalConditionMatch: RankingFactor;
    evidenceCompleteness: RankingFactor;
  };
  questionMatchedTerms: string[];
  conditionSummary: { matched: string[]; mismatched: string[]; unknown: string[]; comparedRecordId: string | null };
  limitations: string[];
};

export type InvestigationRankingResult = {
  algorithmVersion: "NASA Investigation Relevance v1";
  weights: InvestigationRankingWeights;
  request: InvestigationRankingRequest;
  candidatesConsidered: number;
  results: RankedInvestigation[];
};
