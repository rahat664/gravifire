# GRAVIFIRE Final Video Production Plan

Status: planning only. No footage has been recorded or marked captured by this plan.

Working branch: `integration/game-merge`

Starting product commit: `6f6ca19`

## 1. Source documents consulted

### Primary video and capture sources

| Document | Purpose | Status | Requirements used |
| --- | --- | --- | --- |
| `scripts/NSAC Script 2026 240s v2.md` | Latest full storyboard and narration draft | Current working video guide | 240-second runtime, cold open, team introduction, Riti origin, WHO → WHY → WHAT → HOW → PROOF → SO WHAT, title/end cards, NeuraVesta naming, beat timings |
| `Gravifier_research/R6_TRANSLATION/video_script_v2.md` | Fully evidenced research-track script | Older research canon; not the capture route | 240-second budget, claim-to-source discipline, protected 15-second wow, memory line, proof and provenance requirements |
| `scripts/240s_video_screen_build_list.md` | Screen-build priorities derived from the newer 240-second script | Current supporting build note, but partly obsolete for the approved product | Capture priority, lineage/source drill-down, refusal, proof, game corridor fallback |
| `docs/JUDGE_DEMO_SCRIPT.md` | Judge-facing interactive demo script | Current supporting demo guide, separate from the final submission video | 3:30–4:30 live demo target, evidence story, current scoped refusal language, Dossier handoff, emergency versions |
| `docs/DEMO_RECORDING_CHECKLIST.md` | Recording setup and clip checklist | Current operational checklist | Clean browser, 1920×1080 preference, pointer lock, clips, simple captions, no misleading scientific editing |
| `docs/FINAL_DEMO_CAPTURE_CHECKLIST.md` | Approved current product capture states | Current and most relevant product capture checklist | Exact M0/M1/M4/M6/Lab/Dossier routes and review-mode safety |
| `docs/SUBMISSION_SCREENSHOTS.md` | Submission screenshot requirements | Current visual/source checklist | 16:9, no dev overlays, preserve NASA IDs and caveats, approved evidence moments |

### Product and campaign support

| Document | Purpose | Status | Video relevance |
| --- | --- | --- | --- |
| `docs/FINAL_PRODUCT_STATE.md` | Current canonical product architecture and science locks | Current | Confirms PlayCanvas M0/M1/M4/M6, review restrictions, deferred work, canonical evidence wording |
| `docs/FINAL_PRODUCT_POLISH_AUDIT.md` | Final product route and UX audit | Current | Route purposes, loading/error boundaries, demo risks, known deferred payload work |
| `docs/FINAL_CAMPAIGN_RUN_CHECKLIST.md` | Fresh-state end-to-end campaign procedure | Current | Confirms real progression and persistence checks; not a substitute for visual review shortcuts |
| `docs/MISSION_CONTROL_DEMO_QA.md` | Manual gameplay/demo QA | Current supporting QA | Controls, pause/restart, route checks, demo mode, Dossier and Lab links |
| `Setup docs/decision_gate.md` | Winner shape and demo contract | Current strategy authority | One user, NASA data, visible trust mechanism, refusal, provenance, six demo beats, WHO → WHY → WHAT → HOW → PROOF → SO WHAT |
| `Setup docs/roadmap.md` | Dependency and video-track plan | Historical planning source with current sequencing value | 240-second video track, concept-to-final edit distinction, script before screens |
| `Setup docs/strategy_agenda.md` | Deadlines and open submission questions | Current planning source but contains unverified deadline assumptions | 240-second internal target and instruction to verify official Space Apps rules |
| `requirements.md` | Original project requirements/work record | Historical baseline | NASA families, provenance, dashboard goal, evidence synthesis rather than prediction |
| `Setup docs/game_story_and_choices.md` | Original campaign story design | Historical design source; many older mission details | Fictional ISV Vesta premise, EMBER, refusal as content, campaign tone |
| `Setup docs/material_catalog_and_experiment_game.md` | Earlier experiment-game contract | Historical and partly superseded | No-overclaim visual contract and refusal behavior; older PDMS naming must not override current M4 copy |
| `Study Materials/space_apps_winning_strategy_study_pack.md` | Strategy study | Supporting strategy source | Narrow problem, NASA dependency, memorable mechanism, avoid feature overload |
| `Setup docs/anti-ai-writing-style.md` | Repository writing rules | Current | Direct prose, no hype language, evidence-linked claims |

### Supporting implementation references found

| Document/source | Status | Use |
| --- | --- | --- |
| `src/app/video-demo/page.tsx` and `src/components/video-demo/VideoDemoClient.tsx` | Implemented but separate R7 presentation surface | Optional provenance/lineage reference only; not the canonical campaign capture route |
| `tests/r7-video.test.ts` | Current test coverage | Confirms the separate R7 video surface; not a video requirement |
| `Gravifier_research/R5_FINDINGS_DIGEST.md` and R7 handover digest | Current evidence research | Claim guardrails and source-backed values |
| `Gravifier_research/R6_TRANSLATION/DEVELOPER_DOCUMENT.md` and `Gravifier_research/R7_HANDOVER/docs/DEVELOPER_DOCUMENT.md` | Current/previous implementation contracts | Evidence and render-boundary rules |
| `Gravifier_research/R7_HANDOVER/docs/game_story_and_choices.md` and `material_catalog_and_experiment_game.md` | Current handover copies | Context only; use approved runtime rather than older planned labels |

The repository search also found many data, ingestion, and research files containing the word “video” or “demo.” They are source/evidence implementation documents, not video-production guides, and are not treated as scheduling authorities.

## 2. Canonical interpretation and conflicts

The plan uses this precedence:

1. Current approved runtime and `docs/FINAL_DEMO_CAPTURE_CHECKLIST.md` for what can actually be recorded.
2. `scripts/NSAC Script 2026 240s v2.md` for the 240-second story schedule and team treatment.
3. `Gravifier_research/R6_TRANSLATION/video_script_v2.md` and `Setup docs/decision_gate.md` for claim discipline and evidence structure.
4. `docs/JUDGE_DEMO_SCRIPT.md` for live-demo phrasing, not the submission runtime.
5. Older scripts and story drafts only for reusable context.

### Conflict A: duration

- The two script v2 documents specify 240 seconds.
- `docs/JUDGE_DEMO_SCRIPT.md` specifies a 3:30–4:30 live judge demo and includes 2-minute and 60-second emergency versions.
- `Setup docs/strategy_agenda.md` and `Setup docs/decision_gate.md` describe 240 seconds as an internal submission/deadline target, while also saying official 2026 rules must be confirmed.

Interpretation: the final submission video plan is 4:00. The live judge demo is a separate 3:30–4:30 activity. The repository does not contain an authoritative official Space Apps portal rule proving that 240 seconds is the current maximum.

### Conflict B: product surface

- R6 and the screen-build list describe a Certification Queue, R7 precomputed verdict screens, and a generic Virtual Laboratory comparison.
- The approved product is now a PlayCanvas campaign with M0, M1, M4, M6, Mission Control, Dossier, Evidence Explorer, and the existing Lab.

Interpretation: use the approved PlayCanvas routes. Use the R7 surface only for a clean provenance/lineage fallback if it is explicitly labeled as the separate precomputed evidence presentation.

### Conflict C: M4 terminology

- Older R6 and story documents use `PDMS` as the material label.
- Current approved M4 runtime uses `SILICONE`, `SAFFIRE-II / PSI-99`, and preserves raw `037 mm`.

Interpretation: all final video narration and overlays use `Silicone`. `PDMS` is prohibited in the M4 product story.

### Conflict D: team identity

- `scripts/NSAC Script 2026 240s.md` names Team Yottabyte, Barisal, and spells `Ashif Elahi`.
- The newer `scripts/NSAC Script 2026 240s v2.md`, `LICENSE`, and current repository identity use Team NeuraVesta, Rangpur Division, Bangladesh, and `Asif Elahi`.

Interpretation: use Team NeuraVesta and the newer spelling. Confirm the registration record before final export because the script itself says the name must match the Space Apps registration.

### Conflict E: M1 review shortcut

- The user-supplied capture list includes `m1?review=1&stage=prep`.
- Current source dispatch accepts M1 review stages `replay` and `analysis`; the preparation state is reached through `/mission-control/play/m1?review=1` without `stage=prep`.

Interpretation: capture M1 preparation from the canonical review route without `stage=prep`, then use `stage=analysis` for the hero comparison. Do not put the unsupported `stage=prep` URL into the capture run.

## 3. Repository-defined video requirements

These are extracted from repository documents, not new recommendations.

### Runtime and structure

- Target a 240-second submission video.
- Use a problem-first story. The strategy contract is WHO → WHY → WHAT → HOW → PROOF → SO WHAT.
- Protect an immediately understandable demo moment. The R6 guide calls for a 15-second wow: scenario/input → NASA evidence → method/verdict.
- Show the product working on real/current system output where the current build supports it.
- Use simple captions and avoid excessive cinematic effects.
- Do not speed up or edit scientific numerical displays in a misleading way.
- Preserve source IDs, raw values, and limitations on screen.
- Use clean 16:9 captures where possible. `docs/DEMO_RECORDING_CHECKLIST.md` prefers 1920×1080.
- Hide browser chrome, DevTools, debug overlays, FPS, coordinates, console, and browser error indicators.
- Keep the review badge only when internal reviewers need to identify review mode. Remove it from the final export if it reads as development tooling and the shot can be captured safely without it.
- The main video should not be a feature list. It should show a user question, evidence, decision boundary, and next experiment.

### Story and product expectations

- Introduce a fire-safety/materials user and the problem of transferring Earth-tested fire assumptions to space.
- Explain that NASA evidence spans multiple investigations and conditions.
- Show GRAVIFIRE as an evidence engine/system, not a flame predictor.
- Show at least one source comparison, one provenance drill-down, one refusal, and one next-experiment/evidence-gap output.
- Keep the fictional mission clearly separate from real NASA evidence.
- End on the memory mechanism: the system knows when the evidence is not enough.

### Current canonical evidence moments

- M0: fictional incident, not a NASA replay; no matching garment microgravity evidence in the current archive.
- M1: SAFFIRE-I / PSI-98, S1 Concurrent and S2 Opposed, both 20 cm/s airflow, recorded burn times 420 s and 70 s, not a universal control law.
- M4: Silicone, SAFFIRE-II / PSI-99; 2-1 1-g reference Complete versus low-g Insignificant and approximately 0 low-g burn length; `037 mm` remains raw and carries source-review treatment where shown.
- M6: Mars and approximately 0.38 g are mission context. The system refuses because there is no matching combined-condition evidence in the current GRAVIFIRE archive/current ingested evidence domain.
- Lab: the flame is a representational visualization, not a scientific prediction. Prediction Engine remains not connected where displayed.

### Attribution and source visibility

- Identify NASA experiment families and source/run IDs when the related product screen is shown.
- Keep citations/provenance available through Dossier, Evidence Explorer, or the source drawer.
- Do not present a generated fire image as actual NASA experiment footage.
- NASA imagery needs its source/credit retained in the edit. NASA logos/insignia require separate usage care.

## 4. Production recommendations

These are recommendations for this final plan, not repository-mandated requirements.

- Use the newer 240-second storyboard as the spine, but replace obsolete R7/PDMS shots with the approved campaign scenes.
- Make M1, M4, and M6 the three evidence anchors. Use M0 as the fictional human entry point, not as a scientific result.
- Keep product footage around half the final runtime, with enough hold time for 420 s, 70 s, Complete, Insignificant, ~0, 0.38 g, and the refusal to be read.
- Use one uninterrupted live-looking M0 → Mission Control → evidence workflow only if it is reliable; otherwise use clean clips with motivated transitions.
- Record product clips at 60 fps, then export at the target submission frame rate after checking the official submission rules.
- Use burnt-in captions for critical evidence values even when voice-over names them. Captions should reinforce, not replace, readable source UI.
- Prefer restrained ambient sound and a quiet bed under scientific beats. Do not use alarm-heavy sound design for M6 refusal.

## 5. Final story arc

The video has one question:

> Can an Earth-tested fire-safety assumption be trusted in space?

The answer is not a single prediction. GRAVIFIRE moves from an incident, to real source records, to a contrast that breaks intuition, to a refusal when the combined condition is missing, and then to the next experiment.

1. **Hook:** a clean Earth “passed” assumption meets a space-fire question.
2. **Human origin:** the team’s Riti story makes the question memorable without claiming it is NASA evidence.
3. **Problem:** real NASA combustion evidence is distributed across investigations, source tables, and conditions.
4. **Mechanism:** GRAVIFIRE lets a fire-safety officer move through a fictional mission while preserving evidence and provenance.
5. **Proof:** M1 records 420 s versus 70 s under named flow conditions; M4 shows Complete versus Insignificant / ~0 for Silicone under distinct evidence contexts.
6. **Trust:** Dossier/source drill-down shows where values came from.
7. **Boundary:** M6 refuses a Mars combined-condition inference because the current archive has no matching evidence.
8. **So what:** the missing condition becomes a next-experiment question, not an invented answer.

## 6. Timestamped master video plan, 04:00 total

This schedule follows `scripts/NSAC Script 2026 240s v2.md` while using current approved product routes.

| Time | Scene | Visual | Narration purpose | On-screen text | Route/source | Capture / transition | Science note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 00:00–00:06 | Cold open | Editor-made Earth test sheet marked `PASSED` cuts against credited NASA/source fire imagery | Ask the central question immediately | `PASSED · EARTH TEST` → `SAFE IN SPACE?` | Official/source imagery plus generated editorial card | Motion graphic, hard cut, no product UI | Do not imply the sheet is a real NASA certification |
| 00:06–00:12 | Title | GRAVIFIRE logo/title on black | Establish project and event | `GRAVIFIRE · TEAM NEURAVESTA · NASA SPACE APPS 2026` | Generated title card | Music-only hold | Confirm team registration name |
| 00:12–00:35 | Team | Individual team clips or one group shot with lower thirds | Who built it | Elias Ur Rahman; Rahat Kabir Dhrubo; Asif Elahi; Fatema Khanom; Nur Hossain Mahruf | Team footage | Direct cuts, group hold at end | Team names must match registration |
| 00:35–00:40 | Origin handoff | Match/flame/cloth detail, clearly team footage or representational B-roll | Make the question human | `A QUESTION ABOUT FIRE` | Team footage / representational | Match cut into NASA/source material | Do not present as an experiment result |
| 00:40–01:20 | Why microgravity | Cloth story transitions to credited NASA/source 1-g and microgravity imagery | Explain why gravity changes the question | `EARTH CONTEXT` / `MICROGRAVITY CONTEXT` | Official/source visuals plus team footage | Slow cross-dissolves | Keep “context” separate from measured claims |
| 01:20–01:46 | Archive problem | Investigation folders, source tables, Mission Control queue, Evidence Explorer | Explain distributed evidence and user pain | `BASS · BASS-II · SAFFIRE-I · SAFFIRE-II` | Product/source screen capture | Layered screen movement | Use only verified counts/labels if shown |
| 01:46–02:00 | M0 fictional entry | M0 incident wide shot, small fictional fire, astronaut and stations | Introduce the playable mission without confusing it with NASA evidence | `FICTIONAL INCIDENT` / `NOT A NASA REPLAY` | `/mission-control/play/m0?review=1&stage=incident` | Static hold plus short camera move | Current archive has no matching garment microgravity evidence |
| 02:00–02:20 | M1 evidence comparison | M1 analysis wall, pause on both physical displays | Show the first decisive source contrast | `S1 · CONCURRENT · RECORDED BURN TIME · 420 s`; `S2 · OPPOSED · RECORDED BURN TIME · 70 s`; `20 cm/s` | `/mission-control/play/m1?review=1&stage=analysis` | Slow push or static capture | Never say extinction time or universal control law |
| 02:20–02:38 | M4 contradiction | M4 analysis hero wall, then sample wall | Show a second material/context contrast | `SILICONE · SAFFIRE-II / PSI-99`; `1-g REFERENCE · COMPLETE`; `LOW-g · INSIGNIFICANT · ~0` | `/mission-control/play/m4?review=1&stage=analysis` and `stage=samples` | Match cut from one evidence wall to the other | Preserve source scope; do not use PDMS |
| 02:38–02:46 | Raw provenance | Tight sample-wall hold on 2-4 | Demonstrate that inconvenient source text is preserved | `037 mm · SOURCE REVIEW REQUIRED` | `/mission-control/play/m4?review=1&stage=samples` | Digital zoom only if it does not distort text | Keep raw value unchanged |
| 02:46–02:56 | Source connection | Dossier or Evidence Explorer source drawer | Answer “why should I trust this number?” | Investigation, run ID, raw value, provenance | `/mission-control/dossier` or `/experiments` | Click/open drawer, hold readable | Cite actual displayed source; no invented file row |
| 02:56–03:10 | EMBER / limitation | Short EMBER evidence message, then Dossier gap | Show communication layered over evidence | `EMBER · SOURCES SHOWN · LIMITS KEPT` | Dossier/current product | Clean replacement, not stacked text | LLM communicates; it does not create facts |
| 03:10–03:30 | M6 boundary | Heavy boundary door with Mars context | Ask the future-mission question | `MARS HABITAT CONDITION · ≈ 0.38 g · CURRENT EVIDENCE REVIEW` | `/mission-control/play/m6?review=1&stage=boundary` | Approach and stop before interaction | 0.38 g is mission context only |
| 03:30–03:48 | M6 refusal | Refusal installation and memo | Make refusal the memorable mechanism | `REFUSAL`; `NO MATCHING COMBINED-CONDITION EVIDENCE IN CURRENT GRAVIFIRE ARCHIVE` | `/mission-control/play/m6?review=1&stage=refusal` | Let the reveal breathe; no alarm cut | No Mars flame prediction, safe/unsafe label, or broad NASA-history claim |
| 03:48–03:56 | Lab / next experiment | Lab parameter-reactive fire, then memo or Dossier next-experiment view | Distinguish visualization from evidence and show what comes next | `REPRESENTATIONAL VISUALIZATION · NO PREDICTION`; `NEXT EXPERIMENT` | `/lab` and M6 memo/Dossier | Short crossfade | Lab is not a predictive model |
| 03:56–04:00 | End card | Black end card with restrained logo | Leave the memory line | `IT KNOWS WHEN NASA EVIDENCE IS NOT ENOUGH`; GRAVIFIRE; Team NeuraVesta | Generated editorial card | Music-only fade | Do not add unsupported promise |

## 7. Shot-by-shot capture plan

All planned statuses are `NOT CAPTURED`.

| ID | Route/source | State and action | Camera/stop | Must read | Hold | Capture type |
| --- | --- | --- | --- | --- | --- | --- |
| P01 | Editor/source | Build cold-open contrast | Full-frame | Question and source credit | 6 s | Generated/edit |
| P02 | Editor | Logo/title card | Centered | GRAVIFIRE, NeuraVesta, event | 6 s | Generated/edit |
| P03 | Team footage | Five lower-thirds plus group frame | Eye-level, locked | Names/team | 23 s | Human footage |
| P04 | Team footage | Riti cloth/flame origin | Macro/locked | No scientific result label | 5 s | Human/representational |
| P05 | Source visuals | NASA 1-g versus microgravity context | Match framing | Credits/context labels | 40 s | Official/source + edit |
| P06 | Product/source | Archive problem montage | Screen capture | Investigation families and source context | 26 s | Product/source capture |
| P07 | `/mission-control/play/m0?review=1&stage=incident` | Leave astronaut foreground, incident midground, hold without interacting | Behind/right shoulder; stop with all stations visible | FICTIONAL INCIDENT; NOT A NASA REPLAY | 10 s | Live screen recording |
| P08 | `/mission-control/play/m1?review=1&stage=analysis` | Load stage, let wall settle, no cursor over values | Approved hero framing | 420 s, 70 s, Concurrent, Opposed, 20 cm/s | 20 s | Live screen recording |
| P09 | `/mission-control/play/m4?review=1&stage=analysis` | Load stage, hold hero wall | Astronaut lower corner, wall unobstructed | Complete versus Insignificant / ~0 | 18 s | Live screen recording |
| P10 | `/mission-control/play/m4?review=1&stage=samples` | Wide hold or slight pan across four stations | Keep 2-1 through 2-4 in frame | 037 mm and SOURCE REVIEW REQUIRED | 8 s | Live screen recording |
| P11 | `/mission-control/dossier` or `/experiments` | Open one citation/source drawer | Cursor moves only during click, then exits | Source, run ID, raw value, provenance | 10 s | Live screen recording |
| P12 | Dossier/EMBER | Show short evidence-grounded message | Static | Limits kept / source trace | 8 s | Live screen recording |
| P13 | `/mission-control/play/m6?review=1&stage=boundary` | Walk/stop at heavy door | Third-person behind/right, full door | 0.38 g context and current evidence review | 20 s | Live screen recording |
| P14 | `/mission-control/play/m6?review=1&stage=refusal` | Let refusal sequence and memo settle | Astronaut and both physical installations visible | REFUSAL and scoped archive limitation | 18 s | Live screen recording |
| P15 | `/lab` | Change one parameter only if it helps demonstrate live response; do not show generated numbers | Normal Lab framing | Representational visualization · no prediction | 8 s | Live screen recording |
| P16 | M6 memo/Dossier | Show evidence gap/next experiment | Static, readable | Missing match and proposed experiment | 8 s | Live screen recording |
| P17 | Editor | Closing end card | Centered | Memory line, logo, team | 4 s | Generated/edit |

### Capture rules for product shots

- Start each route in a clean browser profile or controlled demo state. Review shortcuts are for visual capture only and must not alter campaign storage.
- Hide the cursor after each interaction. Do not leave it on a number, source ID, or refusal text.
- Use the approved camera composition. Do not add cinematic camera movement that introduces clipping.
- Hold the scene long enough for a judge to read the hero value. Do not cover key text with narration captions.
- Capture a clean plate and a narration-friendly take for each shot where possible.
- Keep `REVIEW MODE · PLAYCANVAS` only for internal review. For final export, use the cleanest capture that remains clearly a valid approved route.

## 8. Hero shots

| Hero | Why it earns time |
| --- | --- |
| M0 fictional incident | Makes the product a mission rather than a dashboard and establishes the boundary between a fictional event and NASA evidence. |
| M1 420 s versus 70 s | The fastest proof that GRAVIFIRE preserves conditions and compares real records rather than producing generic fire advice. |
| M4 Complete versus Insignificant / ~0 | Shows a material/context contrast that challenges intuition while retaining the Silicone/PSI-99 scope. |
| M4 four-sample wall | Demonstrates that the product does not flatten four source rows into one universal material claim. |
| M6 boundary door | Turns the evidence-domain limit into a visible future-mission question. |
| M6 refusal and memo | The standout mechanism: refusal is a useful result that names the missing evidence and next experiment. |
| Dossier/source drawer | Makes provenance inspectable and gives judges a concrete trust mechanism. |
| Lab | Shows a separate representational visualization surface without confusing it with scientific output. It gets less time than the evidence scenes. |

## 9. Team and human footage plan

The newer current team identity in the repository is **Team NeuraVesta**. The current script names:

- Elias Ur Rahman
- Rahat Kabir Dhrubo
- Asif Elahi
- Fatema Khanom
- Nur Hossain Mahruf

Recommended treatment:

- One 4:3 or 16:9 group shot for the opening and closing context.
- Individual 2–3 second clips or a split-screen roll call for each member, with restrained lower thirds.
- Total team segment: approximately 23 seconds, matching the 240-second storyboard.
- The Riti story is a short human-origin insert, approximately 5 seconds of visual handoff plus the 40-second story beat. It should be filmed as team/family-origin footage or clearly labeled representational B-roll, not NASA evidence.
- No individual member needs a long interview unless the team has existing footage. The repository does not prove that any team footage exists.
- Confirm the team registration spelling and division before recording. The older script conflicts on both team name and one member spelling.

## 10. Narration map, not final script

This is a message map. It is intentionally not a final read.

| Time | Key message | Approx. words | Tone | Speaker | Constraint |
| --- | --- | ---: | --- | --- | --- |
| 00:00–00:12 | Earth-tested assumptions lead to a space question; identify GRAVIFIRE | 12–18 | Tense, clean | VO | Do not call the card NASA certification |
| 00:12–00:40 | Team identity and Riti origin | 55–65 | Human, warm | Elias or assigned narrator | Do not present family story as NASA evidence |
| 00:40–01:20 | Fire changes with context; microgravity makes transfer difficult | 80–95 | Curious, grounded | VO | Keep NASA/source footage credited |
| 01:20–01:46 | Archives are distributed; this is the user problem | 55–65 | Direct | VO | Do not claim a number unless source-approved |
| 01:46–02:00 | Fictional M0 incident introduces operational decision under uncertainty | 25–35 | Urgent but controlled | VO | “Not a NASA replay”; no guaranteed response |
| 02:00–02:20 | M1 records 420 s and 70 s under named conditions | 45–55 | Evidentiary | VO | Recorded burn time, not extinction time; not universal |
| 02:20–02:46 | M4 shows Silicone / PSI-99 contrast and preserves 037 mm | 55–70 | Surprising, careful | VO | No PDMS, no universal silicone claim |
| 02:46–03:10 | Provenance and EMBER show why the system can be trusted | 40–50 | Assured | VO | Source/run IDs must be visible |
| 03:10–03:48 | Mars context leads to scoped refusal | 55–65 | Calm climax | VO | No “NASA never tested partial gravity”; no Mars prediction |
| 03:48–04:00 | Lab distinction, next experiment, memory line | 20–28 | Resolute | VO/silence | Lab is representational; refusal is useful |

Reusable text: the memory line `It knows when NASA evidence is not enough.` is explicitly protected by the R6 script and should be spoken once at the close. The current `docs/JUDGE_DEMO_SCRIPT.md` phrasing about “current archive,” “source records,” and “refuses to invent the fire” is suitable for light adaptation after checking each shot.

## 11. NASA/source visual plan

| Visual | Classification | Current repository status | Use |
| --- | --- | --- | --- |
| SAFFIRE/BASS representative frames | Official NASA/source | The v2 script points to `psidata/PSI-25/Representative Image(s)/` and SAFFIRE image data on disk; tracked media inventory did not prove final video files | Use only after confirming local file, credit, and source ID |
| M1 source values | GRAVIFIRE product backed by NASA source | Present in approved PlayCanvas and evidence data | Record product display with source IDs |
| M4 source rows | GRAVIFIRE product backed by NASA source | Present in approved PlayCanvas and evidence data | Record product display; preserve `037 mm` warning |
| M6 archive boundary | GRAVIFIRE product | Present in approved PlayCanvas | Record scoped refusal; no source claim beyond current domain |
| Dossier/source drawer | GRAVIFIRE product/provenance | Present in current product | Show a real source reference, not a fabricated citation |
| Lab flame | Representational/generated product visualization | Present at `/lab` | Label `Representational visualization · no prediction` |
| Cold-open spec sheet | Generated editorial graphic | Not present as a tracked video asset | Build in editor using no fake NASA certification |
| Team/Riti footage | Team footage | Not found in repository media inventory | Must be supplied/recorded by the team |

Do not present AI-generated or editor-generated imagery as NASA experiment footage. The current tracked repository did not contain MP4/MOV/WebM files or a complete media credit manifest. This is a capture blocker, not a reason to invent assets.

## 12. Editing plan

- **Aspect ratio:** 16:9. Use 1920×1080 capture unless official submission instructions require another size.
- **Frame rate:** capture product footage at 60 fps where practical; confirm final export FPS in the editor and against official rules.
- **Runtime:** exactly 04:00 in the current repository plan. Keep a 2-minute emergency cut as a separate internal deliverable only if time permits.
- **Pacing:** fast in the first 12 seconds, readable holds for evidence numbers, slower reveal for M6 refusal, short close.
- **Title cards:** dark graphite/black, off-white type, restrained cyan/amber accents. Use the existing GRAVIFIRE visual language.
- **Lower thirds:** name, role only if verified, and Team NeuraVesta. Avoid large animated labels over evidence.
- **Product treatment:** use clean screen captures with no browser chrome; use motivated cuts rather than heavy device mockups.
- **Zoom/crop:** only for readability and only when it does not change apparent geometry or hide a caveat. Never zoom a value to imply precision that the UI does not show.
- **Transitions:** hard cuts for the hook and evidence contrasts; short dissolves for team/origin/source footage; no glitch treatment on the refusal.
- **Music:** restrained, low enough for narration and source labels. Let the refusal breathe with reduced music rather than an alarm hit.
- **Sound:** optional room tone, console click, restrained door/airlock cue. Do not use a fire roar or emergency sound that changes the meaning of the controlled M0 incident.
- **Subtitles:** include accessible captions for narration. Keep critical evidence labels in the product frame, not only in subtitles.
- **Readability holds:** hold M1 and M4 hero values for at least 6–8 seconds inside their segment; hold M6 refusal for at least 8 seconds; hold `037 mm` long enough to read the warning.

## 13. Recording order

Record by state and route, not final chronology:

1. M1: analysis hero, then M1 preparation/replay only if needed.
2. M4: analysis hero, sample wall, material/ground/low-g if context is needed.
3. M6: boundary, refusal, memo, then manifest/evidence if the final cut needs setup.
4. M0: incident, response, archive, then corridor.
5. Dossier and Evidence Explorer/source drawer.
6. Virtual Lab normal view and one parameter-reactive transition.
7. Mission Control queue/demo navigation.
8. `/`, `/experiments`, `/ask`, `/landscape`, `/recommend`, `/challenge` only if the edit needs them.
9. Team footage and Riti/origin footage.
10. Title, cold-open, captions, credits, and end card.

This order minimizes repeated engine loading and makes the highest-value approved shots available first.

## 14. Pre-edit quality gates

Every clip must pass:

- 1920×1080 or the verified official target.
- 16:9 framing with no accidental browser chrome.
- No DevTools, Next overlay, console, FPS, coordinates, debug diagnostics, or desktop notifications.
- No cursor over a source ID, hero number, refusal, or limitation.
- Hero values readable at normal video size.
- No camera clipping, wall occlusion, black void, primitive incident-fire regression, or missing astronaut in a gameplay shot.
- Correct route and review stage. Do not capture `engine=r3f-legacy` as canonical product.
- Review badge removed from final export when safe; retain it in internal review masters if needed.
- Current science labels exactly preserved.
- No accidental localStorage mutation from review mode.
- Smooth frame pacing and no loading/error flash.
- Source visual credit retained in the edit and description.
- Clean audio, no notification sounds, no microphone clipping.

## 15. Science-video safety list

The following statements must not appear in narration, subtitles, title cards, or editorial graphics:

- “NASA proved …” unless the exact narrow claim is source-supported and cited.
- “420 seconds is extinction time.” Use `RECORDED BURN TIME`.
- `PDMS` as the current M4 runtime material label. Use `SILICONE`.
- “NASA never tested partial gravity.”
- “NASA has never studied partial gravity.”
- “GRAVIFIRE predicts the Mars flame.”
- “This configuration is safe,” “unsafe,” or “certified,” unless a separate current source-backed product state explicitly supports that exact statement. The approved campaign does not.
- “Opposed flow extinguishes the fire.”
- “The Lab simulation predicts the real flame.”
- “The fictional M0 response is scientifically guaranteed.”
- “No data exists” when the accurate statement is that no matching combined condition is present in the current archive.
- “Universal law,” except in the explicit limitation `NOT A UNIVERSAL CONTROL LAW`.
- Any implication that `~0`, Complete, Insignificant, 420 s, or 70 s applies beyond its recorded material, run, and condition.

Approved language centers on `source record`, `recorded burn time`, `current archive`, `source-bound comparison`, `evidence boundary`, `matching combined condition`, `refusal`, and `next experiment`.

## 16. Missing items and blockers

Concrete missing items:

1. Official NASA Space Apps 2026 video duration, file-size, codec, upload, and caption rules are not verified in the repository. Confirm them against the official submission portal before export.
2. Team registration must confirm `Team NeuraVesta`, Rangpur Division, and each member spelling.
3. Team footage, individual lower-third footage, and the Riti-origin footage are not present in the tracked media inventory.
4. NASA/source image files and credits referenced by the script need a final local inventory. The script points to paths on disk, but the tracked repository scan did not prove the final media package exists.
5. The current runtime does not accept M1 `stage=prep` as a review stage. Use `/mission-control/play/m1?review=1` for the preparation shot or add no code and omit the shot if unnecessary.
6. The final edit must choose whether to include the R7 `/video-demo` surface. It is not the canonical PlayCanvas campaign and should not be mixed into the story without an explicit label.
7. No footage is marked captured. The operational shot list below starts with `NOT CAPTURED`.

## 17. Readiness assessment

The product is ready for capture from the approved routes. The video is not ready for final export until the concrete missing items above are resolved, especially official submission rules, team identity confirmation, source-media credits, and team/origin footage.

Recommended status: **B — VIDEO PLAN HAS SPECIFIC BLOCKERS.**

The blockers are production inputs and rule verification, not mission implementation.

