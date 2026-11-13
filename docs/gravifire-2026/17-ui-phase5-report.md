# UI phase 5: visual QA and readiness

## Scope and changes

Reviewed the running application and prior design/audit reports, then captured Home, Dashboard, Explorer, Ranking, Applicability, Virtual Lab, EMBER, Evidence DNA/B1, Dossier, Mission Control and M0/M1/M4/M6 at 1920x1080, 768x1024 and 390x844.

Implemented two contained presentation improvements:

- `src/components/recommendations/InvestigationRankingExplorer.tsx`: native keyboard-operable disclosures for detailed scoring factors. Rank, score, source identity, coverage, condition summary, reference-only warning and scoring-method disclaimer remain visible. All factor explanations/matches/missing fields remain available; no score or matching rule changed. The existing no-result notice gains status semantics.
- `src/app/experiments/page.tsx`: replaced eleven stacked family buttons with a labeled selector containing exactly the same family choices and using the existing filter state. Search now has an explicit label/input association.
- `src/app/globals.css`: restrained disclosure separator/summary styling and scientific table wrapping using existing tokens.
- `src/app/experiments/[id]/runs/[runId]/page.tsx`: narrowed the fallback panel heading to “Condition and outcome limits” and its message to the unavailable airflow/pressure fields, removing a misleading broad gas-measurement claim without rebinding data or altering verdicts.

The new `ui-phase5.spec.ts` verifies SAME-R record terminology under filtering, empty results, keyboard disclosure, and unchanged displayed ranking score after opening details. Capture and profiling scripts are `tests/browser-harness/capture-phase5.cjs` and `profile-phase5.cjs`.

The new test initially caught a missing search-input ID in the attempted label association. It was corrected and the targeted test passed. The initial trace remains in `test-results/`. An unused console-summary variable in the profiling harness caused a lint warning; it was removed and lint reran cleanly.

## Screenshot artifacts

Root: `tests/browser-harness/artifacts/ui-phase5/`.

For each route key below, compare `before/<key>-<size>.png` and `after/<key>-<size>.png`. Sizes are `desktop`, `tablet`, `mobile`. Research captures are full-page images at the requested viewport; games are viewport images. Before/after JSON includes status, overflow and browser errors; before Axe fields are null because baseline scans were not run.

| Key | Route |
|---|---|
| home | `/` |
| dashboard | `/dashboard` |
| experiments | `/experiments` |
| ranking | `/recommend/investigations` |
| applicability | `/applicability` |
| lab | `/lab` |
| ember | `/ask?run=B1&investigation=bass-ii`, after submitting its evidence query |
| dna | `/experiments/bass-ii/runs/B1` |
| dossier | `/mission-control/dossier` |
| control | `/mission-control` |
| m0 / m1 / m4 / m6 | `/mission-control/play/<id>?review=1` |

There are 42 baseline and 42 after default route/viewport images. Important interaction screenshots are also under `run-final-wording/artifacts/screenshots/` (existing lunar B1 comparison at desktop/tablet/mobile) and the new test's subdirectory of `test-results-final-wording/` (SAME-R filter and expanded ranking explanation). Existing error/disclosure and game pause/focus regression cases were executed; not every state has a new dedicated image. Movement views are in `performance-dedicated/`.

## Visual findings

All 42 after combinations returned HTTP 200, had no horizontal page overflow, no captured browser errors and zero Axe WCAG 2.1 A/AA tagged violations. Following the search-label fix, `after-final/experiments-<size>.png` and its JSON supersede the three Explorer after captures. All three rechecks are clear, bringing executed scans to 45. The corrected B1 wording is captured in `after-final-wording/dna-<size>.png`; its three additional scans are clear. Total: 48 executed scans across 42 distinct route/viewport combinations.

Full-page PNG height comparison demonstrates reduced density without deleting scientific information:

| Page | Desktop before / after px | Tablet before / after px | Mobile before / after px |
|---|---|---|---|
| Ranking | 4742 / 3627 | 5978 / 3869 | 9979 / 5664 |
| Explorer | 3025 / 3025 | 6384 / 5844 | 8918 / 8370 |

These are document heights, not performance metrics. Ranking filters themselves still occupy substantial mobile space. Raw scientific names and hashes can remain dense, but wrapping, units and source relationships remain available. Existing dashboard scientific actions already have separate hit targets; existing HUD objective/evidence alignment tests passed, so no speculative HUD change was introduced. Loading/error behavior remains the existing implementation, with query failure and empty-filter regression coverage. No unsupported prediction or certification was added.

## Scientific and technical verification

Visual changes do not edit NASA raw/normalized records, provenance resolvers, ranking weights, verdict logic, applicability calculations, grounded-query retrieval or campaign schemas. Existing tests verify B1's 22.2% oxygen citation, no fabricated outcome, partial-gravity uncertainty, deterministic ranking explanation, safety-certification refusal, Evidence DNA linkage and campaign-state compatibility.

- Full final Vitest: 218/218 tests across 36 files passed (6.56 seconds).
- Initial full Playwright: 9 passed, new test failed from the missing search ID; corrected targeted rerun 1/1 passed.
- TypeScript passed; ESLint passed cleanly after the harness warning cleanup.
- Full final Playwright: 10/10 tests passed in one invocation (reported duration 1.2 minutes), including the corrected new disclosure/filter test.
- `git diff --check`: passed with working-copy line-ending conversion warnings only.
- No production build, dependency operation, service restart, commit, push, merge or deployment was performed. Port 3000 remained PID 21384.

The initial browser run preserved its failure trace/screenshots/video; these are test artifacts, not a final submission recording. All harness outputs were isolated from previous phase artifacts.

## 3D and performance assessment

See `17-3d-production-quality-assessment.md` for concrete scene-art findings and a prioritized proposal with complexity/regression risk. Scenes remain prototype quality: repeated geometry, flat materials/screens, surface/shadow artifacts and apparent avatar/counter occlusion prevent a premium-realism readiness claim. No major 3D overhaul was started.

See `17-performance-baseline.md` for the actual dedicated movement sample. Browser rAF cadence was approximately 88.5–96.2 callbacks/second; it is not an instrumented PlayCanvas FPS count. The M0 startup long task reached 1267 ms, and main-thread task occupancy during samples was about 76–84%. JS heap snapshots were 51–122 MiB. Production/hardware breadth, GPU memory, React commit profiling and long-session stability remain unverified. Existing shader/deprecation warning counts persisted with no demonstrated blank-scene failure. No performance improvement is claimed.

## Separate readiness decisions

| Area | Status | Evidence and scope |
|---|---|---|
| A. Scientific UI visual readiness | READY | Tested layouts, accessible source access and scientific regression coverage; broad B1 fallback wording was corrected to explicitly scope missing airflow/pressure fields and outcome limits. This does not imply full accessibility certification. |
| B. Game HUD readiness | READY | Desktop/tablet/mobile objective/header separation, evidence hit targets, pause focus and campaign navigation checks pass. Touch-only gameplay is outside this claim. |
| C. 3D environment visual readiness | PARTIAL | Scenes work, but prototype assets/materials, repeated layout and visual artifacts fall short of premium realism. |
| D. Performance readiness | PARTIAL | Short local dev samples measured; startup blocking, high task occupancy and missing production/target-device benchmarks remain. |
| E. Accessibility verification | PARTIAL | Automated scans and keyboard tests pass; renewed human NVDA evidence for redesigned interfaces is outstanding. |
| F. Demo recording readiness | PARTIAL | Scientific workflow is reproducible, but timed human rehearsal, manual accessibility review and decisions about 3D visual limitations remain. No final video was recorded. |

Renew human review for mobile navigation, ranking disclosures, family/search controls, scientific comparison tables, EMBER announcements, provenance disclosures, Dossier headings and game onboarding/pause/projected-display reading order. Prior human reports do not automatically validate newly changed interfaces. Canvas accessibility is not established by surrounding Axe passes.

## Next actions

Complete a human NVDA pass and timed rehearsal; review the 3D proposal before authorizing any rendering/asset work; profile M0 startup on representative hardware and establish production performance budgets. Do not conflate a polished HUD with photorealistic scene quality. Work stops at this phase; no next UI phase or major 3D redesign has begun.

The B1 fallback panel previously used a broad Gas Measurements/unavailable heading while the dashboard correctly exposed source oxygen. The panel now explicitly scopes its message to airflow/pressure and preserves UNKNOWN outcome. The new browser regression checks that wording; existing B1 comparison tests verify oxygen and provenance. The B1 native video appeared unsettled in a capture, but a separate browser inspection found metadata ready (readyState 4), no media error and an approximately 44.81-second duration; full video playback was not tested.
