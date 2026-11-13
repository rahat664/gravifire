# GRAVIFIRE final scientific and technical acceptance audit

**Decision: PARTIAL**

Core automated checks and a local HTTP smoke check passed. Scientific safeguards, deterministic ranking, provenance validation, and routes are present. Full interactive browser acceptance, mobile viewport inspection, assistive-technology checks, and a reproducible user-driven end-to-end run were not completed; Playwright is not installed and the local port was already occupied. Therefore this is not a full acceptance sign-off.

## Repository state

- Current branch: `integration/game-merge`.
- Recent commits are present on that branch; this audit made no application-code changes.
- The working tree contains uncommitted changes and untracked files from the ongoing GRAVIFIRE work (including the dashboard, applicability, ranking, coverage, EMBER, and game-science work and prior user documents). They were left untouched. Nothing was staged, committed, pushed, deployed, or published.
- `package.json` provides `lint`, `test`, and `build`; TypeScript checking is available through `pnpm exec tsc --noEmit`. There is no browser-test script or Playwright dependency.

## Check results

| Check | Result |
| --- | --- |
| `pnpm lint` | PASS, exit 0 |
| `pnpm exec tsc --noEmit` | PASS, exit 0 |
| `pnpm test` | PASS: 35 files, 216 tests |
| `pnpm build` | PASS, exit 0; Next.js 16.3.6 compiled and generated static pages |
| `git diff --check` on inspected integration edits | PASS |
| Browser E2E / mobile viewport / screen-reader check | NOT RUN; Playwright command is unavailable and no browser automation is configured |

The production build enumerated `/dashboard`, `/mission-control`, `/mission-control/dossier`, `/mission-control/play/[missionId]`, `/mission-control/play/m1-pc`, `/ask`, `/experiments`, and other expected routes. Dashboard and mission-ID routes are server-rendered on demand; the static routes prerender successfully.

### Local HTTP smoke checks

An attempt to run `pnpm start` failed with `EADDRINUSE` on port 3000. An existing local service was already listening there, so it was not stopped or replaced. Requests to that service returned HTTP 200 for `/dashboard`, `/mission-control`, `/mission-control/dossier`, `/mission-control/play/m0`, `/mission-control/play/m1`, `/mission-control/play/m4`, `/mission-control/play/m6`, and `/ask`. `/api/ask` and `/api/challenge` responded as expected. These checks are useful runtime evidence, but the occupied service prevents treating them as an isolated build-server validation.

Observed endpoint cases:

| Request | Observed result |
| --- | --- |
| Ask initial oxygen for B1 | `ANSWERED`, `DIRECT`, citation `PSI-25:Test-B1` |
| Ask why B1 burned faster | `INSUFFICIENT_EVIDENCE`, `INSUFFICIENT`; no causal explanation asserted |
| Ask which NASA tests measured lunar partial-gravity fire | `INSUFFICIENT_EVIDENCE`; response explicitly says no direct lunar or Martian partial-gravity record was found |
| Ask whether PMMA is safe for a lunar habitat | `INSUFFICIENT_EVIDENCE`; explicit refusal to certify materials/habitats or claim NASA approval |
| Ask what is unknown about B1 | `PARTIALLY_ANSWERED`, `PARTIAL`; five documented gaps and citation `PSI-25:Test-B1` |
| Challenge run S1 | `LIMITED_EVIDENCE`, target `RUN`, citation `PSI-98:Sample-S1` |

## Workflow acceptance

The implemented path is available across existing routes, but it is not a single-page EMBER flow:

1. `/dashboard`: choose spacecraft, lunar habitat, Mars habitat, or pressurized rover; choose prevention, detection, or suppression; refine with a scientific question and inspect ranked investigations.
2. Open an investigation record and compare source-reported conditions with hypothetical mission conditions. The dashboard labels missing values unknown and compares the selected record to the scenario. It does not present a general paired-run comparator on this route; the game M1 context uses the authoritative S1/S2 `challengeComparison` audit.
3. Open the full record and Evidence DNA from the dashboard, then use the record page's “Ask about this experiment” link to enter EMBER at `/ask`.
4. Ask about an evidence gap. For B1, “What don't we know about B1?” returns five recorded limitations. The Ask view shows citations, provenance, limitations, and an answer challenge.

The path is source-inspectable and its component/API behavior is covered by the automated suite, but no browser session clicked through these steps. The dashboard itself does not currently provide a direct EMBER action; users go through the full record page.

## Scientific traceability and units

- Coverage and applicability tests validate source-backed records, unique provenance IDs, HTTP source links, record/investigation identity, source-field alignment, and valid reported/unknown states.
- Source values retain raw value, raw unit, normalized value/unit where conversions are supported, NASA source URL, source record ID, and field provenance. The tests specifically check FLEX pressure conversion from mmHg to kPa and oxygen from mole fraction to percent while preserving source units.
- FLEX-2 entries remain configuration envelopes with ranges/options and are not rendered as experiment outcomes. Unit tests assert that gravity is unknown and run-level applicability remains `UNKNOWN` for unselected configuration choices.
- NASA absence is not filled with mission assumptions: oxygen, pressure, and airflow for the mission profiles remain unspecified unless the user supplies hypothetical values.
- Ranking unit tests check stable reproducibility, tie-break ordering, weights, exact matches, reference-only evidence completeness, unknown condition handling, and that missing metadata cannot increase confidence.
- All three objectives are rendered as native radio controls and mapped to their intended research pillars. This was confirmed through component tests and source inspection, not interactive browser automation.
- Evidence and relevance are not safety certification. The interface and assistant preserve the explicit no-certification boundary.

## Game-route and compatibility review

The production build and HTTP smoke checks include M0, M1, M4, M6, Dossier, Mission Control, and the standalone M1 PlayCanvas route. The mission overlay link is contextual. Campaign state, route access, camera/physics controls, and persistence have dedicated regression tests (`mission-state`, `mission-review`, camera/FPS state, and `game-science-integration`). The integration test verifies campaign serialization round-trip and no state mutation from link/context resolution. It verifies M0 has no NASA audit, M1 compares source S1/S2, M4 maps PSI-99 sample 2-1, and M6 maps FLEX Test 2 with a partial-gravity notice.

The state and source code show no integration code writing campaign progress or influencing player controls. A live playthrough of mission progression and input/camera behavior was not performed in this audit.

## Failures, limitations, and unfinished acceptance work

### Observed failures

- No lint, TypeScript, unit-test, production-build, or inspected-diff whitespace failures.
- The isolated `pnpm start` attempt did not start because port 3000 was occupied (`EADDRINUSE`). The existing service was left running and was used only for smoke requests.
- Browser automation was not available (`pnpm exec playwright --version` reports command not found).

### Scientific limits

- No verified NASA lunar or Martian partial-gravity combustion run is integrated. Microgravity-to-partial-gravity application remains a mismatch/limitation, not a prediction.
- NASA source coverage remains family- and record-specific. Reference-only investigations cannot support run-level results or applicability values. Missing detector response, particle measurements, experiment outcomes, or source links remain explicit gaps where absent.
- Relevance scores express research relevance only. They do not estimate material risk, suppression effectiveness, detector performance, or safety.
- Mission oxygen/pressure/airflow values are hypothetical only when entered; defaults are intentionally unspecified.
- Evidence comparisons use the current exact/qualitative matching contract; they are not uncertainty propagation, causal analysis, or outcome transferability models.

### Remaining work before READY

1. Run browser E2E with a controlled app server: exercise mission selectors, objective changes, ranked investigation selection, source-row expansion, condition comparison, record-to-EMBER navigation, and evidence-gap response.
2. Inspect dashboard and PlayCanvas mission overlay at narrow mobile and desktop sizes. Verify keyboard focus order, visible focus, browser zoom/reflow, and screen-reader labels with an actual browser/assistive technology.
3. Verify campaign progression and gameplay inputs in a live M0/M1/M4/M6 session, including return navigation from the evidence dashboard.
4. Consider adding a direct dashboard-to-EMBER action and a direct tested-record comparison control to reduce navigation steps and make the requested workflow more explicit.
5. Repeat runtime checks against a server started on a known free port from this exact working tree.

## Decision rationale

The underlying code passes all repository-provided quality gates (216 tests, lint, TypeScript, and production build). HTTP smoke outputs confirm citation, uncertainty/refusal, evidence-gap, and run-audit behavior. I classify the release **PARTIAL**, rather than READY, because requested responsive/accessibility and full user-interaction acceptance was not observed in a controlled browser, and the dashboard-to-EMBER workflow requires a navigation hop through the record page. No NASA submission or external deployment status is implied.
