# Step 16.1: human verification record

**Accessibility result: PASS (HUMAN-REPORTED) for A1–A15. Demo result: NOT TESTED.** The human tester explicitly confirms all accessibility cases A1–A15 were performed and worked correctly, with no reported failures. Verification source: direct tester confirmation. Individual case observations, tester identity/date, NVDA/browser versions, recordings, screenshots and Speech Viewer output were not supplied. The human-reported PASS is kept distinct from independently documented automated Axe/Playwright results; no detailed observation or artifact is inferred.

## Accessibility cases

The expected behavior and keyboard procedures are in [`16-accessibility-acceptance.md`](16-accessibility-acceptance.md). For every case, the tester explicitly confirms it was performed and worked correctly. The result is recorded as **PASS (HUMAN-REPORTED)**; no case-specific details or artifacts are supplied.

| Case | Route / coverage | Actual human observation | Status | Evidence |
|---|---|---|---|---|
| A1 | `/` Home | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A2 | `/dashboard` mission/objective controls and hypothetical input | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A3 | `/dashboard` ranking, BASS-II/B1 and provenance | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A4 | `/dashboard` condition comparison and partial-gravity warning | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A5 | `/experiments` Explorer, SAME/SAME-R and FLEX-2 terminology | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A6 | `/recommend/investigations` ranking controls and factor explanations | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A7 | `/applicability` mission conditions and comparison results | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A8 | `/lab` Virtual Laboratory | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A9 | `/ask` EMBER ranking, citations, refusals and limitations | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A10 | `/experiments/bass-ii/runs/B1` Evidence DNA | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A11 | `/mission-control` Mission Control | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A12 | `/mission-control/dossier` Dossier and source navigation | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A13 | `/mission-control/play/m0?review=1` dialog, focus return and science link | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A14 | `/mission-control/play/m1?review=1`, `/mission-control/play/m4?review=1`, `/mission-control/play/m6?review=1` | Tester confirms all three mission cases were performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |
| A15 | `/ask` insufficient-evidence and error announcement | Tester confirms the case was performed and worked correctly; no case-specific notes supplied. | **PASS (HUMAN-REPORTED)** | No individual artifact supplied. |

**Manual accessibility status: PASS (HUMAN-REPORTED).** The tester explicitly confirms A1–A15 were performed and worked correctly; no failures were reported. Case-specific notes and artifacts were not supplied, so this is not an independently evidenced route-by-route transcript. Prior Axe/Playwright results remain separate automated evidence.

## Timed demonstration

No human rehearsal result was supplied. The accessibility confirmation does not provide demo evidence.

| Field | Recorded result |
|---|---|
| Rehearsal performed | **No evidence supplied — NOT TESTED** |
| Actual elapsed duration | Not available |
| Demonstration steps completed | None can be verified |
| Navigation problems | Unknown; no rehearsal observation |
| Scientific explanations delivered | Unknown; no rehearsal observation |
| Unsupported claims | Unknown; no rehearsal observation |
| Missing or misleading evidence | Unknown; no rehearsal observation |
| Interruptions | Unknown; no rehearsal observation |
| Screenshots, notes, recording | None supplied |

The prior Playwright journey establishes that the product flow is automated-testable. It is not a timed human rehearsal. Demo status remains **NOT TESTED** pending a presenter recording actual elapsed time and observations against [`16-demo-readiness.md`](16-demo-readiness.md).

## Defect triage

The tester reports no accessibility failures. No P0, P1, or P2 defect was reported or independently reproduced in this assessment.

| Priority | Confirmed findings | Disposition |
|---|---|---|
| P0 — critical scientific integrity or functional failure | None evidenced by this review of supplied human evidence. | No application change made. This does not resolve unperformed human testing. |
| P1 — accessibility/usability defect in required workflow | None reported by tester; A1–A15 are HUMAN-REPORTED PASS, with no individual artifacts supplied. | Record accessibility gate as HUMAN-REPORTED PASS. Retain the lack of per-case artifacts as an auditability limitation; do not claim an independently documented transcript. |
| P2 — minor presentation/polish | None evidenced. | No action until an observation is supplied. |

Known scientific data-coverage limits remain in [`16-scientific-acceptance.md`](16-scientific-acceptance.md); they are not reclassified as application defects here.

## Gate evidence reviewed

- **Inherited:** Step 15.1 reports 218/218 Vitest, 5/5 Playwright, TypeScript, ESLint, automated Axe, isolated production build and `git diff --check` passed. Not rerun in Step 16.1.
- **Current service check:** existing PID 21384 is a Node process listening on port 3000; `/dashboard` returned HTTP 200. The service was not restarted.
- **Human accessibility:** Direct tester confirmation that A1–A15 were performed and work correctly; no failures reported. HUMAN-REPORTED PASS; individual evidence artifacts not supplied.
- **Human demo rehearsal:** NOT TESTED; no presenter results supplied.
- **Repository changes:** this report and factual update to `16-release-gates.md` are documentation only. Existing uncommitted work remains present.

## Next evidence to provide

The accessibility checklist is complete by direct tester confirmation for A1–A15; route-level notes or artifacts may be appended if later supplied. Next, have a presenter run the documented demo and record elapsed time, completed steps, navigation issues, claims delivered, missing evidence and interruptions. Update the demo gate only from those actual rehearsal results.
