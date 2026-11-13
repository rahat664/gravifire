# Virtual Lab Fire Visual Audit

Before this pass, `/lab` used nested HTML `div`s with CSS gradients and blur as a flame placeholder inside `VirtualLabWorkspace`. There was no Three/R3F scene, shader, particle system, smoke, heat distortion, fire light, depth interaction, or source-replay renderer. The sample and flame were unrelated CSS shapes.

The lowest-risk implementation is an isolated React Three Fiber viewport. Existing Lab controls, evidence cards, provenance, and the explicit no-prediction state remain unchanged. The renderer receives only a visual presentation profile and never computes scientific output.

The first renderer used three broad procedural shader planes and a flat white core. Human review correctly identified the visible plane rectangles, block-like core, smooth silhouette, and weak sample attachment as the primary failure mode. The renderer now uses the same isolated R3F boundary but replaces that mask with asymmetric FBM-driven boundaries, multi-frequency edge erosion, animated upper tongues, a shader-based organic core, four phase-shifted slices, ten restrained secondary wisps, conditional low-opacity smoke, and one filtered warm light.

No external texture or flipbook asset was added. Heat distortion and bloom remain intentionally omitted rather than adding heavyweight dependencies. Development-only `fireReview=close|side` and `fireProfile=earth|lowg|microgravity` query selectors support visual inspection without changing scientific state.
