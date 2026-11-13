# UI phase 3: EMBER, Evidence DNA and Dossier

## Scope and implementation

Extended existing Phase 1/2 tokens and research-console styling to `/ask`, `/experiments/bass-ii/runs/B1` (shared experiment-record route) and `/mission-control/dossier`. No dependencies, NASA data, retrieval modules, ranking logic, scientific verdict contracts or campaign persistence code changed. Port 3000 remained on PID 21384 without restart.

Changed files:

- `src/components/ask/AskGravifire.tsx`: research shell, structured response styling, full evidence excerpts instead of four-line clipping, descriptive citation link names, query accessible name, busy form state, error alert and polite response announcements.
- `src/components/evidence/EvidenceDNA.tsx`: named provenance region, direct existing NASA source link and native technical disclosure showing the existing source ID, file, SHA-256 and row. Identifier text is selectable for copying. No clipboard dependency or fabricated relationship was introduced.
- `src/components/mission-control/Dossier.tsx`: shared archive styling, section headings and Science Dashboard navigation. Existing state initialization, schemas and mission mappings retained.
- `src/app/experiments/[id]/runs/[runId]/page.tsx`: scoped research-console styling to the record page hosting Evidence DNA.
- `src/app/globals.css`: scoped typography, surfaces, wrapping, response emphasis, archive hierarchy and provenance details using existing `--gf-*` variables.
- `tests/browser-harness/capture-phase3.cjs`: repeatable capture and Axe harness; refuses to overwrite existing phase folders.
- `tests/browser-harness/specs/ui-phase3.spec.ts`: failed-query feedback, keyboard provenance disclosure, correct NASA link and Dossier dashboard navigation regression test.

## Baseline findings and improvements

Baseline captures reproduced mobile/tablet EMBER overflow and mobile B1 record overflow. Long evidence titles, hashes and metadata now wrap. Record-page secondary text contrast benefits from the existing research-console tokens. Dossier sections now have real headings. Evidence branches retain their actual source hierarchy and explicit unresolved document links. Existing status text, limitation/refusal language and fictional campaign notice remain visible.

No changes were made to shared verdict state contracts or the game HUD. The work adds presentation and semantic hooks without replacing contract-specific statuses.

## Screenshots and results

Root: `tests/browser-harness/artifacts/ui-phase3/`.

For `ember`, `dna`, and `dossier`, compare `before/<name>-<size>.png` with `after-verified/<name>-<size>.png`. Sizes are `desktop` (1920x1080), `mobile` (390x844), and `tablet` (768x1024). These are full-page captures at the specified viewport sizes. EMBER captures include the actual B1 evidence response and its partial-evidence limitations.

- `before/results.json`: baseline status/overflow/errors; `violations: null` means Axe was not run.
- `after/results.json`: initial scans, retaining discovered record-page contrast and overflow failures.
- `after-verified/results.json`: all 9 combinations HTTP 200, no page/console errors, no horizontal overflow, zero Axe WCAG 2.1 A/AA tagged violations.
- `test-results-final/`: new test's `ember-error.png` and `dna-expanded.png` interaction screenshots, under its test-specific subdirectory.
- `test-results/`: original full-suite outputs, including preserved failure trace for the initially ambiguous test locator.

Visual review of the final EMBER mobile capture confirmed wrapped evidence text, usable source actions and readable provenance branches. Captures are available for comparison across all target surfaces; they are not an exhaustive review of every record family or mission state.

## Verification

| Check | Actual result |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit` passed |
| ESLint | `pnpm lint` passed |
| Full Vitest | 218/218 tests, 36 files passed |
| Existing Playwright tests | 7/7 passed in the 8-test invocation |
| New Playwright test | Initially failed from an ambiguous alert locator including Next.js route announcer; scoped locator rerun passed 1/1 in 4.2 seconds |
| Final browser coverage | All 8 distinct tests passed across the full run and targeted rerun; no single final 8/8 invocation was performed |
| Axe | 9/9 final route/viewport scans clear |
| Git diff check | Passed; line-ending conversion warnings only |
| Production build | Not run; live build output protected |

Existing browser tests verify deterministic ranking explanations, unsupported-certification refusal, partial-gravity insufficiency, B1 oxygen and citation, missing outcome, game mission mappings and campaign state compatibility. Full Vitest covers the unchanged scientific contracts. The new provenance link test resolves PSI-25 and checks disclosure keyboard behavior. Initial failures and corrected reruns are retained rather than described as an uninterrupted all-pass run.

## Accessibility and remaining work

Native disclosure semantics, visible focus from Phase 1, textual warnings and existing reduced-motion handling remain available. Source IDs and hashes can be selected; no new confidence percentages, measurements or safety badges were added. Automated scans do not replace manual NVDA verification. Human review remains needed for live response announcements, long provenance reading order and disclosure use across record families.

Loading-state appearance and every scientific family were not separately screenshot-tested. Dossier navigation was added without changing mission-specific mappings. Existing limitations in source coverage remain scientific boundaries, not visual defects.

## Phase 4 recommendations

A separately authorized phase could review EMBER suggestion density, richer archive navigation and broader record-family provenance layouts with human accessibility feedback. UI Phase 4 has not begun. Existing uncommitted work, NASA artifacts and service configuration were preserved. No commit, push, merge or deployment occurred.

