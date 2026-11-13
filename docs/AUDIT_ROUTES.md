# Route audit

Route ownership is under `src/app`. Server/client status below is based on the page file and its imported top-level component.

| Route | Page file | Main component | Data / status |
|---|---|---|---|
| `/` | `src/app/page.tsx` | inline product landing | **Canonical; fixed in this audit.** Server-rendered, runtime evidence selectors. |
| `/experiments` | `src/app/experiments/page.tsx` | inline client explorer | Active; client filters investigation catalog. |
| `/experiments/[id]` | dynamic page | inline run/dataset detail | Active; server data lookup. |
| `/experiments/[id]/runs/[runId]` | dynamic page | inline run detail | Active; provenance-backed. |
| `/experiments/flex-2/configurations/[configurationId]` | dynamic page | inline detail | Active; configuration-envelope semantics. |
| `/experiments/flex-comparison` | page | inline comparison | Active; distinguishes run-level FLEX from FLEX-2 envelopes. |
| `/experiments/saffire-comparison` | page | inline comparison | Active; availability comparison, not performance ranking. |
| `/experiments/same-comparison` | page | inline comparison | Active; descriptive field comparison. |
| `/experiments/spice/observations/[observationId]` | dynamic page | inline detail | Active; operating-condition observation semantics. |
| `/documents/[family]/[documentId]` | dynamic page | document UI | Active document route. |
| `/lab` | page | `VirtualLabWorkspace` | Active client workspace; observed/counterfactual separation needs continued QA. |
| `/ask` | page | `AskGravifire` | Active deterministic grounded-query UI; not an LLM runtime. |
| `/landscape` | page | `LandscapeExplorer` | Active; currently centered on BASS-II comparable dimensions. |
| `/recommend` | page | `RecommendationExplorer` | Active; BASS-II-scoped recommender, not a universal material ranking. |
| `/challenge` | page | `ChallengeResultView` | Active query-driven challenge surface. |
| `/mission-control` | page | `CertificationQueue` | Canonical campaign queue. |
| `/mission-control/dossier` | page | `Dossier` | Canonical campaign trust/export surface; browser state hydrated from local storage. |
| `/mission-control/manual` | page | `FieldManual` | Canonical field manual, currently compact/partly placeholder copy. |
| `/mission-control/play/[missionId]` | dynamic page | `MissionGameLoader` | Canonical 3D mission route; client-only game loader, mobile/WebGL fallback. |
| `/video-demo` | page | `VideoDemoClient` | R7 precomputed screen demo; separate from campaign gameplay. |
| `/api/ask` | route handler | grounded query API | Active API boundary. |
| `/api/challenge` | route handler | challenge API | Active API boundary. |
| `/api/evidence/bass-ii/[assetId]` | route handler | evidence asset API | Active targeted asset route. |

No additional graybox/debug page route is in `src/app`; the graybox is a mission/data mode inside Mission Control. `app-archive` is not an active Next route tree.

## Global route behavior

`src/app/layout.tsx` owns the site nav. Game routes use `GameShell` and CSS/body route handling to hide site chrome and scrolling. The root layout currently has no global provider and no custom error/loading/not-found route, so Next defaults remain for those states.
