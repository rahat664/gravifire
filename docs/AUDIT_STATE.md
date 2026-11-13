# State audit

| State | Owner | Persistent? | Schema | Consumers | Risk |
|---|---|---:|---|---|---|
| Campaign state | `src/lib/mission-state.ts` | localStorage | `gravifire:mission-control:campaign:v2`, `CampaignState.schemaVersion=2` | Queue, missions, Dossier, Field Manual | Multiple mission writers; migration and replay need regression coverage. |
| Graybox/session mission state | `mission-state.ts` | localStorage | `gravifire:mission-control:graybox:v1` | `MissionGame` | Legacy/compatibility state distinct from campaign state. |
| M6 manifest/memo | `src/lib/m6-state.ts` | localStorage | `gravifire:mission-control:m6:v1`, schema 1 | M6, Dossier | Separate source of truth for M6 selections. |
| Camera mode/shoulder | `src/lib/camera-state.ts` | localStorage | individual keys | `ThirdPersonRig`, `FirstPersonFeel` | Preference state is separate from mission state by design. |
| FPS settings | `src/lib/fps-state.ts` | local/session helper | movement config and state functions | controller/feel UI | Needs a single settings owner eventually. |
| Tutorials | `TutorialTips` | localStorage | `gravifire:tutorials:v1`-style key | first mission HUD | Browser-only hydration; safe fallback is needed. |
| Demo navigation | route query and R7 local component state | no campaign persistence | component state | Mission Control/R7 | Must remain navigation-only and not mutate evidence. |
| Mission transient state | React state/refs in mission components and scene | no | none | active 3D route | Refresh loses current beat; persistent completion remains separate. |

There is no global React context/store. `parseCampaignState`, `serializeCampaignState`, `parseM6State`, and camera helpers are the effective state boundaries. The main risk is duplicate write logic in M0/M1/M4/M6 rather than an immediate data corruption finding.
