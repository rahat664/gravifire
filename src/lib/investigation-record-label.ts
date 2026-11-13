import type { InvestigationRecordKind } from "@/types/investigation-coverage";

export function formatInvestigationRecordCount(count: number | null, kind: InvestigationRecordKind): string | null {
  if (count === null || kind === null) return null;
  if (kind === "configuration_envelopes") return `${count} configuration envelopes`;
  if (kind === "experimental_table_records") return `${count} experimental-table records`;
  return `${count} run records`;
}
