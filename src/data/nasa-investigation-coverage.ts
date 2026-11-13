import type { NASAInvestigation } from "@/types/experiment";
import type {
    InvestigationCoverage,
    InvestigationFileEvidence,
    ResearchPillar,
} from "@/types/investigation-coverage";
import { nasaInvestigations } from "@/data/nasa-investigations";
import sourceHashes from "../../data/nasa/provenance/source-hashes.json";

type SourceHashEntry = { path: string; sha256: string; sizeBytes: number };
type SourceHashManifest = { files: SourceHashEntry[] };

const hashEntries = (sourceHashes as SourceHashManifest).files;
const hashByPath = new Map(hashEntries.map((entry) => [entry.path, entry]));

function fileEvidence(path: string): InvestigationFileEvidence {
    const source = hashByPath.get(path);
    return {
        path,
        sha256: source?.sha256 ?? null,
        sizeBytes: source?.sizeBytes ?? null,
    };
}

type CoverageDefinition = Omit<InvestigationCoverage, "title" | "references" | "provenance"> & {
    sourceManifestPaths: string[];
    rawSourcePaths: string[];
    normalizedArtifacts: string[];
    ingestionReportPath: string | null;
    referenceMaterialPaths: string[];
    doi: string | null;
};

const definitions: CoverageDefinition[] = [
    {
        id: "bass",
        psiId: "PSI-26",
        family: "BASS",
        researchPillars: ["solid_material_flammability"],
        integrationStatus: "reference_only",
        runtimeRecordKind: null,
        runtimeRecordCount: null,
        sourceManifestPaths: ["psidata/manifests/PSI-26.json"],
        rawSourcePaths: [],
        normalizedArtifacts: [],
        ingestionReportPath: null,
        referenceMaterialPaths: [
            "psidata/PSI-26/metadata/PSI-26_metadata_PSI-102_BASS.zip",
            "Gravifier_research/BASS-II/GRAVIFIRE_BASS_PSI-26_Deep_Research.md",
            "Gravifier_research/BASS-II/GRAVIFIRE_BASS_PSI-26_Deep_Research.pdf",
        ],
        doi: null,
        limitations: [
            "Local PSI-26 material is metadata and research context; no primary experimental table or validated runtime records are present.",
        ],
    },
    {
        id: "bass-ii",
        psiId: "PSI-25",
        family: "BASS-II",
        researchPillars: ["solid_material_flammability"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_runs",
        runtimeRecordCount: 129,
        sourceManifestPaths: ["data/nasa/manifests/psi-25-bass-ii.json", "data/nasa/manifests/psi-25-bass-ii.processed.json"],
        rawSourcePaths: ["src/data/nasa/raw/bass-ii/PSI-25_Experimental table_BASS-II.csv"],
        normalizedArtifacts: ["data/nasa/normalized/bass-ii/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/bass-ii/ingestion-report.json",
        referenceMaterialPaths: ["Gravifier_research/BASS-II/GRAVIFIRE_BASS-II_PSI-25_Deep_Research.md"],
        doi: "10.60555/4qc4-de67",
        limitations: ["The count describes validated run records in the local PSI-25 table, not all NASA BASS-II source materials.", "The local table includes source-reported initial/final O2, CO2, and CO sensor fields but does not assign a per-test flame-extinction verdict; sensor readings are not suppression-effectiveness results."],
    },
    {
        id: "saffire-i",
        psiId: "PSI-98",
        family: "SAFFIRE-I",
        researchPillars: ["spacecraft_material_flammability"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_runs",
        runtimeRecordCount: 2,
        sourceManifestPaths: ["data/nasa/manifests/psi-98-saffire-i.json"],
        rawSourcePaths: ["src/data/nasa/raw/saffire-i/PSI-98_Experimental table_SAFFIRE-1.csv"],
        normalizedArtifacts: ["data/nasa/normalized/saffire-i/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/saffire-i/ingestion-report.json",
        referenceMaterialPaths: [
            "Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.md",
            "Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.pdf",
        ],
        doi: "10.60555/0t15-1z43",
        limitations: ["The PSI-98 table has two classified combustion records; two pretest flow-visualization rows are not counted as runs."],
    },
    {
        id: "saffire-ii",
        psiId: "PSI-99",
        family: "SAFFIRE-II",
        researchPillars: ["spacecraft_material_flammability"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_runs",
        runtimeRecordCount: 9,
        sourceManifestPaths: ["data/nasa/manifests/psi-99-saffire-ii.json"],
        rawSourcePaths: ["src/data/nasa/raw/saffire-ii/PSI-99_Experimental table_SAFFIRE-2.csv"],
        normalizedArtifacts: ["data/nasa/normalized/saffire-ii/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/saffire-ii/ingestion-report.json",
        referenceMaterialPaths: ["Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-II_PSI-99_Deep_Research.md"],
        doi: null,
        limitations: [
            "The normalized source retains thickness ambiguities and source unit mismatches; see the PSI-99 ingestion report and source notes.",
        ],
    },
    {
        id: "saffire-iii",
        psiId: "PSI-100",
        family: "SAFFIRE-III",
        researchPillars: ["spacecraft_material_flammability"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_runs",
        runtimeRecordCount: 2,
        sourceManifestPaths: ["data/nasa/manifests/psi-100-saffire-iii.json"],
        rawSourcePaths: ["src/data/nasa/raw/saffire-iii/PSI-100_Experimental table_SAFFIRE-3.csv"],
        normalizedArtifacts: ["data/nasa/normalized/saffire-iii/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/saffire-iii/ingestion-report.json",
        referenceMaterialPaths: [],
        doi: null,
        limitations: ["The normalized PSI-100 artifact records source-context conflicts; the conflicting values are not reconciled."],
    },
    {
        id: "same",
        psiId: "PSI-102",
        family: "SAME",
        researchPillars: ["smoke_and_aerosol_detection"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_table_records",
        runtimeRecordCount: 8,
        sourceManifestPaths: ["data/nasa/manifests/psi-102-same.json", "data/nasa/manifests/psi-102-same.processed.json"],
        rawSourcePaths: ["src/data/nasa/raw/same/PSI-102_Experimental table_SAME.csv"],
        normalizedArtifacts: ["data/nasa/normalized/same/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/same/ingestion-report.json",
        referenceMaterialPaths: [],
        doi: "10.60555/gd4k-8h62",
        limitations: ["Local source has eight records; the registry notes a discrepancy with a nine-row web display.", "The local experimental table records sample material, airflow, weight-loss rate, and aging duration; detector-response and smoke-particle-size outcomes are not present in the local rows."],
    },
    {
        id: "same-r",
        psiId: "PSI-101",
        family: "SAME-R",
        researchPillars: ["smoke_and_aerosol_detection"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_table_records",
        runtimeRecordCount: 109,
        sourceManifestPaths: ["data/nasa/manifests/psi-101-same-r.json"],
        rawSourcePaths: ["src/data/nasa/raw/same-r/PSI-101_Experimental table_SAME-R.csv"],
        normalizedArtifacts: ["data/nasa/normalized/same-r/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/same-r/ingestion-report.json",
        referenceMaterialPaths: [],
        doi: "10.60555/2np7-jv14",
        limitations: ["The local validated record count is from the PSI-101 Experimental Table, not an independent count of sensor detections.", "The local table contains sample identity and test-condition fields, not detector-response, particle-size, or alarm-outcome measurements; published reports remain research references until their source records are ingested."],
    },
    {
        id: "flex",
        psiId: "PSI-69",
        family: "FLEX",
        researchPillars: ["droplet_combustion_and_extinguishment"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "experimental_runs",
        runtimeRecordCount: 274,
        sourceManifestPaths: ["data/nasa/manifests/psi-69-flex.json"],
        rawSourcePaths: ["src/data/nasa/raw/psi-69/PSI-69_Experimental table_FLEX.csv"],
        normalizedArtifacts: ["data/nasa/normalized/flex/valid-runs.json"],
        ingestionReportPath: "data/nasa/normalized/flex/ingestion-report.json",
        referenceMaterialPaths: [],
        doi: "10.60555/mbq8-0451",
        limitations: [
            "The ingestion report records source header/unit and gas-label interpretation warnings, and a 274-row local versus 284-test report discrepancy.",
            "Only 274 local PSI-69 table rows are integrated; results described by the 284-test NASA/TP report are not backfilled into the local dataset.",
        ],
    },
    {
        id: "flex-2",
        psiId: "PSI-68",
        family: "FLEX-2",
        researchPillars: ["droplet_combustion_and_extinguishment"],
        integrationStatus: "verified_and_ingested",
        runtimeRecordKind: "configuration_envelopes",
        runtimeRecordCount: 8,
        sourceManifestPaths: ["data/nasa/manifests/psi-68-flex-2.json"],
        rawSourcePaths: ["src/data/nasa/raw/flex-2/PSI-68_Experimental table_Flex2.csv"],
        normalizedArtifacts: ["data/nasa/normalized/flex-2/configurations.json"],
        ingestionReportPath: "data/nasa/normalized/flex-2/ingestion-report.json",
        referenceMaterialPaths: [],
        doi: null,
        limitations: ["The eight records are configuration envelopes, not individual completed test runs or measured outcomes.", "No verified PSI-68 run-level extinction, burning-rate, or suppressant result table is present in the repository; NASA summary materials are references only."],
    },
];

function toCoverageRecord(definition: CoverageDefinition, investigation: NASAInvestigation): InvestigationCoverage {
    const { sourceManifestPaths, rawSourcePaths, referenceMaterialPaths, doi, ...coverage } = definition;
    return {
        ...coverage,
        title: investigation.title,
        references: { nasaPsiUrl: investigation.sourceUrl, doi },
        provenance: {
            integrationRegistryPath: "data/nasa/integration-registry.json",
            sourceHashManifestPath: "data/nasa/provenance/source-hashes.json",
            sourceManifests: sourceManifestPaths.map(fileEvidence),
            rawSourceFiles: rawSourcePaths.map(fileEvidence),
            normalizedArtifacts: definition.normalizedArtifacts,
            ingestionReportPath: definition.ingestionReportPath,
            referenceMaterialFiles: referenceMaterialPaths.map(fileEvidence),
        },
    };
}

const investigationById = new Map(nasaInvestigations.map((item) => [item.id, item]));

export const nasaInvestigationCoverage: InvestigationCoverage[] = definitions.map((definition) => {
    const investigation = investigationById.get(definition.id);
    if (!investigation) throw new Error(`Missing investigation metadata for ${definition.id}`);
    return toCoverageRecord(definition, investigation);
});

export function validateInvestigationCoverageRegistry(entries: InvestigationCoverage[]): string[] {
    const errors: string[] = [];
    const seenIds = new Set<string>();
    const seenPsiIds = new Set<string>();

    for (const entry of entries) {
        if (seenIds.has(entry.id)) errors.push(`Duplicate investigation id: ${entry.id}`);
        seenIds.add(entry.id);
        if (seenPsiIds.has(entry.psiId)) errors.push(`Duplicate PSI investigation id: ${entry.psiId}`);
        seenPsiIds.add(entry.psiId);

        let psiUrlIsValid = false;
        try {
            const psiUrl = new URL(entry.references.nasaPsiUrl);
            psiUrlIsValid = psiUrl.protocol === "https:" && psiUrl.hostname === "psi.nasa.gov" && psiUrl.pathname === `/physci/repo/data/investigations/${entry.psiId}`;
        } catch {
            psiUrlIsValid = false;
        }
        if (!psiUrlIsValid) {
            errors.push(`Invalid NASA PSI source link for ${entry.id}`);
        }
        if (entry.references.doi !== null && !/^10\.\d{4,9}\/.+/.test(entry.references.doi)) {
            errors.push(`Invalid DOI for ${entry.id}`);
        }
        if (entry.researchPillars.length === 0) errors.push(`Missing research pillar for ${entry.id}`);

        if (entry.integrationStatus === "verified_and_ingested") {
            if (!entry.runtimeRecordCount || entry.runtimeRecordCount < 1 || !entry.runtimeRecordKind) errors.push(`Verified entry lacks runtime record evidence: ${entry.id}`);
            if (entry.provenance.rawSourceFiles.length === 0 || entry.provenance.rawSourceFiles.some((file) => !file.sha256 || !file.sizeBytes)) errors.push(`Verified entry lacks hashed raw source evidence: ${entry.id}`);
            if (entry.provenance.normalizedArtifacts.length === 0 || !entry.provenance.ingestionReportPath) errors.push(`Verified entry lacks normalized ingestion artifacts: ${entry.id}`);
        } else {
            if (entry.runtimeRecordCount !== null || entry.runtimeRecordKind !== null) errors.push(`Non-ingested entry claims runtime records: ${entry.id}`);
            if (entry.provenance.rawSourceFiles.length > 0 || entry.provenance.normalizedArtifacts.length > 0 || entry.provenance.ingestionReportPath !== null) errors.push(`Non-ingested entry claims ingested source artifacts: ${entry.id}`);
        }

        if (entry.integrationStatus === "reference_only" && entry.provenance.referenceMaterialFiles.length === 0 && entry.provenance.sourceManifests.length === 0) {
            errors.push(`Reference-only entry has no reference provenance: ${entry.id}`);
        }
        if (entry.integrationStatus === "unavailable_or_unverified" && entry.limitations.length === 0) {
            errors.push(`Unverified entry must explain its coverage limitation: ${entry.id}`);
        }
    }
    return errors;
}

export const researchPillarLabels: Record<ResearchPillar, string> = {
    solid_material_flammability: "Solid material flammability",
    spacecraft_material_flammability: "Spacecraft material flammability",
    smoke_and_aerosol_detection: "Smoke and aerosol detection",
    droplet_combustion_and_extinguishment: "Droplet combustion and extinguishment",
};
