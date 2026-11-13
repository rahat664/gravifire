# Merged Data Quality Report

Generated on 2026-10-06 from current files by pnpm tsx Scripts/audit-merged-data.ts. Counts below come from the checked-in normalized ingestion reports and the current archive scan; no historical counts were copied into runtime.

## Summary

The current application has deterministic adapters for BASS-II, FLEX, FLEX-2, SAFFIRE-I, SAFFIRE-II, SAFFIRE-III, SAME, SAME-R, and SPICE. PSI-26/BASS is source metadata only and requires a reviewed adapter before it can enter the runtime.

## Family quality

### BASS-II / PSI-25

- Source CSV files: 2
- Reported source rows: 129
- Valid runtime records: 129
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: none reported
- Archive files indexed: 29

### BASS / PSI-26

- Source CSV files: 0
- Reported source rows: not reported
- Valid runtime records: 0
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: none reported
- Archive files indexed: 4

### FLEX-2 / PSI-68

- Source CSV files: 1
- Reported source rows: 8
- Valid runtime records: 8
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENT_CONFIGURATION_ENVELOPE
- Schema warnings: The source defines configuration space; no Cartesian product or run count was generated.
- Archive files indexed: 5

### FLEX / PSI-69

- Source CSV files: 1
- Reported source rows: 274
- Valid runtime records: 274
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: SOURCE_HEADER_UNIT_LOSS; SOURCE_GAS_LABEL_SEMANTIC_MAPPING
- Archive files indexed: 5

### SAFFIRE-I / PSI-98

- Source CSV files: 1
- Reported source rows: 4
- Valid runtime records: 2
- Excluded/rejected records: 0
- Pretest records: 2
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: none reported
- Archive files indexed: 9

### SAFFIRE-II / PSI-99

- Source CSV files: 1
- Reported source rows: 15
- Valid runtime records: 9
- Excluded/rejected records: 0
- Pretest records: 2
- Source-note records: 4
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-4 thickness was preserved without numeric normalization.; SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-5 thickness was preserved without numeric normalization.; SOURCE_SCHEMA_UNIT_MISMATCH: Sample 2-5 has '?-g Spread Length' values with rate units.; SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-6 thickness was preserved without numeric normalization.; SOURCE_SCHEMA_UNIT_MISMATCH: Sample 2-6 has '?-g Spread Length' values with rate units.; SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-4 thickness was preserved without numeric normalization.; SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-5 thickness was preserved without numeric normalization.; SOURCE_SCHEMA_UNIT_MISMATCH: Sample 2-5 has '?-g Spread Length' values with rate units.; SOURCE_VALUE_FORMAT_AMBIGUITY: Sample 2-6 thickness was preserved without numeric normalization.; SOURCE_SCHEMA_UNIT_MISMATCH: Sample 2-6 has '?-g Spread Length' values with rate units.
- Archive files indexed: 9

### SAFFIRE-III / PSI-100

- Source CSV files: 1
- Reported source rows: 2
- Valid runtime records: 2
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: none reported
- Archive files indexed: 6

### SAME-R / PSI-101

- Source CSV files: 1
- Reported source rows: 109
- Valid runtime records: 109
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: none reported
- Archive files indexed: 5

### SAME / PSI-102

- Source CSV files: 1
- Reported source rows: 8
- Valid runtime records: 8
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 0
- Evidence type: EXPERIMENTAL_RUN
- Schema warnings: Source/version discrepancy recorded: LOCAL_SOURCE_RECORDS=8; CURRENT_WEB_TABLE_DISPLAY=9. The local CSV remains authoritative for this build until manually reconciled.
- Archive files indexed: 6

### SPICE / PSI-107

- Source CSV files: 1
- Reported source rows: 469
- Valid runtime records: 469
- Excluded/rejected records: 0
- Pretest records: 0
- Source-note records: 0
- Duplicate indicators: 34
- Evidence type: OPERATING_CONDITION_OBSERVATION
- Schema warnings: none reported
- Archive files indexed: 5


## Cross-cutting warnings

- Text statuses and approximate/range values are retained by family normalizers; they are not converted into invented numeric measurements.
- SAFFIRE-II source-review thickness values remain distinct from normalized context.
- SAFFIRE-III source conflicts remain represented in its normalized conflict artifact.
- FLEX-2 is a configuration envelope, not a run-level result.
- SPICE is an operating-condition observation set, not a universal combustion outcome dataset.
- Research PDFs, reports, images, videos, SQLite stores, and compressed time series remain research/media/source artifacts unless a family adapter links them defensibly.

## Duplicate findings

The archive scan found 35 exact duplicate content groups. No files were deleted. Identical copies are retained where they belong to separate source/research paths; a source-version conflict requires human review and was not silently normalized.

| Classification | SHA-256 | Paths |
|---|---|---|
| EXACT_DUPLICATE | 71e792bf6b5fb5ea620c5dd70fbbac05515992e12aefcf5dff47312caa48c042 | src/data/nasa/raw/bass-ii/PSI-25_Experimental table_BASS-II.csv<br>psidata/PSI-25/Experimental table/PSI-25_Experimental table_BASS-II.csv |
| EXACT_DUPLICATE | 37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570 | data/nasa/normalized/bass-ii/claims.json<br>data/nasa/normalized/bass-ii/document-links.json<br>data/nasa/normalized/bass-ii/rejected-runs.json<br>data/nasa/normalized/bass-ii/unmatched-evidence-assets.json<br>data/nasa/normalized/flex/rejected-runs.json<br>data/nasa/normalized/flex-2/rejected-records.json<br>data/nasa/normalized/saffire-i/rejected-runs.json<br>data/nasa/normalized/saffire-ii/rejected-runs.json<br>data/nasa/normalized/saffire-iii/rejected-runs.json<br>data/nasa/normalized/same/rejected-runs.json<br>data/nasa/normalized/same-r/rejected-runs.json<br>data/nasa/normalized/spice/rejected-records.json |
| EXACT_DUPLICATE | 629faf104a8ff0e8d335f2527c019e740380163ea7f74b8ad754ae71f7da2559 | psidata/metadata_zips/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II (1).zip<br>psidata/metadata_zips/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip<br>psidata/PSI-25/metadata/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip |
| EXACT_DUPLICATE | fa7eb07eeb40a4eb00642938f1159154a3246bf1de860a92417ce774373f54fb | Gravifier_research/evidence_store/exports/data_contract.json<br>Gravifier_research/R7_HANDOVER/store/exports/data_contract.json |
| EXACT_DUPLICATE | 3dfe6551dbda16a68cd349949b328f86c5b6854910c28c9206b434bff2f31756 | Gravifier_research/evidence_store/exports/r2_exit_checks.txt<br>Gravifier_research/R7_HANDOVER/store/exports/r2_exit_checks.txt |
| EXACT_DUPLICATE | 64ebad865f73dab0e176957c42da2d60b1c85feca2de73287491222317f702dd | Gravifier_research/evidence_store/gravifire_l1.db<br>Gravifier_research/R7_HANDOVER/store/gravifire_l1.db |
| EXACT_DUPLICATE | f24cdf5e81e14335dc9643a7f47964bdc436d23264237b58fad44194286c0a65 | Gravifier_research/evidence_store/R2_CENSUS.md<br>Gravifier_research/R7_HANDOVER/store/R2_CENSUS.md |
| EXACT_DUPLICATE | 996bf7cba822d42b319e6ea899caf380d563ec3e97912c84c689caf5d606720c | Gravifier_research/evidence_store/series/q1_P98-S2.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P98-S2.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P98-S2.csv.gz |
| EXACT_DUPLICATE | 18736558fee4d54353414bd62181974e939b7cc33f9f46b78d2f0b2f44b6efe2 | Gravifier_research/evidence_store/series/q1_P99-S1.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S1.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S1.csv.gz |
| EXACT_DUPLICATE | 16af7e3d6033936b0001ef195cc50d40552106e9c7ae439ce9e16a57a1f57c95 | Gravifier_research/evidence_store/series/q1_P99-S2.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S2.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S2.csv.gz |
| EXACT_DUPLICATE | 4531f6d4c25d60c4bf166ba89bd8b69ca76037454090c5e609db77bd04b507fb | Gravifier_research/evidence_store/series/q1_P99-S3.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S3.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S3.csv.gz |
| EXACT_DUPLICATE | 45d04e357cb41fedf82786d5a9c116a49de7038e0f1578868c7e9f0128062fd6 | Gravifier_research/evidence_store/series/q1_P99-S4.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S4.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S4.csv.gz |
| EXACT_DUPLICATE | e722103b34eefbf52ed5618ea115057fe3ef10699eb031e41a52a0d8ea5e2cf8 | Gravifier_research/evidence_store/series/q1_P99-S5.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S5.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S5.csv.gz |
| EXACT_DUPLICATE | b70b41d18601d06cc057d9fbb31c2dede9a589f8c4e7d49abde0dd9018c21f5d | Gravifier_research/evidence_store/series/q1_P99-S6.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S6.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S6.csv.gz |
| EXACT_DUPLICATE | c927aa3968e058fd1379a6577f9ef7f60ee11956c50137dc04d13be7291b4e57 | Gravifier_research/evidence_store/series/q1_P99-S7.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S7.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S7.csv.gz |
| EXACT_DUPLICATE | f396ddd681e6969ea6a1bde677e06974a321bcd4c6052a7f5860a52d61abec61 | Gravifier_research/evidence_store/series/q1_P99-S8.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S8.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S8.csv.gz |
| EXACT_DUPLICATE | 22f7cd02ade1ff5113374c311ccafae2755d07071ed7596e24fd7fa4feebf0d4 | Gravifier_research/evidence_store/series/q1_P99-S9.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99-S9.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99-S9.csv.gz |
| EXACT_DUPLICATE | 1812b3d83771343597080bfd5c2feb2e50f0c60ff160bfc84a022167fe9ab20e | Gravifier_research/evidence_store/series/q1_P99_TELEM_SaffireData.csv.gz<br>Gravifier_research/R1_data_interrogation/outputs/q1_P99_TELEM_SaffireData.csv.gz<br>Gravifier_research/R7_HANDOVER/store/series/q1_P99_TELEM_SaffireData.csv.gz |
| EXACT_DUPLICATE | 95d8c45b632e92efc519f0f8d21db99f186d543fa94f76b9d2482f87930a0b70 | Gravifier_research/R1_data_interrogation/R1_FINDINGS.md<br>Gravifier_research/R7_HANDOVER/docs/R1_FINDINGS.md |
| EXACT_DUPLICATE | b1ec1dd9319441b16db3a21994e0c9e74cdd6d42abc53eaba5c25cbd3e3cdb20 | Gravifier_research/R5_DIGEST_DATA.json<br>Gravifier_research/R7_HANDOVER/digest/R5_DIGEST_DATA.json |
| EXACT_DUPLICATE | c9e6c13c4218003df6333c57cafda00879f586af33f0c8221e76151440ce5663 | Gravifier_research/R5_FINDINGS_DIGEST.md<br>Gravifier_research/R7_HANDOVER/digest/R5_FINDINGS_DIGEST.md |
| EXACT_DUPLICATE | 7cf23ced2c0b0a32170b93af3474ed30c078d1ed8785e9caca9cc3774ecdfbc6 | Gravifier_research/R6_TRANSLATION/DEVELOPER_DOCUMENT.md<br>Gravifier_research/R7_HANDOVER/docs/DEVELOPER_DOCUMENT.md |
| EXACT_DUPLICATE | 17d025f0e169ef66bebad678e74890e226a138d89d37d28dd80573fb17308777 | Gravifier_research/R7_HANDOVER/docs/R4_VALIDATION_REPORT.md<br>Gravifier_research/verdict_engine/R4_VALIDATION_REPORT.md |
| EXACT_DUPLICATE | 1630d8ae93b31d745f677e52cfe84205c2c8689c026b7c6de8f27cce275a9ba3 | Gravifier_research/R7_HANDOVER/engine/engine.py<br>Gravifier_research/verdict_engine/engine.py |
| EXACT_DUPLICATE | a8209e7c20630d25cb9f7139599150c5cf13b58c40bbad32dcf7e33ec50e4909 | Gravifier_research/R7_HANDOVER/engine/literature_register.json<br>Gravifier_research/verdict_engine/literature_register.json |
| EXACT_DUPLICATE | 4a34f70fa44bbf363145aa60891a39ea95a82e25837dd4f4cee0586ea6e12079 | Gravifier_research/R7_HANDOVER/engine/outputs/r4_holdout_stamp.json<br>Gravifier_research/verdict_engine/outputs/r4_holdout_stamp.json |
| EXACT_DUPLICATE | 3002c575fd8a598f12a625a660a827a37b20ee5900ad3ee50e5d923c7bdf038d | Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier1_anchors.json<br>Gravifier_research/verdict_engine/outputs/r4_tier1_anchors.json |
| EXACT_DUPLICATE | 8f06d08185229fa71cbc6fa9ff0b6ea2aa2aa0b8b0e38b9d40cf39e2f37a598b | Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier2_holdout.json<br>Gravifier_research/verdict_engine/outputs/r4_tier2_holdout.json |
| EXACT_DUPLICATE | 1c33fb599d4bdfc390a53b75fd83f26b3bb364902d0f6fff6c31edddb54087f4 | Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier3_provenance.json<br>Gravifier_research/verdict_engine/outputs/r4_tier3_provenance.json |
| EXACT_DUPLICATE | b2f9603e1bfb744916118a6cc88dbefa59c55d6dc935142e43500485825fabd0 | Gravifier_research/R7_HANDOVER/engine/outputs/seed_verdicts.json<br>Gravifier_research/verdict_engine/outputs/seed_verdicts.json |
| EXACT_DUPLICATE | fc39fd8f9246b60f4550f7d12836edae872c99409da00b9f14b7261b64acebc6 | Gravifier_research/R7_HANDOVER/engine/outputs/seed_verdicts.md<br>Gravifier_research/verdict_engine/outputs/seed_verdicts.md |
| EXACT_DUPLICATE | b74b62a405a518d890d11f5f65b2d3b1c617288c2316097c7907f3ddb0340dcc | Gravifier_research/R7_HANDOVER/engine/run_r3.py<br>Gravifier_research/verdict_engine/run_r3.py |
| EXACT_DUPLICATE | 0635d8caaa76f340d4cd1fa13ee0fde2d21e9953ebd8b281b3c94ca0e6d32308 | Gravifier_research/R7_HANDOVER/engine/scenario_input_spec.md<br>Gravifier_research/verdict_engine/scenario_input_spec.md |
| EXACT_DUPLICATE | 95b11506d09600d49e061f8360d49b34793c01fe0a84f80ac8baf56831804600 | Gravifier_research/R7_HANDOVER/engine/seed_claims.json<br>Gravifier_research/verdict_engine/seed_claims.json |
| EXACT_DUPLICATE | 5617203a505be521ceb5c463f34b98c9dc05050f33b297d035402044362103fa | Gravifier_research/R7_HANDOVER/engine/verdict_spec.md<br>Gravifier_research/verdict_engine/verdict_spec.md |

## Current runtime versus merged archive

The merged archive adds research, PSI metadata, and duplicate/reference copies around the existing runtime inputs. No current normalized runtime artifact was overwritten. Differences are therefore classified as ARCHIVE_CONTEXT_ADDED unless a future reviewed adapter proves a source-version conflict.
