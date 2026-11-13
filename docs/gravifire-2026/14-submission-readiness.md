# NASA Space Apps submission readiness

**Audit date:** 2026-11-13
**Decision:** **PARTIAL** — central science workflow and technical baseline are strong, but demo discoverability, count terminology, visible game-link collision, and manual accessibility verification remain before an unqualified READY decision.

## Judge-oriented assessment

| Dimension | Qualitative assessment | Concrete evidence and limitation |
|---|---|---|
| Scientific validity | **Strong evidence discipline; incomplete coverage.** | Source-hashed normalized records and explicit statuses; B1 source citation; refusal of unsupported safety and causal claims. No direct lunar/Martian partial-gravity fire evidence; BASS reference-only; detection outcomes absent from local SAME tables; FLEX 274 vs report 284 unresolved; FLEX-2 configuration-only. |
| Relevance to challenge | **Strong.** | `/dashboard` combines mission environment, prevention/detection/suppression objective, deterministic investigation ranking, source evidence comparison, interpretation/limitations and evidence gaps. Exact detailed official page/resources could not be fetched; video captions yielded no text. |
| Technical implementation | **Strong, with small debt.** | Previously verified TypeScript, ESLint, production build, 216/216 Vitest and 4/4 Playwright passed; live service health checks and required routes succeeded. PlayCanvas warnings did not block game; M0 shader has delayed `uTime` initialization; React adapter emits deprecated `getGuid`. |
| Innovation | **Distinctive integration.** | Evidence-grounded dashboard plus playable campaign links fictional mission events to authoritative evidence, while keeping campaign story and NASA source records distinct. Ranking is reproducible and not LLM-scored. |
| Usability | **Good but demo path is not yet obvious.** | Functional route flow and responsive dashboard; home prioritizes Mission Control instead of the challenge dashboard. Review-mode badge obscures the game-to-science link. Mobile is readable but long. |
| Demonstration clarity | **Substantial evidence, needs polishing.** | Existing 90-second demo script and B1 example; screenshot pass covers primary workflow and M0/M1, automated tests cover M0/M1/M4/M6. The 109 SAME-R count labeling can imply detections/runs; clarify before judges see it. |
| Reproducibility | **Strong.** | Deterministic ranking methodology/version and reproduction example; source manifests/hashes and family ingestion reports; recorded browser/unit/build checks. Source coverage discrepancies are retained rather than silently reconciled. |
| Evidence transparency | **Strong foundation.** | Citations, integration badges, provenance, unknown/mismatch states, limitations and EMBER refusals. Keep caveats adjacent to detection/suppression research cards and define record counts precisely. |

These are qualitative project-readiness observations, not official NASA judging scores or predictions.

## Confirmed strengths

- Complete demonstrable path at `/dashboard`: choose environment/objective, inspect deterministic research relevance, open a record, compare conditions, inspect citation and gaps, then query EMBER.
- Tested BASS-II B1 case shows source oxygen 22.2% and oxygen match, gravity mismatch, partial-gravity warning, PSI-25 provenance, and no invented outcome.
- Ranking is stable, factor-explained and explicitly not a safety score. Missing metadata does not raise confidence.
- EMBER explains ranking without changing scores, cites verified observations, and refuses unsupported certification or partial-gravity certainty.
- Game routes M0/M1/M4/M6 remain accessible and story events are marked fictional relative to real NASA experiments.
- The test/build baseline is unusually complete for a challenge prototype: 216 Vitest tests, 4 Playwright browser tests, type/lint/build checks passed per the existing reports; live route/API health was verified in Step 13.

## Critical issues and limitations

No release-blocking scientific fabrication was found in the inspected journey. These concrete issues justify **PARTIAL**:

1. **Count semantics:** SAME/SAME-R registry values are table-record counts, but a shared `experimental_runs` kind and UI labels blur them with independent experiments/detections. SAME-R's 109 rows must not be read as 109 detector outcomes.
2. **Game navigation overlap:** review-mode badge visibly overlaps the top-right NASA evidence link. Automated navigation still succeeds, but the judge-facing affordance is obscured.
3. **First-time discovery:** homepage primary CTA routes to Mission Control, not directly to the challenge dashboard. Challenge workflow is not the most obvious entry point.
4. **Accessibility evidence:** automated scans passed, but manual NVDA/Chrome or Firefox and game keyboard/screen-reader review remain pending.
5. **Research coverage limits:** no verified lunar/Martian partial-gravity fire experiment; SAME/SAME-R local tables omit detector response/alarm results; BASS is reference-only; PSI-69 local/report scope differs; PSI-68 is configurations, not outcomes. These are scientific limits, not defects to paper over.

Official challenge page direct retrieval and the official video transcript remain unresolved; detailed secondary-source requirements must not be cited as official-confirmed language. The central indexed official summary is summarized in [Step 2](02-requirements-matrix.md). No NASA submission or external judging has occurred.

## Five highest-impact improvements

1. **Correct count vocabulary** in registry/UI: distinguish experimental-table records, completed runs, observations, and configuration envelopes; show detector-result absence beside SAME/SAME-R counts.
2. **Fix the game science-link overlap** by positioning review badge and evidence link in a non-overlapping responsive header; verify M0/M1/M4/M6 at desktop and mobile.
3. **Promote `/dashboard` on the home page** with a plain challenge-oriented CTA and a one-sentence workflow explanation.
4. **Clarify comparison labels** so “Measurement type” describes source measurement categories in plain language (or call it “Recorded source fields”); retain exact field names in provenance/details.
5. **Complete manual accessibility checks** using the Step 12 checklist, record browser/AT/version and any defects, then add narrowly scoped regressions for any confirmed fixes.

These improvements preserve the current evidence boundary. Do not add inferred NASA results, convert research references into integrated data, or describe ranking as fire risk/safety.

## Recommended implementation order

1. Correct the record-count type/labels and add tests; verify SAME/SAME-R and FLEX-2 displays.
2. Fix and browser-check the shared game header collision across four missions and mobile layouts.
3. Add homepage dashboard CTA and confirm first-time route discovery.
4. Rename measurement comparison UI while preserving schema/provenance and add UI regression coverage.
5. Run NVDA manual checklist, address only reproduced barriers, then rerun full tests/build/browser acceptance and refresh release evidence.

After these, separately resolve the official-page/video-source verification when content becomes accessible. Shader initialization can be handled as a small game quality fix; adapter `getGuid` should wait for an upstream-compatible dependency update and full game regression. Do not alter dependencies as part of visual polish.

## Exact next Codex task

**Implement a count-semantics correction only:** add a neutral `experimental_table_records` (or equivalent family-specific count description) to the typed coverage/ranking adapter; render SAME and SAME-R as “8/109 experimental-table records” and explicitly state their local rows do not include detector-response/alarm outcomes; preserve experimental run labels for actual run records and configuration-envelope labels for FLEX-2. Add focused registry/UI regression tests, run the relevant suite, and document any affected count surfaces. Do not change NASA data, ranking weights/scores, scientific verdicts, or the running service.
