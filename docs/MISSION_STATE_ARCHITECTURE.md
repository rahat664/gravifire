# Mission state architecture

GRAVIFIRE has three deliberately separate state categories:

## Immutable scientific state

NASA rows, normalized evidence, provenance, document context, mission evidence references, verdict limitations, and source values. These are imported/read-only. `MissionSessionState` must never contain them and campaign commands never write them.

## Persistent campaign state

`CampaignState` in `src/features/mission-control/types.ts`, persisted at `gravifire:mission-control:campaign:v2`. It contains progression, predictions, decisions, gaps, manual unlocks, and verdict history. `src/lib/campaign-commands.ts` now provides a single storage command boundary for load/save/reset/record/complete operations while preserving schema v2.

M6 remains separate at `gravifire:mission-control:m6:v1` because its manifest and experiment memo are a mission-specific payload with a separate schema and replay lifecycle. Its persistent state is joined into Dossier by selectors, not silently merged into campaign schema.

## Transient session state

`src/lib/mission-session.ts` owns phase, active objective, reviewed station IDs, gate state, interaction lock, active replay, and active panel. It is intentionally in-memory and resettable. M1 now uses it for replay lock/phase; scientific source data and campaign persistence remain where they were.

Camera mode, shoulder, FPS settings, and tutorial completion remain preference/session state, outside campaign history and evidence. This separation prevents a camera preference or temporary replay animation from changing campaign completion or NASA data.

## Migration behavior

`parseCampaignState` falls back to a fresh campaign for missing, malformed, unknown-schema, or missing-missions state and overlays known current mission keys. It does not invent completions. M6 uses the same safe-fallback pattern for schema 1. Future migrations should be explicit functions before accepting a new schema version.
