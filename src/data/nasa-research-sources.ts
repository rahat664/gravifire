import sourceHashes from "../../data/nasa/provenance/source-hashes.json";

export type NASAResearchSource = {
    id: string;
    family: string;
    investigationId?: string;
    title: string;
    sourcePath: string;
    format: string;
    sha256: string;
    evidenceType: "RESEARCH_NOTE" | "SCIENCE_DOCUMENT" | "DERIVED_PROCESSED_DATA" | "MEDIA_EVIDENCE";
    extractionStatus: "NOT_EXTRACTED" | "SOURCE_FILE_ONLY";
};

function evidenceTypeFor(path: string, format: string): NASAResearchSource["evidenceType"] {
    if ([".jpg", ".jpeg", ".png", ".mp4"].includes(format)) return "MEDIA_EVIDENCE";
    if ([".pdf", ".docx", ".pptx"].includes(format)) return "SCIENCE_DOCUMENT";
    if (path.includes("/outputs/") || path.includes("/store/")) return "DERIVED_PROCESSED_DATA";
    return "RESEARCH_NOTE";
}

export const nasaResearchSources: NASAResearchSource[] = sourceHashes.files
    .filter((file) => file.path.startsWith("Gravifier_research/"))
    .map((file) => ({
        id: `archive-${file.sha256.slice(0, 16)}`,
        family: file.family,
        investigationId: file.psiId ?? undefined,
        title: file.path.split("/").pop() ?? file.path,
        sourcePath: file.path,
        format: file.path.includes(".") ? `.${file.path.split(".").pop()}` : "(none)",
        sha256: file.sha256,
        evidenceType: evidenceTypeFor(file.path, file.path.includes(".") ? `.${file.path.split(".").pop()}` : "(none)"),
        extractionStatus: "SOURCE_FILE_ONLY",
    }));
