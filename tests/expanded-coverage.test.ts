import { describe, expect, it } from "vitest";
import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import { nasaExperimentConfigurations } from "@/data/nasa-experiment-configurations";
import { nasaInvestigationCoverage } from "@/data/nasa-investigation-coverage";
import { answerGroundedQuery } from "@/lib/grounded-query";
import type { NASAExperimentRun } from "@/types/experiment";
import sameReport from "../data/nasa/normalized/same/ingestion-report.json";
import sameRReport from "../data/nasa/normalized/same-r/ingestion-report.json";
import flexReport from "../data/nasa/normalized/flex/ingestion-report.json";
import flex2Report from "../data/nasa/normalized/flex-2/ingestion-report.json";
import bassReport from "../data/nasa/normalized/bass-ii/ingestion-report.json";

describe("expanded combustion coverage evidence boundaries", () => {
    it("keeps SAME table-entry counts, run records, and FLEX-2 configuration envelopes distinct", () => {
        expect(sameReport.validRecords).toBe(8);
        expect(sameRReport.validRecords).toBe(109);
        expect(flexReport.validRecords).toBe(274);
        expect(flex2Report.validConfigurationEnvelopes).toBe(8);
        expect(flex2Report.runLevelResultsAvailable).toBe(false);
        expect(bassReport.validRecords).toBe(129);
        expect(nasaExperimentRuns.filter((run) => run.investigationId === "same")).toHaveLength(8);
        expect(nasaExperimentRuns.filter((run) => run.investigationId === "same-r")).toHaveLength(109);
        expect(nasaInvestigationCoverage.find((entry) => entry.id === "same")?.runtimeRecordKind).toBe("experimental_table_records");
        expect(nasaInvestigationCoverage.find((entry) => entry.id === "same-r")?.runtimeRecordKind).toBe("experimental_table_records");
        expect(nasaInvestigationCoverage.find((entry) => entry.id === "flex")?.runtimeRecordKind).toBe("experimental_runs");
        expect(nasaInvestigationCoverage.find((entry) => entry.id === "flex-2")?.runtimeRecordKind).toBe("configuration_envelopes");
        expect(nasaExperimentRuns.filter((run) => run.investigationId === "flex")).toHaveLength(274);
        expect(nasaExperimentConfigurations.filter((item) => item.investigationId === "PSI-68")).toHaveLength(8);
        expect(nasaExperimentRuns.some((run) => run.family === "FLEX-2")).toBe(false);
    });

    it("records verified investigation DOI and the family-specific measurement limitations", () => {
        expect(nasaInvestigationCoverage.find((item) => item.id === "same-r")?.references.doi).toBe("10.60555/2np7-jv14");
        expect(nasaInvestigationCoverage.find((item) => item.id === "same")?.limitations.join(" ")).toMatch(/detector-response and smoke-particle-size outcomes are not present/i);
        expect(nasaInvestigationCoverage.find((item) => item.id === "same-r")?.limitations.join(" ")).toMatch(/not detector-response, particle-size, or alarm-outcome measurements/i);
        expect(nasaInvestigationCoverage.find((item) => item.id === "flex")?.limitations.join(" ")).toMatch(/274 local PSI-69 table rows/i);
        expect(nasaInvestigationCoverage.find((item) => item.id === "flex-2")?.limitations.join(" ")).toMatch(/not individual completed test runs/i);
        expect(nasaInvestigationCoverage.find((item) => item.id === "bass-ii")?.limitations.join(" ")).toMatch(/does not assign a per-test flame-extinction verdict/i);
    });

    it("answers BASS-II source sensor fields without asserting suppression success", () => {
        const run = nasaExperimentRuns.find((item) => item.family === "BASS-II" && item.sourceExperimentId === "B1") as NASAExperimentRun;
        const finalCo = answerGroundedQuery({ query: "What final CO reading was recorded in BASS-II Test B1?", investigationId: "bass-ii" });
        expect(finalCo.answer).toContain(run.measurements!.finalCOPpm.rawValue);
        expect(finalCo.answer).toContain("ppm");
        expect(finalCo.evidence.some((source) => source.citation === "PSI-25:Test-B1")).toBe(true);
        expect(finalCo.limitations.join(" ")).toMatch(/does not infer an outcome or causal interpretation/i);

        const outcome = answerGroundedQuery({ query: "Did BASS-II Test B1 extinguish?", investigationId: "bass-ii" });
        expect(outcome.answerStatus).toBe("INSUFFICIENT_EVIDENCE");
        expect(outcome.answer).toMatch(/does not provide a verified per-test flame-extinction verdict/i);
    });
});
