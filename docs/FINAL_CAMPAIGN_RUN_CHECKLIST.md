# Final Campaign Run Checklist

Use a fresh browser profile or clear only the campaign key `gravifire:mission-control:campaign:v2`. Do not hand-edit scientific records or use review mode for the real progression run.

1. Open `/mission-control` and confirm M0 is `AVAILABLE`; M1, M4, and M6 are `LOCKED`.
2. Start `/mission-control/play/m0` and use `WASD`, `Shift`, `E`, mouse look, and `Esc` pause.
3. Inspect heater, garment, and ventilation, choose an operational response, and review the archive handoff.
4. Complete M0. Confirm FM-01 unlocks and M1 becomes `AVAILABLE`.
5. Complete M1. Confirm the source comparison preserves `RECORDED BURN TIME`, `420 s`, `70 s`, and `NOT A UNIVERSAL CONTROL LAW`.
6. Confirm M4 becomes `AVAILABLE`; complete the Silicone flow without changing `037 mm`.
7. Confirm M6 becomes `AVAILABLE`; complete the manifest, evidence review, boundary scan, refusal, and experiment memo.
8. Confirm the finale remains a scoped refusal for no matching combined-condition evidence in the current archive domain.
9. Revisit Dossier and Field Manual. Confirm unlocked entries remain present and no duplicate unlock toast is generated on reload.
10. Return to Mission Control. Confirm M0/M1/M4/M6 status cards remain correct.
11. Reload the browser and revisit Mission Control, Dossier, and Manual.
12. Confirm campaign progress, mission completion, Field Manual unlocks, and evidence references persist.
13. Separately test malformed campaign storage: replace the campaign value with invalid JSON, reload, and confirm a safe fresh campaign is shown.
14. Separately test development review URLs with `review=1&stage=...`; confirm they do not alter the campaign key.
15. In a production build/server, confirm `review=1` does not bypass a locked mission.

## Expected evidence boundaries

- M0 is a fictional incident, not a NASA replay; no garment microgravity match is claimed.
- M1 presents S1 Concurrent and S2 Opposed as recorded burn times of `420 s` and `70 s`.
- M4 presents Silicone / SAFFIRE-II / PSI-99, including raw `037 mm` source text and its review warning.
- M6 presents contextual Mars mission gravity near `0.38 g` but refuses unsupported combined-condition extrapolation.
