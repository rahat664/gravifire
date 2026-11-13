# GRAVIFIRE Final Video Shot List

Operational capture list for the 04:00 plan in `docs/FINAL_VIDEO_PRODUCTION_PLAN.md`.

All statuses begin as `NOT CAPTURED`. Review shortcuts are development-only and must not mutate campaign storage.

| Shot ID | Time in final video | Route / source | State | Action | Camera | On-screen text | Duration | Audio / narration | Science check | Status |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| P01 | 00:00–00:06 | Editor + credited source | Cold open | Earth test card to source fire contrast | Full frame | `PASSED · EARTH TEST` → `SAFE IN SPACE?` | 6 s | Hook VO/music | Card is editorial, not NASA certification | NOT CAPTURED |
| P02 | 00:06–00:12 | Editor | Title | Logo reveal | Centered | `GRAVIFIRE · TEAM NEURAVESTA · NASA SPACE APPS 2026` | 6 s | Music only | Confirm registration spelling | NOT CAPTURED |
| P03 | 00:12–00:35 | Team footage | Team introduction | Individual names, group hold | Eye-level locked | Elias; Rahat; Asif; Fatema; Nur; Team NeuraVesta | 23 s | Team VO | Names must match registration | NOT CAPTURED |
| P04 | 00:35–00:40 | Team footage | Origin handoff | Cloth/flame detail | Macro/locked | Optional `A QUESTION ABOUT FIRE` | 5 s | VO handoff | Not NASA evidence | NOT CAPTURED |
| P05 | 00:40–01:20 | Official/source + team | Why | Earth/microgravity context | Match framing | Context labels and source credit | 40 s | Origin VO | Never imply generated imagery is NASA footage | NOT CAPTURED |
| P06 | 01:20–01:46 | Mission Control / Evidence Explorer | Archive problem | Show distributed investigation/source context | Clean screen capture | BASS, BASS-II, SAFFIRE-I, SAFFIRE-II | 26 s | Problem VO | Use only verified counts/labels | NOT CAPTURED |
| P07 | 01:46–02:00 | `/mission-control/play/m0?review=1&stage=incident` | M0 incident | Hold astronaut, small fictional incident, stations | Third-person behind/right; stop with all stations visible | `FICTIONAL INCIDENT`; `NOT A NASA REPLAY` | 14 s | Fictional incident VO | No garment microgravity match is claimed | NOT CAPTURED |
| P08 | 02:00–02:20 | `/mission-control/play/m1?review=1&stage=analysis` | M1 analysis | Load and hold comparison wall | Approved hero framing | S1 Concurrent 420 s; S2 Opposed 70 s; 20 cm/s; Recorded Burn Time | 20 s | Evidence VO | Not extinction time; not universal law | NOT CAPTURED |
| P09 | 02:20–02:38 | `/mission-control/play/m4?review=1&stage=analysis` | M4 analysis | Hold Complete versus low-g contrast | Astronaut lower corner; wall unobstructed | Silicone; SAFFIRE-II / PSI-99; Complete; Insignificant; ~0 | 18 s | Evidence VO | Do not say PDMS or universal silicone rule | NOT CAPTURED |
| P10 | 02:38–02:46 | `/mission-control/play/m4?review=1&stage=samples` | Four samples | Wide hold across sample wall | Straight-on or slight pan | 2-1, 2-2, 2-3, 2-4; `037 mm`; `SOURCE REVIEW REQUIRED` | 8 s | Provenance VO | Preserve raw text | NOT CAPTURED |
| P11 | 02:46–02:56 | `/mission-control/dossier` or `/experiments` | Source drawer | Open one evidence reference | Static after click | Investigation, run ID, raw value, provenance | 10 s | Trust VO | No invented citation | NOT CAPTURED |
| P12 | 02:56–03:10 | Dossier / EMBER | Explanation | Show short evidence-grounded message | Static | Sources shown; limits kept | 14 s | EMBER/VO | LLM communicates, not computes truth | NOT CAPTURED |
| P13 | 03:10–03:30 | `/mission-control/play/m6?review=1&stage=boundary` | M6 boundary | Approach and stop at door | Third-person behind/right | Mars Habitat Condition; ≈ 0.38 g; Current Evidence Review | 20 s | Boundary question VO | Context only; no prediction | NOT CAPTURED |
| P14 | 03:30–03:48 | `/mission-control/play/m6?review=1&stage=refusal` | M6 refusal | Let refusal and memo settle | Astronaut and installations visible | `REFUSAL`; no matching combined-condition evidence in current archive | 18 s | Calm refusal VO | Scoped current archive wording | NOT CAPTURED |
| P15 | 03:48–03:52 | `/lab` | Lab | Show normal representational flame | Normal Lab camera | `REPRESENTATIONAL VISUALIZATION · NO PREDICTION` | 4 s | Lab distinction VO | Not predictive fire behavior | NOT CAPTURED |
| P16 | 03:52–03:56 | `/mission-control/play/m6?review=1&stage=refusal` or Dossier | Next experiment | Hold memo/evidence gap | Static | Missing match; proposed next experiment | 4 s | Next-experiment VO | Do not claim NASA commitment | NOT CAPTURED |
| P17 | 03:56–04:00 | Editor | End card | Fade to black | Centered | `IT KNOWS WHEN NASA EVIDENCE IS NOT ENOUGH` | 4 s | Music only | Memory line only | NOT CAPTURED |

## Capture checklist per shot

- [ ] Correct route and stage loaded.
- [ ] Product is PlayCanvas where the route is canonical.
- [ ] No browser chrome, DevTools, Next overlay, console, FPS, coordinates, or debug logs.
- [ ] Cursor leaves important text after interaction.
- [ ] Astronaut is visible in gameplay shots where required.
- [ ] Hero values and caveats are readable at 1920×1080.
- [ ] No camera clipping or wall occlusion.
- [ ] Review mode did not write campaign state.
- [ ] Voice-over does not overstate the source.
- [ ] NASA/source visual has a recorded credit.
- [ ] Clip is backed up with route/state metadata.

## Route notes

- M0 approved review states: `incident`, `response`, `archive`.
- M1 approved review states: `replay`, `analysis`. Use `/mission-control/play/m1?review=1` for preparation; current source does not accept `stage=prep`.
- M4 approved review states: `material`, `ground`, `lowg`, `samples`, `analysis`.
- M6 approved review states: `manifest`, `evidence`, `airlock`, `boundary`, `refusal`.
- `/lab`, `/mission-control/dossier`, and `/experiments` are product routes, not campaign review stages.
- `?engine=r3f-legacy` is never a canonical capture route.
