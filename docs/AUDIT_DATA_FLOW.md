# Scientific data-flow audit

## Canonical pipeline

Family-specific scripts under `scripts/psi` implement:

`raw CSV/document/media → parser → family schema → validator → normalizer → provenance → generated JSON → typed runtime module → Explorer/Lab/Ask/Landscape/Challenge`.

The runtime imports generated JSON from `data/nasa/normalized` through typed modules in `src/data`.

## Family status from `data/nasa/integration-registry.json`

| Family | PSI | Runtime status | Runtime records / type | Adapter status |
|---|---|---|---|---|
| BASS-II | PSI-25 | FULLY_INGESTED | 129 experimental runs | parser, validator, normalizer, document/evidence links |
| BASS | PSI-26 | SOURCE_AVAILABLE_BUT_NOT_INGESTED | 0 | research/archive only; not mission-ready |
| FLEX-2 | PSI-68 | FULLY_INGESTED | 8 configuration envelopes | schema preserves envelope semantics |
| FLEX | PSI-69 | FULLY_INGESTED | 274 experimental runs | warnings preserve source-unit limitations |
| SAFFIRE-I | PSI-98 | FULLY_INGESTED | 2 experimental runs | current M1 source resolver uses S1/S2 |
| SAFFIRE-II | PSI-99 | FULLY_INGESTED | 9 experimental runs | source statuses/warnings preserved; M4 selects 2-1..2-4 |
| SAFFIRE-III | PSI-100 | FULLY_INGESTED | 2 experimental runs | source conflicts are represented |
| SAME-R | PSI-101 | FULLY_INGESTED | 109 experimental runs | family-specific schema |
| SAME | PSI-102 | FULLY_INGESTED | 8 experimental runs | family-specific schema |
| SPICE | PSI-107 | FULLY_INGESTED | 8 operating-condition observations | not treated as run-level combustion results |

The registered source-path count and runtime count are generated metadata. `src/data/nasa-experiment-runs.ts` currently concatenates BASS-II, SAME, SAME-R, SAFFIRE-I/II/III, and FLEX runs; FLEX-2 and SPICE are exposed through separate typed modules because they are not run-level records.

## Safety findings

- Source rows preserve raw values and provenance; SAFFIRE-II ambiguity is surfaced in the UI.
- Runtime files are imported by route/data modules, not by the global layout. The root page now imports only small reviewed selectors and registry reports server-side; it does not ship raw archive files to the browser.
- `BASS` PSI-26 is correctly not treated as ingested evidence.
