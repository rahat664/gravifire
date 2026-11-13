# Game to NASA science dashboard integration

## Scope

The PlayCanvas mission overlay now links to `/dashboard` with a mission-specific context. The link is presentation-only: it does not mutate campaign storage, pause or restart a mission, change player controls, or affect physics/camera state. The dashboard remains available through the existing Mission Control navigation.

## Campaign mapping

| Chapter | Dashboard context | NASA record audit |
| --- | --- | --- |
| M0 | Spacecraft · Detection | No NASA verdict is assigned. The smoke alarm is an explicitly fictional campaign incident. |
| M1 | Spacecraft · Prevention · SAFFIRE-I | PSI-98 samples S1 and S2 are compared with `challengeComparison`. |
| M4 | Spacecraft · Prevention · SAFFIRE-II | PSI-99 sample 2-1 is audited with `challengeRun`. This does not certify other silicone products. |
| M6 | Mars habitat · Suppression · FLEX | PSI-69 Test 2 is audited with `challengeRun`. A persistent notice states that microgravity evidence does not validate Martian partial-gravity outcomes. |

The game campaign itself remains a fictional 2038 narrative. Evidence links cite source experiment identifiers and PSI investigation identifiers; campaign events are never inserted as NASA records.

## Scientific contract

`src/lib/game-science-audit.ts` resolves only the source IDs explicitly mapped in `src/lib/game-science-context.ts`, then calls the existing `challengeComparison` or `challengeRun` engine. The dashboard displays the engine version, status, summary, limitations, missing evidence, conflicts, and source citations. M0 has no engine verdict because it has no corresponding NASA record. The audit is independent of the currently selected ranking card, so changing dashboard selections cannot redirect a chapter’s scientific verdict to another run.

The shared challenge engine citation mapping now identifies SAFFIRE-I as PSI-98 and FLEX as PSI-69 (and keeps SAFFIRE-II/III on PSI-99/100). This corrects the previous generic PSI-25 citation for these NASA run families. No verdict enum or campaign-specific verdict state was changed.

## Navigation and persistence

`MissionScienceLink` is rendered in the existing PlayCanvas mission chrome. It is keyboard reachable, visibly labels the NASA dashboard destination, and calls out the fictional-story boundary. `/dashboard` accepts a small allowlist of mission, objective, and chapter query values and falls back to normal dashboard defaults for invalid values. The Dossier remains unchanged; its campaign export continues to use its existing evidence links.

## Verification

Automated regression coverage in `tests/game-science-integration.test.ts` checks chapter links and contexts, exact verified run mappings, the M0 no-verdict boundary, authoritative-engine results and PSI citations, partial-gravity limitations, and campaign-state round-trip compatibility without mutation. Existing mission-state, dashboard, and challenge-engine tests were also run.

Focused integration, mission-state/dashboard, and challenge-engine tests pass. TypeScript compilation and ESLint checks pass for the touched application/test files.
