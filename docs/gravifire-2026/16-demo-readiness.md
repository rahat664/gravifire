# Step 16: demonstration readiness

**Assessment: DEMONSTRABLE, subject to one live rehearsal. Rehearsal status: NOT TESTED.** The recorded Step 15.1 browser acceptance exercised the required end-to-end workflow and passed. This is automated evidence, not a timed human rehearsal. Use the checklist below to record the actual run; the exact click path and expected outputs are covered by `tests/browser-harness/specs/acceptance.spec.ts`.

## 90-second walkthrough

| Time | Action | Supported narration and visible evidence |
|---|---|---|
| 0–9 s | Open `/dashboard`. Select **Lunar habitat** and **Fire Prevention**. | “GRAVIFIRE starts with a mission context and a fire-safety research question.” The dashboard supports both controls; do not claim that NASA specified the scenario's oxygen/pressure/airflow defaults. |
| 9–20 s | Point at **Relevant NASA investigations**, `NASA Investigation Relevance v1`, and the BASS-II result. Open its evidence. | “This is deterministic research relevance, not a safety score. The catalog distinguishes verified and ingested evidence from reference-only research.” The listed factor explanations and integration status are visible. |
| 20–35 s | Expand **Add hypothetical mission conditions**. Enter **22.2** for oxygen fraction. Select BASS-II **B1** in the verified source-record selector. | “The entered oxygen value is a hypothetical mission assumption. B1 reports an initial oxygen fraction of 22.2 percent in the cited source table.” Keep scenario input and source measurement distinct. |
| 35–49 s | Read the oxygen and gravity comparison rows; show the partial-gravity alert. | “Oxygen matches as a condition; gravity does not. A microgravity record does not directly validate lunar or Martian partial-gravity behavior.” Do not imply matched oxygen makes conditions or outcomes equivalent. |
| 49–61 s | Expand **Inspect exact normalized source row and provenance**. Show PSI-25, B1, source row/hash, and “No normalized outcome observation is linked to this run.” | “The displayed condition is traceable to the source row. GRAVIFIRE does not invent a B1 combustion outcome.” Do not read the hash aloud; show it as provenance. |
| 61–70 s | Activate **Open full evidence record and Evidence DNA**; on `/experiments/bass-ii/runs/B1`, select **Ask about this experiment**. | “The evidence record retains the source identity and provenance. The fictional Vesta story remains separate from NASA's experiment.” |
| 70–84 s | In `/ask`, submit **What don't we know about B1?** Show evidence coverage, PSI-25 citation and limitations. | “EMBER uses the retrieved evidence and points out documented gaps. It does not change ranking scores or the scientific verdict.” The tested response identifies five documented BASS-II B1 gaps and retains `PSI-25:Test-B1`. |
| 84–90 s | Close on the no-certification statement and partial-gravity/data coverage limitation. | “This supports research discovery, not NASA certification. Direct lunar/Martian partial-gravity combustion evidence is absent from the verified catalog.” |

## Setup and rehearsal controls

1. Use the already running GRAVIFIRE service at `http://localhost:3000`; do not restart it for the demo. Confirm `/dashboard` returns HTTP 200.
2. Use desktop Chromium/Chrome, 100% zoom, and an uncluttered browser window. Open the dashboard before starting the timer.
3. Follow the same selections above. If state is retained from a prior interaction, explicitly reselect mission/objective and verify BASS-II/B1 before narration.
4. Ensure the NASA PSI-25 link can be shown; network opening of the external link is optional. The local citation/provenance must still be visible if NASA is unreachable.
5. Keep narration tied to the on-screen labels. Do not claim detector alarm efficacy from SAME/SAME-R, a predicted fire result from the Virtual Lab, or lunar safety from a matched oxygen field.
6. Treat “five documented evidence gaps” as the tested EMBER answer for the current B1 evidence index, not five failed experiments or a complete NASA gap inventory.

## Verification basis and caveats

The automated acceptance journey in `tests/browser-harness/specs/acceptance.spec.ts` performs the same lunar prevention selection, BASS-II/B1 choice, 22.2% input, match/mismatch checks, warning, PSI-25 citation/hash/source row, no-outcome and certification text, Evidence DNA navigation, and EMBER query. Step 15.1 records the full Playwright suite as 5/5 passing and the live service routes as HTTP 200. Step 16 itself verified current HTTP 200 on `/dashboard`, `/experiments`, `/applicability`, `/recommend/investigations`, `/ask`, and relevant surrounding pages, but did not replay the browser interactions or time a human presenter.

The official challenge page's detailed Resources section and the linked video transcript remain unverified in Step 2. The narration above describes verified application behavior and the previously inspected source contract; it does not attribute any requirement or statement to the video. “SI-powered” is not presented as a superintelligence claim.

**Readiness:** The workflow is documented and automation-backed; do one timed rehearsal before an external presentation. No NASA submission or official judging outcome is implied.

## Final 90-second rehearsal checklist

Use this as the human run sheet. Mark an item only after completing it during the timed rehearsal; automation does not pre-check items.

### Preflight

- [ ] Existing service is available at `http://localhost:3000/dashboard` (HTTP 200); do not restart it for rehearsal.
- [ ] Desktop browser is ready at 100% zoom; timer is visible to the presenter.
- [ ] Dashboard starts at the top with no unexpected modal or retained selection.
- [ ] Presenter has rehearsed the evidence-safe wording above and will distinguish NASA-recorded values from the hypothetical mission input.
- [ ] NASA source link can be shown or local PSI-25 citation remains visible if external access is unavailable.

### Timed steps

- [ ] 0–9 s: choose Lunar habitat and Fire Prevention.
- [ ] 9–20 s: show deterministic ranking, research-relevance framing and BASS-II evidence selection.
- [ ] 20–35 s: enter hypothetical oxygen 22.2%; select source record B1.
- [ ] 35–49 s: show oxygen match, gravity mismatch and partial-gravity limitation.
- [ ] 49–61 s: show PSI-25 provenance and no-normalized-outcome notice.
- [ ] 61–70 s: navigate to Evidence DNA and EMBER.
- [ ] 70–84 s: ask what is unknown about B1; show citation and documented gaps.
- [ ] 84–90 s: state the no-certification and partial-gravity limits.

### Rehearsal record (complete from actual run)

- Date/time: ______  Presenter: ______  Observer: ______
- Start/end time and actual duration: ______
- Steps completed (list any skipped): ______
- Navigation or loading problems (route and reproduction): ______
- Scientific explanations actually delivered: ______
- Any unsupported or misleading claim (quote and context; write “none observed” only if reviewed): ______
- Missing/misleading evidence or citation: ______
- Interruptions and recovery: ______
- Screenshots/recording/observer notes and file locations: ______
- Rehearsal result: **NOT TESTED until this record reflects an actual run**; then mark pass/fail with rationale: ______
