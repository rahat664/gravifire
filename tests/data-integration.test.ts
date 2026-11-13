import { describe, expect, it } from "vitest";
import { scientificDatasets } from "../src/data/scientific-datasets";
import integrationRegistry from "../data/nasa/integration-registry.json";
import sourceHashes from "../data/nasa/provenance/source-hashes.json";
import { nasaResearchSources } from "../src/data/nasa-research-sources";

describe("merged NASA data integration", () => {
    it("registers the merged PSI-26 source without pretending it is ingested", () => {
        const bass = scientificDatasets.find((dataset) => dataset.id === "bass");
        expect(bass?.investigationId).toBe("PSI-26");
        expect(bass?.status).toBe("SOURCE_AVAILABLE_BUT_NOT_INGESTED");
        expect(bass?.realRuns).toBe(0);
        expect(bass?.archiveStatus).toBe("SOURCE_AVAILABLE_BUT_NOT_INGESTED");
    });

    it("keeps the existing runtime families and evidence types explicit", () => {
        expect(scientificDatasets.map((dataset) => dataset.family)).toEqual(expect.arrayContaining([
            "BASS-II", "SAFFIRE-I", "SAFFIRE-II", "SAFFIRE-III", "SAME", "SAME-R", "FLEX", "FLEX-2", "SPICE",
        ]));
        expect(scientificDatasets.find((dataset) => dataset.id === "flex-2")?.evidenceTypes).toContain("EXPERIMENT_CONFIGURATION_ENVELOPE");
        expect(scientificDatasets.find((dataset) => dataset.id === "spice")?.evidenceTypes).toContain("OPERATING_CONDITION_OBSERVATION");
    });

    it("records source hashes without collapsing duplicate archive paths", () => {
        expect(sourceHashes.files.length).toBeGreaterThan(0);
        expect(sourceHashes.files.every((file) => /^[a-f0-9]{64}$/.test(file.sha256))).toBe(true);
        const duplicateHashCount = new Set(sourceHashes.files.map((file) => file.sha256)).size;
        expect(duplicateHashCount).toBeLessThan(sourceHashes.files.length);
    });

    it("matches generated registry counts to the application dataset registry", () => {
        for (const family of integrationRegistry.families) {
            const dataset = scientificDatasets.find((item) => item.id === family.id);
            if (!dataset) continue;
            expect(dataset.sourceCount).toBe(family.sourcePaths.length);
            expect(dataset.archiveStatus).toBe(family.status);
        }
    });

    it("registers merged research artifacts as source-only evidence context", () => {
        expect(nasaResearchSources.length).toBeGreaterThan(0);
        expect(nasaResearchSources.every((source) => source.extractionStatus === "SOURCE_FILE_ONLY")).toBe(true);
        expect(nasaResearchSources.some((source) => source.sourcePath.includes("R7_HANDOVER"))).toBe(true);
    });
});
