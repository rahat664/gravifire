# Step 16: scientific consistency acceptance

**Assessment:** implementation contracts and existing UI are consistent with bounded, source-grounded interpretation in the checked workflows. This is a repository/UI consistency audit, not independent validation of NASA's experiments or a safety approval. No NASA data, ranking weights or verdict logic were changed.

## Requirement alignment

The requirements source is [`02-requirements-matrix.md`](02-requirements-matrix.md). Its evidence distinction remains material: the official indexed challenge summary confirms an interactive SI-powered dashboard that summarizes, ranks and interprets NASA microgravity combustion findings; detail on the official challenge page/Resources tab was not directly retrievable during the prior audit, and no video transcript was obtained. Prevention/detection/suppression specifics below are detailed in the written-statement reproduction and should be described as secondary-source alignment, not as transcript-confirmed or fully official-page-verified requirements. “SI-powered” has not been expanded into a superintelligence requirement.

| Acceptance item | Status | Implementation evidence inspected | Limitation / correct presentation |
|---|---|---|---|
| Summarize NASA investigations | **PASS for available catalog summaries; coverage partial** | `/dashboard` `ChallengeDashboard`; `/experiments` and `/experiments/[id]`; registry `src/data/nasa-investigation-coverage.ts`; source metadata `src/data/nasa-investigations.ts`. Coverage status and record kind are displayed. | Catalog is not the entire NASA PSI archive. BASS PSI-26 remains reference-only. No claim of comprehensive historical coverage. |
| Rank by research relevance | **PASS** | `/dashboard` and `/recommend/investigations`; `src/lib/investigation-ranking.ts`; tests `tests/investigation-ranking.test.ts`. Version `NASA Investigation Relevance v1`, deterministic factors and missing-data treatment. | Ranking is research discovery/relevance only; not material risk, fire probability, evidence strength or certification. Weights remain 30% mission, 25% material/phenomenon, 20% environment, 25% completeness. |
| Interpret available evidence | **PASS with bounded scope** | Dashboard condition interpretation and source record; `src/lib/evidence-applicability.ts`; `src/lib/challenge-engine.ts`; `/ask` via `src/components/ask/AskGravifire.tsx`. | Comparisons are not causal transfer. The UI explicitly has no B1 normalized outcome observation. Scientific interpretation remains limited to linked source records and documented gaps. |
| Prevention, detection, suppression | **PARTIAL** | Dashboard objectives filter research pillars. Catalog covers BASS-II/SAFFIRE (prevention-related evidence), SAME/SAME-R (smoke/aerosol tables), and FLEX/BASS-II (combustion/extinction/suppression evidence). | Detection UI does not expose structured detector response/alarm performance from SAME/SAME-R tables. M0 suppression choice is fictional campaign state, not an experiment. Do not claim equal depth across all three domains. |
| Mission applicability | **PASS for comparison; mission science remains incomplete** | `/applicability`, dashboard; `src/types/applicability.ts`; `src/lib/evidence-applicability.ts`; B1 comparison in `tests/browser-harness/specs/acceptance.spec.ts`. | Mission oxygen/pressure/airflow are unspecified until user enters hypothetical assumptions. Qualitative lunar/Mars gravity context does not assert a universal habitat condition. |
| NASA source citations/provenance | **PASS in inspected B1 and core records** | Dashboard source record disclosure; `/experiments/bass-ii/runs/B1`; `src/components/evidence/EvidenceDNA.tsx`; provenance manifest/hash records. Browser test asserts PSI-25 link, row/hash, source fields and 22.2 value. | Do not describe every catalog summary as having run-level document linkage; per-record scientific report links can be unavailable. |
| Measured data vs configuration envelopes | **PASS** | `src/types/investigation-coverage.ts`, `src/types/applicability.ts`, `src/lib/evidence-applicability.ts`; `src/components/experiments/FLEX2ConfigurationCard.tsx`; registry record kinds. FLEX-2 is rendered as eight configuration envelopes, not runs. | FLEX-2 envelope ranges/options are not measurements. Avoid ranking language that implies a completed run. |
| SAME/SAME-R terminology | **PASS in Step 15 remediation** | `src/lib/investigation-record-label.ts`; `/experiments`, SAME comparison page; challenge evidence labels and tests `tests/investigation-record-label.test.ts`, `tests/same.test.ts`, `tests/same-r.test.ts`. Counts read as 8/109 experimental-table records. | Original table rows and repeated SAME-R test identifiers do not establish unique completed runs, detector events, or outcomes. Detector response and particle measurements are absent from the current structured table. |
| Unsupported certification | **PASS in tested assistant/dashboard workflow** | `src/lib/challenge-engine.ts`, `/ask`; browser acceptance asserts “cannot certify a material or habitat as fire-safe” and evidence-insufficient state. Dashboard states no NASA certification/material-safety conclusion. | This is a software behavior check, not NASA certification. No evidence set here can justify habitat safety approval. |
| Unknown / insufficient evidence | **PASS in tested workflows** | B1 record says no normalized outcome observation is linked; `challenge-engine`/`grounded-query` preserve insufficient-evidence states; browser acceptance tests EMBER gaps and absent partial-gravity answer. | Do not infer missing values from adjacent studies or use absent metadata as confidence. |
| Lunar/Martian partial gravity | **PASS as explicit limitation** | `compareApplicability` marks microgravity-vs-partial gravity mismatch and warns; dashboard uses `role="alert"`; `tests/evidence-applicability.test.ts`, browser acceptance. | The catalog has no direct verified lunar/Martian partial-gravity combustion records. A mismatch is a scope warning, not an outcome prediction. |
| Fabricated detector outcomes / fire predictions | **PASS for inspected claims and B1 journey** | SAME/SAME-R detail says source rows do not provide detector response/outcome; B1 UI explicitly reports no normalized outcome; Virtual Lab is a visualization and does not provide a validated prediction engine. | This assessment did not exhaustively parse every possible free-form assistant response. Existing test suite and grounded-query rules are the evidence; remain cautious about claims outside supported evidence. |

## Family and record consistency

- **BASS-II:** B1 condition example uses source-reported initial oxygen 22.2% with PSI-25 attribution and unit. The condition match means only equality of that condition with a user-entered hypothetical value; gravity remains mismatched for lunar scenarios. No B1 combustion outcome is rendered as a normalized run result.
- **BASS (PSI-26):** reference-only; repository presence in research references does not become ingested evidence.
- **SAFFIRE-I/II/III:** integrated records are catalogued with their family source IDs and documented limitations. Mission examples are not presented as NASA experiments.
- **SAME / SAME-R:** current local rows are experimental-table records (8 and 109). The tables do not provide the detector-response/alarm or structured particle-size/morphology outcomes needed to claim smoke-detector performance.
- **FLEX:** runtime run records remain distinct from its unresolved 274 local vs 284 report count discrepancy documented in prior audits.
- **FLEX-2:** eight source configuration envelopes remain distinct from completed experiment runs and measured result sets.

## Evidence and reproducibility inspected

The previous Step 15.1 verified baseline records 218/218 Vitest tests, 5/5 Playwright tests, TypeScript, ESLint, isolated production build, automated Axe scans, and `git diff --check` as passing. The acceptance spec [`tests/browser-harness/specs/acceptance.spec.ts`](../../tests/browser-harness/specs/acceptance.spec.ts) concretely covers lunar prevention → BASS-II B1 → 22.2% comparison → gravity mismatch/warning → PSI-25/hash/source row → no outcome → Evidence DNA → EMBER gaps; it also checks ranking reproducibility/refusal, insufficient partial-gravity evidence, routes, game context, and campaign-state preservation. Step 16 did not rerun those package checks.

Current live route health was independently checked with HTTP 200 at `/`, `/dashboard`, `/experiments`, `/applicability`, `/recommend/investigations`, `/mission-control`, `/mission-control/dossier`, `/ask`, `/lab`, and `/mission-control/play/m0|m1|m4|m6?review=1`. No source values, citation contracts, ranking weights, or verdict contracts were modified during this assessment.

## Remaining scientific limits

1. No directly verified lunar/Martian partial-gravity combustion dataset is represented.
2. SAME/SAME-R source tables do not expose detector response, alarm performance, or structured particle measurements in this local integration.
3. BASS PSI-26 remains reference-only.
4. FLEX's local 274 vs report 284 count discrepancy remains unresolved.
5. FLEX-2 data are configuration envelopes, not completed run outcomes.
6. The official challenge Resources tab and video transcript remain unverified per Step 2; detailed secondary-source requirements must retain that label.
7. This catalog and interpretation workflow do not certify materials, habitats, or fire-safety designs.

**Scientific acceptance:** PASS for the inspected requirements/claims and tested user workflow, with the coverage limitations above. No claim of complete NASA dataset coverage or safety validation is made.
