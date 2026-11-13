import fs from "node:fs";
import path from "node:path";

type JsonRecord = Record<string, unknown>;

const handoverRoot = path.join(process.cwd(), "Gravifier_research", "R7_HANDOVER");
const rawRoot = path.join(process.cwd(), "src", "data", "nasa", "raw");

export type R7Evidence = {
  run_id: string | null;
  item: string;
  value: string;
  class: string;
  flags: string;
  source: string;
  role: string;
};

export type R7Verdict = JsonRecord & { tc_id: string; verdict: string; evidence: R7Evidence[]; confidence?: string; grade?: string | null; missing_evidence?: string[]; what_would_change_it?: string[]; refusal?: boolean };
export type R7SourceRow = { filename: string; rowNumber: number; runId: string | null; columns: string[]; values: string[]; source: string };

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(handoverRoot, relativePath), "utf8")) as T;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (character === "," && !quoted) { values.push(value); value = ""; } else value += character;
  }
  values.push(value);
  return values;
}

function readAllowlistedSource(filename: string): string | null {
  if (filename === "PSI-98_Experimental table_SAFFIRE-1.csv") return fs.readFileSync(path.join(rawRoot, "saffire-i", "PSI-98_Experimental table_SAFFIRE-1.csv"), "utf8");
  if (filename === "PSI-99_Experimental table_SAFFIRE-2.csv") return fs.readFileSync(path.join(rawRoot, "saffire-ii", "PSI-99_Experimental table_SAFFIRE-2.csv"), "utf8");
  return null;
}

function parseSourceReference(source: string): { filename: string; rowNumber: number } | null {
  const match = source.match(/([^/\\]+\.csv)#row(\d+)/i);
  return match ? { filename: match[1], rowNumber: Number(match[2]) } : null;
}

function loadSourceRow(source: string, runId: string | null): R7SourceRow | null {
  const reference = parseSourceReference(source);
  if (!reference) return null;
  const sourceText = readAllowlistedSource(reference.filename);
  if (sourceText === null) return null;
  const rows = sourceText.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
  const header = rows[0];
  const values = rows[reference.rowNumber - 1];
  if (!header || !values) return null;
  return { filename: reference.filename, rowNumber: reference.rowNumber, runId, columns: header, values, source };
}

export function loadR7VideoData() {
  const mission = readJson<JsonRecord>("missions/M1.json");
  const seed = readJson<{ verdicts: R7Verdict[] }>("engine/outputs/seed_verdicts.json");
  const digest = readJson<JsonRecord>("digest/R5_DIGEST_DATA.json");
  const holdout = readJson<JsonRecord>("engine/outputs/r4_tier2_holdout.json");
  const whitelist = readJson<JsonRecord>("numbers_whitelist.json");
  const verdictById = Object.fromEntries(seed.verdicts.map((verdict) => [verdict.tc_id, verdict]));
  const missionVerdicts = mission.verdict_payloads as Record<string, R7Verdict>;
  const branchDefinitions = (mission.beats as JsonRecord[]).find((beat) => beat.id === "configure")?.branches as JsonRecord[];
  const references = [...seed.verdicts.flatMap((verdict) => verdict.evidence ?? [])].map((evidence) => loadSourceRow(evidence.source, evidence.run_id)).filter((row): row is R7SourceRow => Boolean(row));
  const uniqueRows = Array.from(new Map(references.map((row) => [`${row.filename}#${row.rowNumber}`, row])).values());
  const nextExperiments = (digest.next_experiment_ranking as JsonRecord[]).filter((item) => (item.claims_unblocked as string[] | undefined)?.includes("TC-SIBAL-SCALE-01"));
  return { mission, seed, digest, holdout, whitelist, verdictById, missionVerdicts, branchDefinitions, sourceRows: uniqueRows, queue: { material: (mission.environment as JsonRecord).material, priority: "PRIORITY-1", claimCount: (mission.claims as string[]).length }, nextExperiments };
}
