import { describe, expect, it, vi } from "vitest";
import { answerGroundedQuery } from "@/lib/grounded-query";
import { rankNASAInvestigations } from "@/lib/investigation-ranking";
import * as documentSearch from "@/lib/document-search";

describe("grounded query answering", () => {
    it("answers B1 initial oxygen from the structured NASA record", () => {
        const result = answerGroundedQuery({ query: "What was the initial oxygen level in Test B1?" });
        expect(result.answer).toContain("22.2%");
        expect(result.evidence.some((source) => source.citation === "PSI-25:Test-B1")).toBe(true);
        expect(result.evidenceCoverage).toBe("DIRECT");
    });

    it("returns B1 evidence without claiming a direct report link", () => {
        const result = answerGroundedQuery({ query: "What evidence do we have for B1?" });
        expect(result.evidence.some((source) => source.sourceType === "EXPERIMENT_RECORD")).toBe(true);
        expect(result.evidence.some((source) => source.sourceType === "NASA_RAW_VIDEO")).toBe(true);
        expect(result.answer).toContain("not directly linked");
        expect(result.limitations.some((item) => item.includes("Summary Report link"))).toBe(true);
    });

    it("reports genuinely missing B1 fields", () => {
        const result = answerGroundedQuery({ query: "What don't we know about B1?" });
        expect(result.limitations.some((item) => item.includes("airflow"))).toBe(true);
        expect(result.limitations.some((item) => item.includes("pressure"))).toBe(true);
        expect(result.limitations.some((item) => item.includes("outcome"))).toBe(true);
    });

    it("refuses unsupported causal interpretation", () => {
        const result = answerGroundedQuery({ query: "Why did B1 burn faster?" });
        expect(result.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
        expect(result.evidenceCoverage).toBe("INSUFFICIENT");
        expect(result.answer).toContain("does not currently have sufficient evidence");
    });

    it("retrieves the extinction velocity source page", () => {
        const result = answerGroundedQuery({ query: "What does NASA say about extinction velocity?" });
        expect(result.evidence.some((source) => source.citation === "NTRS-20210011385:p31")).toBe(true);
    });

    it("compares only stored fields", () => {
        const result = answerGroundedQuery({ query: "Compare B1 and B2" });
        expect(result.answer).toContain("Test B1");
        expect(result.answer).toContain("Test B2");
        expect(result.answer).toContain("initial O2");
        expect(result.limitations[0]).toContain("no causal interpretation");
    });

    it("uses conservative PMMA normalization", () => {
        const result = answerGroundedQuery({ query: "Which tests used PMMA?" });
        expect(result.answer).toContain("validated BASS-II records");
        expect(result.limitations[0]).toContain("Ambiguous material descriptions remain excluded");
    });

    it("handles invalid run IDs and unknown questions safely", () => {
        const invalid = answerGroundedQuery({ query: "What evidence do we have?", runId: "not-a-real-run" });
        expect(invalid.answer).toContain("could not find");
        const unknown = answerGroundedQuery({ query: "Tell me something unrelated" });
        expect(unknown.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
        expect(unknown.evidence).toHaveLength(0);
    });

    it("does not trust client-supplied ranking text as verified evidence", () => {
        const result = answerGroundedQuery({ query: "Why is this proposed condition ranked highly?", recommendationContext: "classification UNSAMPLED; matching tests 0; information value 0.789; nearest test M7" });
        expect(result.answer).not.toContain("information value 0.789");
        expect(result.evidence[0].citation).toBe("GRAVIFIRE:UNVERIFIED-CONTEXT");
        expect(result.evidenceCoverage).toBe("INSUFFICIENT");
    });

    it("explains challenge ranking with unchanged deterministic scores and factors", () => {
        const result = answerGroundedQuery({ query: "Rank NASA investigations for lunar fire detection" });
        const expected = rankNASAInvestigations({ missionType: "LUNAR_HABITAT", researchPillar: ["smoke_and_aerosol_detection"], scientificQuestion: "rank nasa investigations for lunar fire detection", topN: 5 });
        expect(result.retrievalMetadata.intent).toBe("INVESTIGATION_RELEVANCE");
        expect(result.rankingExplanations?.map(({ score, rank }) => ({ score, rank }))).toEqual(expected.results.map(({ score, rank }) => ({ score, rank })));
        expect(result.rankingExplanations?.[0].factors).toEqual(expected.results[0].factors);
        expect(result.answer).toContain("no direct lunar or Martian partial-gravity fire evidence");
        expect(result.evidence.every((source) => source.citation && source.provenance)).toBe(true);
        expect(result.answerSegments[0].evidenceIds).toEqual(result.evidence.map((source) => source.id));
    });

    it("refuses unsupported safety certification", () => {
        const result = answerGroundedQuery({ query: "Is PMMA safe for a lunar habitat?" });
        expect(result.retrievalMetadata.intent).toBe("SAFETY_REFUSAL");
        expect(result.answer).toContain("cannot certify");
        expect(result.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
        expect(result.answer).not.toContain("safe for flight");
    });

    it("states that direct partial-gravity tests are absent from verified coverage", () => {
        const result = answerGroundedQuery({ query: "Which NASA tests measured fire in lunar partial gravity?" });
        expect(result.answer).toContain("does not contain a direct lunar or Martian partial-gravity");
        expect(result.answer).not.toMatch(/test\s+#?\d/i);
        expect(result.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
    });

    it("corrects a contradictory numerical premise against the cited record", () => {
        const result = answerGroundedQuery({ query: "Was initial oxygen in Test B1 21%?" });
        expect(result.answer).toContain("22.2%");
        expect(result.answer).toContain("does not support the 21% value");
        expect(result.evidence.some((source) => source.citation === "PSI-25:Test-B1")).toBe(true);
    });

    it("fails closed when NASA document retrieval throws", () => {
        const search = vi.spyOn(documentSearch, "searchDocumentChunks").mockImplementation(() => { throw new Error("index unavailable"); });
        try {
            const result = answerGroundedQuery({ query: "What does NASA say about extinction velocity?" });
            expect(result.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
            expect(result.evidence).toHaveLength(0);
            expect(result.limitations.join(" ")).toContain("retrieval failed");
        } finally {
            search.mockRestore();
        }
    });
});
