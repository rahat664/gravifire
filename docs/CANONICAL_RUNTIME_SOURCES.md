# Canonical runtime sources

This registry is the developer-facing answer to “which file is scientific runtime truth?”

| Surface | Canonical source |
|---|---|
| M1 S1/S2 | `src/lib/m1-evidence.ts` → `src/data/nasa-experiment-runs.ts` → generated SAFFIRE-I normalized runtime |
| M4 2-1..2-4 | `src/lib/m4-evidence.ts` → generated SAFFIRE-II normalized runtime; document context is separate |
| M6 | `src/lib/m6-state.ts`, `src/data/missions/m6-locked-door.ts`, campaign state commands |
| Dataset registry | `data/nasa/integration-registry.json` |
| Document context | `src/data/nasa-document-data.ts` and explicit mission document references |
| R7 video output | `src/lib/r7/adapter.ts` and the checked-in `Gravifier_research/R7_HANDOVER` outputs |

Historical story/research markdown is not read dynamically as runtime evidence. Generated normalized data is reproducible output from family-specific parsers/validators/normalizers. Raw NASA files remain immutable source material.
