"use client";

import { useMemo, useState } from "react";
import { compareApplicability, createMissionScenario, nasaApplicabilityEvidence, setScenarioValue } from "@/lib/evidence-applicability";
import type { ApplicabilityDimension, ConditionScalar, GravityRegime, MissionScenarioKind } from "@/types/applicability";

const dimensionLabels: Record<ApplicabilityDimension, string> = { gravity: "Gravity", oxygenFraction: "Oxygen fraction", pressure: "Pressure", airflow: "Airflow", fuel: "Fuel / material", sampleGeometry: "Sample geometry", sampleSize: "Sample size", measurementType: "Measurement type" };
const scenarioKinds: MissionScenarioKind[] = ["SPACECRAFT", "LUNAR_HABITAT", "MARS_HABITAT", "PRESSURIZED_ROVER"];

export default function ApplicabilityExplorer() {
  const records = useMemo(() => nasaApplicabilityEvidence(), []);
  const [runId, setRunId] = useState(records[0] ? `${records[0].source.family}:${records[0].source.recordId}` : "");
  const [kind, setKind] = useState<MissionScenarioKind>("SPACECRAFT");
  const [scenario, setScenario] = useState(() => createMissionScenario("SPACECRAFT"));
  const evidence = useMemo(() => records.find((item) => `${item.source.family}:${item.source.recordId}` === runId) ?? records[0] ?? null, [runId, records]);
  const comparison = useMemo(() => evidence ? compareApplicability(evidence, scenario) : null, [evidence, scenario]);

  function chooseScenario(nextKind: MissionScenarioKind) {
    setKind(nextKind);
    setScenario(createMissionScenario(nextKind));
  }

  function changeCondition(dimension: ApplicabilityDimension, raw: string) {
    let value: ConditionScalar = raw === "" ? null : raw;
    if (["oxygenFraction", "pressure", "airflow"].includes(dimension) && raw !== "") {
      const parsed = Number(raw);
      value = Number.isFinite(parsed) ? parsed : null;
    }
    setScenario((current) => setScenarioValue(current, dimension, value));
  }

  function valueFor(dimension: ApplicabilityDimension): string {
    const value = scenario.conditions[dimension].value;
    return value == null ? "" : String(value);
  }

  return <main className="research-console min-h-screen bg-[#050811] px-5 py-8 text-white"><div className="mx-auto max-w-6xl">
    <header className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6"><p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Evidence applicability · interpretation layer</p><h1 className="mt-2 text-3xl font-semibold">Compare NASA conditions with a mission scenario</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">This tool compares reported experimental conditions with user-defined hypothetical conditions. Similarity is not a fire prediction, safety determination, or NASA certification.</p></header>
    <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2"><label className="text-sm text-slate-300">NASA source record<select value={runId} onChange={(event) => setRunId(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/10 bg-[#0b1020] p-3 text-white">{records.map((record, index) => <option key={`${record.source.family}:${record.source.recordId}:${index}`} value={`${record.source.family}:${record.source.recordId}`}>{record.source.family} · {record.source.recordId}{record.source.recordType === "EXPERIMENT_CONFIGURATION_ENVELOPE" ? " · configuration envelope" : ` · ${record.run?.material ?? "source record"}`}</option>)}</select></label><label className="text-sm text-slate-300">Hypothetical mission environment<select value={kind} onChange={(event) => chooseScenario(event.target.value as MissionScenarioKind)} className="mt-2 block w-full rounded-lg border border-white/10 bg-[#0b1020] p-3 text-white">{scenarioKinds.map((item) => <option key={item} value={item}>{createMissionScenario(item).label}</option>)}</select></label></section>
    {scenario.conditions.gravity.value === "PARTIAL_GRAVITY" && evidence?.conditions.gravity.value === "MICROGRAVITY" && <div role="alert" className="mt-4 rounded-xl border border-amber-300/40 bg-amber-300/[0.08] p-4 text-sm text-amber-100">Microgravity evidence does not directly validate lunar or Martian partial-gravity fire behavior. This comparison cannot establish safety.</div>}
    <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="mb-4"><h2 className="text-lg font-semibold">Mission condition assumptions</h2><p className="mt-1 text-xs text-slate-400">Every entered value is a hypothetical scenario assumption. Empty fields remain unknown; no mission design defaults are supplied.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(["gravity", "oxygenFraction", "pressure", "airflow", "fuel", "sampleGeometry", "sampleSize", "measurementType"] as ApplicabilityDimension[]).map((dimension) => <label key={dimension} className="text-xs text-slate-400">{dimensionLabels[dimension]}{dimension === "gravity" ? <select value={valueFor(dimension)} onChange={(event) => changeCondition(dimension, event.target.value)} className="mt-2 block w-full rounded-lg border border-white/10 bg-[#0b1020] p-3 text-sm text-white"><option value="">Unknown</option>{(["MICROGRAVITY", "PARTIAL_GRAVITY", "NORMAL_GRAVITY"] as GravityRegime[]).map((item) => <option key={item}>{item}</option>)}</select> : <div className="mt-2 flex"><input aria-label={dimensionLabels[dimension]} type={["oxygenFraction", "pressure", "airflow"].includes(dimension) ? "number" : "text"} step="any" value={valueFor(dimension)} onChange={(event) => changeCondition(dimension, event.target.value)} className="min-w-0 flex-1 rounded-l-lg border border-white/10 bg-[#0b1020] p-3 text-sm text-white" placeholder="Unspecified"/><span className="flex items-center rounded-r-lg border border-l-0 border-white/10 px-2 text-[10px] text-slate-400">{dimension === "oxygenFraction" ? "%" : dimension === "pressure" ? "kPa" : dimension === "airflow" ? "cm/s" : "text"}</span></div>}</label>)}</div></section>
    {comparison && evidence && <><section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="border-b border-white/10 p-5"><h2 className="text-lg font-semibold">Condition comparison</h2><p className="mt-1 text-xs text-slate-400">All rows describe condition matching only. A mismatch is not a performance conclusion.</p></div><div className="divide-y divide-white/10">{comparison.rows.map((row) => <article key={row.dimension} className="grid gap-2 p-4 md:grid-cols-[150px_1fr_1fr_110px]"><strong className="text-sm text-slate-200">{dimensionLabels[row.dimension]}</strong><div><p className="text-[10px] uppercase text-slate-400">NASA record</p><p className="mt-1 break-words text-sm text-slate-300">{display(row.evidence.value, row.evidence.unit)}</p><p className="mt-1 text-[10px] text-slate-400">{row.evidence.origin.replaceAll("_", " ")}{row.evidence.sourceField ? ` · ${row.evidence.sourceField}` : ""}</p></div><div><p className="text-[10px] uppercase text-slate-400">{scenario.label} scenario</p><p className="mt-1 break-words text-sm text-slate-300">{display(row.mission.value, row.mission.unit)}</p><p className="mt-1 text-[10px] text-slate-400">{row.mission.origin.replaceAll("_", " ")}</p></div><span className={`h-fit rounded-full px-3 py-1 text-center text-[10px] font-semibold ${row.status === "MATCHED" ? "bg-emerald-400/10 text-emerald-300" : row.status === "MISMATCHED" ? "bg-rose-400/10 text-rose-300" : "bg-slate-400/10 text-slate-300"}`}>{row.status}</span><p className="text-xs leading-5 text-slate-400 md:col-start-2 md:col-span-3">{row.explanation}{row.evidence.provenance && <> · <a className="text-cyan-300 underline" href={row.evidence.provenance.sourcePathOrCitation} target="_blank" rel="noreferrer">Source record {row.evidence.provenance.sourceRecordId}</a> · raw: “{row.evidence.rawValue}” {row.evidence.sourceUnit ?? ""}; SHA-256 in provenance.</>}</p></article>)}</div></section>
    <section className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5"><h2 className="font-semibold text-emerald-200">Content classifications</h2><ul className="mt-3 space-y-2 text-xs leading-5 text-slate-400"><li><b className="text-slate-200">Source conditions:</b> reported values and qualitative context with row-level provenance.</li><li><b className="text-slate-200">Measured results:</b> remain in their source record and are not inferred by this comparison.</li><li><b className="text-slate-200">Modeled results:</b> none generated or shown here.</li><li><b className="text-slate-200">Interpretation:</b> matched / mismatched / unknown condition labels only.</li><li><b className="text-slate-200">Hypothetical scenarios:</b> editable mission assumptions, not flight/habitat specifications.</li></ul></div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5"><h2 className="font-semibold text-amber-100">Limits</h2><ul className="mt-3 space-y-2 text-xs leading-5 text-slate-400">{comparison.limitations.map((item) => <li key={item}>• {item}</li>)}</ul></div></section>
    <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"><summary className="cursor-pointer text-sm text-cyan-200">Show source provenance</summary><pre className="mt-3 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-slate-400">{JSON.stringify({ source: evidence.source, provenance: evidence.run?.provenance ?? evidence.conditions.fuel.provenance?.notes, conditions: evidence.conditions, contentClasses: evidence.contentClasses }, null, 2)}</pre></details></>}
  </div></main>;
}

function display(value: ConditionScalar, unit: string | null): string {
  return value == null ? "Unknown / not reported" : `${String(value)}${unit ? ` ${unit}` : ""}`;
}
