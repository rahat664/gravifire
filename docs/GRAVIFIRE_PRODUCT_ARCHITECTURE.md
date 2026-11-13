# GRAVIFIRE product architecture

## Home

`/` is the product entry point: platform promise, reviewed evidence highlights, pipeline explanation, and links to the two major product modes.

## Science workspace

`/experiments` and detail/comparison routes expose structured NASA evidence. `/lab` provides condition exploration with observed/counterfactual distinctions. `/ask` provides deterministic grounded retrieval. `/landscape` provides comparable coverage views. `/recommend` is explicitly scoped to its current recommender data. `/challenge` exposes limitations and competing evidence.

## Mission Control

`/mission-control` owns the fictional campaign queue; `/mission-control/play/[missionId]` owns client-only 3D mission sessions; `/mission-control/manual` owns unlocked field entries.

## Trust layer

`/mission-control/dossier`, `VerdictCard`, evidence references, Challenge, source provenance, and `/video-demo`'s R7 citation/holdout screens form the trust layer. R7 remains a precomputed capture contract, not a second runtime ingestion path.

## Data boundary

Raw and normalized scientific data stay server/build-side or in typed route modules. Client game code receives mission payloads and selected runtime values, never the entire raw archive. The browser must not calculate scientific verdicts.

## Current architecture quality

The product surfaces exist and pass the current automated baseline. The main architectural debt is concentration: large mission components mix session state, persistence, and rendering, while science pages often import generated JSON directly. The next safe step is boundary extraction, not a rewrite.
