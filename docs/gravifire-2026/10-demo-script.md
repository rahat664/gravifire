# GRAVIFIRE 90-second demonstration script

**Audience:** challenge reviewers. **Route:** `/dashboard`. **Goal:** show that GRAVIFIRE ranks NASA research by relevance, exposes source evidence and its limits, then asks EMBER about an evidence gap without presenting a safety claim.

## Before the timer

- Start GRAVIFIRE locally and open `/dashboard` in a desktop browser.
- Use the available normalized BASS-II record B1 for the reproducible source example.
- Do not describe the fictional ISV Vesta campaign as a NASA experiment.

## Timed walkthrough

| Time | Action and narration |
| --- | --- |
| 0–10 s | On the Mission Fire Evidence Dashboard, select **Spacecraft** and **Fire Prevention**. “We start from the mission context and the fire-safety question.” |
| 10–22 s | In the scientific-question field, enter **oxygen effect on PMMA flame spread**. Point to the ranked investigation list, evidence status, relevance score, and factor explanations. “This is research relevance, not a material-safety score.” |
| 22–34 s | Open **Burning and Suppression of Solids (BASS-II)**. Select verified record **B1** if it is not already selected. “This record is ingested and source-linked; reference-only records are labeled separately.” |
| 34–48 s | Expand **Inspect exact normalized source row and provenance**. Point out record ID, source row, source hash, raw fields, and NASA link. “Every displayed observation is traceable to this NASA source row; missing fields stay missing.” |
| 48–60 s | In **Add hypothetical mission conditions**, enter or leave oxygen unspecified; if entering a value, call it a user scenario assumption. Review matched/mismatched/unknown rows and their units. “This compares conditions only and does not transfer outcomes or certify safety.” |
| 60–69 s | Open **Open full evidence record and Evidence DNA**. On the B1 page, select **Ask about this experiment**. This opens `/ask` with B1 context. |
| 69–83 s | Ask **What don't we know about B1?** Show EMBER’s partial-evidence answer, the `PSI-25:Test-B1` citation, and the listed limitations. “EMBER returns recorded evidence gaps and links them back to the NASA record.” |
| 83–90 s | Close on the limitation: no safety certification, no inferred causal result, and no direct NASA lunar/Martian partial-gravity fire run in the verified catalog. |

## Reviewer checks

- Navigate with Tab and Enter; mission and objective controls are native keyboard-operable form controls.
- Verify the record URL and citation use PSI-25 / B1; follow the NASA source link if network access is available.
- Try **Is PMMA safe for a lunar habitat?** to demonstrate EMBER’s refusal to certify safety.
- Try **Which NASA tests measured fire in lunar partial gravity?** to demonstrate an explicit insufficient-evidence response.

The timed script demonstrates existing routes and behavior. Responsive visual appearance and assistive-technology behavior still require the browser acceptance checks listed in the acceptance report.
