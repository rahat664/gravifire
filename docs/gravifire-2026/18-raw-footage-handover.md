# GRAVIFIRE raw footage editor handover

**Delivery: playable continuous raw master, with documented partial gameplay. This is not a final submission video and has not been uploaded or submitted.**

Recorded from the actual localhost:3000 application in one fresh Chromium browser context at 1920�1080, starting before opening the homepage. The original user campaign/profile was not opened or edited. No localStorage seeding, forced objective completion, stage shortcuts, app changes, dependency changes, service restart or dataset changes were used during this capture task.

| File | Measured duration | Format | Resolution / cadence | Bytes |
|---|---|---|---|---|
| D:\gravifire\submission-footage\gravifire-complete-raw-master.webm | 504.960 s | vp9 / WebM / yuv420p | 1920�1080 / 25 FPS | 128678817 |
| D:\gravifire\submission-footage\gravifire-complete-raw-master.mp4 | 504.960 s | h264 / MP4 / yuv420p | 1920�1080 / 25 FPS | 51927642 |

Use the MP4 for editor compatibility; preserve the WebM as the original master. The MP4 is a full-duration H.264 transcode (CRF 18, veryfast, yuv420p, faststart), without cuts or added frames/graphics. Native cadence is 25 FPS, below the requested preferred 30/60; it has not been falsely relabeled or upsampled. Both have **no audio stream**. No narration, music or system/source-video audio was captured.

The original native WebM under scenes/ is byte-identical to the named WebM master (SHA-256 verified). Existing older files under submission-video/ are separate edited fallback work and are not this raw handover.

## Timestamp index

| Scene | Start�end | Content | Coverage |
|---|---|---|---|
| WEB-01 | 00:00:00.17�00:00:15.02 | Branding, hero, navigation, homepage sections and dashboard entry | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-02 | 00:00:15.02�00:00:41.35 | Mission scenarios; prevention, detection, suppression; rankings and limitations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-03 | 00:00:41.35�00:01:41.75 | NASA registry families, exact PSI identities, integration status, record scope and provenance | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-04 | 00:01:41.75�00:02:06.11 | Mission research relevance rankings, deterministic score factors and filters | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-05 | 00:02:06.11�00:02:41.25 | Hypothetical spacecraft/lunar/Mars conditions; matched/mismatched/unknown and partial-gravity cautions | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-06 | 00:02:41.25�00:03:04.44 | BASS-II B1 22.2% oxygen, condition match, gravity mismatch, unknown outcome and exact source provenance | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-07 | 00:03:04.44�00:03:22.53 | Virtual Lab source configuration and explicitly hypothetical modification, limitations and citations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-08 | 00:03:22.54�00:03:46.28 | Evidence DNA hierarchy, exact source record, provenance, outcome limits and original NASA video | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-09 | 00:03:46.28�00:04:49.19 | Four real grounded EMBER queries: evidence, ranking, partial gravity and unsupported safety certification | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-10 | 00:04:49.19�00:04:58.70 | Fresh-session mission archive, scientific status, evidence relationships and limitations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| GAME-01 | 00:04:58.70�00:05:08.36 | Fictional ISV Vesta campaign, mission selection, availability and NASA evidence navigation | CAPTURED_SAMPLED_VIDEO_REVIEW |
| GAME-02 | 00:05:08.36�00:05:51.82 | Real M0 onboarding, walking, incident inspection, operational response, pause and available completion | PARTIAL |
| GAME-03 | 00:05:51.83�00:06:42.44 | M1 genuine initial-state exploration, SIBAL, source replay stations and comparison | PARTIAL |
| GAME-04 | 00:06:42.44�00:07:29.35 | M4 actual material, ground and low-g source interactions and reachable sample inspection | PARTIAL |
| GAME-05 | 00:07:29.35�00:08:23.92 | M6 real manifest selection, evidence, airlock, boundary/refusal and persistent Dossier | PARTIAL |

Measured media duration is 504.960 seconds; final approximately one second includes native recorder retention. Scene times are measured recording-clock cues, not frame-certified edit decisions. Actual-video midpoint and end samples have been visually reviewed for all 15 scenes; start/end frames are supplied for precise editing. This is not a full-duration human playback audit.

## Coverage limits and unusable footage

- GAME-02: master reaches two of three M0 incident inspections; no master completion claim. See the separate real-progression M0 recording below.
- GAME-03: SIBAL, S1 and S2 interactions and comparison state are captured; campaign completion is not asserted.
- GAME-04: ground and low-g records, sample wall, and sample 2-1 interaction are captured; other three source cards are visible but not all reviewed.
- GAME-05: manifest, evidence, airlock, Mars boundary and actual refusal are captured; campaign-wide completion is not asserted.
- M1/M4/M6 use built-in development review access without any stage parameter or injected save. This is not a complete sequentially unlocked campaign playthrough.
- 00:05:08.52�00:05:09.48: dark M0 onboarding/loading flagged by blackdetect; inspected and retained. Start usable gameplay after assets settle.
- Browser loads and unsuccessful attempts remain in this unedited recording.

## Supplemental M0 recording

WebM: D:\gravifire\submission-footage\scenes\m0-supplement\m0-real-progression.webm

MP4: D:\gravifire\submission-footage\scenes\m0-supplement\m0-real-progression.mp4

Measured duration: 64.760 seconds. All three inspections, real response selection, pause/resume, completion button and persisted Dossier state are captured. **Post-completion navigation fails visibly: avoid approximately 00:41�00:59.** Do not present that interval as a successful route. Original remains intact.

## Best moments for editing

- 00:00�00:15: project identity, real capabilities and dashboard entry.
- 00:41�01:42: NASA family identity/status cards, including honest reference-only and configuration-envelope labels.
- 02:41�03:04: BASS-II B1 source row/provenance, 22.2% oxygen condition match, gravity mismatch and unknown parameters.
- 03:23�03:46: Evidence DNA source hierarchy and linked original NASA video. Do not claim the linked investigation video establishes a B1 combustion outcome.
- 03:46�04:49: four actual EMBER responses: evidence, ranking, partial-gravity gap and safety-certification refusal.
- 05:52�06:42: M1 real movement and SAFFIRE-I source replay/comparison.
- 06:42�07:29: M4 source-reference versus low-g display and sample wall. Some projected labels overflow their panels; prefer readable individual moments.
- Around 08:01�08:07: M6 explicit refusal and next-experiment boundary; actual-video sample GAME-05-refusal.png confirms it.
- Supplemental M0 00:13�00:29: actual incident inspections and response. 00:29�00:40: explicit fictional incident/evidence limitation, camera motion, pause/resume. Final Dossier shows M0 completion/FM-01 unlocked after a separate successful navigation.

## Scientific narration guardrails

- NASA evidence is real; ISV Vesta/2038 incidents and operational responses are fictional. They are not NASA experiments or predictions.
- BASS-II PSI-25 B1 reports **initial oxygen 22.2%**. The hypothetical mission input is a separate setting. A condition match is not an outcome match or safety finding. No linked B1 flame-spread or combustion-outcome result is established here.
- Ranking scores are deterministic application research relevance, not fire risk, safety probability, certification, confidence or a NASA-endorsed scoring standard.
- Microgravity evidence does not directly establish lunar/Martian partial-gravity behavior. Preserve the uncertainty and refusal language.
- SAME/SAME-R table-entry counts do not imply detector responses or alarm performance. FLEX-2 envelopes do not imply completed runs. FLEX and SAME source-count discrepancies and SAFFIRE source conflicts remain disclosed.
- Virtual Lab modifications are hypothetical configuration comparisons; the illustrative flame is explicitly representational, not a NASA prediction.
- No NASA endorsement, material certification, invented measurements or universal material-safety conclusions should be narrated.

## Validation and safety

- All 15 requested scene IDs accounted for, ordered and within measured video duration. All route visits returned HTTP 200 in the recording harness.
- Full-file FFmpeg decode: PASS for both masters and both supplemental formats. Media metadata checked using ffprobe.
- All 15 native-video midpoint and end samples inspected; B1 comparison, M4 sample wall, M6 refusal and M0 onboarding/completion frames inspected separately. No missing-video recording failure was observed in this sampling and decode validation.
- Blackdetect flagged 308.52�309.48 s in the WebM; actual frame shows a real onboarding dialog over a dark loading scene. MP4 threshold scan did not flag it. Retain as raw, avoid as gameplay footage.
- Main recording logged zero page exceptions and zero console errors. Existing warnings: THREE.Clock deprecation once and Entity#getGuid deprecation four times. No warning suppression or rendering upgrade performed.
- Supplemental completion navigation error is explicitly recorded above; it was not converted into a passing workflow claim. The capture script originally inferred successful navigation from the route; visual inspection corrected that inference. Original script metadata is retained separately.
- Port 3000 remains PID 21384; post-capture /dashboard returned HTTP 200. No services were restarted. git diff --check passed (existing line-ending warnings only).
- No full new application test/build run was needed for recording-only scripts; prior test counts are inherited, not rerun claims. Manual NVDA rechecking remains deferred.

## Handover artifacts and remaining requirements

- submission-footage/footage-index.md and footage-index.json: scene routes, source identities, real response text and action/observed objective logs.
- submission-footage/capture-validation.json: measured formats, durations, file sizes, checksums, decode results, limitations and review method.
- submission-footage/validation-frames/: actual-video start/midpoint/end samples and contact sheets.
- submission-footage/scenes/: original native continuous file, documentary screenshots and the separate original M0 completion attempt.
- Capture scripts: tests/browser-harness/record-complete-raw.cjs, record-m0-raw-supplement.cjs, validate-complete-raw.cjs and finalize-raw-handover.cjs. They refuse existing video masters rather than overwrite them.

The initial remaining-footage assessment is superseded by the pickup addendum below: all four M4 sample reviews now reach analysis. A clean actual post-M0-completion navigation take, campaign-wide completion/unlock footage, and sustained manually directed gameplay/free-look shots remain outstanding. Existing footage must not be described as a complete sequential campaign completion. Voice-over/music and any final edit remain the separate editor�s work. Nothing was published, deployed or submitted.


## Gameplay pickup addendum

The existing master remains unchanged (SHA-256 verified). Additional raw pickups are now available:

- `submission-footage/scenes/gravifire-m4-remaining-samples.webm` and `.mp4`: **81.960 s**, 1920�1080, 25 FPS, no audio. Actual source sample reviews 2-2, 2-3 and 2-4 succeed after the initial 2-1 review; analysis is reached. Key observed times: **00:38.124**, **00:52.801**, **01:07.209**. No campaign-wide completion claim.
- `submission-footage/scenes/gravifire-m0-clean-completion.webm` and `.mp4`: **46.520 s**, 1920�1080, 25 FPS, no audio. Clean completion-ready endpoint; the completion button is deliberately **not activated**. No actual completion is claimed for this take. Prefer 00:28�00:33 and 00:41�00:46.520 for the evidence boundary.
- Both formats of both recommended clips passed full decoding. Actual-video keyframes were inspected; no unintended error screen was observed in those samples. No near-black interval =0.5 s was flagged by the pickup validation scan.
- Original M0 completion clip remains preserved. Its approximately **00:41�00:59** error interval remains unusable; the later Dossier shows persisted completion after separate navigation.

See **submission-footage/editor-pickup-guide.md** for exact event timestamps, best edit windows, preserved unsuccessful takes, scientific caveats and remaining missing footage. See **submission-footage/pickup-validation.json** for measured metadata and master integrity. The first unsuccessful M4 pickup is retained separately; the preferred M4 filename contains the successful second take. No master recording, application code, NASA data, campaign state schema, dependencies or running service was changed.
