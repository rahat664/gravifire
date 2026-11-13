import type { MissionEvidenceReference, VerdictType } from "@/features/mission-control/types";

/** Campaign evidence states. These are not R7 presentation verdicts. */
export type CampaignEvidenceState = VerdictType;

/** R7 handover vocabulary is a separate precomputed presentation contract. */
export type R7PresentationVerdict = "SUPPORTED" | "CONTRADICTED" | "INSUFFICIENT";

export type EvidenceReferenceDTO = Pick<MissionEvidenceReference, "id" | "family" | "investigationId" | "sourceRecordId" | "sourcePathOrCitation" | "evidenceRole">;

export function campaignEvidenceDTO(reference: MissionEvidenceReference): EvidenceReferenceDTO {
  return { id: reference.id, family: reference.family, investigationId: reference.investigationId, sourceRecordId: reference.sourceRecordId, sourcePathOrCitation: reference.sourcePathOrCitation, evidenceRole: reference.evidenceRole };
}

/** No implicit EXACT→SUPPORTED mapping: callers must choose a contract explicitly. */
export function isR7PresentationVerdict(value: string): value is R7PresentationVerdict {
  return value === "SUPPORTED" || value === "CONTRADICTED" || value === "INSUFFICIENT";
}
