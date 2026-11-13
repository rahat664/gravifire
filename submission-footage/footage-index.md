# GRAVIFIRE raw footage index

Continuous original browser footage. No timeline cuts, captions, transitions, narration, music or fabricated frames. All 15 planned scene IDs are present. Game completion is limited as stated below.

Master WebM: D:\gravifire\submission-footage\gravifire-complete-raw-master.webm

Editor-compatible MP4: D:\gravifire\submission-footage\gravifire-complete-raw-master.mp4

Measured duration: **00:08:24.96 (504.960 seconds)**. 1920�1080, native 25 FPS, no audio stream.

Timestamps are measured recording-clock navigation cues; allow approximately one second around boundaries and use the supplied video-derived start/end frames for final cuts. Initial page creation and the native recorder tail remain unedited.

| Scene | Start | End | Route | Demonstration | Result |
|---|---|---|---|---|---|
| WEB-01 | 00:00:00.17 | 00:00:15.02 | / | Branding, hero, navigation, homepage sections and dashboard entry | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-02 | 00:00:15.02 | 00:00:41.35 | /dashboard | Mission scenarios; prevention, detection, suppression; rankings and limitations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-03 | 00:00:41.35 | 00:01:41.75 | /experiments | NASA registry families, exact PSI identities, integration status, record scope and provenance | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-04 | 00:01:41.75 | 00:02:06.11 | /recommend/investigations | Mission research relevance rankings, deterministic score factors and filters | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-05 | 00:02:06.11 | 00:02:41.25 | /applicability | Hypothetical spacecraft/lunar/Mars conditions; matched/mismatched/unknown and partial-gravity cautions | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-06 | 00:02:41.25 | 00:03:04.44 | /dashboard?mission=LUNAR_HABITAT&objective=PREVENTION&investigation=bass-ii&record=B1 | BASS-II B1 22.2% oxygen, condition match, gravity mismatch, unknown outcome and exact source provenance | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-07 | 00:03:04.44 | 00:03:22.53 | /lab?investigation=bass-ii&run=B1 | Virtual Lab source configuration and explicitly hypothetical modification, limitations and citations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-08 | 00:03:22.54 | 00:03:46.28 | /experiments/bass-ii/runs/B1 | Evidence DNA hierarchy, exact source record, provenance, outcome limits and original NASA video | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-09 | 00:03:46.28 | 00:04:49.19 | /ask?run=B1&investigation=bass-ii | Four real grounded EMBER queries: evidence, ranking, partial gravity and unsupported safety certification | CAPTURED_SAMPLED_VIDEO_REVIEW |
| WEB-10 | 00:04:49.19 | 00:04:58.70 | /mission-control/dossier | Fresh-session mission archive, scientific status, evidence relationships and limitations | CAPTURED_SAMPLED_VIDEO_REVIEW |
| GAME-01 | 00:04:58.70 | 00:05:08.36 | /mission-control | Fictional ISV Vesta campaign, mission selection, availability and NASA evidence navigation | CAPTURED_SAMPLED_VIDEO_REVIEW |
| GAME-02 | 00:05:08.36 | 00:05:51.82 | /mission-control/play/m0 | Real M0 onboarding, walking, incident inspection, operational response, pause and available completion | PARTIAL |
| GAME-03 | 00:05:51.83 | 00:06:42.44 | /mission-control/play/m1?review=1 | M1 genuine initial-state exploration, SIBAL, source replay stations and comparison | PARTIAL |
| GAME-04 | 00:06:42.44 | 00:07:29.35 | /mission-control/play/m4?review=1 | M4 actual material, ground and low-g source interactions and reachable sample inspection | PARTIAL |
| GAME-05 | 00:07:29.35 | 00:08:23.92 | /mission-control/play/m6?review=1 | M6 real manifest selection, evidence, airlock, boundary/refusal and persistent Dossier | PARTIAL |

## Limitations and editor exclusions

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

## Scientific source identities shown

| Family | NASA identity | Local scope shown |
|---|---|---|
| BASS | PSI-26 | Reference only; no validated runtime run records |
| BASS-II | PSI-25 | 129 local run records; B1 initial oxygen 22.2%; no linked B1 combustion outcome |
| SAFFIRE-I | PSI-98 | 2 classified combustion records; pretest flow rows excluded; game source S1/S2 |
| SAFFIRE-II | PSI-99 | 9 local run records; sample cards 2-1 through 2-4 |
| SAFFIRE-III | PSI-100 | 2 local configuration/run records with source-context conflict warning retained |
| SAME | PSI-102 | 8 experimental-table records, not detector-response counts; source discrepancy disclosed |
| SAME-R | PSI-101 | 109 experimental-table records, not detector-response counts |
| FLEX | PSI-69 | 274 local run records; 284-test report discrepancy and interpretation warnings retained |
| FLEX-2 | PSI-68 | 8 configuration envelopes, not completed runs or measured outcomes |

## Actual EMBER queries

- What evidence do we have for B1?
- Rank NASA investigations for lunar fire prevention
- Which NASA tests measured fire in lunar partial gravity?
- Is PMMA safe for a lunar habitat?

The JSON retains actual response text, visible catalog card text, measured action times and resulting objective text. Action labels describe attempted inputs; resulting HUD text is the evidence of progression.


## Gameplay pickup addendum

The existing master remains unchanged (SHA-256 verified). Additional raw pickups are now available:

- `submission-footage/scenes/gravifire-m4-remaining-samples.webm` and `.mp4`: **81.960 s**, 1920�1080, 25 FPS, no audio. Actual source sample reviews 2-2, 2-3 and 2-4 succeed after the initial 2-1 review; analysis is reached. Key observed times: **00:38.124**, **00:52.801**, **01:07.209**. No campaign-wide completion claim.
- `submission-footage/scenes/gravifire-m0-clean-completion.webm` and `.mp4`: **46.520 s**, 1920�1080, 25 FPS, no audio. Clean completion-ready endpoint; the completion button is deliberately **not activated**. No actual completion is claimed for this take. Prefer 00:28�00:33 and 00:41�00:46.520 for the evidence boundary.
- Both formats of both recommended clips passed full decoding. Actual-video keyframes were inspected; no unintended error screen was observed in those samples. No near-black interval =0.5 s was flagged by the pickup validation scan.
- Original M0 completion clip remains preserved. Its approximately **00:41�00:59** error interval remains unusable; the later Dossier shows persisted completion after separate navigation.

See **submission-footage/editor-pickup-guide.md** for exact event timestamps, best edit windows, preserved unsuccessful takes, scientific caveats and remaining missing footage. See **submission-footage/pickup-validation.json** for measured metadata and master integrity. The first unsuccessful M4 pickup is retained separately; the preferred M4 filename contains the successful second take. No master recording, application code, NASA data, campaign state schema, dependencies or running service was changed.
