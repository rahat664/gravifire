import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type Family = {
    id: string;
    displayName: string;
    psiId: string;
    sourcePaths: string[];
    runtimeRecords: number;
    rejectedRecords: number;
    status: "FULLY_INGESTED" | "PARTIALLY_INGESTED" | "SOURCE_AVAILABLE_BUT_NOT_INGESTED" | "RESEARCH_ONLY" | "UNSUPPORTED_NEEDS_REVIEW";
    evidenceTypes: string[];
    limitations: string[];
};

type SourceEntry = {
    family: string;
    psiId: string | null;
    fileName: string;
    path: string;
    format: string;
    sizeBytes: number;
    purpose: string;
    sourceStatus: "RAW" | "DERIVED" | "REFERENCE" | "RESEARCH";
    ingestionStatus: string;
    provenance: string;
    sha256: string;
};

type JsonRecord = Record<string, unknown>;

const root = process.cwd();
const generatedAt = "2026-10-06";
const archiveRoots = ["src/data/nasa/raw", "data/nasa/manifests", "data/nasa/normalized", "psidata", "Gravifier_research"];
const familyMap: Record<string, { id: string; displayName: string; psiId: string }> = {
    "PSI-25": { id: "bass-ii", displayName: "BASS-II", psiId: "PSI-25" },
    "PSI-26": { id: "bass", displayName: "BASS", psiId: "PSI-26" },
    "PSI-68": { id: "flex-2", displayName: "FLEX-2", psiId: "PSI-68" },
    "PSI-69": { id: "flex", displayName: "FLEX", psiId: "PSI-69" },
    "PSI-98": { id: "saffire-i", displayName: "SAFFIRE-I", psiId: "PSI-98" },
    "PSI-99": { id: "saffire-ii", displayName: "SAFFIRE-II", psiId: "PSI-99" },
    "PSI-100": { id: "saffire-iii", displayName: "SAFFIRE-III", psiId: "PSI-100" },
    "PSI-101": { id: "same-r", displayName: "SAME-R", psiId: "PSI-101" },
    "PSI-102": { id: "same", displayName: "SAME", psiId: "PSI-102" },
    "PSI-107": { id: "spice", displayName: "SPICE", psiId: "PSI-107" },
};

async function walk(directory: string): Promise<string[]> {
    const output: string[] = [];
    for (const item of await readdir(directory, { withFileTypes: true })) {
        const absolute = path.join(directory, item.name);
        if (item.isDirectory()) output.push(...await walk(absolute));
        else output.push(absolute);
    }
    return output;
}

function relative(absolute: string): string {
    return path.relative(root, absolute).split(path.sep).join("/");
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function psiIdFor(filePath: string): string | null {
    const match = filePath.match(/PSI[-_ ]?(25|26|68|69|98|99|100|101|102|107)/i);
    return match ? `PSI-${match[1]}` : null;
}

function familyFor(filePath: string): { id: string; displayName: string; psiId: string } | null {
    const psi = psiIdFor(filePath);
    if (psi && familyMap[psi]) return familyMap[psi];
    const normalized = filePath.toLowerCase();
    if (normalized.includes("bass-ii") || normalized.includes("bass_ii")) return familyMap["PSI-25"];
    if (normalized.includes("saffire-iii")) return familyMap["PSI-100"];
    if (normalized.includes("saffire-ii")) return familyMap["PSI-99"];
    if (normalized.includes("saffire-i")) return familyMap["PSI-98"];
    if (normalized.includes("same-r")) return familyMap["PSI-101"];
    if (normalized.includes("same")) return familyMap["PSI-102"];
    if (normalized.includes("flex-2")) return familyMap["PSI-68"];
    if (normalized.includes("flex")) return familyMap["PSI-69"];
    if (normalized.includes("spice")) return familyMap["PSI-107"];
    return null;
}

function sourceStatus(filePath: string): SourceEntry["sourceStatus"] {
    if (filePath.includes("/normalized/") || filePath.includes("/processed.")) return "DERIVED";
    if (filePath.includes("Gravifier_research/")) return "RESEARCH";
    if (filePath.includes("manifests/") || /reference|metadata/i.test(filePath)) return "REFERENCE";
    return "RAW";
}

function purpose(filePath: string, extension: string): string {
    if (filePath.includes("/normalized/")) return "deterministic normalized runtime artifact";
    if (filePath.includes("Experimental table") || extension === ".csv") return "experimental table or structured source data";
    if (extension === ".pdf" || extension === ".md") return filePath.includes("Gravifier_research/") ? "research report or scientific notes" : "scientific document";
    if ([".mp4", ".jpg", ".jpeg", ".png"].includes(extension)) return "media evidence or selected research frame";
    if ([".xlsx", ".docx", ".pptx", ".zip"].includes(extension)) return "engineering, reference, or metadata package";
    if (filePath.includes("manifest")) return "source manifest and provenance metadata";
    return "scientific archive artifact";
}

function readJson(filePath: string): JsonRecord | null {
    try {
        const value: unknown = JSON.parse(readFileSync(filePath, "utf8"));
        return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : null;
    } catch {
        return null;
    }
}

function firstNumber(record: JsonRecord | null | undefined, keys: string[]): number {
    for (const key of keys) if (typeof record?.[key] === "number") return record[key];
    return 0;
}

function stringArray(record: JsonRecord | null | undefined, key: string): string[] {
    const value = record?.[key];
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function main() {
    const files = (await Promise.all(archiveRoots.map(async (entry) => {
        const absolute = path.join(root, entry);
        try { return await walk(absolute); } catch { return []; }
    }))).flat().filter((file) => !file.includes("/scripts/") && !file.endsWith("/.gitkeep"));

    const entries: SourceEntry[] = [];
    for (const absolute of files) {
        const filePath = relative(absolute);
        const info = await stat(absolute);
        const content = await readFile(absolute);
        const extension = path.extname(absolute).toLowerCase() || "(none)";
        const family = familyFor(filePath);
        const status = sourceStatus(filePath);
        entries.push({
            family: family?.displayName ?? "Cross-family / archive",
            psiId: family?.psiId ?? psiIdFor(filePath),
            fileName: path.basename(absolute),
            path: filePath,
            format: extension,
            sizeBytes: info.size,
            purpose: purpose(filePath, extension),
            sourceStatus: status,
            ingestionStatus: status === "DERIVED" ? "GENERATED_RUNTIME_ARTIFACT" : family && ["BASS-II", "FLEX", "FLEX-2", "SAFFIRE-I", "SAFFIRE-II", "SAFFIRE-III", "SAME", "SAME-R", "SPICE"].includes(family.displayName) ? "FAMILY_ADAPTER_PRESENT" : "RESEARCH_OR_SOURCE_ONLY",
            provenance: family ? "PSI/family inferred from path or manifest; verify source-specific metadata before stronger claims" : "archive path only",
            sha256: createHash("sha256").update(content).digest("hex"),
        });
    }

    const currentReports = new Map<string, JsonRecord>();
    for (const family of Object.values(familyMap)) {
        const reportPath = path.join(root, "data", "nasa", "normalized", family.id, "ingestion-report.json");
        const report = readJson(reportPath);
        if (report) currentReports.set(family.displayName, report);
    }

    const runtimeValues = (family: string, report: JsonRecord | null | undefined) => ({
        rawRows: firstNumber(report, ["rawRows", "rawRecordsFound"]),
        valid: firstNumber(report, ["validRecords", "combustionRecords", "combustionExperiments", "validRuns", "validConfigurationEnvelopes", "validObservations"]),
        rejected: firstNumber(report, ["rejectedRecords", "rejectedRows"]),
        pretest: firstNumber(report, ["pretestRecords", "pretestFlowVisualizationRecords"]),
        sourceNotes: firstNumber(report, ["sourceNoteRecords"]),
        duplicates: firstNumber(report, ["duplicateRecords", "duplicateFLEXTestCount", "exactDuplicateOccurrences"]),
        warningCount: stringArray(report, "warnings").length || stringArray(report, "schemaWarnings").length,
        evidenceType: typeof report?.sourceRecordType === "string" ? report.sourceRecordType : family === "FLEX-2" ? "CONFIGURATION_ENVELOPE" : family === "SPICE" ? "OPERATING_CONDITION_OBSERVATION" : "EXPERIMENTAL_RUN",
    });

    const families: Family[] = Object.values(familyMap).map((family) => {
        const report = currentReports.get(family.displayName);
        const runtime = runtimeValues(family.displayName, report);
        const sourcePaths = entries.filter((entry) => entry.family === family.displayName && entry.sourceStatus !== "DERIVED").map((entry) => entry.path);
        const researchOnly = sourcePaths.length > 0 && sourcePaths.every((source) => source.startsWith("Gravifier_research/"));
        const status = report ? (runtime.valid > 0 || family.displayName === "FLEX-2" || family.displayName === "SPICE" ? "FULLY_INGESTED" : "PARTIALLY_INGESTED") : researchOnly ? "RESEARCH_ONLY" : "SOURCE_AVAILABLE_BUT_NOT_INGESTED";
        return { id: family.id, displayName: family.displayName, psiId: family.psiId, sourcePaths, runtimeRecords: runtime.valid, rejectedRecords: runtime.rejected, status, evidenceTypes: [runtime.evidenceType], limitations: [...new Set(stringArray(report, "warnings").concat(stringArray(report, "schemaWarnings")))] };
    });

    const hashGroups = new Map<string, SourceEntry[]>();
    for (const entry of entries) hashGroups.set(entry.sha256, [...(hashGroups.get(entry.sha256) ?? []), entry]);
    const exactDuplicates = [...hashGroups.values()].filter((group) => group.length > 1);

    const outputDir = path.join(root, "data", "nasa", "provenance");
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "source-hashes.json"), JSON.stringify({ generatedAt, files: entries.map(({ path: filePath, sha256, sizeBytes, family, psiId }) => ({ path: filePath, sha256, sizeBytes, family, psiId })) }, null, 2) + "\n");
    await writeFile(path.join(root, "data", "nasa", "integration-registry.json"), JSON.stringify({ generatedAt, families }, null, 2) + "\n");

    const formatTable = entries.map((entry) => `| ${entry.family} | ${entry.psiId ?? "—"} | ${entry.fileName.replace(/\|/g, "\\|")} | \`${entry.path}\` | ${entry.format} | ${formatBytes(entry.sizeBytes)} | ${entry.purpose} | ${entry.sourceStatus} | ${entry.ingestionStatus} | SHA-256 |`).join("\n");
    const familyTable = families.map((family) => {
        const report = currentReports.get(family.displayName);
        const runtime = runtimeValues(family.displayName, report);
        const archiveCount = entries.filter((entry) => entry.family === family.displayName).length;
        return `| ${family.displayName} | ${family.psiId} | ${archiveCount} | ${runtime.valid} | ${runtime.rejected} | ${family.status} | ${runtime.evidenceType} | ${family.sourcePaths.length ? "path + SHA-256; source-specific metadata varies" : "not available"} |`;
    }).join("\n");
    const inventory = `# Merged NASA Data Integration Inventory\n\nGenerated deterministically on ${generatedAt} by pnpm tsx scripts/audit-merged-data.ts. Raw source files were not modified. Hashes are recorded in data/nasa/provenance/source-hashes.json.\n\n## Scope\n\nThe archive includes the current GRAVIFIRE runtime inputs under src/data/nasa/raw and data/nasa/normalized, plus the merged research and PSI trees under Gravifier_research and psidata. Research and source artifacts are not treated as runtime evidence until an adapter validates them.\n\n## Experiment family status\n\n| Family | PSI | Archive files | Runtime records | Rejected | Integration status | Evidence type | Provenance |\n|---|---|---:|---:|---:|---|---|---|\n${familyTable}\n\n## Source classification\n\n| Family | PSI | Filename | Path | Format | Size | Purpose | Raw/derived status | Ingestion status | Hash |\n|---|---|---|---|---|---:|---|---|---|---|\n${formatTable}\n\n## Interpretation rules\n\n- data/nasa/normalized is generated runtime data and remains separate from raw source files.\n- CSV tables are not assumed to be run-level experiments; adapters classify pretests, notes, configuration envelopes, observations, and runs.\n- Approximate, range, text, missing, and review-required values remain status-bearing.\n- Research notes and media are provenance-linked source/context candidates, not automatically measured results.\n- PSI-26/BASS has target-repository metadata but no validated runtime adapter in this application.\n`;
    await writeFile(path.join(root, "docs", "DATA_INTEGRATION_INVENTORY.md"), inventory);

    const qualityRows = families.map((family) => {
        const report = currentReports.get(family.displayName);
        const runtime = runtimeValues(family.displayName, report);
        const sourceRows = entries.filter((entry) => entry.family === family.displayName && entry.format === ".csv").length;
        const warnings = stringArray(report, "warnings").concat(stringArray(report, "schemaWarnings"));
        return `### ${family.displayName} / ${family.psiId}\n\n- Source CSV files: ${sourceRows}\n- Reported source rows: ${runtime.rawRows || "not reported"}\n- Valid runtime records: ${runtime.valid}\n- Excluded/rejected records: ${runtime.rejected}\n- Pretest records: ${runtime.pretest}\n- Source-note records: ${runtime.sourceNotes}\n- Duplicate indicators: ${runtime.duplicates}\n- Evidence type: ${runtime.evidenceType}\n- Schema warnings: ${warnings.length ? warnings.join("; ") : "none reported"}\n- Archive files indexed: ${entries.filter((entry) => entry.family === family.displayName).length}\n`;
    }).join("\n");
    const quality = `# Merged Data Quality Report\n\nGenerated on ${generatedAt} from current files by pnpm tsx scripts/audit-merged-data.ts. Counts below come from the checked-in normalized ingestion reports and the current archive scan; no historical counts were copied into runtime.\n\n## Summary\n\nThe current application has deterministic adapters for BASS-II, FLEX, FLEX-2, SAFFIRE-I, SAFFIRE-II, SAFFIRE-III, SAME, SAME-R, and SPICE. PSI-26/BASS is source metadata only and requires a reviewed adapter before it can enter the runtime.\n\n## Family quality\n\n${qualityRows}\n\n## Cross-cutting warnings\n\n- Text statuses and approximate/range values are retained by family normalizers; they are not converted into invented numeric measurements.\n- SAFFIRE-II source-review thickness values remain distinct from normalized context.\n- SAFFIRE-III source conflicts remain represented in its normalized conflict artifact.\n- FLEX-2 is a configuration envelope, not a run-level result.\n- SPICE is an operating-condition observation set, not a universal combustion outcome dataset.\n- Research PDFs, reports, images, videos, SQLite stores, and compressed time series remain research/media/source artifacts unless a family adapter links them defensibly.\n\n## Current runtime versus merged archive\n\nThe merged archive adds research, PSI metadata, and duplicate/reference copies around the existing runtime inputs. No current normalized runtime artifact was overwritten. Differences are therefore classified as ARCHIVE_CONTEXT_ADDED unless a future reviewed adapter proves a source-version conflict.\n`;
    const duplicateRows = exactDuplicates.map((group) => `| EXACT_DUPLICATE | ${group[0].sha256} | ${group.map((entry) => entry.path).join("<br>")} |`).join("\n");
    const qualityWithDuplicates = quality.replace("## Current runtime versus merged archive", `## Duplicate findings\n\nThe archive scan found ${exactDuplicates.length} exact duplicate content groups. No files were deleted. Identical copies are retained where they belong to separate source/research paths; a source-version conflict requires human review and was not silently normalized.\n\n| Classification | SHA-256 | Paths |\n|---|---|---|\n${duplicateRows || "| None detected | — | — |"}\n\n## Current runtime versus merged archive`);
    await writeFile(path.join(root, "docs", "DATA_QUALITY_REPORT.md"), qualityWithDuplicates);

    console.log(JSON.stringify({ generatedAt, indexedFiles: entries.length, families }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
