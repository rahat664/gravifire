"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nasaInvestigations } from "@/data/nasa-investigations";
import { nasaInvestigationCoverage, researchPillarLabels } from "@/data/nasa-investigation-coverage";
import { formatInvestigationRecordCount } from "@/lib/investigation-record-label";

export default function ExperimentsPage() {
    const [search, setSearch] = useState("");
    const [family, setFamily] = useState("ALL");

    const filtered = useMemo(() => {
        return nasaInvestigations.filter((item) => {
            const matchesFamily =
                family === "ALL" || item.family === family;

            const text = [
                item.title,
                item.family,
                item.category,
                item.shortDescription,
                ...item.materials,
                ...item.capabilities,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            return matchesFamily && matchesSearch;
        });
    }, [search, family]);

    return (
        <main className="research-console min-h-screen bg-[#050811] text-white">
            <div className="mx-auto max-w-[1600px] px-5 py-5">
                <header className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
                                GRAVIFIRE
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold">
                                NASA Experiment Explorer
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                Explore NASA combustion investigations and discover the
                                evidence behind GRAVIFIRE.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/landscape" className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 text-center text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.14]">Fire Landscape</Link>
                            <Link href="/experiments/saffire-comparison" className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">SAFFIRE Comparison</Link>
                            <Link href="/experiments/same-comparison" className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">SAME Comparison</Link>
                            <Link href="/experiments/flex-comparison" className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">FLEX Comparison</Link>
                            <Link href="/lab" className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 text-center text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.14]">Open Virtual Lab</Link>
                        </div>
                    </div>
                </header>

                <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                    {/* Filters */}
                    <aside className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                            Filters
                        </p>

                        <div className="mt-5">
                            <label htmlFor="investigation-search" className="mb-2 block text-sm text-slate-400">
                                Search
                            </label>

                            <input
                                id="investigation-search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="PMMA, smoke, extinction..."
                                className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400/50"
                            />
                        </div>

                        <div className="mt-6">
                            <p className="mb-3 text-sm text-slate-400">
                                Experiment Family
                            </p>

                            <select aria-label="Experiment family" value={family} onChange={(event) => setFamily(event.target.value)} className="rank-control">
                                {["ALL", "BASS", "BASS-II", "SAFFIRE-I", "SAFFIRE-II", "SAFFIRE-III", "FLEX", "FLEX-2", "SAME", "SAME-R", "SPICE"].map((item) => <option key={item} value={item}>{item === "ALL" ? "All Investigations" : item}</option>)}
                            </select>
                        </div>

                        <div className="mt-7 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
                            <p className="text-xs font-semibold text-emerald-300">
                                DATA POLICY
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                GRAVIFIRE keeps NASA source provenance visible and separates
                                original evidence from model-generated estimates.
                            </p>
                        </div>
                    </aside>

                    {/* Results */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {filtered.length} investigations
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Initial GRAVIFIRE evidence catalog
                                </p>
                            </div>

                            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                Investigation View
              </span>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-2">
                            {filtered.map((investigation) => (
                                <article
                                    key={investigation.id}
                                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.025]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge>{investigation.family}</Badge>

                                                {investigation.psiId && (
                                                    <Badge>{investigation.psiId}</Badge>
                                                )}

                                                <span className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.07] px-2 py-1 text-[10px] font-medium text-emerald-300">
                          NASA SOURCE
                        </span>
                                            </div>

                                            <h2 className="mt-4 text-lg font-semibold tracking-tight">
                                                {investigation.title}
                                            </h2>

                                            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-400">
                                                {investigation.category}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-slate-400">
                                        {investigation.shortDescription}
                                    </p>

                                    <InvestigationCoverageSummary investigationId={investigation.id} />

                                    <div className="mt-5">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                                            Research Areas
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {investigation.capabilities.map((capability) => (
                                                <span
                                                    key={capability}
                                                    className="rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-xs text-slate-400"
                                                >
                          {capability}
                        </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-white/10 pt-4">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Link
                                                href={`/experiments/${investigation.id}`}
                                                className="rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                            >
                                                Explore Investigation
                                            </Link>

                                            <a
                                                href={investigation.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-slate-300 transition hover:bg-white/[0.06]"
                                            >
                                                View NASA Source
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-16 text-center">
                                <p className="font-medium text-slate-300">
                                    No matching investigations
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    Try another keyword or experiment family.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.07] px-2 py-1 text-[10px] font-medium text-cyan-300">
      {children}
    </span>
    );
}

function InvestigationCoverageSummary({ investigationId }: { investigationId: string }) {
    const coverage = nasaInvestigationCoverage.find((item) => item.id === investigationId);
    if (!coverage) return null;

    const statusLabel = coverage.integrationStatus === "verified_and_ingested"
        ? `VERIFIED · ${formatInvestigationRecordCount(coverage.runtimeRecordCount, coverage.runtimeRecordKind)?.toUpperCase()}`
        : coverage.integrationStatus === "reference_only"
            ? "REFERENCE ONLY · NO VALIDATED RUN RECORDS"
            : "UNAVAILABLE OR UNVERIFIED";
    const statusClass = coverage.integrationStatus === "verified_and_ingested"
        ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
        : "border-amber-400/20 bg-amber-400/[0.06] text-amber-200";

    return (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${statusClass}`}>
                    {statusLabel}
                </span>
                <span className="text-[10px] text-slate-400">{coverage.family} · {coverage.psiId}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
                {coverage.researchPillars.map((pillar) => researchPillarLabels[pillar]).join(" · ")}
            </p>
            {(coverage.family === "SAME" || coverage.family === "SAME-R") && (
                <p role="note" className="mt-2 text-xs leading-5 text-amber-200">
                    These experimental-table records do not include detector-response or alarm-outcome measurements; the row count is not a count of detections.
                </p>
            )}
            {coverage.limitations.length > 0 && (
                <p className="mt-2 text-xs leading-5 text-slate-400">{coverage.limitations[0]}</p>
            )}
        </div>
    );
}
