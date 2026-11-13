"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { nasaInvestigations } from "@/data/nasa-investigations";
import { getGameScienceContext, type GameScienceMissionId } from "@/lib/game-science-context";
import { resolveAuthoritativeGameAudit } from "@/lib/game-science-audit";
import { researchPillarLabels } from "@/data/nasa-investigation-coverage";
import { compareApplicability, createMissionScenario, nasaApplicabilityEvidence, setScenarioValue } from "@/lib/evidence-applicability";
import { rankNASAInvestigations } from "@/lib/investigation-ranking";
import { formatInvestigationRecordCount } from "@/lib/investigation-record-label";
import type { ApplicabilityDimension, ConditionScalar, MissionScenarioKind, NASAConditionEvidence } from "@/types/applicability";
import type { ResearchPillar } from "@/types/investigation-coverage";
import type { NASAExperimentRun } from "@/types/experiment";

export type MissionObjective = "PREVENTION" | "DETECTION" | "SUPPRESSION";
const objectivePillars: Record<MissionObjective, ResearchPillar[]> = {
  PREVENTION: ["solid_material_flammability", "spacecraft_material_flammability"],
  DETECTION: ["smoke_and_aerosol_detection"],
  SUPPRESSION: ["solid_material_flammability", "droplet_combustion_and_extinguishment"],
};
const objectiveTerms: Record<MissionObjective, string> = {
  PREVENTION: "flammability material flame spread ignition prevention",
  DETECTION: "smoke aerosol detection sensor",
  SUPPRESSION: "fire suppression extinction flame droplet combustion",
};
const missionTypes: MissionScenarioKind[] = ["SPACECRAFT", "LUNAR_HABITAT", "MARS_HABITAT", "PRESSURIZED_ROVER"];
const dimensionLabels: Record<ApplicabilityDimension, string> = { gravity: "Gravity", oxygenFraction: "Oxygen fraction", pressure: "Pressure", airflow: "Airflow", fuel: "Fuel / material", sampleGeometry: "Sample geometry", sampleSize: "Sample size", measurementType: "Measurement type" };

export default function ChallengeDashboard({ initialMission = "SPACECRAFT", initialObjective = "PREVENTION", initialInvestigationId = null, initialRecordId, initialQuestion = "", gameMission = null }: { initialMission?: MissionScenarioKind; initialObjective?: MissionObjective; initialInvestigationId?: string | null; initialRecordId?: string; initialQuestion?: string; gameMission?: GameScienceMissionId | null }) {
  const evidenceRecords = useMemo(() => nasaApplicabilityEvidence(), []);
  const [mission, setMission] = useState<MissionScenarioKind>(initialMission);
  const [objective, setObjective] = useState<MissionObjective>(initialObjective);
  const [question, setQuestion] = useState(initialQuestion);
  const [missionConditions, setMissionConditions] = useState<Partial<Record<ApplicabilityDimension, ConditionScalar>>>({});
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string | null>(initialInvestigationId);
  const [selectedRecordKey, setSelectedRecordKey] = useState<string | null>(null);

  const ranking = useMemo(() => rankNASAInvestigations({
    missionType: mission,
    researchPillar: objectivePillars[objective],
    scientificQuestion: `${objectiveTerms[objective]} ${question}`.trim(),
  }), [mission, objective, question]);
  const selectedRank = ranking.results.find((item) => item.id === selectedInvestigationId) ?? ranking.results[0] ?? null;
  const metadata = nasaInvestigations.find((item) => item.id === selectedRank?.id) ?? null;
  const records = evidenceRecords.filter((item) => item.source.investigationId === selectedRank?.id || item.source.investigationId === selectedRank?.psiId);
  const selectedEvidence = records.find((item) => recordKey(item) === selectedRecordKey) ?? records.find((item) => item.source.recordId === initialRecordId) ?? records[0] ?? null;
  const selectedRun = selectedEvidence?.run ?? null;
  const scientificAudit = useMemo(() => gameMission ? resolveAuthoritativeGameAudit(gameMission) : null, [gameMission]);
  const gameContext = gameMission ? getGameScienceContext(gameMission) : null;

  const scenario = useMemo(() => {
    let result = createMissionScenario(mission);
    for (const [dimension, value] of Object.entries(missionConditions)) {
      if (value != null) result = setScenarioValue(result, dimension as ApplicabilityDimension, value);
    }
    return result;
  }, [mission, missionConditions]);
  const interpretation = selectedEvidence ? compareApplicability(selectedEvidence, scenario) : null;

  function setMissionCondition(dimension: ApplicabilityDimension, raw: string) {
    let value: ConditionScalar = raw === "" ? null : raw;
    if (["oxygenFraction", "pressure", "airflow"].includes(dimension) && raw !== "") {
      const parsed = Number(raw);
      value = Number.isFinite(parsed) ? parsed : null;
    }
    setMissionConditions((current) => ({ ...current, [dimension]: value }));
  }

  function selectInvestigation(id: string) {
    setSelectedInvestigationId(id);
    setSelectedRecordKey(null);
  }

  return <main className="command-dashboard min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <header className="command-dashboard__header mb-5 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div><p className="text-xs uppercase tracking-[0.24em] text-cyan-300">NASA Space Apps · GRAVIFIRE</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Mission fire evidence dashboard</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Set a mission context and fire-safety objective, explore NASA investigations, inspect available records, then compare their reported conditions. Relevance is not safety certification.</p></div><div className="flex flex-wrap gap-2"><Link href="/lab" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/30">Virtual Lab</Link><Link href="/recommend/investigations" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/30">Advanced ranking</Link><Link href="/experiments" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/30">Evidence Explorer</Link></div></header>

    <section aria-labelledby="mission-context-heading" className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><div><h2 id="mission-context-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">1 · Mission environment</h2><label className="mt-3 block text-sm text-slate-300">Select a mission environment<select aria-label="Mission environment" value={mission} onChange={(event) => setMission(event.target.value as MissionScenarioKind)} className="rank-control">{missionTypes.map((item) => <option key={item} value={item}>{missionLabel(item)}</option>)}</select></label><p className="mt-2 text-xs leading-5 text-slate-400">Gravity is qualitative context only. Oxygen, pressure and airflow remain unspecified until entered below.</p></div>
      <fieldset><legend className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">2 · Fire-safety objective</legend><div className="mt-3 grid gap-2 sm:grid-cols-3">{(["PREVENTION", "DETECTION", "SUPPRESSION"] as MissionObjective[]).map((item) => <label key={item} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${objective === item ? "border-cyan-300/40 bg-cyan-300/[0.08] text-cyan-100" : "border-white/10 bg-black/10 text-slate-300 hover:border-white/20"}`}><input type="radio" name="fire-objective" value={item} checked={objective === item} onChange={() => setObjective(item)} className="accent-cyan-300" />Fire {capitalize(item.toLowerCase())}</label>)}</div><p className="mt-2 text-xs text-slate-400">Pillar scope: {objectivePillars[objective].map((pillar) => researchPillarLabels[pillar]).join(" · ")}</p></fieldset>
      <div className="lg:col-span-2"><details><summary className="cursor-pointer text-xs text-slate-400">Add hypothetical mission conditions (optional)</summary><p className="mt-2 text-xs text-slate-400">These are user assumptions, not NASA measurements or mission specifications. Exact matching is required; unknown and approximate evidence is not filled in.</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(["oxygenFraction", "pressure", "airflow"] as ApplicabilityDimension[]).map((dimension) => <label key={dimension} className="text-xs text-slate-400">{dimensionLabels[dimension]} ({dimension === "oxygenFraction" ? "%" : dimension === "pressure" ? "kPa" : "cm/s"})<input type="number" step="any" value={String(missionConditions[dimension] ?? "")} onChange={(event) => setMissionCondition(dimension, event.target.value)} placeholder="Unspecified" className="rank-control" /></label>)}</div></details></div>
    </section>

    <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"><section aria-labelledby="ranked-investigations-heading" className="min-w-0"><div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">3 · Evidence discovery</p><h2 id="ranked-investigations-heading" className="mt-1 text-xl font-semibold">Relevant NASA investigations</h2></div><label className="w-full text-xs text-slate-400 sm:max-w-xs">Refine with a scientific question<input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="e.g. oxygen effects on flame spread" className="rank-control" /></label></div>
      <p className="mb-3 text-xs leading-5 text-slate-400">Ranked with {ranking.algorithmVersion}. Scores express research relevance only. Each item shows whether evidence is verified and ingested or reference-only.</p>
      <ol className="space-y-2">{ranking.results.map((item) => <li key={item.id}><article className={`rounded-xl border p-4 transition ${selectedRank?.id === item.id ? "border-cyan-300/35 bg-cyan-300/[0.06]" : "border-white/10 bg-white/[0.025] hover:border-white/20"}`}><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold text-slate-100">{item.title}</h3><p className="mt-1 text-xs text-slate-400">{item.family} · {item.psiId} · Rank {item.rank} · relevance index {item.score.toFixed(3)}</p></div><IntegrationBadge status={item.integrationStatus} /></div><p className="mt-2 text-xs text-slate-400">{item.factors.missionRelevance.explanation} {item.factors.materialPhenomenonApplicability.explanation}</p><p className="mt-2 text-[11px] text-slate-400">{formatInvestigationRecordCount(item.runtimeRecordCount, item.runtimeRecordKind) ?? "No validated runtime records"}</p><button type="button" aria-pressed={selectedRank?.id === item.id} onClick={() => selectInvestigation(item.id)} className="mt-3 min-h-10 rounded-lg border border-cyan-300/25 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/[0.08]">{selectedRank?.id === item.id ? "Selected · inspect evidence" : "Open investigation evidence"}</button></article></li>)}</ol>
    </section>

    <section aria-labelledby="investigation-evidence-heading" className="min-w-0 space-y-4">{gameContext && <aside role="note" className="rounded-xl border border-amber-300/25 bg-amber-300/[0.05] p-4 text-xs leading-5 text-amber-100">{gameContext.notice}</aside>}<article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">4 · Investigation evidence</p><h2 id="investigation-evidence-heading" className="mt-2 text-xl font-semibold">{metadata?.title ?? "Select an investigation"}</h2></div>{selectedRank && <IntegrationBadge status={selectedRank.integrationStatus} />}</div>
      {metadata && selectedRank && <><p className="mt-3 text-sm leading-6 text-slate-300">{metadata.shortDescription}</p><p className="mt-3 text-xs text-slate-400">{formatInvestigationRecordCount(selectedRank.runtimeRecordCount, selectedRank.runtimeRecordKind) ? `${formatInvestigationRecordCount(selectedRank.runtimeRecordCount, selectedRank.runtimeRecordKind)} in the local coverage registry.` : "No verified runs or configurations are integrated."}</p><a href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-cyan-300 underline">NASA PSI investigation {metadata.psiId}</a>
      {records.length === 0 ? <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4"><p className="font-medium text-amber-100">Reference only · no verified normalized experiment records</p><p className="mt-2 text-xs leading-5 text-slate-400">This investigation may inform research discovery, but GRAVIFIRE cannot summarize run measurements or compare source conditions that are not ingested.</p></div> : <><label className="mt-4 block text-xs text-slate-400">Select a verified source record<select value={selectedEvidence ? recordKey(selectedEvidence) : ""} onChange={(event) => setSelectedRecordKey(event.target.value)} className="rank-control">{records.map((record) => <option key={recordKey(record)} value={recordKey(record)}>{record.source.family} · {record.source.recordId} · {record.source.recordType === "EXPERIMENT_CONFIGURATION_ENVELOPE" ? "configuration envelope" : record.run?.material}</option>)}</select></label>
        {selectedEvidence && <SourceRecord evidence={selectedEvidence} run={selectedRun} />}</>}
      </>}
      </article>

      {gameMission && <article aria-labelledby="game-audit-heading" className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.025] p-5"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Authoritative scientific assessment</p><h2 id="game-audit-heading" className="mt-2 text-lg font-semibold">NASA evidence audit</h2>{gameMission === "m0" ? <p className="mt-3 text-sm leading-6 text-slate-300">No scientific verdict is assigned to the fictional M0 alarm. The ranked NASA investigations are independent context and are not evidence that the Vesta event occurred.</p> : scientificAudit ? <><p className="mt-3 text-xs text-emerald-200">{scientificAudit.provenance.engineVersion} · {scientificAudit.challengeStatus}</p><p className="mt-2 text-sm leading-6 text-slate-300">{scientificAudit.summary}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-400">{[...scientificAudit.limitations, ...scientificAudit.missingEvidence, ...scientificAudit.conflicts].map((item, index) => <li key={`${item.id}-${index}`}>{item.text}</li>)}</ul><div className="mt-3 flex flex-wrap gap-2">{scientificAudit.evidence.map((source) => <a key={source.id} href={source.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 underline">{source.citation}</a>)}</div><p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-amber-100">This verdict applies to the cited NASA source record(s), not the fictional campaign event. It does not certify material safety.</p></> : <p className="mt-3 text-sm text-slate-400">The linked NASA record could not be resolved; no verdict is shown.</p>}</article>}

      <article aria-labelledby="interpretation-heading" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.025] p-5"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">5 · Condition interpretation</p><h2 id="interpretation-heading" className="mt-2 text-lg font-semibold">Evidence versus {missionLabel(mission)}</h2>
        {!selectedEvidence || !interpretation ? <p className="mt-3 text-sm text-slate-400">No verified source record is available for comparison. Conditions remain unknown.</p> : <><p className="mt-2 text-xs leading-5 text-slate-400">{selectedEvidence.source.recordType === "EXPERIMENT_CONFIGURATION_ENVELOPE" ? "This source describes configuration options/ranges, not a measured experimental run." : "This comparison evaluates reported condition similarity only. It does not transfer outcomes or establish safety."}</p><div className="mt-3 space-y-2">{interpretation.rows.map((row) => <div key={row.dimension} className="grid gap-2 rounded-lg border border-white/5 bg-black/20 p-3 sm:grid-cols-[130px_1fr_auto]"><b className="text-xs text-slate-300">{dimensionLabels[row.dimension]}</b><div><p className="break-words text-xs text-slate-300">NASA: {displayCondition(row.evidence.value, row.evidence.unit)} · Mission: {displayCondition(row.mission.value, row.mission.unit)}</p><p className="mt-1 text-[10px] leading-4 text-slate-400">{row.explanation}</p>{row.evidence.provenance && <a href={row.evidence.provenance.sourcePathOrCitation} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] text-cyan-300 underline">NASA {row.evidence.provenance.investigationId}, record {row.evidence.provenance.sourceRecordId}, field {row.evidence.provenance.sourceField}; raw “{row.evidence.rawValue}” {row.evidence.sourceUnit ?? ""}</a>}</div><MatchBadge status={row.status} /></div>)}</div>{scenarioWarning(selectedEvidence, scenario)}</>}
        <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-amber-100">No NASA certification or material-safety conclusion. This interpretation compares conditions only; unknown values are not imputed.</p>
      </article>

      <article className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.025] p-5"><p className="text-xs uppercase tracking-[0.2em] text-amber-200">6 · Limitations and next research</p><h2 className="mt-2 text-lg font-semibold">Research limitations and next experiment direction</h2>
        {!selectedRank || !metadata ? <p className="mt-3 text-sm text-slate-400">Select an investigation to view its coverage limitations.</p> : <><ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-400">{[...selectedRank.limitations, ...(selectedRun?.normalizationWarnings ?? [])].map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>{selectedEvidence && interpretation ? <NextResearchDirection investigationId={selectedRank.id} evidence={selectedEvidence} rows={interpretation.rows} /> : <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-400">Next evidence step: verify and ingest a primary NASA experimental table and provenance before summarizing runs or comparing conditions. No measurements or test count are inferred from reference material.</p>}</>}
      </article>
    </section></div>
  </div></main>;
}

function SourceRecord({ evidence, run }: { evidence: NASAConditionEvidence; run: NASAExperimentRun | null }) {
  return <section aria-label="Selected NASA evidence record" className="mt-4 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.025] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-medium text-emerald-100">{evidence.source.recordType === "EXPERIMENT_CONFIGURATION_ENVELOPE" ? "NASA configuration envelope" : "NASA normalized experiment record"} · {evidence.source.recordId}</h3><span className="text-[10px] text-emerald-200">VERIFIED SOURCE RECORD</span></div><p className="mt-2 text-xs text-slate-400">Family {evidence.source.family} · Investigation {evidence.source.investigationId}</p><p className="mt-1 break-all text-[10px] text-slate-400">{run?.provenance.sourceFile ?? evidence.conditions.fuel.provenance?.notes ?? "Source provenance recorded in configuration manifest"}</p>
    {run && <><p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Normalized source observations</p>{Object.entries(run.observations).filter(([, value]) => value !== undefined && value !== null).length ? <dl className="mt-2 grid gap-2 sm:grid-cols-2">{Object.entries(run.observations).filter(([, value]) => value !== undefined && value !== null).map(([key, value]) => <div key={key} className="rounded-lg bg-black/20 p-2"><dt className="text-[10px] text-slate-400">{key}</dt><dd className="mt-1 text-xs text-slate-200">{String(value)}</dd></div>)}</dl> : <p className="mt-1 text-xs text-slate-400">No normalized outcome observation is linked to this run. No result is generated from its condition fields.</p>}
      <details className="mt-3"><summary className="cursor-pointer text-xs text-cyan-200">Inspect exact normalized source row and provenance</summary><dl className="mt-2 grid gap-1 sm:grid-cols-2">{Object.entries(run.rawRecord ?? {}).map(([key, value]) => <div key={key} className="rounded bg-black/20 p-2"><dt className="break-words text-[10px] text-slate-400">{key}</dt><dd className="break-words text-xs text-slate-200">{value || "(blank in source row)"}</dd></div>)}</dl><p className="mt-2 break-all text-[10px] text-slate-400">Source SHA-256: {run.provenance.sourceSha256 ?? "not recorded"} · row {run.provenance.sourceRow ?? "not recorded"} · <a href={run.source.url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">NASA source</a></p></details>
      <div className="mt-3 flex flex-wrap items-center gap-3"><Link href={`/experiments/${run.investigationId}/runs/${run.id}`} className="inline-flex min-h-10 items-center rounded-lg border border-cyan-300/25 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-300/[0.08]">Open full evidence record and Evidence DNA</Link>
      <a href={evidence.source.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-xs text-cyan-300 underline underline-offset-4">Open NASA Physical Sciences Informatics source</a></div></>}
    {!run && <p className="mt-3 text-xs leading-5 text-slate-400">Configuration ranges/options only. This record does not represent an observed outcome.</p>}
    {!run && <a href={evidence.source.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-xs text-cyan-300 underline underline-offset-4">Open NASA Physical Sciences Informatics source</a>}
  </section>;
}

function NextResearchDirection({ investigationId, evidence, rows }: { investigationId: string; evidence: NASAConditionEvidence; rows: ReturnType<typeof compareApplicability>["rows"] }) {
  if (evidence.source.recordType === "EXPERIMENT_CONFIGURATION_ENVELOPE") return <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-400">Next step: locate or ingest a source-linked FLEX-2 experimental run before interpreting these configuration options as tested conditions. No experimental result is inferred from this envelope.</p>;
  if (evidence.conditions.gravity.value === "MICROGRAVITY" && rows.some((row) => row.dimension === "gravity" && row.mission.value === "PARTIAL_GRAVITY")) return <div className="mt-3 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-3 text-xs leading-5 text-amber-100"><p>Evidence gap: this record is in microgravity context, while the selected mission profile is partial gravity. A future investigation or independently verified source under the target gravity regime would be needed; no outcome is predicted.</p>{investigationId === "bass-ii" && <Link href="/recommend" className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-amber-300/20 px-3 py-2 text-xs text-amber-100 hover:bg-amber-300/[0.06]">Open BASS-II coverage-gap experiment recommender</Link>}</div>;
  const unknown = rows.filter((row) => row.status === "UNKNOWN").map((row) => dimensionLabels[row.dimension]);
  const direction = unknown.length ? `Future evidence would need source-reported values for: ${unknown.join(", ")}. This identifies missing conditions; it does not prescribe an unverified numeric test point.` : "The selected record covers these comparison fields. A broader replicated study or additional source-linked records may be useful, but this dashboard does not infer an optimal next test.";
  return <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3"><p className="text-xs leading-5 text-slate-400">{direction}</p>{investigationId === "bass-ii" && <Link href="/recommend" className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-amber-300/20 px-3 py-2 text-xs text-amber-100 hover:bg-amber-300/[0.06]">Open BASS-II coverage-gap experiment recommender</Link>}</div>;
}

function scenarioWarning(evidence: NASAConditionEvidence, scenario: ReturnType<typeof createMissionScenario>) {
  if (evidence.conditions.gravity.value === "MICROGRAVITY" && scenario.conditions.gravity.value === "PARTIAL_GRAVITY") return <p role="alert" className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-100">Microgravity evidence does not directly validate lunar or Martian partial-gravity behavior.</p>;
  return null;
}

function recordKey(evidence: NASAConditionEvidence): string { return `${evidence.source.recordType}:${evidence.source.family}:${evidence.source.recordId}`; }
function missionLabel(value: MissionScenarioKind): string { return value === "SPACECRAFT" ? "Spacecraft" : value === "LUNAR_HABITAT" ? "Lunar habitat" : value === "MARS_HABITAT" ? "Mars habitat" : "Pressurized rover"; }
function capitalize(value: string): string { return value[0].toUpperCase() + value.slice(1); }
function displayCondition(value: ConditionScalar, unit: string | null): string { return value == null ? "Unknown / not reported" : `${String(value)}${unit ? ` ${unit}` : ""}`; }
function IntegrationBadge({ status }: { status: string }) { const label = status === "verified_and_ingested" ? "VERIFIED · INGESTED" : status === "reference_only" ? "REFERENCE ONLY" : "UNAVAILABLE / UNVERIFIED"; const color = status === "verified_and_ingested" ? "border-emerald-300/25 bg-emerald-300/[0.06] text-emerald-200" : status === "reference_only" ? "border-amber-300/25 bg-amber-300/[0.06] text-amber-100" : "border-rose-300/25 bg-rose-300/[0.06] text-rose-200"; return <span className={`rounded-md border px-2 py-1 text-[9px] font-semibold tracking-wide ${color}`}>{label}</span>; }
function MatchBadge({ status }: { status: "MATCHED" | "MISMATCHED" | "UNKNOWN" }) { const style = status === "MATCHED" ? "bg-emerald-300/10 text-emerald-200" : status === "MISMATCHED" ? "bg-rose-300/10 text-rose-200" : "bg-slate-300/10 text-slate-300"; return <span className={`h-fit rounded-full px-2.5 py-1 text-center text-[9px] font-semibold ${style}`}>{status}</span>; }
