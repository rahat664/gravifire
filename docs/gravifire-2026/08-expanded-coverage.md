# Expanded NASA Combustion Coverage

## Audit result

The repository already contained deterministic ingestion pipelines and validated local source tables for the requested families. This change does not re-download or replace source data, does not hand-edit generated normalized JSON, and does not claim a wider run scope than the local originals support. It strengthens the evidence boundary around BASS-II suppression-related sensor readings, updates the typed coverage registry with verified source context and limitations, and adds coverage regressions.

| Family | Integration state | Verified local artifact and records | What the local record supports | What remains a research reference or gap |
|---|---|---|---|---|
| SAME / PSI-102 | `verified_and_ingested` | `src/data/nasa/raw/same/PSI-102_Experimental table_SAME.csv`; 8 rows, 8 normalized records | Source fields for sample/material, airflow, weight-loss rate and aging duration | Local rows do not carry smoke particle-size outputs, detector response/alarm events or sensor time series. NASA's PSI listing identifies a final science report; it is not present as a locally ingested source here. The registry preserves the known 8-local-row vs 9-row web-display discrepancy. |
| SAME-R / PSI-101 | `verified_and_ingested` | `src/data/nasa/raw/same-r/PSI-101_Experimental table_SAME-R.csv`; 109 rows, 109 normalized records | Sample type, source test identifier, description, date, inlet velocity, Rt/R0 and timing fields | These table rows do not provide detector-response, smoke-particle-size or alarm outcomes. PSI lists a SAME-R final report and NTRS contains published particle morphology/size results, but those results are not inserted as experimental table rows. Test #57 is repeated across Lampwick and Teflon; its composite source identity is preserved. |
| FLEX / PSI-69 | `verified_and_ingested` | `src/data/nasa/raw/psi-69/PSI-69_Experimental table_FLEX.csv`; 274 rows, 274 normalized test records | Source test identifiers, conditions, test-end labels (including `Extinction`), and source extinction-diameter values where present | The local PSI table has 274 rows while NASA/TP-2015-216046 describes 284 tests. The difference remains unresolved. No 10 extra tests were synthesized from the report. Existing source-header/unit and gas-label interpretation warnings remain. |
| FLEX-2 / PSI-68 | `verified_and_ingested` as **configuration envelopes** | `src/data/nasa/raw/flex-2/PSI-68_Experimental table_Flex2.csv`; 8 rows, 8 configuration envelopes | Listed fuels/mixtures and discrete or ranged atmosphere/configuration options | The local source is not run-level test data: no per-test identifier, measured extinction result, burn rate, or outcome is available. The registry status is integrated configuration coverage, never completed experimental runs. NASA overview material is research context only. |
| BASS-II / PSI-25 | `verified_and_ingested` | `src/data/nasa/raw/bass-ii/PSI-25_Experimental table_BASS-II.csv`; 129 rows, 129 validated records | Source-reported initial/final O2, CO2 and CO fields, plus material/configuration fields; B1 video is separately hash-verified and explicitly linked | The CSV does not supply a per-test normalized flame-extinction verdict. Gas readings are observable measurements, but do not independently establish suppression success or material safety. |

## Source and provenance verification

The raw experimental files above are covered by `data/nasa/provenance/source-hashes.json`; the coverage registry checks their SHA-256 values against the files on disk. Corresponding pipelines are `scripts/psi/ingest-same.ts`, `ingest-same-r.ts`, `ingest-flex.ts`, `ingest-flex-2.ts`, and `ingest-bass-ii.ts`. Each parser/normalizer/validator retains source fields and row provenance. Their normalized outputs and generated ingestion reports remain under `data/nasa/normalized/<family>/`.

NASA PSI source records:

- [PSI-102 SAME](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102), DOI `10.60555/gd4k-8h62`, CC0 listing. The NASA description states its low-gravity smoke particle-size and detector-response purpose; it describes TEM, aerosol instruments, detector response, and sample mass-loss analysis. Those published study aims/results are not confused with fields actually present in GRAVIFIRE's local CSV.
- [PSI-101 SAME-R](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), DOI `10.60555/2np7-jv14`, CC0 listing. The NASA page identifies the reflight and its objective to quantify smoke particulate sizes in low gravity. Its final report is not currently ingested as row-level evidence.
- [PSI-69 FLEX](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69), DOI `10.60555/mbq8-0451`, CC0 listing.
- [PSI-68 FLEX-2](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68). Its available source in this repository is the configuration table, not completed run outcomes.
- [PSI-25 BASS-II](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25).

NASA NTRS sources used to check interpretation and report scope:

- [BASS-II Summary Report, NTRS 20210011385](https://ntrs.nasa.gov/citations/20210011385) describes the experiment hardware, O2/CO/CO2 instrumentation, and states those readings were used to evaluate combustion completeness. This supports treating the local gas fields as measured evidence; it does not supply a local per-row extinction label.
- [Detailed Results from FLEX, NTRS 20150023456](https://ntrs.nasa.gov/citations/20150023456) describes the FLEX source report and its 284 tests. This is the basis for retaining the discrepancy with the 274-row local table.
- [Particle Morphology and Size Results from SAME-2, NTRS 20130000422](https://ntrs.nasa.gov/citations/20130000422) documents published SAME-R particle morphology/size results. It remains a research reference until the original source artifact, extraction, page/record mapping, and provenance are ingested into the project.
- [NASA FLEX-2 overview](https://www.nasa.gov/wp-content/uploads/2025/07/flame-extinguishment-experiment-flex.pdf) describes scientific goals including complex fuels and flow effects. It does not turn the PSI-68 configuration table into measured run records.

NASA source pages are sometimes difficult to inspect through plain-text page extraction; source identity, PSI IDs, DOI values, and source-page listings above were checked against NASA PSI search-indexed page content. NTRS report metadata and abstracts were directly readable. No inaccessible record content was inferred.

## Code changes and behavior

- `src/data/nasa-investigation-coverage.ts` now records the verified PSI-101 DOI and more specific limitations for SAME, SAME-R, FLEX, FLEX-2, and BASS-II.
- `src/lib/grounded-query.ts` can answer a named BASS-II test's source-reported initial/final CO or CO2 sensor field with its existing PSI-25 citation. It explicitly refuses to infer a per-test flame-extinction verdict from the sensor fields.
- `tests/expanded-coverage.test.ts` asserts local record counts and types, checks the verified DOI and coverage limitations, and guards BASS-II source-value citations and refusal behavior.
- Existing family-specific parsers, validators, manifests, raw files, and normalized artifacts are retained as-is. No new measurement values or source IDs were created.

## Verification

The new expanded-coverage regression suite and the existing `same`, `same-r`, `flex`, `flex-2`, `psi-ingestion`, evidence-ingestion, and investigation-coverage tests should run with `pnpm test`. The integration is limited to what can be traced to local, hashed source tables and existing generated records. Published papers and NASA narrative descriptions remain clearly marked references until their original documents and extractable record-level provenance are added.
