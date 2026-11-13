"use client";

import type { R7Verdict } from "@/lib/r7/adapter";

const tone: Record<string, string> = { SUPPORTED: "border-emerald-300/70 text-emerald-200", CONTRADICTED: "border-rose-300/70 text-rose-200", INSUFFICIENT: "border-amber-300/70 text-amber-200", REFUSAL: "border-amber-300/70 text-amber-200" };

export default function VerdictStamp({ verdict }: { verdict: R7Verdict }) {
  const state = verdict.verdict === "INSUFFICIENT" && verdict.refusal ? "INSUFFICIENT" : verdict.verdict;
  return <div className={`r7-verdict-stamp ${tone[state] ?? tone.INSUFFICIENT}`}><span className="r7-verdict-stamp__mark">{state === "SUPPORTED" ? "✓" : state === "CONTRADICTED" ? "×" : "!"}</span><span>{state}</span></div>;
}
