# UI phase 2 research interface report

## Scope and outcome

Applied the Phase 1 spacecraft research-console language to `/experiments`, `/recommend/investigations`, `/applicability` and `/lab`. This is a restrained shared styling pass, not a complete restructuring of these screens. Source records, numerical scores, matching rules, scientific calculations, terminology and visualization physics are unchanged.

## Modified files

- `src/app/globals.css`: shared `.research-console` presentation using the existing `--gf-*` tokens; instrument headers, panel borders/depth, readable metadata, controls, source targets and table spacing.
- `src/app/experiments/page.tsx`: scoped research-console styling hook.
- `src/components/recommendations/InvestigationRankingExplorer.tsx`: scoped styling hook; scores and all four scoring factors remain intact.
- `src/components/applicability/ApplicabilityExplorer.tsx`: scoped styling hook; explicit units and textual MATCHED/MISMATCHED/UNKNOWN states retained.
- `src/components/lab/VirtualLabWorkspace.tsx`: scoped styling and accessible names for text/range controls.
- `src/components/lab/FireVisualization.tsx`: image role supports the existing representational-visualization accessible label. No rendering code changed.
- `tests/browser-harness/capture-phase2.cjs`: reproducible screenshot/Axe capture harness. Run from repository root with `node tests/browser-harness/capture-phase2.cjs before` or `after`; reruns replace that phase's capture artifacts.

Shared CSS avoids introducing another design system or unnecessary component abstractions. Existing scientific evidence components inherit typography, controls and citation treatment inside these research surfaces.

## Before/after and responsive evidence

Artifacts: `tests/browser-harness/artifacts/ui-phase2/`.

For each of `experiments`, `ranking`, `applicability`, `lab`, screenshots are saved as:

- `before/<name>-desktop.png` and `after/<name>-desktop.png` (1920x1080 viewport).
- `before/<name>-mobile.png` and `after/<name>-mobile.png` (390x844 viewport).
- `before/<name>-tablet.png` and `after/<name>-tablet.png` (768x1024 viewport).

These are full-page screenshots, so image height may exceed viewport height. `before/results.json` and `after/results.json` record HTTP status, horizontal overflow and uncaught page errors. After results additionally record Axe WCAG 2.1 A/AA violations. Baseline captures did not run Axe; empty baseline violation arrays are not accessibility passes.

All 12 final route/viewport combinations returned HTTP 200, had no horizontal page overflow and emitted no uncaught page errors. Source targets are at least 44px tall; dense 9-11px metadata is raised to 12px. Existing mobile comparison order and text status labels remain available. Sample visual inspection confirmed the applicability mobile comparison and laboratory desktop panels remain readable. This does not constitute exhaustive visual inspection of every interaction state.

## Accessibility

Final Axe: zero violations in 12 scans. Initial scans exposed Virtual Lab missing control names and a prohibited aria-label on a generic wrapper; accessible names and the visualization role corrected these findings. Focus indicators and reduced-motion handling come from Phase 1. No real NVDA session was performed in this phase; manual control announcements, reading order and canvas alternatives still require human review.

## Technical and scientific verification

- TypeScript: `pnpm exec tsc --noEmit` passed.
- ESLint: `pnpm lint` passed after marking the standalone CommonJS capture script appropriately.
- Full Vitest: 218/218 tests across 36 files passed.
- Playwright: 7/7 passed in 52.0 seconds; includes BASS-II B1 oxygen/citation, partial-gravity uncertainty, missing outcome, EMBER refusals/ranking explanations, campaign navigation and state preservation.
- Axe: 12/12 scans clear.
- `git diff --check`: passed with Git line-ending conversion warnings only.
- Port 3000: retained PID 21384; no restart or dependency installation.
- No production build performed; live build output was not replaced.

NASA datasets, ranking modules and verdict modules were not edited. SAME/SAME-R table-entry terminology and FLEX-2 configuration-envelope labels remain unchanged. No new scientific observation, prediction or certification was introduced.

## Remaining issues and Phase 3 recommendations

Ranking remains long because all factor explanations are expanded. Explorer mobile family filters remain a long list. These were preserved rather than hidden without interaction review. The laboratory representational flame still occupies a relatively small part of its preview; its camera and scientific representation were left untouched. Empty/filter-failure and modified-lab states were not exhaustively captured. Console error events were not collected by the new screenshot harness; the existing Playwright workflows check console errors on their covered routes.

A future separately authorized phase can evaluate progressive disclosure for ranking factors, compact mobile filters, record-specific laboratory layouts and a broader manual accessibility pass. UI Phase 3 has not begun. Release readiness remains subject to those independent gates; these automated results do not establish full accessibility compliance.
