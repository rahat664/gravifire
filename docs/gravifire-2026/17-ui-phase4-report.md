# UI phase 4: Mission Control and game HUD

## Scope and architecture

This phase updates the Mission Control landing page and shared HTML instruments for the default M0/M1/M4/M6 routes. It reuses the existing Phase 1/2 `--gf-*` tokens. The fictional 2038 campaign remains explicitly separate from real NASA source evidence.

The active routes resolve through `src/lib/mission-route.ts` and `PlayCanvasMissionLoader.tsx` to four PlayCanvas pilots. `GameShell` handles viewport/body containment. `PlayCanvasMissionChrome` owns the HTML science header, control hints, onboarding and pause dialog. Pilot-authored `.playcanvas-objective` and `.playcanvas-ember` elements are HTML layered over the canvas. Projected evidence monitors are also HTML positioned from existing world projections; their geometry, anchors and scientific content were not changed.

A separate development `engine=r3f-legacy` path uses `MissionGame`, the M0/M1/M4/M6 legacy components, `MissionScene`, `MissionHUD`, `MissionObjectiveGuide` and `TutorialTips`. `MissionScene` uses R3F/Three, Rapier, keyboard controls and pointer lock. Those legacy controls/renderers remain unchanged. The default four missions are not assumed to share that renderer.

## Changed components

- `src/components/mission-control/CertificationQueue.tsx`: research/operations shell styling; science-dashboard entry; displayed mission IDs now use actual `mission.id` (M4/M6) instead of sequence positions (previously M2/M3). Availability, priority selection, reset confirmation and persistence functions are unchanged.
- `src/components/mission-control/PlayCanvasMissionChrome.tsx`: static class hooks for the shared chrome, control strip, tutorial and pause panels. Escape handling, focus trap/restoration, resume events and tutorial storage remain unchanged.
- `src/app/globals.css`: scoped operations-center and HTML HUD presentation; opaque-enough instrument backing, readable objective and control text, consistent margins, responsive science header placement, separated EMBER message, restrained panel edges and scrollable pause/onboarding surfaces.
- `tests/browser-harness/capture-phase4.cjs`: before/after capture and warning/Axe collector; refuses existing destinations.
- `tests/browser-harness/specs/ui-phase4.spec.ts`: objective/header overlap, evidence hit targets, unobstructed center, pause/controls and focus restoration across all four missions.

No player, camera, pointer-lock controller, physics, collision, trigger, mission completion, campaign schema, science/ranking module, NASA data or dependency file was edited. No new telemetry or scientific readings were introduced. No new continuous animations, React effects or state updates were added.

## Before/after screenshots

Root: `tests/browser-harness/artifacts/ui-phase4/`.

The interruption left three Mission Control baseline files in `before/`; these were preserved. The complete baseline is `before-resumed/`. Compare its files with `after/`:

| Surface | Filename pattern |
|---|---|
| Mission Control | `control-desktop.png`, `control-tablet.png`, `control-mobile.png` |
| M0/M1/M4/M6 objectives, HUD and evidence navigation | `<mission>-desktop.png`, `<mission>-tablet.png`, `<mission>-mobile.png` |
| M0 pause and controls expanded | `pause-<size>.png`, `controls-<size>.png` |

Desktop uses 1920x1080, tablet 768x1024, mobile 390x844. Game captures are viewport screenshots; Mission Control uses full-page screenshots. Captures wait for the objective and canvas plus a render settling interval. They represent development review states, not proof of completed campaign missions.

Additional final states in `states/`: onboarding, fictional incident, and M6 refusal/boundary at desktop/mobile. `states/pointer-lock.json` records four desktop pointer-lock checks. Final pause styling screenshots and scans are recorded separately in `pause-final/`; the initial `after/pause-*` captures predate the last pause-panel class hook.

Visual review compared baseline Mission Control/M0 mobile with updated Mission Control, M1 desktop, M6 mobile and onboarding/pause states. Objectives and control hints are more legible with solid backing, while the central gameplay area stays clear. Long mission descriptions retain their real text and wrap. No claim is made that the unchanged 3D environment assets became more realistic.

## Mission-by-mission results

| Mission | Verified results |
|---|---|
| M0 | Objective/evidence layout at all three sizes; pause focus/controls/restoration; tutorial capture; fictional incident capture; pointer-lock recovery |
| M1 | Objective/evidence layout at all three sizes; existing source/dashboard mapping; pause focus/controls/restoration; pointer-lock recovery |
| M4 | Objective/evidence layout at all three sizes; existing source/dashboard mapping; pause focus/controls/restoration; pointer-lock recovery |
| M6 | Manifest objective/evidence layout at all three sizes; existing Mars context/dashboard mapping and campaign-state checks; boundary/refusal capture; pause focus/controls/restoration; pointer-lock recovery |

The new test checks the actual evidence link center remains clickable and objective/header rectangles do not intersect. Pause controls are keyboard reachable and focus returns to the previously focused evidence link. Existing acceptance coverage verifies campaign serialization remains unchanged through game-to-dashboard navigation. These checks do not constitute a full manual playthrough of every objective/manifest selection or a collision/navigation-mesh audit.

## Accessibility and responsive checks

All 15 final default route/viewport combinations returned HTTP 200, had no horizontal page overflow and produced zero Axe WCAG 2.1 A/AA violations. Existing Playwright pause-dialog and science-header Axe checks also pass. Text continues to name warnings and source boundaries; color is supplemental. Focus styling and reduced-motion preferences are inherited from prior phases.

Mobile HUD responsiveness is verified; touch-only movement/look controls are not implemented or claimed. Keyboard/mouse remains the intended game input. Manual NVDA verification is pending, particularly for onboarding, objectives and projected evidence reading order. Canvas accessibility is not established by accessible surrounding controls.

## Rendering and performance

Before and after warning counts match per captured load: M0 reports 10 missing `uTime` shader-uniform warnings plus one `Entity#getGuid` deprecation; M1/M4/M6 each report the deprecation once. No console errors, uncaught page exceptions or blank-scene failures appeared in either complete capture pass. Full logs are in `before-resumed/results.json` and `after/results.json`.

The shader initialization timing and dependency-adapter deprecation sources remain as diagnosed in `14-game-rendering-diagnostics.md`. They were not repaired during HUD work. No dependency upgrade or shader change was attempted.

Recorded elapsed capture times include navigation, intentional settling, screenshot work, and (after only) Axe analysis. They are not comparable FPS/render benchmarks. No frame-time or React-profiler measurement was performed; no quantitative performance improvement is claimed. Changes are static classes/CSS with no added frame loop, animation or layout polling. Warning parity and successful render/interaction checks are the available stability evidence.

## Verification

- TypeScript: `pnpm exec tsc --noEmit` passed.
- ESLint: `pnpm lint` passed.
- Full Vitest: 218/218 tests across 36 files passed.
- First complete Playwright run: 9/9 passed, including the new four-mission HUD regression test.
- Final rerun after the pause-panel style hook: 9/9 Playwright tests passed (reported duration 1.4 minutes).
- Axe: 15/15 default route/viewport scans plus 3/3 final expanded-pause-dialog scans clear (18 total). Baseline did not run Axe (`violations: null`).
- Desktop pointer-lock checks: 4/4 passed (canvas click acquires, Escape releases/pauses, Resume then canvas click reacquires).
- `git diff --check`: passed with line-ending conversion warnings only.
- Service: port 3000 retained PID 21384; no restart, new server, package installation or production build.

Browser test outputs are isolated in `run/`, `test-results/`, `run-final/` and `test-results-final/`, preserving prior harness artifacts. Existing uncommitted work was retained. No commit, push, merge or deployment occurred.

## Remaining issues

Manual NVDA, full mission completion playthroughs, touch-only gameplay and controlled FPS/React performance profiling remain unverified. The development-only legacy R3F path was inspected but was not redesigned or browser-certified in this phase. Existing projected monitor text can remain small on narrow viewports; world anchors and camera behavior were deliberately left unchanged. Shader/deprecation warnings remain documented. UI Phase 5 has not begun.

The existing pause interface exposes Controls rather than a separate settings system; no new settings or gameplay input system was introduced.
