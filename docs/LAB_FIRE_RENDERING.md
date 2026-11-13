# Virtual Lab Fire Rendering

The Virtual Lab fire is an isolated React Three Fiber presentation effect. It receives a `FireVisualProfile`; it does not calculate measurements, verdicts, flame height, spread, temperature, extinction, soot, or safety conclusions.

## Rendering approach

- Four crossed/rotated shader slices share a procedural flame shader but use independent seeds and phases.
- The fragment shader uses low-, mid-, and high-frequency noise plus lightweight FBM.
- Independent left/right boundaries combine vertical taper, lean, noise deformation, and high-frequency erosion so alpha reaches zero well inside each plane edge.
- Four animated tongue lobes break the upper silhouette; the core is another organic shader mask rather than a white rectangle.
- Ten small GPU-animated secondary wisps remain close to the ignition point. They are not a particle fountain.
- Earth reference mode may show extremely subtle neutral smoke. Low-g and microgravity presentation modes do not imply measured smoke behavior.
- A single warm point light uses layered filtered modulation. It is local scene illumination, not a temperature signal.

## Profiles

`EARTH_REFERENCE_VISUAL`, `LOW_G_REPRESENTATIONAL`, and `MICROGRAVITY_REPRESENTATIONAL` are presentation presets only. Flow, buoyancy, turbulence, and elongation are art controls; they are not a gravity-to-flame model. Development-only URL overrides are available at `/lab?fireProfile=earth`, `lowg`, or `microgravity`.

## Review modes

- `/lab?fireReview=close` frames the sample and flame for mask/attachment review.
- `/lab?fireReview=side` provides an oblique view for checking that the crossed slices do not read as a paper-thin billboard.

These query parameters are ignored in production and never mutate experiment, campaign, or scientific state.

## Parameter-to-visual mapping

`src/lib/fire-visual-mapping.ts` is the only mapping layer between the modified Lab configuration and renderer targets. Its output is `FireVisualState` and is explicitly display-only:

- Initial oxygen changes brightness/core emphasis and a narrow bounded presentation scale range.
- Airflow changes lean, flow vector, turbulence, and flicker speed. It never moves the ignition origin.
- Pressure changes opacity/glow/turbulence subtly and is clamped to safe visual limits.
- Environment selects the existing representational Earth, low-g, or microgravity profile.
- Geometry changes only the visual contact footprint. Material names do not create material-specific combustion behavior.
- Earth-only smoke remains subtle and profile-controlled; arbitrary parameters do not infer soot or smoke measurements.

The tuning hierarchy is intentionally uneven so user changes are visible without implying a model:

| Input | Visual channels | Response strength | Scientific status |
| --- | --- | --- | --- |
| Oxygen | intensity, hot-core emphasis, bounded fullness/scale | Moderate | Visual heuristic only |
| Airflow | lean, flow vector, turbulence, flicker/wisp motion | Strong | Visual heuristic only |
| Pressure | opacity, glow, small turbulence modulation | Subtle | Visual heuristic only |
| Environment | buoyancy preset, spread, directional bias, smoke policy | Strong | Representational visual preset |

These mappings are deterministic display heuristics, not scientific combustion models, NASA-derived behavior, prediction output, or measured results. The renderer never writes evidence status or scientific verdict fields. Target values are damped inside the renderer over a short transition so slider changes feel continuous without React updates on every frame.

## Source replay and limitations

Recorded NASA evidence remains distinct from this synthetic visualization. When a source-replay flow is used, the renderer must not be presented as recorded imagery. No new texture, flipbook, or commercial VFX asset was added in this pass.

## Performance

Animation updates mutate shader uniforms in `useFrame`; they do not update React state per frame. The effect uses shared shader source, four primary slices, ten low-cost wisps, and at most nine low-opacity smoke meshes. No CPU particle swarm or heavy post-processing stack is introduced. Lower-quality device handling can omit smoke and secondary layers at the integration boundary without changing the science contract.
