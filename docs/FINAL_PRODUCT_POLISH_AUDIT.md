# GRAVIFIRE Final Product Polish Audit

Audit baseline: `integration/game-merge` at `758fa3d`. This is a source/configuration audit; browser screenshots and production-server smoke results are recorded separately in the handoff report.

## Route inventory

| Route | Purpose | Client/engine boundary | Loading/error/empty behavior | Demo risk / remaining inconsistency |
|---|---|---|---|---|
| `/` | Product landing and evidence entry points | Server-rendered content with linked science surfaces | Normal App Router loading/error boundaries | Product copy is coherent; no gameplay engine loaded |
| `/experiments` | NASA experiment explorer | Server page with evidence cards/details | Shared app loading and route error boundaries | Large evidence surface; defer payload optimization |
| `/lab` | Virtual Fire Laboratory | Client R3F viewport; science controls remain React-owned | Lab client loading/error boundary | Fire is representational and must not be presented as prediction |
| `/ask` | Grounded evidence Q&A | Client workspace with API boundary | API error state in workspace | Document context payload is a known post-demo risk |
| `/landscape` | Evidence landscape comparison | Client science visualization | Client empty/error states | Large client payload; defer broad rewrite |
| `/recommend` | Next-experiment recommendations | Client science workspace | Client empty/error states | Must retain named-gap framing |
| `/challenge` | Challenge/evidence review | Client interaction with challenge API | Result and error states | Must not turn challenge output into certification |
| `/mission-control` | Campaign hub and mission status | React campaign state in browser storage | Mission cards expose locked/available/complete states | Core demo entry point |
| `/mission-control/dossier` | Campaign evidence dossier | React campaign/evidence surface | Empty campaign state is supported | Preserve separation from R7 verdict model |
| `/mission-control/manual` | Field Manual unlocks | React campaign state | Empty/manual-lock state is supported | Verify unlock persistence in manual run |
| `/mission-control/play/m0` | Canonical fictional incident mission | Client-only PlayCanvas M0 through `PlayCanvasMissionLoader` | Mission loading shell and explicit PlayCanvas failure boundary | Review bypass is development-only |
| `/mission-control/play/m1` | Canonical SIBAL evidence mission | Client-only PlayCanvas M1 | Same shared loading/failure boundary | Science labels remain recorded burn time |
| `/mission-control/play/m4` | Canonical Silicone evidence mission | Client-only PlayCanvas M4 | Same shared loading/failure boundary | Raw `037 mm` remains source text |
| `/mission-control/play/m6` | Canonical archive-boundary finale | Client-only PlayCanvas M6 | Same shared loading/failure boundary | Refusal is scoped to the current archive domain |
| `/video-demo` | R7/demo presentation surface | Client React presentation | Existing route-level loading/error | Keep distinct from campaign completion state |

## Cross-cutting findings

- Canonical mission dispatch is PlayCanvas for M0/M1/M4/M6. Legacy R3F is explicit development comparison only and is never a silent fallback.
- All canonical mission engines are dynamically imported with `ssr: false`; the PlayCanvas failure boundary exposes initialization failure instead of substituting R3F.
- Mission routes use `GameShell`, which hides document overflow while mounted. The shared PlayCanvas chrome now supplies one control grammar and a pause surface.
- Review-stage query values are accepted only outside production and are transient. They do not write campaign completion.
- Mission rooms and approved camera compositions are intentionally preserved. This pass changes shared UX chrome/input behavior, not approved scene art.
- M2/M3/M5, BASS/PSI-26 ingestion, broad science-route DTO optimization, production audio, mobile gameplay, and `scripts/`/`Scripts/` consolidation remain deferred.

## Science-copy review targets

Runtime copy must continue to avoid unsupported `safe`, `unsafe`, `certified`, universal-law, extinction-time, and broad NASA-history claims. The canonical assertions to recheck are listed in `FINAL_PRODUCT_STATE.md` and the exact manual run is in `FINAL_CAMPAIGN_RUN_CHECKLIST.md`.
