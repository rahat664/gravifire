# GRAVIFIRE repository audit

Audit basis: branch `integration/game-merge`, HEAD before this audit `a27d37d`.

| Directory | Purpose | Status / issue |
|---|---|---|
| `src/app` | Next App Router routes and API handlers | Canonical application entry. Root page was still the Create Next App starter and has now been replaced. |
| `src/components` | Science workspace, trust UI, Mission Control, R7 demo | Active product surface, with some large single-file mission components. |
| `src/features/mission-control` | Mission and campaign types | Canonical campaign type definitions. |
| `src/lib` | Parsers' runtime consumers, evidence resolvers, campaign state, recommendations, R7 adapter | Canonical shared logic; several mission state systems remain separate by design. |
| `src/data/nasa/raw` | Curated source copies used by deterministic ingestion | Raw source; do not edit in product work. |
| `data/nasa/normalized` | Generated normalized runtime artifacts and reports | Build/runtime source for the evidence explorer; large JSON is server/build imported by route modules. |
| `data/nasa/manifests` | Dataset manifests | Provenance/ingestion metadata. |
| `data/nasa/provenance` | Source hashes | Generated provenance index. |
| `psidata` | Broader source archive/manifests | Archive and source material; not the browser runtime by itself. |
| `Gravifier_research` | Research notes, R7 handover, documents, media, validation outputs | Research and handover archive; historical notes do not override runtime evidence. |
| `scripts/psi` | Family-specific parser, validator, normalizer, adapter and provenance code | Active ingestion architecture. |
| `tests` | Ingestion, mission, state, R7, recommendations and regression tests | 25 files / 145 tests at audit start. |
| `public/assets/game` | Game asset registry and selected Kenney M1 GLBs | M1 has a small CC0 asset slice; character remains procedural fallback. |
| `app-archive`, `Daily doc`, `Setup docs`, `Study Materials` | Non-App-Router archive/support material | Not route owners; review before future cleanup. |

## Root-level findings

- `package.json` and `pnpm-lock.yaml` define a single pnpm Next 16 application.
- No second root `app/` directory is present. `src/app` owns routing.
- `next.config.ts` is intentionally minimal.
- The repository contains both source data and generated normalized artifacts; generated files must be regenerated through the family scripts, not hand-edited.
- `scripts/` and `Scripts/` are duplicate case-sensitive directory trees with duplicate filenames. This is a cleanup risk on Linux/CI and should be consolidated only after ownership review.
- The repository is not a finished asset-complete game: most game geometry is procedural and the approved GLB slice is currently M1-only.
