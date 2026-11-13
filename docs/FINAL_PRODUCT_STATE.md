# GRAVIFIRE Final Product State

## Canonical architecture

- Next.js/React owns routing, campaign state, mission definitions, evidence resolvers, provenance, Dossier, Field Manual, EMBER, and science workspaces.
- PlayCanvas is the canonical 3D presentation layer for M0, M1, M4, and M6. The missions are client-only dynamically imported through `PlayCanvasMissionLoader`.
- R3F/Rapier mission implementations remain in the repository as explicit development comparison/fallback code. They are not selected by default and are not silently substituted when PlayCanvas fails.
- The Virtual Lab remains an isolated React Three Fiber viewport. Its fire is a representational renderer; it is not a prediction engine.

## Core campaign

The reviewed demo campaign is `M0 → M1 → M4 → M6`. M0 is a fictional incident. M1 and M4 visualize reviewed NASA source comparisons. M6 is the archive-domain refusal finale.

## Science locks

- M0: no matching garment/microgravity evidence in the current archive; no validated incident outcome is claimed.
- M1: S1 Concurrent and S2 Opposed use `RECORDED BURN TIME` values `420 s` and `70 s`; the comparison is not a universal control law.
- M4: material label is `SILICONE`; runtime preserves SAFFIRE-II / PSI-99 source context and raw `037 mm` where applicable.
- M6: Mars `≈ 0.38 g` is mission context only; the final result is refusal when no matching combined-condition evidence exists in the current archive domain.

## Review/demo tooling

Development-only `review=1&stage=...` shortcuts are documented in `FINAL_DEMO_CAPTURE_CHECKLIST.md`. They do not persist campaign state. The shared PlayCanvas mission chrome provides the canonical controls, first-mission tutorial, pause menu, and explicit restart/return paths.

## Intentionally deferred

- M2/M3/M5 scientific review and implementation.
- BASS/PSI-26 ingestion until a reviewed adapter exists.
- Broad client DTO/payload optimization for science routes.
- Full production audio, advanced mobile gameplay, and script-tree consolidation.
- AAA environment replacement or mission art rebuild.
