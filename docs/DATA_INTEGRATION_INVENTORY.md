# Merged NASA Data Integration Inventory

Generated deterministically on 2026-10-06 by pnpm tsx Scripts/audit-merged-data.ts. Raw source files were not modified. Hashes are recorded in data/nasa/provenance/source-hashes.json.

## Scope

The archive includes the current GRAVIFIRE runtime inputs under src/data/nasa/raw and data/nasa/normalized, plus the merged research and PSI trees under Gravifier_research and psidata. Research and source artifacts are not treated as runtime evidence until an adapter validates them.

## Experiment family status

| Family | PSI | Archive files | Runtime records | Rejected | Integration status | Evidence type | Provenance |
|---|---|---:|---:|---:|---|---|---|
| BASS-II | PSI-25 | 29 | 129 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| BASS | PSI-26 | 4 | 0 | 0 | SOURCE_AVAILABLE_BUT_NOT_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| FLEX-2 | PSI-68 | 5 | 8 | 0 | FULLY_INGESTED | EXPERIMENT_CONFIGURATION_ENVELOPE | path + SHA-256; source-specific metadata varies |
| FLEX | PSI-69 | 5 | 274 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SAFFIRE-I | PSI-98 | 9 | 2 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SAFFIRE-II | PSI-99 | 9 | 9 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SAFFIRE-III | PSI-100 | 6 | 2 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SAME-R | PSI-101 | 5 | 109 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SAME | PSI-102 | 6 | 8 | 0 | FULLY_INGESTED | EXPERIMENTAL_RUN | path + SHA-256; source-specific metadata varies |
| SPICE | PSI-107 | 5 | 469 | 0 | FULLY_INGESTED | OPERATING_CONDITION_OBSERVATION | path + SHA-256; source-specific metadata varies |

## Source classification

| Family | PSI | Filename | Path | Format | Size | Purpose | Raw/derived status | Ingestion status | Hash |
|---|---|---|---|---|---:|---|---|---|---|
| BASS-II | PSI-25 | TM-20210011385.pdf | `src/data/nasa/raw/bass-ii/documents/TM-20210011385.pdf` | .pdf | 46.70 MB | scientific document | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | BASS_GMT50_SAMPLE_147_TEST_B1.mp4 | `src/data/nasa/raw/bass-ii/evidence/BASS_GMT50_SAMPLE_147_TEST_B1.mp4` | .mp4 | 5.54 MB | media evidence or selected research frame | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Experimental table_BASS-II.csv | `src/data/nasa/raw/bass-ii/PSI-25_Experimental table_BASS-II.csv` | .csv | 16.2 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| FLEX-2 | PSI-68 | PSI-68_Experimental table_Flex2.csv | `src/data/nasa/raw/flex-2/PSI-68_Experimental table_Flex2.csv` | .csv | 1.0 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| FLEX | PSI-69 | PSI-69_Experimental table_FLEX.csv | `src/data/nasa/raw/psi-69/PSI-69_Experimental table_FLEX.csv` | .csv | 24.2 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-I | PSI-98 | PSI-98_Experimental table_SAFFIRE-1.csv | `src/data/nasa/raw/saffire-i/PSI-98_Experimental table_SAFFIRE-1.csv` | .csv | 469 B | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-II | PSI-99 | PSI-99_Experimental table_SAFFIRE-2.csv | `src/data/nasa/raw/saffire-ii/PSI-99_Experimental table_SAFFIRE-2.csv` | .csv | 1.9 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-III | PSI-100 | PSI-100_Experimental table_SAFFIRE-3.csv | `src/data/nasa/raw/saffire-iii/PSI-100_Experimental table_SAFFIRE-3.csv` | .csv | 239 B | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAME | PSI-102 | PSI-102_Experimental table_SAME.csv | `src/data/nasa/raw/same/PSI-102_Experimental table_SAME.csv` | .csv | 331 B | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAME-R | PSI-101 | PSI-101_Experimental table_SAME-R.csv | `src/data/nasa/raw/same-r/PSI-101_Experimental table_SAME-R.csv` | .csv | 5.5 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SPICE | PSI-107 | PSI-107_Experimental table_Spice.csv | `src/data/nasa/raw/spice/PSI-107_Experimental table_Spice.csv` | .csv | 30.5 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | bass-ii-documents.json | `data/nasa/manifests/bass-ii-documents.json` | .json | 473 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-III | PSI-100 | psi-100-saffire-iii.json | `data/nasa/manifests/psi-100-saffire-iii.json` | .json | 243 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAME-R | PSI-101 | psi-101-same-r.json | `data/nasa/manifests/psi-101-same-r.json` | .json | 253 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAME | PSI-102 | psi-102-same.json | `data/nasa/manifests/psi-102-same.json` | .json | 301 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAME | PSI-102 | psi-102-same.processed.json | `data/nasa/manifests/psi-102-same.processed.json` | .json | 630 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SPICE | PSI-107 | psi-107-spice.json | `data/nasa/manifests/psi-107-spice.json` | .json | 313 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | psi-25-bass-ii.json | `data/nasa/manifests/psi-25-bass-ii.json` | .json | 316 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | psi-25-bass-ii.processed.json | `data/nasa/manifests/psi-25-bass-ii.processed.json` | .json | 643 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| FLEX-2 | PSI-68 | psi-68-flex-2.json | `data/nasa/manifests/psi-68-flex-2.json` | .json | 239 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| FLEX | PSI-69 | psi-69-flex.json | `data/nasa/manifests/psi-69-flex.json` | .json | 308 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-I | PSI-98 | psi-98-saffire-i.json | `data/nasa/manifests/psi-98-saffire-i.json` | .json | 299 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-II | PSI-99 | psi-99-saffire-ii.json | `data/nasa/manifests/psi-99-saffire-ii.json` | .json | 239 B | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | chunks.json | `data/nasa/normalized/bass-ii/chunks.json` | .json | 485.1 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | claims.json | `data/nasa/normalized/bass-ii/claims.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | document-ingestion-report.json | `data/nasa/normalized/bass-ii/document-ingestion-report.json` | .json | 293 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | document-links.json | `data/nasa/normalized/bass-ii/document-links.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | documents.json | `data/nasa/normalized/bass-ii/documents.json` | .json | 800 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | evidence-assets.json | `data/nasa/normalized/bass-ii/evidence-assets.json` | .json | 1.1 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | ingestion-report.json | `data/nasa/normalized/bass-ii/ingestion-report.json` | .json | 1021 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | pages.json | `data/nasa/normalized/bass-ii/pages.json` | .json | 411.4 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | rejected-runs.json | `data/nasa/normalized/bass-ii/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | unmatched-evidence-assets.json | `data/nasa/normalized/bass-ii/unmatched-evidence-assets.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| BASS-II | PSI-25 | valid-runs.json | `data/nasa/normalized/bass-ii/valid-runs.json` | .json | 532.4 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX | PSI-69 | ingestion-report.json | `data/nasa/normalized/flex/ingestion-report.json` | .json | 2.0 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX | PSI-69 | rejected-runs.json | `data/nasa/normalized/flex/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX | PSI-69 | valid-runs.json | `data/nasa/normalized/flex/valid-runs.json` | .json | 1.98 MB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX-2 | PSI-68 | configurations.json | `data/nasa/normalized/flex-2/configurations.json` | .json | 29.0 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX-2 | PSI-68 | ingestion-report.json | `data/nasa/normalized/flex-2/ingestion-report.json` | .json | 1.5 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| FLEX-2 | PSI-68 | rejected-records.json | `data/nasa/normalized/flex-2/rejected-records.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-I | PSI-98 | ingestion-report.json | `data/nasa/normalized/saffire-i/ingestion-report.json` | .json | 692 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-I | PSI-98 | pretest-records.json | `data/nasa/normalized/saffire-i/pretest-records.json` | .json | 2.9 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-I | PSI-98 | rejected-runs.json | `data/nasa/normalized/saffire-i/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-I | PSI-98 | valid-runs.json | `data/nasa/normalized/saffire-i/valid-runs.json` | .json | 8.2 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-II | PSI-99 | ingestion-report.json | `data/nasa/normalized/saffire-ii/ingestion-report.json` | .json | 2.0 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-II | PSI-99 | pretest-records.json | `data/nasa/normalized/saffire-ii/pretest-records.json` | .json | 3.1 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-II | PSI-99 | rejected-runs.json | `data/nasa/normalized/saffire-ii/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-II | PSI-99 | source-notes.json | `data/nasa/normalized/saffire-ii/source-notes.json` | .json | 5.9 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-II | PSI-99 | valid-runs.json | `data/nasa/normalized/saffire-ii/valid-runs.json` | .json | 75.2 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-III | PSI-100 | ingestion-report.json | `data/nasa/normalized/saffire-iii/ingestion-report.json` | .json | 1.4 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-III | PSI-100 | rejected-runs.json | `data/nasa/normalized/saffire-iii/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-III | PSI-100 | source-conflicts.json | `data/nasa/normalized/saffire-iii/source-conflicts.json` | .json | 2.9 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAFFIRE-III | PSI-100 | valid-runs.json | `data/nasa/normalized/saffire-iii/valid-runs.json` | .json | 12.0 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME | PSI-102 | ingestion-report.json | `data/nasa/normalized/same/ingestion-report.json` | .json | 797 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME | PSI-102 | rejected-runs.json | `data/nasa/normalized/same/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME | PSI-102 | valid-runs.json | `data/nasa/normalized/same/valid-runs.json` | .json | 20.7 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME-R | PSI-101 | ingestion-report.json | `data/nasa/normalized/same-r/ingestion-report.json` | .json | 1.4 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME-R | PSI-101 | rejected-runs.json | `data/nasa/normalized/same-r/rejected-runs.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SAME-R | PSI-101 | valid-runs.json | `data/nasa/normalized/same-r/valid-runs.json` | .json | 473.1 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SPICE | PSI-107 | ingestion-report.json | `data/nasa/normalized/spice/ingestion-report.json` | .json | 1.7 KB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SPICE | PSI-107 | observations.json | `data/nasa/normalized/spice/observations.json` | .json | 1.53 MB | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| SPICE | PSI-107 | rejected-records.json | `data/nasa/normalized/spice/rejected-records.json` | .json | 3 B | deterministic normalized runtime artifact | DERIVED | GENERATED_RUNTIME_ARTIFACT | SHA-256 |
| Cross-family / archive | — | dead_files.txt | `psidata/dead_files.txt` | .txt | 1.7 KB | scientific archive artifact | RAW | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | download.py | `psidata/download.py` | .py | 10.3 KB | scientific archive artifact | RAW | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| BASS-II | PSI-25 | PSI-25.json | `psidata/manifests/PSI-25.json` | .json | 1.20 MB | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS | PSI-26 | PSI-26.json | `psidata/manifests/PSI-26.json` | .json | 337.0 KB | source manifest and provenance metadata | REFERENCE | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| SAFFIRE-I | PSI-98 | PSI-98.json | `psidata/manifests/PSI-98.json` | .json | 193.4 KB | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-II | PSI-99 | PSI-99.json | `psidata/manifests/PSI-99.json` | .json | 210.6 KB | source manifest and provenance metadata | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_metadata_PSI_metadata_PSI-101_BASS-II (1).zip | `psidata/metadata_zips/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II (1).zip` | .zip | 13.1 KB | engineering, reference, or metadata package | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip | `psidata/metadata_zips/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip` | .zip | 13.1 KB | engineering, reference, or metadata package | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Engineering Documents_BASS-II_Engineering Requirements.pptx | `psidata/PSI-25/Engineering Documents/PSI-25_Engineering Documents_BASS-II_Engineering Requirements.pptx` | .pptx | 1.07 MB | engineering, reference, or metadata package | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Engineering Documents_BASS-II_Ops.docx | `psidata/PSI-25/Engineering Documents/PSI-25_Engineering Documents_BASS-II_Ops.docx` | .docx | 1.06 MB | engineering, reference, or metadata package | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Experimental table_BASS-II.csv | `psidata/PSI-25/Experimental table/PSI-25_Experimental table_BASS-II.csv` | .csv | 16.2 KB | experimental table or structured source data | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_metadata_PSI-101_BASS-II.zip | `psidata/PSI-25/metadata/PSI-25_metadata_PSI-101_BASS-II.zip` | .zip | 16.9 KB | engineering, reference, or metadata package | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip | `psidata/PSI-25/metadata/PSI-25_metadata_PSI_metadata_PSI-101_BASS-II.zip` | .zip | 13.1 KB | engineering, reference, or metadata package | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Reference Data_Fan calibration data.xlsx | `psidata/PSI-25/Reference Data/PSI-25_Reference Data_Fan calibration data.xlsx` | .xlsx | 23.4 KB | engineering, reference, or metadata package | REFERENCE | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | PSI-25_Representative Image(s)_BASS-II_flame testing.jpg | `psidata/PSI-25/Representative Image(s)/PSI-25_Representative Image(s)_BASS-II_flame testing.jpg` | .jpg | 36.6 KB | media evidence or selected research frame | RAW | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS | PSI-26 | PSI-26_metadata_PSI-102_BASS.zip | `psidata/PSI-26/metadata/PSI-26_metadata_PSI-102_BASS.zip` | .zip | 11.4 KB | engineering, reference, or metadata package | REFERENCE | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| BASS-II | PSI-25 | GRAVIFIRE_BASS-II_PSI-25_Deep_Research.md | `Gravifier_research/BASS-II/GRAVIFIRE_BASS-II_PSI-25_Deep_Research.md` | .md | 38.0 KB | research report or scientific notes | RESEARCH | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS-II | PSI-25 | GRAVIFIRE_BASS-II_PSI-25_Deep_Research.pdf | `Gravifier_research/BASS-II/GRAVIFIRE_BASS-II_PSI-25_Deep_Research.pdf` | .pdf | 146.5 KB | research report or scientific notes | RESEARCH | FAMILY_ADAPTER_PRESENT | SHA-256 |
| BASS | PSI-26 | GRAVIFIRE_BASS_PSI-26_Deep_Research.md | `Gravifier_research/BASS-II/GRAVIFIRE_BASS_PSI-26_Deep_Research.md` | .md | 56.8 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| BASS | PSI-26 | GRAVIFIRE_BASS_PSI-26_Deep_Research.pdf | `Gravifier_research/BASS-II/GRAVIFIRE_BASS_PSI-26_Deep_Research.pdf` | .pdf | 222.6 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| SAFFIRE-II | PSI-99 | GRAVIFIRE_SAFFIRE-II_PSI-99_Deep_Research.md | `Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-II_PSI-99_Deep_Research.md` | .md | 92.3 KB | research report or scientific notes | RESEARCH | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-I | PSI-98 | GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.md | `Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.md` | .md | 78.6 KB | research report or scientific notes | RESEARCH | FAMILY_ADAPTER_PRESENT | SHA-256 |
| SAFFIRE-I | PSI-98 | GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.pdf | `Gravifier_research/BASS-II/GRAVIFIRE_SAFFIRE-I_PSI-98_Deep_Research.pdf` | .pdf | 321.1 KB | research report or scientific notes | RESEARCH | FAMILY_ADAPTER_PRESENT | SHA-256 |
| Cross-family / archive | — | data_contract.json | `Gravifier_research/evidence_store/exports/data_contract.json` | .json | 678.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_exit_checks.txt | `Gravifier_research/evidence_store/exports/r2_exit_checks.txt` | .txt | 1.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | gravifire_l1.db | `Gravifier_research/evidence_store/gravifire_l1.db` | .db | 576.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R2_CENSUS.md | `Gravifier_research/evidence_store/R2_CENSUS.md` | .md | 5.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P98-S2.csv.gz | `Gravifier_research/evidence_store/series/q1_P98-S2.csv.gz` | .gz | 3.07 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S1.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S1.csv.gz` | .gz | 1.77 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S2.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S2.csv.gz` | .gz | 2.28 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S3.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S3.csv.gz` | .gz | 2.25 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S4.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S4.csv.gz` | .gz | 2.26 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S5.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S5.csv.gz` | .gz | 1.68 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S6.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S6.csv.gz` | .gz | 1.57 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S7.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S7.csv.gz` | .gz | 2.81 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S8.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S8.csv.gz` | .gz | 3.39 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S9.csv.gz | `Gravifier_research/evidence_store/series/q1_P99-S9.csv.gz` | .gz | 4.70 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99_TELEM_SaffireData.csv.gz | `Gravifier_research/evidence_store/series/q1_P99_TELEM_SaffireData.csv.gz` | .gz | 306.2 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_channel_manifests.json | `Gravifier_research/R1_data_interrogation/outputs/q1_channel_manifests.json` | .json | 2 B | source manifest and provenance metadata | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P98-S2.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P98-S2.csv.gz` | .gz | 3.07 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S1.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S1.csv.gz` | .gz | 1.77 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S2.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S2.csv.gz` | .gz | 2.28 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S3.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S3.csv.gz` | .gz | 2.25 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S4.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S4.csv.gz` | .gz | 2.26 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S5.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S5.csv.gz` | .gz | 1.68 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S6.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S6.csv.gz` | .gz | 1.57 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S7.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S7.csv.gz` | .gz | 2.81 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S8.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S8.csv.gz` | .gz | 3.39 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S9.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99-S9.csv.gz` | .gz | 4.70 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99_TELEM_SaffireData.csv.gz | `Gravifier_research/R1_data_interrogation/outputs/q1_P99_TELEM_SaffireData.csv.gz` | .gz | 306.2 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_schema_stats.csv | `Gravifier_research/R1_data_interrogation/outputs/q1_schema_stats.csv` | .csv | 569 B | experimental table or structured source data | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q2_alignment_stats.csv | `Gravifier_research/R1_data_interrogation/outputs/q2_alignment_stats.csv` | .csv | 296 B | experimental table or structured source data | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q4_s5_front.png | `Gravifier_research/R1_data_interrogation/outputs/q4_s5_front.png` | .png | 65.6 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q4_s5_front_ok.csv | `Gravifier_research/R1_data_interrogation/outputs/q4_s5_front_ok.csv` | .csv | 377.2 KB | experimental table or structured source data | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q4_s5_front_track.csv | `Gravifier_research/R1_data_interrogation/outputs/q4_s5_front_track.csv` | .csv | 524.0 KB | experimental table or structured source data | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q5_evidence_rows.csv | `Gravifier_research/R1_data_interrogation/outputs/q5_evidence_rows.csv` | .csv | 272.6 KB | experimental table or structured source data | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R1_FINDINGS.md | `Gravifier_research/R1_data_interrogation/R1_FINDINGS.md` | .md | 7.8 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | fetch_p98_s1_sensors.py | `Gravifier_research/R1_data_interrogation/scripts/fetch_p98_s1_sensors.py` | .py | 1.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | p98_header.py | `Gravifier_research/R1_data_interrogation/scripts/p98_header.py` | .py | 569 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_sensor_schema.py | `Gravifier_research/R1_data_interrogation/scripts/q1_sensor_schema.py` | .py | 1.9 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_unified_timeseries.py | `Gravifier_research/R1_data_interrogation/scripts/q1_unified_timeseries.py` | .py | 7.3 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q2_time_alignment.py | `Gravifier_research/R1_data_interrogation/scripts/q2_time_alignment.py` | .py | 3.8 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q4_frame_recon.py | `Gravifier_research/R1_data_interrogation/scripts/q4_frame_recon.py` | .py | 1.4 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q4_s5_anchor.py | `Gravifier_research/R1_data_interrogation/scripts/q4_s5_anchor.py` | .py | 7.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q5_experimental_tables.py | `Gravifier_research/R1_data_interrogation/scripts/q5_experimental_tables.py` | .py | 9.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_build_store.py | `Gravifier_research/R1_data_interrogation/scripts/r2_build_store.py` | .py | 36.7 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_census.py | `Gravifier_research/R1_data_interrogation/scripts/r2_census.py` | .py | 3.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_export_contract.py | `Gravifier_research/R1_data_interrogation/scripts/r2_export_contract.py` | .py | 4.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_extract_anchors.py | `Gravifier_research/R1_data_interrogation/scripts/r2_extract_anchors.py` | .py | 3.9 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_matrix_header.py | `Gravifier_research/R1_data_interrogation/scripts/r2_matrix_header.py` | .py | 591 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_recon_xlsx.py | `Gravifier_research/R1_data_interrogation/scripts/r2_recon_xlsx.py` | .py | 1.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | xlsx_recon.py | `Gravifier_research/R1_data_interrogation/scripts/xlsx_recon.py` | .py | 1013 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R5_DIGEST_DATA.json | `Gravifier_research/R5_DIGEST_DATA.json` | .json | 12.3 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R5_FINDINGS_DIGEST.md | `Gravifier_research/R5_FINDINGS_DIGEST.md` | .md | 11.1 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | DEVELOPER_DOCUMENT.md | `Gravifier_research/R6_TRANSLATION/DEVELOPER_DOCUMENT.md` | .md | 20.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r6_exit_checks.py | `Gravifier_research/R6_TRANSLATION/r6_exit_checks.py` | .py | 3.9 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | video_script_v2.md | `Gravifier_research/R6_TRANSLATION/video_script_v2.md` | .md | 8.4 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C1-1465937149755.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C1-1465937149755.jpeg` | .jpeg | 42.0 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C1-1465937348893.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C1-1465937348893.jpeg` | .jpeg | 35.7 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C1-1465937541403.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C1-1465937541403.jpeg` | .jpeg | 34.0 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C2-1479773240574.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C2-1479773240574.jpeg` | .jpeg | 9.5 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C2-1479773392561.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C2-1479773392561.jpeg` | .jpeg | 11.8 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S1C2-1479773544549.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S1C2-1479773544549.jpeg` | .jpeg | 6.3 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S2C2-1479773722620.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S2C2-1479773722620.jpeg` | .jpeg | 12.0 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S2C2-1479773922604.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S2C2-1479773922604.jpeg` | .jpeg | 11.7 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S2C2-1479774122587.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S2C2-1479774122587.jpeg` | .jpeg | 13.4 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S4C1-1479774902677.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S4C1-1479774902677.jpeg` | .jpeg | 5.1 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S4C1-1479775102660.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S4C1-1479775102660.jpeg` | .jpeg | 3.5 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S4C1-1479775302642.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S4C1-1479775302642.jpeg` | .jpeg | 2.2 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C1-1479775474718.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C1-1479775474718.jpeg` | .jpeg | 9.3 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C1-1479775602706.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C1-1479775602706.jpeg` | .jpeg | 19.4 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C1-1479775730695.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C1-1479775730695.jpeg` | .jpeg | 7.4 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C2-1479775459386.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C2-1479775459386.jpeg` | .jpeg | 3.5 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C2-1479775526047.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C2-1479775526047.jpeg` | .jpeg | 3.4 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S5C2-1479775592708.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S5C2-1479775592708.jpeg` | .jpeg | 8.8 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S6C1-1479775884758.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S6C1-1479775884758.jpeg` | .jpeg | 12.0 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S6C1-1479776012746.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S6C1-1479776012746.jpeg` | .jpeg | 23.8 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S6C1-1479776140735.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S6C1-1479776140735.jpeg` | .jpeg | 14.6 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S9C1-1479780736517.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S9C1-1479780736517.jpeg` | .jpeg | 4.0 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S9C1-1479781122464.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S9C1-1479781122464.jpeg` | .jpeg | 5.1 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | Mapped_S9C1-1479781508432.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/Mapped_S9C1-1479781508432.jpeg` | .jpeg | 8.3 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | S3C2-1479774462628.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/S3C2-1479774462628.jpeg` | .jpeg | 9.6 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | S3C2-1479774595950.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/S3C2-1479774595950.jpeg` | .jpeg | 5.5 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | S3C2-1479774729273.jpeg | `Gravifier_research/R7_HANDOVER/assets/dossier_frames/S3C2-1479774729273.jpeg` | .jpeg | 2.2 KB | media evidence or selected research frame | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | frames_manifest.md | `Gravifier_research/R7_HANDOVER/assets/frames_manifest.md` | .md | 8.1 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R5_DIGEST_DATA.json | `Gravifier_research/R7_HANDOVER/digest/R5_DIGEST_DATA.json` | .json | 12.3 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R5_FINDINGS_DIGEST.md | `Gravifier_research/R7_HANDOVER/digest/R5_FINDINGS_DIGEST.md` | .md | 11.1 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | DEVELOPER_DOCUMENT.md | `Gravifier_research/R7_HANDOVER/docs/DEVELOPER_DOCUMENT.md` | .md | 20.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | game_story_and_choices.md | `Gravifier_research/R7_HANDOVER/docs/game_story_and_choices.md` | .md | 24.0 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | material_catalog_and_experiment_game.md | `Gravifier_research/R7_HANDOVER/docs/material_catalog_and_experiment_game.md` | .md | 12.8 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R1_FINDINGS.md | `Gravifier_research/R7_HANDOVER/docs/R1_FINDINGS.md` | .md | 7.8 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R4_VALIDATION_REPORT.md | `Gravifier_research/R7_HANDOVER/docs/R4_VALIDATION_REPORT.md` | .md | 6.1 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | engine.py | `Gravifier_research/R7_HANDOVER/engine/engine.py` | .py | 25.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | literature_register.json | `Gravifier_research/R7_HANDOVER/engine/literature_register.json` | .json | 3.6 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_holdout_stamp.json | `Gravifier_research/R7_HANDOVER/engine/outputs/r4_holdout_stamp.json` | .json | 295 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier1_anchors.json | `Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier1_anchors.json` | .json | 4.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier2_holdout.json | `Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier2_holdout.json` | .json | 1.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier3_provenance.json | `Gravifier_research/R7_HANDOVER/engine/outputs/r4_tier3_provenance.json` | .json | 2.8 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_verdicts.json | `Gravifier_research/R7_HANDOVER/engine/outputs/seed_verdicts.json` | .json | 35.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_verdicts.md | `Gravifier_research/R7_HANDOVER/engine/outputs/seed_verdicts.md` | .md | 1.5 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | run_r3.py | `Gravifier_research/R7_HANDOVER/engine/run_r3.py` | .py | 4.7 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | scenario_input_spec.md | `Gravifier_research/R7_HANDOVER/engine/scenario_input_spec.md` | .md | 3.4 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_claims.json | `Gravifier_research/R7_HANDOVER/engine/seed_claims.json` | .json | 11.9 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | verdict_spec.md | `Gravifier_research/R7_HANDOVER/engine/verdict_spec.md` | .md | 8.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | M1.json | `Gravifier_research/R7_HANDOVER/missions/M1.json` | .json | 19.4 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | mission_schema.md | `Gravifier_research/R7_HANDOVER/missions/mission_schema.md` | .md | 4.6 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | numbers_whitelist.json | `Gravifier_research/R7_HANDOVER/numbers_whitelist.json` | .json | 13.6 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | README.md | `Gravifier_research/R7_HANDOVER/README.md` | .md | 2.8 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | data_contract.json | `Gravifier_research/R7_HANDOVER/store/exports/data_contract.json` | .json | 678.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r2_exit_checks.txt | `Gravifier_research/R7_HANDOVER/store/exports/r2_exit_checks.txt` | .txt | 1.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | gravifire_l1.db | `Gravifier_research/R7_HANDOVER/store/gravifire_l1.db` | .db | 576.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R2_CENSUS.md | `Gravifier_research/R7_HANDOVER/store/R2_CENSUS.md` | .md | 5.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P98-S2.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P98-S2.csv.gz` | .gz | 3.07 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S1.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S1.csv.gz` | .gz | 1.77 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S2.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S2.csv.gz` | .gz | 2.28 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S3.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S3.csv.gz` | .gz | 2.25 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S4.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S4.csv.gz` | .gz | 2.26 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S5.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S5.csv.gz` | .gz | 1.68 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S6.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S6.csv.gz` | .gz | 1.57 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S7.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S7.csv.gz` | .gz | 2.81 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S8.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S8.csv.gz` | .gz | 3.39 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99-S9.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99-S9.csv.gz` | .gz | 4.70 MB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | q1_P99_TELEM_SaffireData.csv.gz | `Gravifier_research/R7_HANDOVER/store/series/q1_P99_TELEM_SaffireData.csv.gz` | .gz | 306.2 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | verify_bundle.py | `Gravifier_research/R7_HANDOVER/verify_bundle.py` | .py | 5.2 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | solution_prior_art_scan.md | `Gravifier_research/solution_prior_art_scan.md` | .md | 8.9 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | engine.py | `Gravifier_research/verdict_engine/engine.py` | .py | 25.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | literature_register.json | `Gravifier_research/verdict_engine/literature_register.json` | .json | 3.6 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | blind_store.db | `Gravifier_research/verdict_engine/outputs/blind_store.db` | .db | 580.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_holdout_stamp.json | `Gravifier_research/verdict_engine/outputs/r4_holdout_stamp.json` | .json | 295 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier1_anchors.json | `Gravifier_research/verdict_engine/outputs/r4_tier1_anchors.json` | .json | 4.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier2_holdout.json | `Gravifier_research/verdict_engine/outputs/r4_tier2_holdout.json` | .json | 1.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier3_provenance.json | `Gravifier_research/verdict_engine/outputs/r4_tier3_provenance.json` | .json | 2.8 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_verdicts.json | `Gravifier_research/verdict_engine/outputs/seed_verdicts.json` | .json | 35.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_verdicts.md | `Gravifier_research/verdict_engine/outputs/seed_verdicts.md` | .md | 1.5 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | R4_VALIDATION_REPORT.md | `Gravifier_research/verdict_engine/R4_VALIDATION_REPORT.md` | .md | 6.1 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | run_r3.py | `Gravifier_research/verdict_engine/run_r3.py` | .py | 4.7 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | scenario_input_spec.md | `Gravifier_research/verdict_engine/scenario_input_spec.md` | .md | 3.4 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_pdms_diag.py | `Gravifier_research/verdict_engine/scripts/r4_pdms_diag.py` | .py | 964 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_s6_diag.py | `Gravifier_research/verdict_engine/scripts/r4_s6_diag.py` | .py | 939 B | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier1_anchors.py | `Gravifier_research/verdict_engine/scripts/r4_tier1_anchors.py` | .py | 11.8 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier2_holdout.py | `Gravifier_research/verdict_engine/scripts/r4_tier2_holdout.py` | .py | 5.4 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r4_tier3_provenance.py | `Gravifier_research/verdict_engine/scripts/r4_tier3_provenance.py` | .py | 7.0 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r5_build_digest.py | `Gravifier_research/verdict_engine/scripts/r5_build_digest.py` | .py | 5.1 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | r5_exit_checks.py | `Gravifier_research/verdict_engine/scripts/r5_exit_checks.py` | .py | 3.5 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | seed_claims.json | `Gravifier_research/verdict_engine/seed_claims.json` | .json | 11.9 KB | scientific archive artifact | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | VERDICT_REVIEW.md | `Gravifier_research/verdict_engine/VERDICT_REVIEW.md` | .md | 5.5 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |
| Cross-family / archive | — | verdict_spec.md | `Gravifier_research/verdict_engine/verdict_spec.md` | .md | 8.3 KB | research report or scientific notes | RESEARCH | RESEARCH_OR_SOURCE_ONLY | SHA-256 |

## Interpretation rules

- data/nasa/normalized is generated runtime data and remains separate from raw source files.
- CSV tables are not assumed to be run-level experiments; adapters classify pretests, notes, configuration envelopes, observations, and runs.
- Approximate, range, text, missing, and review-required values remain status-bearing.
- Research notes and media are provenance-linked source/context candidates, not automatically measured results.
- PSI-26/BASS has target-repository metadata but no validated runtime adapter in this application.
