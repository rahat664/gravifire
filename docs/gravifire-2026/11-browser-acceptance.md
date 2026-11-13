# GRAVIFIRE browser acceptance

Date: 2026-11-13  
Branch observed: `integration/game-merge`

## Test setup and safety

- Browser target: the already-running Next.js development service at `http://localhost:3000`.
- Port owner was identified before testing as Next.js (`node` PID 10008 with child PID 19648). The process was not stopped, restarted, or reconfigured.
- Browser runner: Playwright Test 1.65.0 with Chrome channel and `@axe-core/playwright` 4.14.0, isolated in `tests/browser-harness/`; it is not added to the application dependencies. Run from that directory with `npm ci` then `npm test`. `GRAVIFIRE_BASE_URL` can override the default URL.
- Browser artifacts are under `tests/browser-harness/artifacts/`. The existing repository `.next` directory was not used for a build. Production build and final static checks ran from a separate source copy at `D:\gravifire-acceptance-build-final-20261113`.
- No user files or NASA source data were removed. Existing uncommitted changes remain uncommitted.

## Browser results

Final Playwright run: **4 passed, 0 failed, 0 blocked**.

1. Dashboard lunar habitat + prevention → relevant investigations → BASS-II / PSI-25 → B1, with hypothetical oxygen set to 22.2%. Verified source-record oxygen and scenario oxygen are both displayed as `22.2 %` and `MATCHED`; gravity is `MISMATCHED`; the partial-gravity warning is visible. The source row shows the BASS-II identity, PSI source link, source SHA-256 `71e792bf6b5fb5ea620c5dd70fbbac05515992e12aefcf5dff47312caa48c042`, and row 2. The UI explicitly says no normalized outcome is linked to B1; no combustion outcome was inferred. Limitations and next experiment direction are visible. The flow then opens the complete run record / Evidence DNA and EMBER's five documented evidence gaps for B1.
2. EMBER repeats the lunar prevention ranking question and returns identical score explanation text, preserves the ranking version, refuses material/habitat safety certification, and returns insufficient evidence for partial-gravity fire tests.
3. `/experiments`, `/applicability`, `/recommend/investigations`, `/dashboard`, `/mission-control`, `/mission-control/dossier`, and `/mission-control/manual` respond and render. The Dossier routes to NASA evidence. M0, M1, M4 and M6 game science links preserve their mission/objective/investigation query context; fictional incidents remain explicitly fictional and do not receive invented NASA verdicts. Campaign local storage is byte-for-byte unchanged after review navigation.
4. Dashboard prevention, detection, and suppression controls can be selected; form controls are keyboard reachable and focus is visible. The dashboard has no horizontal overflow at 1280×900, 768×1024, or 390×844. Mission pause dialog has dialog semantics, initial focus, Tab/Shift+Tab containment, and Escape close with focus restoration.

No uncaught page errors or browser console errors were observed by the passing acceptance checks.

## Automated accessibility

axe WCAG 2.1 A/AA and WCAG 2.0 A/AA scans passed with zero violations on the dashboard mobile state, dashboard controls, applicability, experiments, ranking, Mission Control, Dossier, Field Manual, and M0 pause dialog. Scan JSON is in `tests/browser-harness/artifacts/axe/`.

The initial browser scans found insufficient text contrast in dashboard, experiment list, applicability comparison, ranking, Mission Control, Dossier and Field Manual labels. Text colors were adjusted in those views and the final scans passed. This is an automated accessibility check, not a complete screen-reader audit. Manual verification with a screen reader, including data-table announcements and game interaction, remains necessary.

## Screenshot and diagnostic artifacts

- `tests/browser-harness/artifacts/screenshots/dashboard-lunar-prevention-b1-desktop.png`
- `tests/browser-harness/artifacts/screenshots/dashboard-lunar-prevention-b1-tablet.png`
- `tests/browser-harness/artifacts/screenshots/dashboard-lunar-prevention-b1-mobile.png`
- `tests/browser-harness/artifacts/axe/` contains per-route/accessibility-state JSON reports.
- `tests/browser-harness/artifacts/test-results/` retains traces, screenshots and video from earlier failed exploratory runs that exposed defects subsequently fixed. The final successful run uses `retain-on-failure`, so it does not emit a success trace.

## Defects fixed during acceptance

- The hypothetical oxygen assumption omitted its unit. The applicability utility now displays the configured scenario units; the B1 browser workflow confirms scenario oxygen as `22.2 %`, and unit regression assertions were added in `tests/evidence-applicability.test.ts`.
- The M0 pause overlay lacked dialog semantics and keyboard focus handling. It now identifies a modal dialog, moves focus into it, contains Tab navigation, and restores focus on Escape. The browser regression exercises those behaviors.
- Automated contrast scans identified below-threshold text in the affected evidence and game-adjacent views. The labels now use a higher-contrast palette and all final scans listed above pass.

These are presentation and interaction fixes. The authoritative scientific verdict states, B1 source measurement, NASA evidence, game physics, and campaign decisions were not changed by these fixes.

## Limitations

- Browser acceptance used the existing development service; production behavior was verified by a build, not by launching a second production server.
- axe cannot establish complete screen-reader usability. Perform a manual screen-reader pass before treating accessibility as fully accepted.
- B1 is a source configuration record, not an outcome observation. Its absence of a linked combustion outcome remains explicit. Lunar partial gravity is not represented by this microgravity record; the warning and evidence gap are expected behavior.
