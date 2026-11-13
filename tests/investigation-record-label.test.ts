import { describe, expect, it } from "vitest";
import { nasaInvestigationCoverage } from "@/data/nasa-investigation-coverage";
import { formatInvestigationRecordCount } from "@/lib/investigation-record-label";

describe("investigation coverage count terminology", () => {
  it("labels SAME and SAME-R source entries as table records rather than completed runs", () => {
    const same = nasaInvestigationCoverage.find((entry) => entry.id === "same")!;
    const sameR = nasaInvestigationCoverage.find((entry) => entry.id === "same-r")!;
    expect(same.runtimeRecordKind).toBe("experimental_table_records");
    expect(same.runtimeRecordCount).toBe(8);
    expect(formatInvestigationRecordCount(same.runtimeRecordCount, same.runtimeRecordKind)).toBe("8 experimental-table records");
    expect(sameR.runtimeRecordKind).toBe("experimental_table_records");
    expect(sameR.runtimeRecordCount).toBe(109);
    expect(formatInvestigationRecordCount(sameR.runtimeRecordCount, sameR.runtimeRecordKind)).toBe("109 experimental-table records");
  });

  it("preserves completed-run and configuration-envelope labels", () => {
    const bassII = nasaInvestigationCoverage.find((entry) => entry.id === "bass-ii")!;
    const flex2 = nasaInvestigationCoverage.find((entry) => entry.id === "flex-2")!;
    expect(formatInvestigationRecordCount(bassII.runtimeRecordCount, bassII.runtimeRecordKind)).toBe("129 run records");
    expect(flex2.runtimeRecordKind).toBe("configuration_envelopes");
    expect(formatInvestigationRecordCount(flex2.runtimeRecordCount, flex2.runtimeRecordKind)).toBe("8 configuration envelopes");
    expect(formatInvestigationRecordCount(null, null)).toBeNull();
  });
});
