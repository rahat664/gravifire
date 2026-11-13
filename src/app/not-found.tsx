import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#050811] px-6 text-center text-slate-100"><div><p className="font-mono text-xs uppercase tracking-[.28em] text-amber-300">GRAVIFIRE · ROUTE NOT FOUND</p><h1 className="mt-4 text-3xl font-light">This evidence view is not in the current archive.</h1><Link href="/" className="mt-8 inline-flex rounded-md bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">RETURN TO GRAVIFIRE</Link></div></main>;
}
