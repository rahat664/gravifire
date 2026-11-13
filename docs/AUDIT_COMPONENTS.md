# Component architecture audit

## Site and science UI

- `MissionNav`: global site navigation; appropriate for science routes, hidden by game route CSS.
- `AskGravifire`, `VirtualLabWorkspace`, `LandscapeExplorer`, `RecommendationExplorer`: active product workspaces. They consume structured runtime arrays directly and are separate from Mission Control.
- `ExperimentRunCard`, family-specific detail components, `DataStatusBadge`, `EvidenceAssetCard`, `DocumentSearch`: active evidence presentation components.

## Trust and evidence

- `EvidenceDNA`, `SPICEObservationDNA`, `VerdictCard`, `ChallengeResultView`: provenance/verdict/challenge surfaces.
- `Dossier`, `FieldManual`, `EmberPanel`: campaign trust surfaces. Dossier is functional but large and mixes hydration, campaign summaries, and presentation.

## Mission Control/game

- `GameShell`, `MissionGameLoader`, `MissionGame`, `MissionScene`: route shell, client-only loader, mission dispatch, and R3F/Rapier scene.
- `M0MissionGame`, `M1MissionGame`, `M4MissionGame`, `M6MissionGame`: mission-specific state and interactions. These are functional but each is a large stateful component and should eventually be split by phase/controller/view.
- `ThirdPersonRig`, `FirstPersonFeel`, `MissionHUD`, `MissionObjectiveGuide`, `TutorialTips`: camera, movement, HUD, guidance, and tutorials.
- `SpacecraftKit`, `M1ProductionEnvironment`, `ProductionGLTFModule`: procedural environment kit plus M1-only CC0 GLB boundary. `M1ProductionEnvironment` is the first asset-backed vertical slice; other missions remain mostly procedural.

## R7/video

`src/lib/r7/adapter.ts`, `VideoDemoClient`, `R7VerdictCard`, and `VerdictStamp` form a separate precomputed-JSON capture surface. It is not the same verdict model as campaign `EXACT/BOUND/INSUFFICIENT/REFUSAL` and must remain contract-scoped.

## Duplication / complexity findings

- `scripts/` and `Scripts/` duplicate ingestion/source files.
- Mission state is split across campaign state, graybox state, M6 state, camera settings, FPS settings, and tutorial state. This is currently understandable but increases hydration and replay risk.
- The game scene contains a large procedural kit and mission components rather than a data-driven mission presentation system.
- `Dossier` and mission components combine local-storage hydration, rendering, and persistence; future work should extract selectors and command handlers first.
- No deletion is recommended during this audit; these are cleanup candidates, not proven dead code.
