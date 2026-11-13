import bassReport from "../../data/nasa/normalized/bass-ii/ingestion-report.json";
import sameReport from "../../data/nasa/normalized/same/ingestion-report.json";
import saffireReport from "../../data/nasa/normalized/saffire-i/ingestion-report.json";
import saffireIIReport from "../../data/nasa/normalized/saffire-ii/ingestion-report.json";
import saffireIIIReport from "../../data/nasa/normalized/saffire-iii/ingestion-report.json";
import sameRReport from "../../data/nasa/normalized/same-r/ingestion-report.json";
import flexReport from "../../data/nasa/normalized/flex/ingestion-report.json";
import flex2Report from "../../data/nasa/normalized/flex-2/ingestion-report.json";
import spiceReport from "../../data/nasa/normalized/spice/ingestion-report.json";
import integrationRegistry from "../../data/nasa/integration-registry.json";

export type ScientificDataset = {
    id: string;
    investigationId: string;
    family: string;
    status: "INGESTED" | "NOT_INGESTED" | "SOURCE_AVAILABLE_BUT_NOT_INGESTED";
    realRuns: number;
    rejectedRuns: number;
    recordType?: string;
    recordCount?: number;
    sourceCount: number;
    archiveStatus: string;
    evidenceTypes: string[];
    provenanceStatus: string;
    lastIngestionVersion: string;
    knownLimitations: string[];
};

const archiveFamily = (id: string) => integrationRegistry.families.find((item) => item.id === id);
const metadata = (id: string) => {
    const item = archiveFamily(id);
    return {
        sourceCount: item?.sourcePaths.length ?? 0,
        archiveStatus: item?.status ?? "UNSUPPORTED_NEEDS_REVIEW",
        evidenceTypes: item?.evidenceTypes ?? [],
        provenanceStatus: item ? "SOURCE_PATH_AND_SHA256_INDEXED" : "NOT_INDEXED",
        lastIngestionVersion: integrationRegistry.generatedAt,
        knownLimitations: item?.limitations ?? [],
    };
};

export const scientificDatasets: ScientificDataset[] = [
    { id: "bass-ii", investigationId: "PSI-25", family: "BASS-II", status: "INGESTED", realRuns: bassReport.validRecords, rejectedRuns: bassReport.rejectedRecords, ...metadata("bass-ii") },
    { id: "bass", investigationId: "PSI-26", family: "BASS", status: "SOURCE_AVAILABLE_BUT_NOT_INGESTED", realRuns: 0, rejectedRuns: 0, recordType: "EXPERIMENTAL_RUN", ...metadata("bass") },
    { id: "same", investigationId: "PSI-102", family: "SAME", status: "INGESTED", realRuns: sameReport.validRecords, rejectedRuns: sameReport.rejectedRecords, ...metadata("same") },
    { id: "same-r", investigationId: "PSI-101", family: "SAME-R", status: "INGESTED", realRuns: sameRReport.validRecords, rejectedRuns: sameRReport.rejectedRecords, ...metadata("same-r") },
    { id: "saffire-i", investigationId: "PSI-98", family: "SAFFIRE-I", status: "INGESTED", realRuns: saffireReport.combustionRecords, rejectedRuns: saffireReport.rejectedRecords, ...metadata("saffire-i") },
    { id: "saffire-ii", investigationId: "PSI-99", family: "SAFFIRE-II", status: "INGESTED", realRuns: saffireIIReport.combustionExperiments, rejectedRuns: saffireIIReport.rejectedRecords, ...metadata("saffire-ii") },
    { id: "saffire-iii", investigationId: "PSI-100", family: "SAFFIRE-III", status: "INGESTED", realRuns: saffireIIIReport.validRuns, rejectedRuns: saffireIIIReport.rejectedRows, ...metadata("saffire-iii") },
    { id: "flex", investigationId: "PSI-69", family: "FLEX", status: "INGESTED", realRuns: flexReport.validRecords, rejectedRuns: flexReport.rejectedRecords, ...metadata("flex") },
    { id: "flex-2", investigationId: "PSI-68", family: "FLEX-2", status: "INGESTED", realRuns: 0, rejectedRuns: flex2Report.rejectedRecords, recordType: "CONFIGURATION_ENVELOPES", recordCount: flex2Report.validConfigurationEnvelopes, ...metadata("flex-2") },
    { id: "spice", investigationId: "PSI-107", family: "SPICE", status: "INGESTED", realRuns: 0, rejectedRuns: spiceReport.rejectedRecords, recordType: "OPERATING_CONDITION_OBSERVATIONS", recordCount: spiceReport.validObservations, ...metadata("spice") },
];
