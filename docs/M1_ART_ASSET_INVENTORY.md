# M1 art asset inventory

Inventory checked for the M1 vertical slice on 2026-10-06. The files below are the extracted, reviewed subset of the Kenney Space Station Kit. They are visual-only GLB modules; Rapier collision remains a separate simple deck in `MissionScene.tsx`.

## Source and license

| Source | Creator | License | Runtime source |
|---|---|---|---|
| Kenney Space Station Kit | Kenney / Kenney.nl | CC0 | [asset credits](ASSET_CREDITS.md), `public/assets/game/environment/m1/LICENSE_KENNEY.txt` |

Source page: <https://kenney.nl/assets/space-station-kit>. The selected files were downloaded/extracted from the credited pack on 2026-10-06. No commercial game assets or NASA-owned imagery are used.

## Selected M1 files

All entries are GLB, embedded-material visual modules, and currently consumed by `src/components/mission-control/M1ProductionEnvironment.tsx` unless marked otherwise.

| File | Bytes | Role | Consumer/status |
|---|---:|---|---|
| `computer-system.glb` | 17,552 | research console | S1/S2 control stations; production |
| `computer-wide.glb` | 17,136 | wide console | preparation/replay control; production |
| `container-wide.glb` | 12,212 | equipment/storage prop | preparation bay; production |
| `door-double-closed.glb` | 6,984 | closed door module | approved inventory; reserved for later doorway composition |
| `floor-detail.glb` | 5,452 | deck detail | visual floor grid; production |
| `floor-panel.glb` | 8,900 | deck panel | visual floor grid; production |
| `floor.glb` | 2,836 | edge deck module | visual floor grid; production |
| `pipe.glb` | 3,536 | service conduit | replay chamber/ceiling; production |
| `rail.glb` | 9,692 | structural rail | ceiling/service rhythm; production |
| `structure-panel.glb` | 12,516 | overhead structural panel | ceiling kit; production |
| `structure.glb` | 29,828 | large structural frame | replay chamber; production |
| `table-display.glb` | 24,344 | display/console housing | analysis bay monitor bases; production |
| `table-large.glb` | 9,828 | lab table | SIBAL preparation station; production |
| `wall-detail.glb` | 15,096 | wall module | side walls; production |
| `wall-door-wide.glb` | 9,904 | doorway/wall module | side/rear wall openings; production |
| `wall-window-frame.glb` | 4,548 | window frame | approved inventory; reserved support module |
| `wall-window.glb` | 9,720 | window module | side walls; production |
| `wall.glb` | 5,252 | wall module | side walls; production |
| `LICENSE_KENNEY.txt` | 720 | license record | provenance; not rendered |
| `Textures/colormap.png` | 7,440 | shared Kenney color texture | referenced by the selected GLBs; production |

Approximate selected visual-module payload: 213,496 bytes (GLBs plus the shared texture and license, excluding repository metadata). No HDRIs, audio, VFX sprites, FBX files, or GLTF animation clips are present in the M1 asset directory.

## GLB inspection

The selected GLBs were inspected from their binary glTF headers. They use embedded `colormap` material/image data, contain one image each, and contain no animation clips. Mesh/node counts range from one small module to 13 nodes/meshes for `structure.glb`; `wall-detail.glb` contains three nodes/meshes. They are modular environment/prop assets, not a humanoid character.

## Character and fallback status

No approved character GLB is present. The third-person mission engineer remains the existing procedural fallback. The registry intentionally keeps this explicit in `src/lib/mission-visual-assets.ts`; no unreviewed character was introduced for this slice.

## Architecture boundary

- Rendered modules: `M1ProductionEnvironment.tsx`
- Invisible/simple collision: `M1CollisionDeck` in `MissionScene.tsx`
- Mission interactions: existing IDs (`sibal-sample`, `concurrent-control`, `opposed-control`, `ignition-console`, `analysis-wall`)
- Scientific values: unchanged mission/evidence runtime modules
- Approved registry: `src/lib/mission-visual-assets.ts`
