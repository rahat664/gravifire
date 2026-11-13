# Client bundle audit

This audit follows imports from the route page to the client boundary. Exact per-route JS sizes are not available from the current build output without adding an analyzer, so no size is invented.

| Route | Client component | Data imported | Risk | Boundary / action |
|---|---|---|---|---|
| `/` | none | reviewed M1/M4 selectors and compact registry reports on the server | Low | No Three/Rapier/raw archive import. Kept server-rendered. |
| `/experiments` | page itself | `nasaInvestigations` catalog only | Low | Compact catalog already; detail data is route-scoped. |
| `/lab` | `VirtualLabWorkspace` | `nasaInvestigations` and `nasaExperimentRuns` through the client route | Medium/high | Full runtime array is currently serialized to the client. Next hardening task: server query/API DTO boundary. |
| `/ask` | `AskGravifire` | document arrays and challenge-engine import chain | Medium | Retrieval itself is API/server-side, but document context is imported into the client for `EvidenceDNA`. Extract a compact evidence/document DTO or server-render the DNA section. |
| `/landscape` | `LandscapeExplorer` | full BASS-II runs passed as props | Medium/high | Plot needs compact points; selection details should be fetched by ID. Current behavior preserved; DTO extraction is P1. |
| `/recommend` | `RecommendationExplorer` | full BASS-II runs passed as props | Medium/high | Recommendation computation runs in the client route boundary. Move computation/server result to a compact recommendation DTO. Scope remains BASS-II only. |
| `/challenge` | server page + result UI | server computes selected result; no global archive client import identified | Low/medium | Keep query-driven; verify result DTOs as challenge surface grows. |
| `/mission-control` | queue client islands | mission definitions and compact campaign state | Low | No game engine on queue. |
| `/mission-control/dossier` | `Dossier` client | selected runtime evidence plus local campaign state | Medium | It imports selected resolver data, not the full archive. Extract selectors/hydration helper next. |

## Findings

- `Three`, R3F, Drei, and Rapier are imported from the mission loader/scene boundary, not the root, Explorer, Ask, Landscape, or Recommend page modules.
- `data/nasa/provenance/source-hashes.json`, raw CSV/PDF/SQLite/archive files are not imported by the root layout or root page.
- The main remaining browser-payload issue is full BASS-II/run-array serialization into Lab/Landscape/Recommend client surfaces. It is documented rather than hidden; converting those routes to server/API DTOs is the next safe payload milestone.
