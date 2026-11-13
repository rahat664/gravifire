# GRAVIFIRE release readiness

Date: 2026-11-13  
Decision: **PARTIAL**

## Gate results

| Gate | Result | Evidence |
|---|---|---|
| Real-browser journey | PASS | Playwright: 4 passed, 0 failed, 0 blocked; existing service at `http://localhost:3000` |
| Source integrity and scientific boundaries | PASS | B1 identity, raw value, provenance hash/row, no-outcome state, partial-gravity caveat, and EMBER refusal assertions passed |
| Mission/game regression | PASS | Mission Control, Dossier, Field Manual, M0/M1/M4/M6 dashboard links, fictional boundary, and campaign-state preservation assertions passed |
| Responsive and automated accessibility | PASS | Desktop/tablet/mobile sizes, no horizontal overflow, keyboard focus/dialog checks, axe scans with zero final violations |
| TypeScript | PASS | `pnpm exec tsc --noEmit` passed in the isolated final source copy |
| ESLint | PASS | `pnpm lint` passed in the isolated final source copy |
| Vitest | PASS | `pnpm test`: 35 files, 216 tests passed in the isolated final source copy |
| Production build | PASS | `pnpm exec next build` passed in the isolated final source copy; `.next` route manifest shows dashboard, applicability, ranking and existing game routes |
| `git diff --check` | PASS | No whitespace errors; Git emitted only existing LF/CRLF conversion notices |
| Manual screen-reader verification | NOT RUN | Automated checks do not replace a manual screen-reader pass |
| Root workspace package-manager health | BLOCKED | Concurrent root pnpm launch reported a Windows staging error moving an existing `node_modules/.pnpm/esbuild...` directory; subsequent root `.bin/tsc.cmd` lookup was unavailable. Final checks used the isolated copy to avoid repairing dependencies under the live development server. |

## Test execution detail

- Playwright suite: `tests/browser-harness/specs/acceptance.spec.ts` — **4 passed**. Includes the lunar/BASS-II B1 journey, deterministic EMBER explanations and refusals, route/game/campaign regressions, responsive controls, focus and automated accessibility.
- Full Vitest suite: **216 passed across 35 files**.
- TypeScript: passed from `D:\gravifire-acceptance-build-final-20261113`.
- ESLint: passed from `D:\gravifire-acceptance-build-final-20261113`.
- Production build: passed from `D:\gravifire-acceptance-build-final-20261113`; it compiled and type-checked, generated 23 static pages and enumerated 27 application routes.
- `git diff --check`: passed.
- An earlier Vitest discovery attempt treated the Playwright spec as a Vitest test. `vitest.config.mts` now excludes `tests/browser-harness/**`; rerun then passed 216/216. Root TypeScript config excludes this isolated Playwright harness, whose dependencies intentionally are not application dependencies.
- The first isolated Next build attempt used a junction to root `node_modules`; Turbopack correctly rejected a dependency link outside its project root. A second independent source copy with its own frozen-lockfile install built successfully.

The root `node_modules` staging issue is an environment/tooling problem; no application package manifest or lockfile was changed. The live Next.js service was left running and no existing `.next` artifacts were overwritten. Because dependency repair could affect that running service, it was not attempted.

## Repository state and changes

Current branch is `integration/game-merge`. The worktree already contained substantial uncommitted and untracked Steps 1–10 work before this acceptance pass. Those changes remain present; nothing was committed, pushed, deployed, or published. The acceptance pass adds the browser harness, extends TypeScript/Vitest exclusions for the isolated harness, adjusts contrast in the views identified by axe, fixes the hypothetical oxygen unit display, and adds the M0 modal focus behavior. It does not edit NASA raw or generated normalized evidence.

The existing development service on port 3000 was not stopped, restarted, or modified. No application changes were made to `.next` in the main worktree.

## Scientific and accessibility limitations

- B1 has source-reported experiment configuration (including oxygen fraction 22.2%); the evidence adapter has no normalized outcome observation for that run. The UI must continue to avoid stating a combustion outcome.
- Microgravity evidence does not directly establish lunar or Martian partial-gravity behavior. No result in this acceptance pass closes that evidence gap.
- Automated axe scans and keyboard checks passed. Manual verification with screen-reader software, including comprehension of scientific comparison tables and gameplay controls, has not been performed.
- Browser testing exercised the existing development server. A separate production server smoke test was not run because the task prohibits changing/restarting services without permission.

## Required next actions

1. Arrange a maintenance window or an explicitly approved safe dependency repair for the root `node_modules`, then rerun `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm test` from `D:\gravifire` without overlapping pnpm operations.
2. Perform and record a manual screen-reader pass on dashboard comparisons, EMBER responses, Dossier/Evidence DNA, and game pause/navigation controls.
3. If required by the release process, run a production smoke test in a separately approved isolated runtime and compare it with the successful isolated production build.
4. Re-run `git status --short` and review all pre-existing dirty/untracked Steps 1–10 changes before any later release action.

**Why PARTIAL:** the science-facing workflow, routes, responsive behavior, browser regressions, automated accessibility, full unit suite, static checks and isolated production build all passed. Release readiness is still incomplete because the root dependency tree experienced a package-manager staging failure and the manual screen-reader check is outstanding. No NASA submission or deployment readiness is claimed.
