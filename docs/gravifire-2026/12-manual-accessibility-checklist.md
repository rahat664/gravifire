# Manual screen-reader and keyboard accessibility checklist

Status: **not performed**. This document is a reproducible checklist, not a claim that NVDA or another screen reader was tested. Automated axe and browser keyboard checks passed during Step 11, but those checks cannot establish screen-reader usability.

## Test setup and record

Use a Windows test machine with NVDA installed and current supported Chrome or Firefox. Record before starting:

- [ ] Date, tester, Windows version, NVDA version, and browser/version.
- [ ] Browser zoom 100%; first test at desktop width, then repeat key tasks at a narrow/mobile viewport.
- [ ] NVDA speech viewer or equivalent speech history is available for recording exact announcements.
- [ ] Keyboard only: do not use a mouse after loading the page. Record any mouse-only recovery needed.
- [ ] Use a healthy GRAVIFIRE instance. At the time this checklist was prepared, port 3000 returned HTTP 500, so do not treat it as a valid manual-test target until recovery and health checks pass.
- [ ] Do not enter or persist real user or mission data during this test.

Test the primary flow at `/dashboard`: choose Lunar habitat and Fire Prevention, open BASS-II / PSI-25 / B1, set hypothetical oxygen fraction to 22.2%, and inspect the comparison and provenance. Then inspect `/experiments`, `/applicability`, `/recommend/investigations`, EMBER, Mission Control, the Dossier/Evidence DNA link, and the M0 pause dialog.

## Heading and landmark navigation

- [ ] On each route, use NVDA+F7 to inspect headings, landmarks, links, and form fields.
- [ ] Navigate by H / Shift+H and confirm the heading order describes the page and its current task.
- [ ] Navigate by D / Shift+D and confirm main, navigation, and complementary/aside regions are identifiable where present.
- [ ] Confirm there is a single useful page-level H1 and that expandable sections, evidence sections, and result cards have meaningful headings.
- [ ] Check that dynamic route changes and selected investigation content do not leave focus or the virtual cursor at an unrelated position.
- Notes / unexpected announcement:

## Keyboard-only operation

- [ ] Use Tab and Shift+Tab to reach all visible controls and links in a logical order; no keyboard trap outside an intentional modal.
- [ ] Confirm every focused control has a visible focus indicator with sufficient contrast.
- [ ] Use Enter and Space on buttons/links, arrow keys for radio groups and selects, and Escape only where the interface documents or implements it.
- [ ] Confirm the selected objective and environment remain apparent without relying on color alone.
- [ ] Confirm the selected investigation and record can be opened and changed without a pointer.
- [ ] Confirm desktop and narrow viewport layouts do not obscure focused controls or require unexplained horizontal scrolling.
- Notes / unexpected announcement:

## Form labels, units, and validation

- [ ] Hear the mission environment select with its label and current value.
- [ ] Hear Fire Prevention, Detection, and Suppression as a labeled radio group, with selected state announced.
- [ ] Hear the hypothetical oxygen field label, editable value, and `%` unit. Confirm the unit is available to a screen reader, not only painted beside the input.
- [ ] Hear the source-record select label and selected record identity (B1).
- [ ] Clear optional mission fields and confirm the UI announces or exposes that they are unknown rather than filled from an unspoken default.
- [ ] Enter malformed or out-of-range input if the UI allows it; verify validation is associated with the field, understandable, and does not silently turn into a scientific result.
- [ ] Confirm that changing mission assumptions is described as hypothetical and does not overwrite source-reported NASA values.
- Notes / unexpected announcement:

## Dialog focus and return

On a review-mode M0 game route, open the pause dialog using the keyboard.

- [ ] Focus moves into the dialog and its name (“PAUSED”) and modal state are announced.
- [ ] Tab and Shift+Tab stay within the dialog and reach each action.
- [ ] The dialog's return-to-mission and resume actions have clear accessible names.
- [ ] Escape closes the dialog if that is the intended behavior; focus returns to the control that opened it.
- [ ] If Escape does not close it by design, verify an announced, keyboard-accessible close action instead.
- [ ] Confirm the background cannot be activated while the modal is open.
- Notes / unexpected announcement:

## Scientific comparison table/navigation

On the B1 applicability comparison, inspect every row and heading using table navigation (NVDA table commands such as Ctrl+Alt+arrow keys where supported) and the virtual cursor.

- [ ] Determine whether the comparison is exposed as a semantic table or as a clearly structured set of labeled regions. Record the actual role; do not assume a visual grid is a table.
- [ ] Hear the dimension, NASA/source value, mission scenario value, and match state together or in a predictable navigable sequence.
- [ ] Confirm oxygen is announced with units on both values: NASA `22.2 %`, mission `22.2 %`, status matched.
- [ ] Confirm gravity is announced as mismatched and that microgravity-to-partial-gravity limitations are spoken, not represented by color alone.
- [ ] Confirm unknown conditions are explicitly announced as unknown and are not mistaken for matches.
- [ ] At narrow width, verify row labels remain associated with their values and status; test any horizontal scroll region using keyboard and screen-reader browse/focus modes.
- [ ] Confirm mismatch is described as a condition difference, not as a fire-performance outcome or safety conclusion.
- Notes / announcement order and usability:

## Source identity and provenance

- [ ] Navigate to the selected source record and hear investigation/family identity, PSI source ID, record ID B1, and source-record status.
- [ ] Hear that the value is source-reported and retain units (`22.2 %`).
- [ ] Locate the NASA source link by link list and verify its accessible name identifies it as the NASA PSI-25 source, rather than a generic “click here”.
- [ ] Inspect provenance disclosure and determine whether source row and SHA-256 provenance can be reached and understood without forcing an unreadable uninterrupted 64-character announcement.
- [ ] Verify the page clearly states that no normalized outcome observation is linked to B1. Confirm no combustion outcome is announced or inferred.
- [ ] Verify research limitations and next-experiment direction can be found by heading navigation.
- Notes / unexpected announcement:

## Ranking and uncertainty

On `/recommend/investigations` and the dashboard ranking results:

- [ ] Hear result order, rank number, score, investigation name, integration status, and source link in a repeatable order.
- [ ] Hear scoring factors and explanations, including mission relevance, material/phenomenon applicability, environmental match, and evidence completeness.
- [ ] Confirm reference-only versus verified-and-ingested state is spoken as text and not conveyed only by badge color.
- [ ] Confirm missing metadata is identified as unknown/missing and does not sound like extra confidence or a better safety rating.
- [ ] Confirm the interface identifies ranking as research relevance, not material safety or evidence strength.
- [ ] Repeat the same query in EMBER. Confirm ranking scores are explained without being re-scored and the deterministic source/version reference is accessible.
- Notes / unexpected announcement:

## Warnings, evidence gaps, and EMBER

- [ ] Confirm the partial-gravity warning is announced when the scenario uses lunar or Martian gravity and microgravity evidence is selected.
- [ ] Confirm warning text explains the limitation and is not just a color/icon alert.
- [ ] Ask EMBER about partial-gravity evidence and verify the insufficient-evidence response is announced.
- [ ] Ask for an unsupported safety certification and verify the refusal is clear and not contradicted by another verdict on the page.
- [ ] Confirm measured source evidence and hypothetical mission values are identified separately in speech.
- [ ] Locate citations in EMBER by link navigation. Confirm source IDs and links remain understandable in context and no unsupported numerical/scientific claim is presented without a source.
- [ ] Confirm missing source data or unavailable retrieval is announced as unavailable, not replaced with fabricated claims.
- Notes / unexpected announcement:

## Mission Control and game context

- [ ] Navigate Mission Control, Dossier, Field Manual, Evidence DNA, and game science links using headings and link lists.
- [ ] Confirm M0/M1/M4/M6 links announce mission context and open the intended dashboard context.
- [ ] Confirm fictional game events are announced as fictional, with no false attribution to NASA investigations.
- [ ] In M0 pause overlay, complete the dialog checks above; test returning to gameplay and opening the NASA science dashboard without losing keyboard orientation.
- [ ] Confirm campaign state and game progression are not unexpectedly changed by reading evidence or following science links.
- Notes / unexpected announcement:

## Results and sign-off

- [ ] Record each item as Pass, Fail, Not applicable, or Blocked; include the exact speech output and route for every failure.
- [ ] File defects with a concise reproduction, expected announcement, actual announcement, browser/NVDA versions, and severity.
- [ ] Re-test every corrected defect with the same screen reader/browser and keyboard-only operation.
- [ ] Report remaining limitations; do not describe axe results as a manual screen-reader audit.
- Overall result: Not run / Pass / Pass with issues / Fail
- Tester and date:
- Outstanding issues:
