# GRAVIFIRE challenge dashboard walkthrough

## Route and required interactions

Open **`/dashboard`** (linked as **DASHBOARD** in the global navigation). The page composes the investigation coverage registry, deterministic `NASA Investigation Relevance v1` engine, normalized NASA run/configuration records, and Step 4 applicability comparison. It does not replace the Virtual Lab, Evidence DNA, standalone investigation ranking, mission-control game, or experiment explorers.

### Demonstration: summarize, rank, and interpret

1. **Choose an environment.** At **1 · Mission environment**, choose Spacecraft, Lunar habitat, Mars habitat, or Pressurized rover. Gravity is qualitative context; no numeric gravity or environmental setpoints are presumed. Optionally expand **Add hypothetical mission conditions** and enter oxygen percent, pressure in kPa, and airflow in cm/s. These inputs are labeled hypothetical.
2. **Choose the challenge task.** At **2 · Fire-safety objective**, keyboard-operable radio buttons select Fire Prevention, Fire Detection, or Fire Suppression. Each objective maps to its listed research pillars.
3. **Review the ranked summary.** At **3 · Evidence discovery**, investigations are ranked for the selected mission and objective. Optionally refine with a scientific question. Each card shows the rank index, PSI identifier, factor explanations, local record/configuration count, and integration status. Scores are relevance indexes, not probabilities or safety ratings.
4. **Open a study.** Use **Open investigation evidence** on a ranked card. The right-hand dossier summarizes the cataloged investigation and its coverage status. Select a source record from the labeled list. The NASA reference link is available for each investigation.
5. **Inspect evidence.** For normalized runs, inspect populated normalized source observations and expand **Inspect exact normalized source row and provenance** to read the actual raw row, source hash, row number, and NASA citation. **Open full evidence record and Evidence DNA** opens the existing per-run evidence view. FLEX-2 entries are labeled configuration envelopes; they are not presented as observed run outcomes. Reference-only investigations such as BASS/PSI-26 explicitly show that run details are unavailable.
6. **Interpret conditions.** Compare the record with the selected environment in **5 · Condition interpretation**. Each condition is `MATCHED`, `MISMATCHED`, or `UNKNOWN`, with its source field, raw value, units, and citation when present. Adding a hypothetical condition changes only the mission side. Microgravity-to-lunar/Mars comparisons show a direct warning.
7. **Review limits and follow-up.** **6 · Limitations and next research** lists registry limitations and source normalization warnings. It identifies missing source-reported conditions as evidence gaps. For BASS-II, a link opens the existing coverage-gap experiment recommender. For other families, the dashboard only describes missing evidence or a gravity-domain gap; it does not invent numerical test conditions.

### Suggested live demo

- Select **Lunar habitat** and **Fire Prevention**.
- Select **Burning and Suppression of Solids II (PSI-25)** from the ranked list.
- Enter `22.2` for hypothetical oxygen fraction, leaving pressure and airflow blank.
- Inspect run `B1`. The NASA record reports initial oxygen `22.2` percent and source-described microgravity investigation context. The comparison should show oxygen `MATCHED`, gravity `MISMATCHED`, and the explicit partial-gravity warning. Unknown pressure and airflow stay unknown.
- Expand the exact normalized source row, point to the PSI-25 source link, then explain the listed missing dimensions and use **Open BASS-II coverage-gap experiment recommender** for the existing data-coverage-based next experiment workflow.

The `B1` observation is source-backed and its SHA-256/row provenance appears in the dossier. The lunar environment and its 22.2% oxygen value are hypothetical inputs for comparison, not a published lunar-habitat specification.

## Evidence and safety boundaries

- `verified_and_ingested`, `reference_only`, and `unavailable_or_unverified` remain distinct. Only verified linked records can populate the record selector.
- The dashboard summarizes catalog descriptions and record metadata; it renders normalized outcome observations only when the selected run actually contains them. If there are none, it says so. A condition is not converted into an outcome.
- Every condition comparison is an applicability interpretation, not an experiment verdict. Existing `EXACT`, `BOUND`, `INSUFFICIENT`, `CONTRADICTED`, `REFUSAL`, and `SYSTEM_TEST` contracts are not changed.
- No result displayed here claims NASA certification, material safety, or mission safety. Unknown evidence is never filled from a research summary or neighboring run.

## Accessibility and responsive behavior

Mission environment uses a labeled native select; objective selection uses a fieldset, legend, and native radio inputs. Investigation and record selection use labeled native controls and buttons. Focusable links retain visible hover/focus-compatible borders, and status is conveyed with text as well as color. The two-column workspace collapses to a stacked layout on narrow screens; investigation cards and source rows wrap rather than requiring a wide table. The global dashboard link remains visible in the mobile navigation.

## Verification

`tests/challenge-dashboard.test.tsx` server-renders the dashboard component and checks mission/objective controls, ranked source/status explanations, exact source-row/Evidence DNA affordances, condition interpretation language, partial-gravity warnings, reference-only limitations, and preservation links to the Virtual Lab and advanced explorers. It uses React's server renderer, so it verifies rendered component contracts and accessibility semantics but does not simulate browser event dispatch; interactive selectors use standard native React controls.
