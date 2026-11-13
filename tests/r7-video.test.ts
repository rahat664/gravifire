import { describe, expect, it } from "vitest";
import { loadR7VideoData } from "@/lib/r7/adapter";

const data = loadR7VideoData();

describe("R7 video screen contract", () => {
  it("loads the M1 mission and SIBAL priority queue from handover data", () => {
    expect(data.mission.mission_id).toBe("M1");
    expect(data.queue.priority).toBe("PRIORITY-1");
    expect((data.queue.material as Record<string, unknown>).family_key).toBe("sibal_fabric");
  });

  it("maps the supplied comparison branches without frontend verdict calculation", () => {
    expect(data.branchDefinitions.map((branch) => branch.render_state)).toEqual(["EXACT", "CONTRADICTED", "REFUSAL"]);
    expect(data.verdictById["TC-SIBAL-LG-01"].verdict).toBe("SUPPORTED");
    expect(data.verdictById["TC-SAF1-S2-01"].verdict).toBe("CONTRADICTED");
    expect(data.verdictById["TC-SIBAL-SCALE-01"].verdict).toBe("INSUFFICIENT");
  });

  it("resolves citations to authentic source rows using file row numbers", () => {
    const s1 = data.sourceRows.find((row) => row.source === "PSI-98_Experimental table_SAFFIRE-1.csv#row2");
    expect(s1?.rowNumber).toBe(2);
    expect(s1?.values[0]).toBe("S1");
    expect(s1?.runId).toBe("SAFFIRE1-S1");
  });

  it("preserves refusal missing evidence and scoped next experiment data", () => {
    const refusal = data.verdictById["TC-SIBAL-SCALE-01"];
    expect(refusal.missing_evidence?.length).toBeGreaterThan(0);
    expect(refusal.what_would_change_it?.length).toBeGreaterThan(0);
    expect(data.nextExperiments.length).toBeGreaterThan(0);
  });

  it("exposes hold-out proof only through the supplied whitelist artifact", () => {
    const entry = (data.whitelist.entries as Array<{ key: string; render_as: string }>).find((item) => item.key === "blind_holdout_false_supported");
    expect(entry?.render_as).toBe("0/5 false-SUPPORTED");
    expect(data.holdout.n_holdout_claims).toBe(5);
    expect(data.holdout.false_SUPPORTED_rate).toBe(0);
  });
});
