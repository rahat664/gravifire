import type { ExperimentFamily } from "@/types/experiment";

export type InvestigationIntegrationStatus =
    | "verified_and_ingested"
    | "reference_only"
    | "unavailable_or_unverified";

export type ResearchPillar =
    | "solid_material_flammability"
    | "spacecraft_material_flammability"
    | "smoke_and_aerosol_detection"
    | "droplet_combustion_and_extinguishment";

export type InvestigationRecordKind =
    | "experimental_runs"
    | "experimental_table_records"
    | "configuration_envelopes"
    | null;

export type InvestigationFileEvidence = {
    path: string;
    sha256: string | null;
    sizeBytes: number | null;
};

export type InvestigationCoverage = {
    id: string;
    title: string;
    psiId: string;
    family: ExperimentFamily;
    researchPillars: ResearchPillar[];
    integrationStatus: InvestigationIntegrationStatus;
    runtimeRecordKind: InvestigationRecordKind;
    runtimeRecordCount: number | null;
    references: {
        nasaPsiUrl: string;
        doi: string | null;
    };
    provenance: {
        integrationRegistryPath: string;
        sourceHashManifestPath: string;
        sourceManifests: InvestigationFileEvidence[];
        rawSourceFiles: InvestigationFileEvidence[];
        normalizedArtifacts: string[];
        ingestionReportPath: string | null;
        referenceMaterialFiles: InvestigationFileEvidence[];
    };
    limitations: string[];
};
