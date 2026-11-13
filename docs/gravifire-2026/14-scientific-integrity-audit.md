# Scientific integrity audit

**Audit date:** 2026-11-13
**Method:** Inspected registry, ingestion/coverage documentation, ranking/applicability/grounded-query implementations and rendered dashboard/evidence views. No NASA data or application code was modified.

## Family coverage and interpretation boundaries

| Family | Verified repository state | Scientific scope and unresolved issue |
|---|---|---|
| BASS / PSI-26 | `reference_only`; no primary experimental table or normalized runtime records. | Research documents and metadata are not promoted to run evidence. Do not claim local BASS observations. |
| BASS-II / PSI-25 | `verified_and_ingested`; 129 local validated records. | Source gas sensor fields (O2, CO2, CO) can be reported with units/citation. Neither those readings nor the registry establish per-test extinction/suppression success. B1 initial O2 22.2% is source-reported and cited `PSI-25:Test-B1`; no B1 combustion outcome is rendered. |
| SAFFIRE-I / PSI-98 | `verified_and_ingested`; two classified combustion records; pretest flow visualizations excluded. | Mission M1 compares S1/S2 source rows and states the comparison is not a universal ventilation rule or causal mechanism. |
| SAFFIRE-II / PSI-99 | `verified_and_ingested`; nine local records. | Ingestion documents thickness ambiguity and source unit mismatches. Interpret only fields whose source semantics are retained; the mismatch remains unresolved. |
| SAFFIRE-III / PSI-100 | `verified_and_ingested`; two records. | Source-context conflicts are retained, not reconciled. Missing PSI-100 fields are not copied from earlier missions. |
| SAME / PSI-102 | `verified_and_ingested`; eight local experimental-table records. | Local rows contain sample/material, airflow, weight-loss and aging fields, not detector response, alarm outcomes, or smoke particle-size results. A nine-row web display discrepancy is documented. The eight rows are table records; do not present them as eight detector tests/results. |
| SAME-R / PSI-101 | `verified_and_ingested`; 109 local experimental-table records. | Table rows do not contain detector response, particle-size or alarm outcomes. Published NASA/NTRS research remains reference context unless record-level extraction/provenance is integrated. Repeated Test # identity is handled as documented. |
| FLEX / PSI-69 | `verified_and_ingested`; 274 local table records. | Some rows preserve source test-end labels and extinction-related fields; missing values/dashes are not converted to zero. NASA/TP-2015-216046 reports 284 tests; discrepancy remains unresolved. Gas/header mappings have documented caveats. No 10 records are backfilled. |
| FLEX-2 / PSI-68 | `verified_and_ingested` as eight **configuration envelopes**. | Not eight completed runs or outcomes. No run-level extinction or suppressant result should be inferred. |

Source mapping and scope above are documented in [dataset coverage](03-dataset-coverage.md) and [expanded coverage](08-expanded-coverage.md). NASA PSI links are stored in `src/data/nasa-investigation-coverage.ts`; primary family pages include [PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25), [PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98), [PSI-99](https://psi.nasa.gov/physci/repo/data/investigations/PSI-99), [PSI-100](https://psi.nasa.gov/physci/repo/data/investigations/PSI-100), [PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102), [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), [PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) and [PSI-68](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68). Report-scope references include [NASA BASS-II report](https://ntrs.nasa.gov/citations/20210011385), [FLEX report](https://ntrs.nasa.gov/citations/20150023456) and [SAME-2 report](https://ntrs.nasa.gov/citations/20130000422). These links do not mean every report's data have been ingested.

## Traceability, units and verdict handling

- The coverage registry obtains source hash entries from `data/nasa/provenance/source-hashes.json` and names raw source files, normalized artifacts and ingestion reports. Family parsers preserve row identity and source provenance. This is stronger traceability than research-document presence alone.
- B1's selected evidence is source-row-specific and its numeric oxygen display is `%` (22.2% source-reported). The browser and API checks did not show a fabricated combustion outcome. Evidence comparison keeps gravity mismatch separate from oxygen match.
- Applicability fields cover gravity, oxygen fraction, pressure, airflow, fuel, geometry, sample size and measurement fields. The matching utility compares known values and marks absent values unknown; comparison is not a material safety verdict. Partial-gravity application carries an explicit limitation.
- **UI terminology issue:** “Measurement type” currently displays populated normalized field/property names (for example `initialOxygenPercent`, `finalCO`) rather than plain-language measurement categories. This risks making source keys look like instrument/measurement-type taxonomy. It is a labeling clarity issue; the inspected values remain source fields, not generated results.
- **Record-count terminology issue:** `runtimeRecordKind` has only `experimental_runs`, `configuration_envelopes`, or null. SAME and SAME-R are assigned `experimental_runs` despite their registry/docs correctly describing 8 and 109 rows as “experimental-table records.” On ranking/detail surfaces, labels therefore call these counts “validated records” or “validated experimental records,” which blurs table rows with independent runs/events. This is especially risky for detection research: 109 rows are not 109 detections. The registry type/labels should gain a neutral table-record kind or family-specific count description, without changing data.
- Ranking is deterministic `NASA Investigation Relevance v1`, with documented weights (mission .30, material/phenomenon .25, conditions .20, completeness .25), stable tie ordering and explicit missing-data treatment. It measures research relevance only. Mission mapping weights are product-authored judgments, not empirically validated or official NASA rankings. Reference-only evidence gets capped completeness; missing metadata does not improve confidence.
- EMBER uses grounded deterministic retrieval here; numerical/scientific answers cite available source references, and insufficient evidence/refusal paths exist for unsupported safety and partial gravity. The evidence engine preserves pre-existing verdict state enums.

## Claims at risk and disposition

| Claim/rendering risk | Audit finding | Disposition |
|---|---|---|
| SAME/SAME-R cards imply detection capability equals detector-performance evidence | Research pillar is valid as study relevance, but local table has no detector-response/alarm result fields. | Keep “research relevance” wording; place missing detector-result caveat next to counts and objective results. |
| BASS-II gas readings imply suppression effectiveness | Per-test extinction verdict is not in the local PSI-25 table. | Grounded-query code explicitly refuses inference; preserve. |
| FLEX counts represent all NASA reported tests | Local count 274 vs report 284 remains unresolved. | Disclose source scope and discrepancy wherever counts are summarized. |
| FLEX-2 count means measured tests | It is eight configuration envelopes. | Existing coverage correctly distinguishes this; keep labels consistent. |
| Partial gravity is tested by microgravity records | It is not. | The tested lunar comparison marks gravity mismatch and warns; no certification claim found. |
| Virtual Lab visual fire implies predictive physics | `/lab` states prediction engine is not connected and no scientific outcome is generated. | Label is present; maintain it wherever visualization is shown. |
| BASS means local ingested results | BASS/PSI-26 is reference-only. | Registry and dashboard expose status; no local run claim found. |

## Scientific integrity conclusion

No fabricated NASA measurement or unsupported safety certification was found in the inspected user journey. The most actionable inconsistency is the run-versus-table-record terminology for SAME/SAME-R. The source-level gaps (no direct partial-gravity records, detector outcomes absent from local SAME tables, BASS reference-only, FLEX scope discrepancy, FLEX-2 configuration-only) are material scientific limitations and should remain visible in any judged demonstration.
