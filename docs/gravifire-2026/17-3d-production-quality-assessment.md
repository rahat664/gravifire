# 3D production-quality assessment

## Decision

**3D environment visual readiness: PARTIAL.** The active PlayCanvas missions render and respond, and the HUD communicates the evidence workflow. The actual scene art is a functional prototype rather than the agreed premium realistic spacecraft standard. No assets, lighting, materials, camera/controller code or environment geometry were changed in this phase.

Evidence is the current live browser output in `tests/browser-harness/artifacts/ui-phase5/before/` and `after/`, plus movement views in `performance-dedicated/`. These include M0/M1/M4/M6 at desktop, tablet and mobile sizes. Source review includes the active PlayCanvas pilots and their imported/generated assets. A separate legacy R3F/Rapier path exists; it is not the default renderer and is not certified by these captures.

## Findings by category

| Category | Actual finding | Scope and implication |
|---|---|---|
| HUD | Objective, evidence link and control strip are consistently grouped with readable backing. | HTML overlay quality is materially ahead of scene-art quality. Existing automated tests cover hit targets and pause/focus behavior. Projected monitor text is still small on narrow screens. |
| Environment | M1/M4/M6 use strongly repeated corridor, counter and instrument-station forms; surfaces have sparse functional detail. | Mission text differs, but rooms have limited visual identity or environmental storytelling. |
| Geometry | Many hard rectangular edges and broad flat panels read as prototype modular geometry. | Add intentional scale, edge treatment and believable instrument mounting through a reviewed asset pipeline. |
| Character | Astronaut silhouette is recognizable but visibly stylized/faceted. At initial M1/M4 framing, a foreground counter obscures/intersects the avatar silhouette. | This is a visual framing/placement issue; screenshots alone do not prove a collision defect. No collision change is authorized here. |
| Lighting/shadows | Strong diagonal surface/shadow bands are visible on walls/floor; contrast can be harsh and patchy. | Root cause may involve normals, shadow settings, geometry or lighting. It has not been isolated, so do not attribute it conclusively to the uTime warning. |
| Materials/textures | Large plain surfaces and flat cyan display panels lack realistic roughness variation, texture density and fine detail. | Consistent materials and a restrained instrument palette would improve realism without invented scientific telemetry. |
| Camera | Initial framing can place counters across the avatar; near-surface movement views show large foreground panels. | Needs deliberate camera/occlusion review separately from HUD work. Existing movement and camera code were preserved. |
| Animation | Short keyboard movement responds and changes viewpoint. | Still screenshots and rAF metrics do not establish natural gait, foot contact, turn quality or blend quality. A human motion review remains necessary. |
| Rendering compatibility | Missing-uTime and adapter deprecation warnings remain. | Current scenes render; no persistent blank-scene or gameplay failure caused by a warning was demonstrated. |
| Gameplay usability | Evidence navigation, pause/focus and pointer-lock recovery have automated coverage. | Touch-only controls, full mission completion and full collision traversal are not established by responsive HUD captures. |

## Mission distinctions

- **M0:** incident corridor establishes an alarm scenario, but the visual treatment and procedural incident effect remain stylized. It is explicitly fictional; do not treat flame visuals as NASA reconstruction.
- **M1:** sample/preparation-room objectives are understandable; repeated room geometry, counter occlusion and plain panels reduce visual credibility.
- **M4:** source identity and silicone objective are visible, while the environment remains closely related to M1 and has similar material/shadow limitations.
- **M6:** manifest and evidence-boundary text establish the research purpose, but stronger room identity and more readable projected displays would improve presentation.

## Prioritized proposal requiring separate approval

| Priority | Proposed work | Complexity | Regression risk / required validation |
|---|---|---|---|
| P1 | Isolate diagonal surface/shadow artifacts with controlled lighting, normals and shadow diagnostics. | Medium | Medium; preserve visual baselines and check all four scenes, light/shadow passes and target GPUs. |
| P1 | Diagnose initial avatar/counter framing and placement before selecting an art or camera correction. | Medium | High if camera/collision changes follow; test interaction distances, movement and all mission triggers. |
| P1 | Initialize M0 material time uniformly before first rendering, in a separate contained rendering fix. | Low–medium | Medium; retain per-frame updates, compare incident states and verify shader logs. No prediction/physics implication. |
| P2 | Define a small coherent PBR material/texture library with consistent units and texel density. | Medium–high | Medium; memory, draw-call and shader-compile budgets must be profiled. |
| P2 | Improve modular panel/console assets with edge treatment, assembly detail and distinct room layouts. | High | High; asset scale, collision alignment, world projections and trigger anchors need regression checks. |
| P2 | Review avatar art and motion blending with human animation inspection. | High | High; rig/animation compatibility, movement and camera occlusion must be tested before replacing assets. |
| P2 | Improve projected scientific-display legibility with an accessible HTML alternative. | Medium | Medium; preserve source identifiers, units, real limits and existing world relationships. |
| P2 | Review an upstream-compatible PlayCanvas React adapter version for getGuid deprecation. | Medium | High; dependency and lockfile work requires separate authorization and full rendering regression. |

Do not solve art limitations with fake telemetry, NASA insignia or unsupported safety claims. Establish art and performance budgets before a major environment pass. No major overhaul or replacement asset work has begun.

## Demo implications

Research pages and a concise HUD/navigation demonstration are usable, but a recording promising cinematic photorealism would overstate the current 3D result. A timed human rehearsal, chosen stable mission states and review of visual artifacts are still needed. No final submission video was recorded or published.
