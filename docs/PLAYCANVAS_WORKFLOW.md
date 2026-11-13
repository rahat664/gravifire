# PlayCanvas Pilot Workflow

The M1 PlayCanvas pilot lives at `/mission-control/play/m1-pc` and is an isolated development route. The existing R3F/Rapier route remains the campaign fallback at `/mission-control/play/m1`.

## Intended authoring loop

1. Assemble a compact M1 research-bay composition in PlayCanvas Editor using approved, license-safe modules.
2. Validate human scale, lighting, material response, camera framing, and interaction sight lines in the editor.
3. Export or download only the approved GLB/configuration needed by the repository.
4. Store the self-hosted files under `public/assets/game/` and record source, license, date, and modifications in `docs/ASSET_CREDITS.md`.
5. Render the approved files through the React PlayCanvas runtime. React owns the HUD and mission state; PlayCanvas owns the visual scene.

The final architecture must not depend on a permanently remote PlayCanvas iframe. An iframe may be used for temporary editor comparison only.

## Current pilot boundary

The pilot now uses `public/assets/game/generated/m1/gravifire_lab_shell_8x8.glb` as the primary enclosed room shell, with the generated SIBAL station, equipment rack, science console, and bulkhead as room props. The pack is documented by `public/assets/game/generated/m1/README.md` and `asset-manifest.json`; it contains presentation geometry only. The extracted Kenney CC0 modules remain available as a reviewed fallback. The pilot proves a preparation-bay composition, camera, basic movement, lighting, and a clearly marked procedural character fallback. No external candidate was downloaded for this slice; the manifest's Spaceship Interior Deck Kit remains the preferred external option for a later approved asset pass.

PlayCanvas uses approximately one world unit per meter. The preparation bay keeps collision and mission state outside the renderer; the pilot's movement bounds are intentionally lightweight and are not a replacement for the Rapier campaign implementation.

## Gate before expansion

Review `/mission-control/play/m1-pc?review=1` in a desktop browser before adding the replay chamber or analysis bay. The required gate is a readable character, floor, walls, ceiling, door, sample station, practical light, and no client/runtime errors. If the screenshot is not visibly better than the R3F M1 route, keep R3F as the active presentation and do not propagate the pilot.
