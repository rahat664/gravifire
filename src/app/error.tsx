"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("GRAVIFIRE route error", error); }, [error]);
  return <main className="flex min-h-screen items-center justify-center bg-[#050811] px-6 text-center text-slate-100"><div><p className="font-mono text-xs uppercase tracking-[.28em] text-amber-300">GRAVIFIRE · VIEW UNAVAILABLE</p><h1 className="mt-4 text-3xl font-light">GRAVIFIRE could not load this view.</h1><p className="mt-3 max-w-md text-sm leading-6 text-slate-400">The scientific archive remains unchanged. Retry the view or return to the product entry point.</p><div className="mt-8 flex justify-center gap-3"><button onClick={() => reset()} className="rounded-md bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">RETRY</button><Link href="/" className="rounded-md border border-white/20 px-5 py-3 text-sm">RETURN HOME</Link></div></div></main>;
}
