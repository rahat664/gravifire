# M1 production art report

## Scope

This slice upgrades M1 only. M0, M4, and M6 visual environments were not propagated or redesigned. Scientific logic and evidence values were not changed.

## Implemented

- PlayCanvas pilot preparation bay uses an enclosed generated lab shell and generated room props.
- Kenney CC0 modules remain available as reviewed environment fallback assets.
- The pilot now loads the reviewed human Quaternius astronaut candidate from Poly Pizza model `3hC2i0CTuO` instead of the rejected creature character.
- The PlayCanvas controller maps actual `CharacterArmature|Idle`, `CharacterArmature|Walk`, and `CharacterArmature|Run` clips and keeps the procedural character only as a loading/error fallback.
- Runtime character scale is normalized to approximately 1.78 m.
- The camera uses a tighter over-shoulder composition and bounded preparation-bay movement.
- Badge duplication was removed so review status occupies one unobtrusive position.

## Asset and character status

The approved astronaut is `public/assets/game/character/quaternius-human-astronaut.glb`, sourced from Quaternius through Poly Pizza and listed as CC0. Inspection found four skinned meshes, four skins, a human-named armature/joint hierarchy, and the three locomotion clips listed above, plus additional source clips. The previously selected `quaternius-astronaut.glb` is retained but marked `REJECTED_FOR_PLAYER_CHARACTER` because it is a non-human/creature character. Provenance is recorded in [ASSET_CREDITS.md](ASSET_CREDITS.md) and the asset registry.

NASA's `Astronaut.glb` was inspected as a human-proportion benchmark only. It contains no embedded animation clips and is not used by the pilot.

## Performance

The approved astronaut file is 1,944,976 bytes. It is loaded only by the PlayCanvas M1 pilot route. M0, M4, and M6 assets remain lazy and unchanged. The pilot keeps visual assets separate from mission collision and scientific data.

## Manual visual review

Automated repository tooling does not provide browser screenshot inspection in this environment. HTTP/build validation can confirm route and asset availability, but it cannot approve visual quality. Human review is still required at approximately 1920×1080 for the spawn, preparation bay, SIBAL station, doorway, floor/ceiling readability, and locomotion framing.

## Remaining visible limitations

The astronaut is a low-poly CC0 asset rather than a bespoke production character, and the pilot still uses lightweight world-space screen treatment without baked lightmaps. The preparation bay must pass manual browser screenshot review before the art direction is propagated or the replay chamber is built.
