# Build roadmap from repository audit

## P0 — product truth and runtime reliability

| Task | Why | Current status | Files / dependencies | Risk / size |
|---|---|---|---|---|
| Keep `/` as canonical product landing | Removes starter experience and explains both product modes | Completed in this audit | `src/app/page.tsx`, layout metadata | Low science risk / S |
| Add branded error/loading/not-found states | Current app relies on Next defaults for these states | Not built | `src/app/error.tsx`, `loading.tsx`, `not-found.tsx` | Low / S |
| Keep runtime evidence selectors centralized | Prevents root/story constants drifting | Partial | `src/lib/m1-evidence.ts`, `m4-evidence.ts`, registry | Low / M |
| CI smoke test required product routes | Build does not prove browser render | Not built | scripts/tests | Low / S |

## P1 — trust and scientific product quality

| Task | Why | Current status | Dependencies | Risk / size |
|---|---|---|---|---|
| Unified source/citation viewer for science workspace | Dossier/R7 citation and Explorer provenance are separate | Partial | provenance types, route API | Medium / M |
| Review R7 lineage matching | Current visual matching is heuristic | Partial | R7 handover contract | Medium / S |
| Add explicit runtime copy audit | Historical terms must not leak into new UI | Not built | source scan and allowlist | Medium / S |
| Review M2/M3/M5 evidence proposals | Prevent narrative-first mission building | Blocked by scientific review | family adapters/source review | High / M |

## P2 — game architecture and asset completion

| Task | Why | Current status | Dependencies | Risk / size |
|---|---|---|---|---|
| Split mission state/controllers/views | Mission components are large and duplicated | Prototype debt | stable selectors first | Medium / L |
| Extend approved asset pipeline beyond M1 | M1 has only selected CC0 GLBs; character fallback remains procedural | Blocked by asset approval/availability | credits, optimized GLBs | Visual / L |
| Add real browser visual QA automation | Manual visual approval is currently external | Not built | browser tooling | Low / M |

## P3 — deferred breadth

- Do not implement M2/M3/M5 before scientific review.
- Do not ingest additional families without a family adapter and provenance report.
- Do not add an LLM to determine facts or verdicts.
- Do not perform broad refactors or delete archive material during feature work.

Already good enough for MVP: deterministic family ingestion, S1/S2 and M4 resolvers, campaign progression, M6 refusal, R7 capture screens, and current automated regression suite.
