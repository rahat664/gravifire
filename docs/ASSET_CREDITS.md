# GRAVIFIRE Mission Control visual assets

The M1 vertical slice includes a small, extracted subset of the Kenney Space Station Kit.

## M1 environment

- Asset pack: Kenney Space Station Kit
- Creator: Kenney / Kenney.nl
- Source: https://kenney.nl/assets/space-station-kit
- License: Creative Commons CC0, verified on 2026-10-06
- Download source: `https://kenney.nl/media/pages/assets/space-station-kit/6475288f2e-1712749919/kenney_space-station-kit.zip`
- Download date: 2026-10-06
- Files used: selected `.glb` modules and the shared `Textures/colormap.png` under `public/assets/game/environment/m1/`
- Modifications: extracted and arranged at runtime; no source mesh edits
- Physics: visual-only; Rapier collision remains in `MissionScene`

The included vendor license is `public/assets/game/environment/m1/LICENSE_KENNEY.txt`.

## M1 PlayCanvas character — approved human candidate

- Asset: `public/assets/game/character/quaternius-human-astronaut.glb` (1,944,976 bytes)
- Original creator: Quaternius
- Source page: https://poly.pizza/m/3hC2i0CTuO
- License: Public Domain / CC0 1.0, listed by the source page
- Download source: `https://static.poly.pizza/0076345b-bbea-42d5-931c-4a5ad2050b18.glb`
- Download date: 2026-10-06
- Modifications: self-hosted unchanged GLB; runtime scale normalized to the GRAVIFIRE meter-scale pilot
- Inspection: four skinned meshes, four skins, human-named armature/joint hierarchy, estimated 10,558 triangles
- Animation clips retained for the pilot: `CharacterArmature|Idle`, `CharacterArmature|Walk`, `CharacterArmature|Run`
- Other source clips are not used because they are not required for non-combat locomotion
- Physics: visual-only; pilot movement remains separate from the render asset

The source page identifies this candidate as a person/character rather than an animal/creature. The runtime player selection points only to this candidate.

## M1 PlayCanvas character — rejected candidate

- Asset: `public/assets/game/character/quaternius-astronaut.glb` (approximately 755 KB)
- Original creator: Quaternius
- Source page: https://poly.pizza/m/OgeSH89Nmx
- License: Public Domain / CC0, verified on 2026-10-06
- Download source: https://static.poly.pizza/29010dcf-84c9-4eaf-a874-c44ef3166f55.glb
- Download date: 2026-10-06
- Status: `REJECTED_FOR_PLAYER_CHARACTER`
- Reason: `NON-HUMAN / CREATURE CHARACTER`
- Modifications: retained unchanged for provenance; no longer referenced by the player runtime
- Animation clips retained: `CharacterArmature|Idle`, `CharacterArmature|Walk`, `CharacterArmature|Run`, plus source clips
- Physics: visual-only; pilot movement remains separate from the render asset

## Human-proportion benchmark (not used at runtime)

- Asset: NASA `Astronaut.glb` (762,988 bytes downloaded; NASA page lists approximately 745.11 KB)
- Source page: https://science.nasa.gov/3d-resources/astronaut/
- Direct source: https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/astronaut/Astronaut.glb
- Source attribution: DigitalSpace Corporation, as listed on the NASA resource page
- Status: visual/proportion benchmark only; not added to the player runtime
- Inspection: one mesh, no embedded animation clips; it was not used as an animated character

The visual asset registry in `src/lib/mission-visual-assets.ts` remains the approved insertion point for reviewed GLB/GLTF modules.

When an asset is added, record:

- asset ID and filename
- creator/source URL
- license or permission
- modifications made for GRAVIFIRE
- approximate file size and optimization/compression method
- whether it is visual-only and therefore excluded from physics/collision

No commercial game assets, NASA-owned imagery, or unreviewed downloaded models may be added here.
