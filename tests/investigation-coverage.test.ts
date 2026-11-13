import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { nasaExperimentConfigurations } from "@/data/nasa-experiment-configurations";
import { nasaExperimentRuns } from "@/data/nasa-experiment-runs";
import { nasaInvestigationCoverage, validateInvestigationCoverageRegistry } from "@/data/nasa-investigation-coverage";
import { nasaInvestigations } from "@/data/nasa-investigations";
import integrationRegistry from "../data/nasa/integration-registry.json";
import sourceHashes from "../data/nasa/provenance/source-hashes.json";
import type { InvestigationCoverage } from "@/types/investigation-coverage";

const repositoryRoot = process.cwd();
const hashByPath = new Map(sourceHashes.files.map((file) => [file.path, file]));
const integrationById = new Map(integrationRegistry.families.map((family) => [family.id, family]));

function localPath(path: string) {
    return `${repositoryRoot}/${path}`;
}

describe("NASA investigation coverage registry", () => {
    it("contains the requested investigations and satisfies the typed coverage contract", () => {
        expect(nasaInvestigationCoverage.map((item) => item.id).sort()).toEqual([
            "bass", "bass-ii", "flex", "flex-2", "same", "same-r", "saffire-i", "saffire-ii", "saffire-iii",
        ].sort());
        expect(validateInvestigationCoverageRegistry(nasaInvestigationCoverage)).toEqual([]);
        for (const entry of nasaInvestigationCoverage) {
            const metadata = nasaInvestigations.find((investigation) => investigation.id === entry.id);
            expect(metadata).toBeDefined();
            expect(entry.title).toBe(metadata?.title);
            expect(entry.family).toBe(metadata?.family);
            expect(entry.psiId).toBe(metadata?.psiId);
            expect(entry.references.nasaPsiUrl).toBe(metadata?.sourceUrl);
        }
    });

    it("uses source-linked NASA PSI URLs and only well-formed DOI values", () => {
        for (const entry of nasaInvestigationCoverage) {
            const url = new URL(entry.references.nasaPsiUrl);
            expect(url.protocol).toBe("https:");
            expect(url.hostname).toBe("psi.nasa.gov");
            expect(url.pathname).toBe(`/physci/repo/data/investigations/${entry.psiId}`);
            if (entry.references.doi) expect(entry.references.doi).toMatch(/^10\.\d{4,9}\/\S+$/);
        }

        const malformedLink: InvestigationCoverage = {
            ...nasaInvestigationCoverage[0],
            references: { ...nasaInvestigationCoverage[0].references, nasaPsiUrl: "https://example.com/not-psi" },
        };
        expect(validateInvestigationCoverageRegistry([malformedLink])).toContain(`Invalid NASA PSI source link for ${malformedLink.id}`);
    });

    it("rejects duplicate investigation IDs and duplicate PSI IDs", () => {
        const first = nasaInvestigationCoverage[0];
        const errors = validateInvestigationCoverageRegistry([...nasaInvestigationCoverage, { ...first }]);
        expect(errors).toContain(`Duplicate investigation id: ${first.id}`);
        expect(errors).toContain(`Duplicate PSI investigation id: ${first.psiId}`);
    });

    it("keeps integration status consistent with raw, normalized, and runtime evidence", () => {
        const bass = nasaInvestigationCoverage.find((item) => item.id === "bass")!;
        expect(bass.integrationStatus).toBe("reference_only");
        expect(bass.runtimeRecordCount).toBeNull();
        expect(bass.provenance.rawSourceFiles).toHaveLength(0);
        expect(bass.provenance.normalizedArtifacts).toHaveLength(0);
        expect(bass.provenance.referenceMaterialFiles.length).toBeGreaterThan(0);

        for (const entry of nasaInvestigationCoverage.filter((item) => item.integrationStatus === "verified_and_ingested")) {
            expect(entry.runtimeRecordCount).toBeGreaterThan(0);
            expect(entry.provenance.rawSourceFiles.length).toBeGreaterThan(0);
            expect(entry.provenance.normalizedArtifacts.length).toBeGreaterThan(0);
            expect(entry.provenance.ingestionReportPath).not.toBeNull();

            const integration = integrationById.get(entry.id);
            expect(integration?.runtimeRecords).toBe(entry.runtimeRecordCount);
            expect(integration?.status).toBe("FULLY_INGESTED");

            const runtimeCount = entry.runtimeRecordKind === "configuration_envelopes"
                ? nasaExperimentConfigurations.length
                : nasaExperimentRuns.filter((run) => run.investigationId === entry.id).length;
            expect(runtimeCount).toBe(entry.runtimeRecordCount);
        }

        const invalidReferenceOnly: InvestigationCoverage = {
            ...nasaInvestigationCoverage.find((item) => item.id === "bass-ii")!,
            integrationStatus: "reference_only",
        };
        expect(validateInvestigationCoverageRegistry([invalidReferenceOnly])).toContain("Non-ingested entry claims runtime records: bass-ii");

        const unavailable: InvestigationCoverage = {
            ...bass,
            integrationStatus: "unavailable_or_unverified",
        };
        expect(validateInvestigationCoverageRegistry([unavailable])).toEqual([]);
    });

    it("verifies primary raw source files against the repository SHA-256 manifest", () => {
        for (const entry of nasaInvestigationCoverage.filter((item) => item.integrationStatus === "verified_and_ingested")) {
            for (const file of entry.provenance.rawSourceFiles) {
                expect(file.sha256).toMatch(/^[a-f0-9]{64}$/);
                const manifestEntry = hashByPath.get(file.path);
                expect(manifestEntry?.sha256).toBe(file.sha256);
                expect(existsSync(localPath(file.path))).toBe(true);
                const actualHash = createHash("sha256").update(readFileSync(localPath(file.path))).digest("hex");
                expect(actualHash).toBe(file.sha256);
            }
        }
    });

    it("keeps source, manifest, normalized, report, and reference provenance paths inspectable", () => {
        for (const entry of nasaInvestigationCoverage) {
            for (const file of entry.provenance.sourceManifests) {
                expect(existsSync(localPath(file.path))).toBe(true);
                expect(file.sha256).toMatch(/^[a-f0-9]{64}$/);
                expect(hashByPath.get(file.path)?.sha256).toBe(file.sha256);
                expect(createHash("sha256").update(readFileSync(localPath(file.path))).digest("hex")).toBe(file.sha256);
            }
            for (const path of entry.provenance.normalizedArtifacts) expect(existsSync(localPath(path))).toBe(true);
            if (entry.provenance.ingestionReportPath) expect(existsSync(localPath(entry.provenance.ingestionReportPath))).toBe(true);
            for (const file of [...entry.provenance.rawSourceFiles, ...entry.provenance.referenceMaterialFiles]) {
                expect(existsSync(localPath(file.path))).toBe(true);
                if (file.sha256) {
                    expect(hashByPath.get(file.path)?.sha256).toBe(file.sha256);
                    expect(createHash("sha256").update(readFileSync(localPath(file.path))).digest("hex")).toBe(file.sha256);
                }
            }
        }
    });
});
