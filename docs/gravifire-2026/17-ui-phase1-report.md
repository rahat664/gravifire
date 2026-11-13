# UI phase 1 visual implementation report

## Outcome

Implemented the Home page, shared navigation and scientific dashboard visual pass for the GRAVIFIRE spacecraft research-operations direction. The active Next.js service on port 3000 was used only for browser inspection; it was not stopped or restarted. No dependencies, NASA raw/normalized records, generated scientific artifacts, ranking logic, verdict logic, game rendering or campaign state were changed.

## Changes

- `src/app/globals.css` — added the shared research-system tokens, navigation, Home, dashboard surface, responsive and focus styles. Dashboard metadata rendered at 9–11 px is raised to a 12 px minimum.
- `src/components/mission-control/MissionNav.tsx` — added active-route identification, a complete desktop route bar and a native mobile navigation disclosure exposing all five primary destinations.
- `src/app/page.tsx` — rebuilt Home around evidence discovery and mission context. Coverage counts come from the existing registry; the aggregate is labeled “local records” and explicitly described as a mixture of ingested runs, observation records and configuration envelopes. Vesta 2038 is stated to be fictional and not a NASA mission.
- `src/components/dashboard/ChallengeDashboard.tsx` — added a visual root/header hook and separated the internal Evidence DNA action from the external NASA source action with a wrapping flex row. No scientific content or behavior changed.
- `tests/browser-harness/specs/ui-phase1.spec.ts` — added desktop/mobile route navigation and dashboard source-action separation regression coverage.

The first screenshot review revealed that a closed native disclosure also hid desktop links; the navigation now has a separate desktop link row and mobile disclosure. The first Axe pass found a label-content-name mismatch on the Home brand link; its redundant aria-label was removed. The dashboard evidence actions were visually crowded; the links now have a measured gap and non-intersecting hit boxes. Registry inspection showed the Home aggregate combines unlike record types, so its label is "Local records" and the note names runs, observation records and configuration envelopes rather than implying every item is an experimental run.

## Screenshots

Requested captures are exact viewport screenshots at 1920×1080 desktop and 390×844 mobile. Earlier baseline captures were made before implementation from the healthy local service.

| View | Before | After |
|---|---|---|
| Home desktop | `tests/browser-harness/artifacts/ui-phase1/before/home-desktop.png` | `tests/browser-harness/artifacts/ui-phase1/after/home-desktop.png` |
| Home mobile | `tests/browser-harness/artifacts/ui-phase1/before/home-mobile.png` | `tests/browser-harness/artifacts/ui-phase1/after/home-mobile.png` |
| Dashboard desktop | `tests/browser-harness/artifacts/ui-phase1/before/dashboard-desktop.png` | `tests/browser-harness/artifacts/ui-phase1/after/dashboard-desktop.png` |
| Dashboard mobile | `tests/browser-harness/artifacts/ui-phase1/before/dashboard-mobile.png` | `tests/browser-harness/artifacts/ui-phase1/after/dashboard-mobile.png` |

Additional interaction evidence:

- `tests/browser-harness/artifacts/ui-phase1/after/dashboard-mobile-menu.png` — open mobile route menu.
- `tests/browser-harness/artifacts/ui-phase1/after/dashboard-lunar-bassii-22-2.png` — full-page Lunar habitat / BASS-II B1 comparison with hypothetical oxygen set to 22.2%; the source-reported value, gravity mismatch, warning, unknown fields and no-outcome message remain visible.
- `tests/browser-harness/artifacts/ui-phase1/after/axe-results.json` — route and viewport Axe summaries.
- `tests/browser-harness/artifacts/ui-phase1/after/browser-checks.txt` — browser check summary.
- Playwright results and outputs are isolated under `tests/browser-harness/artifacts/ui-phase1/playwright-results/` and `playwright-cwd/` so prior harness reports and screenshots are not overwritten.

## Verification

Executed against the existing port 3000 service:

| Check | Result |
|---|---|
| Home and dashboard browser HTTP | 4/4 route/viewport combinations returned HTTP 200 |
| Browser runtime and console errors | None observed on Home/Dashboard captures |
| Horizontal overflow | None at 1920×1080 or 390×844 on Home/Dashboard |
| Desktop active route | Dashboard identified with `aria-current="page"` |
| Mobile navigation | Five routes visible; Evidence Explorer navigation succeeded |
| Evidence action hit boxes | No intersection at desktop; regression also tested at mobile |
| Automated Axe WCAG 2.1 A/AA | 0 violations across Home/Dashboard at desktop/mobile (4 scans) |
| TypeScript | `pnpm exec tsc --noEmit` passed |
| ESLint | `pnpm lint` passed |
| Vitest | 218 tests passed across 36 files |
| Playwright | 7 tests passed, including the 2 new UI phase tests |
| `git diff --check` | Passed; only Git LF-to-CRLF working-copy warnings were printed |
| Production build | Not run; not required for this visual pass, and the live `.next` output was left untouched |

The final Playwright run used one worker, ran 7 tests and passed all 7. Its isolated output is in `tests/browser-harness/artifacts/ui-phase1/playwright-results-last/`; process-relative screenshots/reports were isolated in `playwright-cwd-last/`. Earlier repeated runs used the sibling `playwright-results/` and `playwright-cwd/` locations. No production build or package installation was run. No service restart occurred. The automated browser and Axe results do not constitute a manual NVDA/screen-reader audit.

## Remaining visual/accessibility work

- Manual NVDA review remains necessary for the mobile disclosure, current-page announcements and dashboard comparison semantics.
- Tablet screenshots were not requested in this phase and were not added.
- The Home “local records” field follows the existing registry calculation, which combines different ingested record types. Its qualifier makes that scope explicit; it is not an experimental run total across all NASA investigations.
- Other research pages and the 3D game/HUD retain their previous visual styling and are outside this phase.

## UI-2 recommendation

Review this phase before proceeding. A separate UI-2 task can address ranking/Explorer information density, common scientific comparison rows, Virtual Lab framing and game HUD legibility. Preserve route behavior, source provenance, unknown data, game controls and science contracts while doing so.

**Phase 1 result:** implemented; requested automated checks passed. Manual screen-reader review and any broader release gates remain separate.
