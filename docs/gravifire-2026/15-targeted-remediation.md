# Step 15 targeted remediation

**Date:** 2026-11-13
**Status:** **BLOCKED — the targeted UI changes and browser regressions passed, but the existing Next process now returns HTTP 500 because root dependency links no longer resolve. Dependency repair and service restart were not authorized and were not attempted.**

## Root causes and changes

### SAME / SAME-R count terminology

Inspection of `src/data/nasa/raw/same/PSI-102_Experimental table_SAME.csv` shows rows keyed by `Sample #` with material, airflow, weight-loss rate and aging-duration columns. `PSI-101_Experimental table_SAME-R.csv` rows are keyed by sample type and `SAME Test #`, with description/date/velocity/Rt/R0/timing fields; some test identifiers repeat. The normalized schemas represent these rows as `NASAExperimentRun`, but that software type does not establish that every row is a separate completed run, smoke detector event, or detection result.

Coverage now uses `experimental_table_records` for SAME (8) and SAME-R (109), while verified run datasets retain `experimental_runs` and FLEX-2 retains `configuration_envelopes` (8). Count wording is centralized in `src/lib/investigation-record-label.ts`. Experiment Explorer, investigation ranking, and the challenge dashboard now render the precise count kind. SAME/SAME-R Explorer summaries state that local rows contain no detector-response or alarm-outcome measurements and that row count is not detection count. The SAME comparison page calls its counts experimental-table entries. No source IDs, values, provenance paths, data artifacts, or ranking weights changed.

The evidence wording returned by `challengeRun` was also audited: SAME and SAME-R evidence cards used the generic phrase “NASA run record.” It now calls these “experimental-table records”; existing citations remain `PSI-102:Sample-<id>` and `PSI-101:Test-<id>`. Regression assertions were added to the SAME and SAME-R challenge-engine tests. Other investigation families retain run wording.

### Game header overlap

The review badge was conditionally rendered by `PlayCanvasMissionLoader` as a fixed top-right overlay (`z-index: 50`); `MissionScienceLink` independently occupied the same corner. The overlap reproduced in M0/M1/M4/M6 review routes at desktop and mobile viewports. The before captures are [desktop](</C:/Users/rahat/AppData/Local/Temp/gravifire-step15-before-20261113/desktop.png>) and [mobile](</C:/Users/rahat/AppData/Local/Temp/gravifire-step15-before-20261113/mobile.png>).

The smallest layout correction moves the review badge into `PlayCanvasMissionChrome` and stacks it with the NASA evidence link in a shared, non-interactive-positioned header. The header preserves pointer interaction on its link, whose minimum height is 44px. On narrow screens the stack moves below the mission HUD title area. Badge contrast was strengthened. The link has an accessible landmark label; DOM reading order is badge then link. No controls, camera, physics, campaign state, or verdict logic changed.

After captures for all four missions at desktop and mobile were attached by `tests/browser-harness/specs/review-header.spec.ts`; the HTML report and image data are in `tests/browser-harness/artifacts/report/`. The report includes eight images (M0/M1/M4/M6 × desktop/mobile). The regression also checks geometry for no overlap, center-point hit testing, link navigation/context, badge visibility/contrast, keyboard focus, 44px target size, and Axe WCAG 2.1 A/AA checks scoped to the updated header.

## Exact files changed for this remediation

- `src/types/investigation-coverage.ts`
- `src/lib/investigation-record-label.ts`
- `src/data/nasa-investigation-coverage.ts`
- `src/app/experiments/page.tsx`
- `src/app/experiments/same-comparison/page.tsx`
- `src/components/recommendations/InvestigationRankingExplorer.tsx`
- `src/components/dashboard/ChallengeDashboard.tsx`
- `src/components/mission-control/MissionScienceLink.tsx`
- `src/components/mission-control/PlayCanvasMissionChrome.tsx`
- `src/components/mission-control/PlayCanvasMissionLoader.tsx`
- `src/lib/challenge-engine.ts`
- `src/app/globals.css`
- `tests/investigation-record-label.test.ts`
- `tests/expanded-coverage.test.ts`
- `tests/challenge-dashboard.test.tsx`
- `tests/same.test.ts`
- `tests/same-r.test.ts`
- `tests/browser-harness/specs/review-header.spec.ts`
- this report

Pre-existing worktree changes remain present. `package.json`, `pnpm-lock.yaml`, NASA raw tables, normalized NASA artifacts, and verdict/ranking logic were not edited.

## Verification results before dependency-layout failure

| Check | Result |
|---|---|
| Focused Vitest coverage, ranking, applicability and dashboard tests | **25 passed / 25** across 5 files |
| Full Vitest suite | **218 passed / 218** across 36 files, before the final two challenge-evidence wording assertions were added. Those assertions could not be rerun after dependency paths broke. |
| TypeScript (`pnpm exec tsc --noEmit`) | **Passed** (exit 0) |
| Targeted Playwright header/count regression | **1 passed**; M0/M1/M4/M6 at desktop/mobile; Axe scoped scans had no violations |
| Full Playwright harness | **5 passed / 5**; includes B1, EMBER, mission-context/campaign compatibility, responsive dashboard and the new regression |
| Existing browser Axe scans | **Passed** on dashboard, mission-control routes/dialog and the updated science header; automated only |
| `git diff --check` | **Passed**; only Git line-ending conversion notices for pre-existing modified files |
| ESLint | **Blocked**: `pnpm run lint` returned `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` / access denied while trying to remove root modules; no direct ESLint binary remained resolvable afterward |
| Isolated production build | **Failed to verify**: Turbopack rejected the external `node_modules` junction as outside the isolated project root. A direct webpack build in that same junction-based copy could not resolve Next packages. Root `.next` was not intentionally used as an output target. |

### Dependency and service incident

The first isolated build copy used a junction from its `node_modules` to the root dependency folder. `pnpm run build` in that copy triggered a dependency-install step and rewrote package links through that shared junction to paths under the temporary build directory. A subsequent root `pnpm run lint` attempted to remove/recreate `node_modules` and was denied. Read-only inspection then found `D:\gravifire\node_modules\next` targeting the temporary build path and no package directories under the expected root `.pnpm` store. The original Next process PID 21244 remained present, but a health request to `/` returned HTTP 500 with Next reporting it could not resolve `next/package.json`; the service is no longer healthy.

This environment incident is separate from the targeted UI changes. No attempt was made to reinstall dependencies, alter the lockfile, terminate the process, or restart the service. Those actions require explicit authorization under the current instructions. Do not infer that the final service is healthy from the earlier 5/5 browser run; that run completed before the broken module resolution was detected.

## Scientific integrity confirmation

- SAME/SAME-R remain integrated only as source-table records with existing identifiers and provenance. Their count no longer implies detector outcomes.
- FLEX-2 still renders configuration envelopes, not runs. FLEX remains labeled as run records.
- BASS-II B1 oxygen value (22.2%), PSI-25 citation, condition comparison and no-outcome behavior were covered by the full browser workflow before the dependency incident. No scientific verdict code or ranking input changed.
- Partial-gravity warnings, EMBER source grounding/refusals, Evidence DNA navigation and game-to-dashboard context passed the 5-test browser suite before dependency breakage.
- No manual NVDA session was performed. Manual verification remains pending; the automated Axe scans are not a screen-reader certification.

## Remaining blockers and next safe actions

1. Obtain explicit authorization to recover root pnpm links/dependencies using the existing lockfile without deleting the dependency store, then verify the still-running PID 21244 and request approval before any service restart if it remains unhealthy.
2. Run ESLint, TypeScript, full Vitest, Playwright, Axe and a production build with an isolated dependency tree that does not share a writable junction with the root. Preserve the current `.next` directory.
3. Confirm the health routes and scientific B1/EMBER behavior after recovery; record actual service status.
4. Complete the manual NVDA checklist in `12-manual-accessibility-checklist.md` before claiming manual accessibility verification.

No commit, push, deployment, or publication was performed.
