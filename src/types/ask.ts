import { NASAExperimentRun } from "@/types/experiment";
import { NASAScientificDocument } from "@/types/documents";

export type EvidenceSourceType = "EXPERIMENT_RECORD" | "NASA_DOCUMENT" | "NASA_RAW_VIDEO" | "NASA_METADATA" | "GRAVIFIRE_METHOD" | "UNKNOWN";
export type EvidenceCoverage = "DIRECT" | "PARTIAL" | "INSUFFICIENT";
export type AnswerStatus = "ANSWERED" | "PARTIALLY_ANSWERED" | "INSUFFICIENT_EVIDENCE";
export type QueryIntent = "RUN_FACT" | "RUN_EVIDENCE" | "DOCUMENT_SEARCH" | "INVESTIGATION_QUESTION" | "COMPARISON" | "KNOWLEDGE_GAP" | "INVESTIGATION_RELEVANCE" | "SAFETY_REFUSAL" | "UNKNOWN";

export type RankingExplanation = {
    algorithmVersion: "NASA Investigation Relevance v1";
    missionType: "SPACECRAFT" | "LUNAR_HABITAT" | "MARS_HABITAT" | "PRESSURIZED_ROVER";
    objective: "PREVENTION" | "DETECTION" | "SUPPRESSION";
    investigationId: string;
    title: string;
    rank: number;
    score: number;
    integrationStatus: "verified_and_ingested" | "reference_only" | "unavailable_or_unverified";
    sourceUrl: string;
    factors: import("@/types/investigation-ranking").RankedInvestigation["factors"];
    limitations: string[];
};

export type EvidenceSource = {
    id: string;
    sourceType: EvidenceSourceType;
    investigationId: string;
    title: string;
    text: string;
    citation: string;
    sourceUrl?: string;
    sourceExperimentId?: string;
    sourceSampleId?: string;
    documentId?: string;
    pageStart?: number;
    pageEnd?: number;
    dataStatus: string;
    provenance: string;
    relevanceScore?: number;
};

export type AnswerSegment = { text: string; evidenceIds: string[] };

export type GroundedQueryResult = {
    query: string;
    answerStatus: AnswerStatus;
    evidenceCoverage: EvidenceCoverage;
    answer: string;
    answerSegments: AnswerSegment[];
    evidence: EvidenceSource[];
    limitations: string[];
    relatedRuns: NASAExperimentRun[];
    relatedDocuments: NASAScientificDocument[];
    retrievalMetadata: {
        intent: QueryIntent;
        structuredHits: number;
        documentHits: number;
        evidenceAssetHits: number;
        citations: string[];
    };
    rankingExplanations?: RankingExplanation[];
};

export type GroundedQueryRequest = {
    query: string;
    runId?: string;
    investigationId?: string;
    recommendationContext?: string;
};
