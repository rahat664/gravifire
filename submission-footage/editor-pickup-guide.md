# GRAVIFIRE editor pickup guide

**Use the existing master plus these separate raw pickups. No final edited video has been created.**

## Existing master � unchanged

`D:\gravifire\submission-footage\gravifire-complete-raw-master.mp4`

8:24.960, 1920�1080, 25 FPS, no audio. Its SHA-256 and the original WebM hash were checked against the previous validation and remain unchanged. Do not replace this master with a pickup. Existing master scene timestamps remain valid.

## Recommended pickup files

| Pickup | WebM original / MP4 copy | Duration | Size in bytes (WebM / MP4) | Result |
|---|---|---|---|---|
| gravifire-m4-remaining-samples | D:\gravifire\submission-footage\scenes\gravifire-m4-remaining-samples.webm<br>D:\gravifire\submission-footage\scenes\gravifire-m4-remaining-samples.mp4 | 81.960 s | 21530930 / 10831159 | All four sample rows reviewed; analysis reached |
| gravifire-m0-clean-completion | D:\gravifire\submission-footage\scenes\gravifire-m0-clean-completion.webm<br>D:\gravifire\submission-footage\scenes\gravifire-m0-clean-completion.mp4 | 46.520 s | 10564300 / 5243389 | Completion-ready endpoint only; completion NOT activated |

All four recommended files are 1920�1080 at native 25 FPS with no audio stream. WebM is VP9; MP4 is H.264/yuv420p. Every file passed a full FFmpeg decode. No =0.5 s near-black interval was detected at the stated scan threshold. Actual-video frames at the key events were inspected; this is sampled visual review, not exhaustive human playback.

## M4 usable moments and exact observed event timestamps

Source: **SAFFIRE-II / PSI-99**, source sample IDs **2-1, 2-2, 2-3, 2-4**. Sample 2-1 was already reviewed in master GAME-04 (06:42�07:29). The new successful take repeats the genuine earlier interactions to reach the remaining sample consoles, without seeding saved state or overriding stages.

| Clip-relative edit window | Observed event time | Actual footage |
|---|---|---|
| 00:24�00:29 | 00:26.457 | 2-1 reviewed for context; counter 1/4 |
| 00:36�00:41 | 00:38.124 | Actual click reviews 2-2; counter 2/4; PSI-99 source CSV row-3 citation visible |
| 00:51�00:56 | 00:52.801 | Actual click reviews 2-3; counter 3/4; PSI-99 source CSV row-4 citation visible |
| 01:00�01:05 | 01:02.234 (approach/initial click) | Readable 2-4 source card, including SOURCE REVIEW REQUIRED note |
| 01:05�01:10 | 01:07.209 | Successful 2-4 click advances from 3/4 to analysis; no persistent 4/4 counter is displayed |
| 01:13�01:21.960 | 01:16.481 and 01:20.870 | Reachable source comparison; four source rows reviewed / comparison ready |

Event times are measured recording-clock observations after inputs; editing windows include the actual interactions. Allow approximately one second around boundaries and consult the supplied actual-video frames. M4 uses the existing development review entry without a stage parameter. It is not a sequentially unlocked campaign-completion recording.

**M4 completion status:** the remaining three sample reviews succeeded through actual mouse clicks after walking past the intervening bulkhead. The reachable analysis state is captured. No campaign-level completion button/state transition is asserted. The word �Complete� on the 1-g reference panel is a source result, not a mission completion badge or material-safety finding.

Some projected scientific labels overflow their panel borders, and the analysis camera partly intersects existing geometry. These are genuine application visuals; no rendering/code changes were made for the pickups. Prefer the readable individual sample views above.

## M0 clean endpoint

**This take is COMPLETION-READY, NOT ACTUAL COMPLETION.** All three inspections and the operational response were genuinely reached. Recording stops before activating COMPLETE M0, avoiding the known post-completion error rather than hiding or repairing it.

| Clip-relative edit window | Observed event time | Actual footage |
|---|---|---|
| 00:13�00:16 | 00:14.244 | Incident inspection begins |
| 00:17�00:20 | 00:18.805 | Heater inspected, counter 1/3 |
| 00:20�00:23 | 00:21.631 | Garment inspected, counter 2/3 |
| 00:23�00:27 | 00:24.662 | Vent inspection finishes; response objective appears |
| 00:28�00:33 | 00:29.449 | Real operational response; evidence limitation boundary appears |
| 00:41�00:46.520 | 00:45.889 | Clean final evidence boundary with completion button visible but unactivated |

Do not narrate this clean take as the final completion/unlock transition. The older clip below contains the actual completion activation and later persisted Dossier state, with a bad navigation interval that must not be used as a valid demonstration.

## Older M0 footage � preserved, with an unusable interval

`submission-footage/scenes/m0-supplement/m0-real-progression.webm` and matching `.mp4` remain unchanged. Duration 64.760 seconds.

- Approximately **00:41�00:59**: exclude from usable demonstration. It includes the post-completion �GRAVIFIRE could not load this view� error; original samples show it at 42, 44, 46, 48 and 50 seconds.
- Approximately **00:62�00:64.760**: later Dossier shows M0 complete and FM-01 unlocked, after a separate direct navigation. Do not imply the preceding route transition was successful.
- The old clip and its error were not deleted, overwritten, or silently substituted.

## Preserved original takes and validation

- `scenes/m4-console-approach-original/`: successful native original, screenshots and measured interaction log.
- `scenes/gravifire-m4-console-approach.webm`: identical named copy of the successful M4 take; preferred filename above contains the same bytes.
- `scenes/m4-pickup-original/` and `scenes/gravifire-m4-remaining-samples-attempt1.webm`: first unsuccessful attempt retained; it remains at 1/4 and is not recommended for editing. The new successful take was copied to the preferred name only after preserving this attempt under its own name; no source bytes were overwritten.
- `scenes/m0-clean-pickup-original/`: clean M0 native original, screenshots and measured interaction log.
- `scenes/pickup-validation-frames/`: actual-video frame samples confirming sample IDs/counters, analysis and clean M0 endpoint.
- `pickup-validation.json`: metadata, file sizes, checksums, decode logs, master integrity and completion limitations.

## Scientific and remaining-footage cautions

Keep �SOURCE REVIEW REQUIRED� and source-specific uncertainty visible, especially for sample 2-4; do not silently normalize ambiguous source fields. Source results do not certify silicone or any other material as safe. Fictional Vesta gameplay is distinct from NASA SAFFIRE evidence. No new observations, predictions or outcomes were generated.

Remaining missing footage: a clean actual post-M0-completion navigation/unlock sequence and campaign-wide completion footage. These pickups resolve the three missing M4 sample reviews but do not establish campaign completion. The existing M0 navigation error remains unresolved; no application code was changed to conceal it. No music/narration, upload, submission or final edited video was produced.
