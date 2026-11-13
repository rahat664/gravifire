# GRAVIFIRE 2026 Baseline Repository and Implementation Audit

**Audit date:** 2026-11-13  
**Repository:** `D:\gravifire`  
**Scope:** Read-only application audit. This file is the only file created by the audit; application code, NASA sources, and generated datasets were not edited.

## Executive summary

GRAVIFIRE is a Next.js 16 App Router application with two connected product surfaces: a NASA evidence workbench and a fictional, evidence-bounded mission campaign. NASA data is parsed, normalized, validated, and recorded with provenance by family-specific PSI pipelines. The science UI exposes experiment records, documents, grounded answers, comparisons, a virtual lab, landscape coverage, recommendations, and a deterministic evidence audit. Mission Control currently runs M0, M1, M4, and M6 in PlayCanvas by default; legacy React Three Fiber / Rapier game code remains selectable in development and as the fallback renderer for other mission IDs.

The existing system already has substantial ranking and scientific interpretation logic, but its ranking is an **experiment information-value ranking**, not a fire-risk, suppression-success, or mission-performance ranking. M0 offers response choices but does not model or simulate physical fire control. M6 provides a selectable evidence manifest, habitat condition boundary, refusal, and next-experiment choices. Detection is not implemented as a sensor/fire-detection model. Automated baseline checks passed; a production build was intentionally not run because `next build` writes generated `.next` output that the user asked to preserve.

## Git state and protected work

- Current branch: `integration/game-merge`, tracking `datarepo/integration/game-merge`.
- HEAD: `6f6ca19 feat: unify PlayCanvas campaign demo experience`.
- Recent commits (newest first):
  - `6f6ca19` unify PlayCanvas campaign demo experience
  - `758fa3d` improve M0 incident flame readability
  - `400094f` align M0 flame shader precision
  - `4894b4f` hide Next development indicator
  - `5275f83` replace M0 cone fire with transparent flame VFX
  - `9b88dd1` replace M0 incident sphere with flame tongues
  - `ed74f6a` repair M0 visual review composition
  - `fc5829f` convert M0 to PlayCanvas
- Branch is **48 commits ahead** of its configured upstream and 0 behind.
- Existing user changes, preserved untouched:
  - Modified: `public/assets/mission-control/README.md` (one added asset link).
  - Untracked: `docs/FINAL_VIDEO_PRODUCTION_PLAN.md`.
  - Untracked: `docs/FINAL_VIDEO_SHOT_LIST.md`.
- No changes were made to those files, the lockfile, application code, NASA source material, or generated artifacts. Do not overwrite or clean these changes during subsequent work.

## Package and check baseline

- `package.json` declares `next@16.3.6`, React 19, TypeScript, pnpm `12.3.4`, PlayCanvas React, R3F/Rapier, Vitest, and ESLint.
- `pnpm-lock.yaml` is lockfile v9 and contains the root importer plus 1,268 package records; declared direct dependencies and installed top-level dependencies were consistent in `pnpm list --depth 0`.
- Scripts: `dev`, `build`, `start`, `lint`, `test`, data/copy audits, and individual PSI ingestion commands. There is no named typecheck script.
- Results:

| Check | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | Pass, exit 0 |
| Unit/integration suite | `pnpm test` | Pass: 29 files, 178 tests |
| TypeScript | `pnpm exec tsc --noEmit --incremental false` | Pass, exit 0 |
| Production build | `pnpm build` | Not run; `next build` writes `.next` generated output and preserving existing generated artifacts was an explicit constraint |

There were no failures among the checks run. Build status is **unverified**, not a known failure. The Vitest run emitted only a transform-cache performance note.

## Application routes and architecture

Active routes live under `src/app`; `app-archive` is not the active route tree.

| Surface | Routes | Implementation |
|---|---|---|
| Landing | `/` | Server-rendered landing page; uses resolved M1/M4 evidence highlights |
| Evidence explorer | `/experiments`, `/experiments/[id]`, `/experiments/[id]/runs/[runId]`, `/experiments/flex-2/configurations/[configurationId]`, `/experiments/{flex-comparison,saffire-comparison,same-comparison}`, `/experiments/spice/observations/[observationId]` | Experiment and family-specific views, provenance, source-status and comparison components |
| Documents and question answering | `/documents/[family]/[documentId]`, `/ask`, `/api/ask` | Document search/details and deterministic grounded query API/UI |
| Science exploration | `/lab`, `/landscape`, `/recommend`, `/challenge` | Virtual Lab, coverage landscape, coverage-based proposed experiments, evidence audit |
| Campaign | `/mission-control`, `/mission-control/dossier`, `/mission-control/manual`, `/mission-control/play/[missionId]` | Certification queue, campaign dossier/manual, client-loaded game route |
| Campaign alias/demo | `/mission-control/play/m1-pc`, `/video-demo` | M1 PlayCanvas alias and separate precomputed video demo |
| Evidence API | `/api/challenge`, `/api/evidence/bass-ii/[assetId]` | Challenge request handling and allow-listed local evidence serving |
| Framework states | `/error`, `/loading`, `/not-found` | App Router error, loading, and not-found files are present |

Key architecture files:

- Route and mission-engine selection: `src/app/mission-control/play/[missionId]/page.tsx`, `src/lib/mission-route.ts`, `src/components/mission-control/PlayCanvasMissionLoader.tsx`.
- Mission definitions and shared schema: `src/data/missions/*.ts`, `src/features/mission-control/types.ts`, `src/lib/mission-state.ts`, `src/lib/mission-session.ts`.
- Campaign gameplay: `src/components/mission-control/PlayCanvasM0Pilot.tsx`, `PlayCanvasM1Pilot.tsx`, `PlayCanvasM4Pilot.tsx`, `PlayCanvasM6Pilot.tsx`; shared chrome in `PlayCanvasMissionChrome.tsx`.
- Default engine: PlayCanvas for M0/M1/M4/M6; R3F/Rapier implementations remain in `MissionGame.tsx`, `MissionScene.tsx`, and legacy mission components. `resolveMissionEngine` permits the legacy selection only outside production. The Virtual Lab remains an R3F surface.
- Challenge engine/schema/API/UI: `src/lib/challenge-engine.ts`, `src/types/challenge.ts`, `src/app/api/challenge/route.ts`, `src/app/challenge/page.tsx`, `src/components/challenge/ChallengeResultView.tsx`.
- Evidence/data resolvers: `src/lib/m1-evidence.ts`, `src/lib/m4-evidence.ts`, `src/lib/evidence-serving.ts`, with typed runtime modules in `src/data/` and contracts in `src/types/`.

## NASA data pipeline and source boundaries

Family-specific ingestion scripts under `scripts/psi/` implement source parsing, family validation, normalization, and provenance. Their generated normalized JSON in `data/nasa/normalized/` is imported into typed runtime data modules under `src/data/`. Provenance and source hashes are tracked under `data/nasa/` and in generated record-level metadata. BASS-II video/document evidence is matched conservatively using identifiers; `/api/evidence/bass-ii/[assetId]` resolves only registered local assets and rejects paths outside the configured root.

`data/nasa/integration-registry.json` records these current source families and coverage:

| Family | PSI ID | Registry status / records | Meaningful scope notes |
|---|---:|---|---|
| BASS-II | PSI-25 | Fully ingested, 129 runs | Run records plus document/evidence matching pipeline |
| BASS | PSI-26 | Source available, not ingested, 0 | Not runtime evidence |
| FLEX-2 | PSI-68 | Fully ingested, 8 envelopes | Configuration space, not completed run results |
| FLEX | PSI-69 | Fully ingested, 274 runs | Source/header interpretation limitations retained |
| SAFFIRE-I | PSI-98 | Fully ingested, 2 runs | M1 resolves S1 and S2 explicitly |
| SAFFIRE-II | PSI-99 | Fully ingested, 9 runs | M4 focuses on samples 2-1 through 2-4; source ambiguities remain visible |
| SAFFIRE-III | PSI-100 | Fully ingested, 2 runs | Conflicting source contexts are preserved, not silently merged |
| SAME-R | PSI-101 | Fully ingested, 109 runs | Composite source identity is required for some records |
| SAME | PSI-102 | Fully ingested, 8 runs | Family-specific schema |
| SPICE | PSI-107 | Fully ingested, 8 observations | Operating-condition observations, not run-level combustion outcomes |

Canonical pipeline references include `scripts/psi/ingest-*.ts`, family parsers/validators/normalizers under `scripts/psi/`, `data/nasa/integration-registry.json`, `src/data/nasa-experiment-runs.ts`, `src/data/nasa-operating-condition-observations.ts`, and `docs/NASA_DATA_PIPELINE.md`. Existing raw sources and normalized artifacts were inspected, not regenerated.

## Feature inventory: challenge-specific behavior

| Feature | Status | Verified behavior and limits |
|---|---|---|
| Evidence ranking | **Implemented, scoped** | `src/lib/recommendations.ts` ranks proposed BASS-II conditions by information value using coverage sparsity and normalized nearest-point distance. The formula and filters are included in result metadata. It is not a fire-risk ranking, material safety score, suppression ranking, or universal ranking. EMBER’s “rank evidence” copy is also explicit that it does not certify. |
| Detection | **Absent as a challenge/game system** | The campaign has no sensor model, event detection algorithm, alarm threshold/latency, detection confidence, or detection score. M0 begins from a fictional alarm and asks the player to inspect three incident systems; this is narrative setup, not implemented fire detection. |
| Suppression / response | **Partial, narrative choice only** | M0 presents `vent-cut`, `vent-increase`, and `suppression` interaction stations and records the chosen option in campaign state. The inspected PlayCanvas handler records the action and reveals the archive boundary. It does not simulate suppression, airflow/fire dynamics, effect size, success/failure, or downstream physical outcome. Scientific text correctly refuses to infer an unrepresented garment response. |
| Habitat | **Implemented as evidence-bound manifest and refusal** | M6 `src/lib/m6-state.ts` assembles material/application manifest options, source matches, evidence states, and boundary differences; its NASA lookups are bounded to the current runtime catalog. `m6-locked-door.ts` and `PlayCanvasM6Pilot.tsx` name the combined Mars habitat condition (including ~0.38 g) and refuse a fire-behavior verdict when no matching combined record exists. The 0.38 g value is context, not combustion evidence. |
| Scientific interpretation | **Implemented, bounded** | M1 resolves SAFFIRE-I S1/S2 and reports the source-bound burn-time difference with explicit limitations; M4 resolves four SAFFIRE-II silicone samples plus NASA context and distinguishes ground reference from low-g records; M0 labels its incident fictional and exposes the archive gap; M6 distinguishes direct/bounded/insufficient material records and the combined-condition refusal. `challenge-engine.ts` audits runs, answers, recommendations, comparisons, landscape regions, observations, configurations, and document claims while carrying scope and provenance. It does not infer outcomes or causes from arbitrary prose. |
| Campaign ranking / player scoring | **Absent** | No verified mission score, leaderboard, player rank, response grade, detection score, or suppression success metric exists in the inspected state/types/handlers. Current `CampaignState` tracks predictions, decisions, gaps, manual unlocks, verdict history, and challenge links. |

Additional partial areas: M0’s legacy R3F implementation includes three-system inspection and response choices, while the current canonical PlayCanvas M0 interaction flow records a response then opens the evidence panel; the campaign’s physics renderer does not represent a validated fire-behavior solver. M6 proposes next experiment questions but does not calculate or certify a safe habitat design.

## Tests and implementation quality

Test coverage exists across architecture guards, challenge engine, data integration/ingestion, evidence, fire visuals, mission state/review/routing, implemented campaign missions M1/M4/M6, and recommendations. Notable files include `tests/challenge-engine.test.ts`, `tests/mission-state.test.ts`, `tests/m1.test.ts`, `tests/m4.test.ts`, and `tests/m6.test.ts`, plus family ingestion tests. There is no dedicated `m0.test.ts` in the current test inventory.

Known product/architecture limits supported by code and existing docs:

- No outcome or causal model; no physical airflow mapping for raw fields.
- The campaign is a review/interpretation experience and not a predictive combustion simulator.
- M0’s fictional incident has no matching microgravity garment evidence.
- M1/M4 observations apply only to the specific source records and tested conditions.
- M6 has an explicit current-archive boundary; it does not assert that all NASA science lacks the evidence.
- Large mission components combine interaction handling, session state, persistence, and rendering; this is maintainability debt, not a test failure.

No known automated test, lint, or typecheck failures were found by the checks above. The production build remains unverified.

## Recommended implementation sequence

1. **Define challenge semantics and success criteria before adding mechanics.** Specify separately what “detection,” “suppression response,” “habitat review,” and any desired “ranking” mean. Preserve the boundary that evidence rank is not risk/safety rank.
2. **Design a typed, deterministic incident-response model** with explicit inputs, allowed actions, observable outputs, uncertainty states, and NASA-evidence links. Keep unsupported physical outcomes unknown; do not imply real suppression efficacy from the current records.
3. **Add unit tests for the model and evidence boundaries first**, including unrepresented conditions and abstention behavior. The present green baseline makes regressions distinguishable.
4. **Integrate the model into the canonical PlayCanvas M0 flow** (the response interaction and incident panel), then surface resulting evidence/gaps in Dossier/Challenge only if their schemas support it. Keep legacy R3F behavior explicitly noncanonical until parity is intentional.
5. **Run lint, typecheck, Vitest, then a production build only when generated-output preservation is no longer required or `.next` is safely snapshotted.** Recheck git status before and after so pre-existing user changes remain intact.

**Next safe implementation step:** write and review the response-model contract (types, state transitions, evidence/unknown semantics, and acceptance cases) before implementing any simulated detection or suppression effect. This is a design artifact step and can be done without modifying NASA datasets or conflating information value with safety scoring.
