# NASA Investigation Dataset Coverage

**Audit date:** 2026-11-13  
**Registry:** `src/data/nasa-investigation-coverage.ts`  
**Scope:** BASS, BASS-II, SAFFIRE-I/II/III, SAME, SAME-R, FLEX, FLEX-2. Counts below describe this repository’s validated normalized records, not total historical experiment counts or the full NASA PSI archive.

## Coverage states

- **`verified_and_ingested`** — a local primary source table is present; its SHA-256 matches `data/nasa/provenance/source-hashes.json`; an ingestion report and normalized runtime artifact exist; the runtime count is verified against the artifact.
- **`reference_only`** — locally available investigation metadata and/or research documents exist, but no verified primary run table and normalized records are imported for that investigation.
- **`unavailable_or_unverified`** — a supported state for an investigation whose local source identity/data cannot yet be verified. No investigation in the current nine-family scope is classified this way; BASS is more specific: reference material exists, so it is `reference_only`.

The research-pillar labels are GRAVIFIRE’s taxonomy for organizing the investigations. They are not NASA classifications. The catalog intentionally records no numeric environmental values or experiment outcomes; those remain in their existing normalized, family-specific schemas. Missing facts remain absent rather than inferred from a research document.

## Investigation status matrix

| Investigation | PSI ID | Research pillar | Coverage state | Local validated runtime records | Primary source and normalized artifact |
|---|---|---|---|---:|---|
| BASS | PSI-26 | Solid material flammability | `reference_only` | Not established | PSI metadata manifest, metadata ZIP, and local research MD/PDF; no primary experimental table, ingestion report, or normalized runtime artifact |
| BASS-II | PSI-25 | Solid material flammability | `verified_and_ingested` | 129 experimental runs | `src/data/nasa/raw/bass-ii/PSI-25_Experimental table_BASS-II.csv` → `data/nasa/normalized/bass-ii/valid-runs.json` |
| SAFFIRE-I | PSI-98 | Spacecraft material flammability | `verified_and_ingested` | 2 experimental runs | `src/data/nasa/raw/saffire-i/PSI-98_Experimental table_SAFFIRE-1.csv` → `data/nasa/normalized/saffire-i/valid-runs.json` |
| SAFFIRE-II | PSI-99 | Spacecraft material flammability | `verified_and_ingested` | 9 experimental runs | `src/data/nasa/raw/saffire-ii/PSI-99_Experimental table_SAFFIRE-2.csv` → `data/nasa/normalized/saffire-ii/valid-runs.json` |
| SAFFIRE-III | PSI-100 | Spacecraft material flammability | `verified_and_ingested` | 2 experimental runs | `src/data/nasa/raw/saffire-iii/PSI-100_Experimental table_SAFFIRE-3.csv` → `data/nasa/normalized/saffire-iii/valid-runs.json` |
| SAME | PSI-102 | Smoke and aerosol detection | `verified_and_ingested` | 8 experimental-table records | `src/data/nasa/raw/same/PSI-102_Experimental table_SAME.csv` → `data/nasa/normalized/same/valid-runs.json` |
| SAME-R | PSI-101 | Smoke and aerosol detection | `verified_and_ingested` | 109 experimental-table records | `src/data/nasa/raw/same-r/PSI-101_Experimental table_SAME-R.csv` → `data/nasa/normalized/same-r/valid-runs.json` |
| FLEX | PSI-69 | Droplet combustion and extinguishment | `verified_and_ingested` | 274 experimental runs | `src/data/nasa/raw/psi-69/PSI-69_Experimental table_FLEX.csv` → `data/nasa/normalized/flex/valid-runs.json` |
| FLEX-2 | PSI-68 | Droplet combustion and extinguishment | `verified_and_ingested` | 8 configuration envelopes | `src/data/nasa/raw/flex-2/PSI-68_Experimental table_Flex2.csv` → `data/nasa/normalized/flex-2/configurations.json` |

Each PSI ID links to its NASA PSI investigation URL in the registry. A DOI is included only where the local PSI source manifest contains one; omitted DOI values are `null`, not inferred. Current manifest DOI values include BASS-II `10.60555/4qc4-de67`, SAFFIRE-I `10.60555/0t15-1z43`, SAME `10.60555/gd4k-8h62`, and FLEX `10.60555/mbq8-0451`.

## Verification details and limits

### Raw source and hashes

The eight primary CSV files listed for ingested investigations are present under `src/data/nasa/raw/`. Each file’s size and SHA-256 were independently recalculated and matched the corresponding row in `data/nasa/provenance/source-hashes.json`. Registry tests repeat these checks so a stale or changed input fails validation.

The provenance registry also points to each source manifest, the shared source-hash manifest, the integration registry, normalized artifact, ingestion report, and available local research-reference files. Local research documents are kept as reference material; their presence never sets an investigation to `verified_and_ingested`.

### Family-specific cautions retained

- **BASS:** PSI-26 has a source metadata JSON/ZIP and research MD/PDF, but no experimental CSV in the local raw tree and no normalized PSI-26 run data. Its record count is `null`, not zero, because this catalog does not establish the total number of source experiments.
- **BASS-II:** The current count is 129 validated PSI-25 table rows. The local ingestion report separately tracks one matched video. The video is not counted as another experiment record.
- **SAFFIRE-I:** The ingestion report distinguishes two combustion records from two pretest flow-visualization records. Only the two validated combustion records are counted.
- **SAFFIRE-II:** The nine normalized records retain thickness ambiguity and source unit mismatch warnings. The catalog does not repair those scientific fields.
- **SAFFIRE-III:** The two normalized records retain source-context conflicts; conflicting source values are not silently reconciled.
- **SAME:** The local validated table contains eight records. The integration registry notes a discrepancy with a nine-row current web display; local source is retained pending reconciliation.
- **SAME-R:** The 109 figure is the validated local table record count. It is not an asserted number of detector events or successful detections.
- **FLEX:** The local table contains 274 validated records; its ingestion report preserves a comparison to a 284-test NASA report as an unresolved source-scope discrepancy. Source header/unit interpretation warnings remain attached.
- **FLEX-2:** Eight rows define validated configuration envelopes. They are not eight completed experiments, do not imply every parameter combination was tested, and have no run-level outcomes in this integration.

### Research and derived artifacts

Local family research MD/PDF files are available for BASS/PSI-26, BASS-II/PSI-25, SAFFIRE-I/PSI-98, and SAFFIRE-II/PSI-99. The in-scope SAME, SAME-R, SAFFIRE-III, FLEX, and FLEX-2 source tables are instead supported by their PSI source manifests, raw tables, source hashes, ingestion reports, and normalized outputs. No research document was promoted into run-level data.

The repository also has research/handover and evidence-store artifacts, including extracted telemetry files. Those artifacts are not substituted for the family-specific raw-input → parser → validator → normalizer contract in this registry. They do not change an investigation’s coverage state.

## Registry implementation

- Schema: `src/types/investigation-coverage.ts`.
- Typed records (NASA investigation title/family/PSI identity and links composed with integration state and local provenance) and state consistency validator: `src/data/nasa-investigation-coverage.ts`.
- Existing `/experiments` cards now display integration state, validated record kind/count, research pillar, and the first explicit limitation. The NASA PSI source link remains available on each card.
- The registry uses existing investigation metadata and local source-hash records; it does not edit normalized JSON or change ingestion/evidence verification logic.

Tests in `tests/investigation-coverage.test.ts` verify expected family membership, registry validity, PSI URL/DOI shapes, duplicate investigation and PSI IDs, status/artifact consistency, runtime counts, source-manifest/reference paths, and actual SHA-256 values for primary inputs.

## Check results

| Check | Result |
|---|---|
| Focused coverage tests | Pass: 6 tests |
| Full Vitest suite | Pass: 30 files, 184 tests |
| TypeScript | Pass: `pnpm exec tsc --noEmit --incremental false` |
| ESLint | Pass: `pnpm lint` |
| Production build | Not run; it writes generated `.next` output, which was preserved |

## Remaining coverage gaps

1. BASS/PSI-26 primary experimental data has not been locally acquired, hashed, ingested, or validated; it remains reference-only.
2. FLEX-2 run-level experiment results are not present; current records only describe configuration envelopes.
3. Existing source discrepancies remain open: SAME’s local eight vs web nine record display, and FLEX’s local 274 vs NASA report 284 test counts.
4. Research notes do not replace primary source tables or resolve the SAFFIRE-II and SAFFIRE-III data-quality warnings.
5. No scope expansion was made to other NASA families or studies outside the requested list.

## Protected repository state

Existing user changes were left untouched: modified `public/assets/mission-control/README.md`, untracked `docs/FINAL_VIDEO_PRODUCTION_PLAN.md`, and untracked `docs/FINAL_VIDEO_SHOT_LIST.md`. Generated normalized JSON and NASA source files were not edited. The only application changes are the new typed coverage registry and its Experiment Explorer status display, plus the requested unit tests and this report.
