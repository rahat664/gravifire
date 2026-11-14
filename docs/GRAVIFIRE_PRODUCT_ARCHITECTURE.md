# GRAVIFIRE product architecture

GRAVIFIRE connects mission-context selection, NASA evidence discovery, condition comparison and narrative learning in one browser-based platform. Its mission-research concept supports early exploration of fire prevention, detection and suppression questions using available experimental records. The [project details](PROJECT_DETAILS.md) describe the intended impact, development tools and design considerations.

The science workspace makes data useful through reproducible ranking, comparison views and traceable source records. Mission Control turns evidence inspection and uncertainty into interactive learning decisions aboard the fictional ISV Vesta in 2038. Both modes preserve the boundary between NASA observations, hypothetical conditions and fictional events.

## Home

`/` is the product entry point: platform promise, reviewed evidence highlights, pipeline explanation, and links to the two major product modes.

## Science workspace

`/dashboard` is the guided workflow: select a mission environment and fire-safety objective, review ranked investigations, inspect a source record and compare conditions marked matched, mismatched or unknown. Source identifiers and provenance stay attached to the evidence, including missing measurements and family-specific limitations.

`/experiments` and detail/comparison routes expose structured NASA evidence. `/lab` provides condition exploration with observed/counterfactual distinctions. `/ask` provides deterministic grounded retrieval. `/landscape` provides comparable coverage views. `/recommend` is explicitly scoped to its current recommender data. `/challenge` exposes limitations and competing evidence.

## Mission Control

`/mission-control` owns the fictional campaign queue; `/mission-control/play/[missionId]` owns client-only 3D mission sessions; `/mission-control/manual` owns unlocked field entries.

## Trust layer

`/mission-control/dossier`, `VerdictCard`, evidence references, Challenge, source provenance, and `/video-demo`'s R7 citation/holdout screens form the trust layer. R7 remains a precomputed capture contract, not a second runtime ingestion path.

## Data boundary

Raw and normalized scientific data stay server/build-side or in typed route modules. Client game code receives mission payloads and selected runtime values, never the entire raw archive. The browser must not calculate scientific verdicts.

## Current architecture quality

The product surfaces exist and pass the current automated baseline. The main architectural debt is concentration: large mission components mix session state, persistence, and rendering, while science pages often import generated JSON directly. The next safe step is boundary extraction, not a rewrite.
