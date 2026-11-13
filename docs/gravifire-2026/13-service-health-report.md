# GRAVIFIRE service health report

Date: 2026-11-13  
Status: **HEALTHY** (service is running and the requested live route/API/browser checks passed)

## Service restart

- Port 3000 was confirmed free before startup.
- Original launch mode was development: from `D:\gravifire`, `pnpm run dev` invokes the `package.json` script `next dev`. The prior process command line showed the Next CLI with `dev`; no `.env*` files were present. Next runs with development environment semantics (`NODE_ENV=development`). The service inherits its environment from the launching shell; secret environment values were not dumped or copied into this report.
- Runtime: Node `v24.19.0`, pnpm `12.3.4`, Next.js `16.3.6`, Turbopack. Configuration is `next.config.ts` with `devIndicators: false`.
- Started exactly one original-mode service using `pnpm run dev` with working directory `D:\gravifire`. Next reported ready at `http://localhost:3000`.
- Current listener: `[::]:3000`, Node PID **21244**. Its parent is the Next CLI process PID **26796**, launched by the `pnpm run dev` process in the `D:\gravifire` working directory. The service remains running.
- Production build verification was performed separately in `D:\gravifire-release-build-20261113`, using that copy's own dependency tree and `.next`; it did not write production output into the main repository's `.next` directory. The temporary production verification server on port 3001 was stopped before restarting the original development service.

## Dependency recovery and preflight

- `pnpm install --frozen-lockfile --prefer-offline` completed in the root project using the existing pnpm store. It restored the root `.pnpm` store and `.bin` command links.
- `next.cmd`, `tsc.cmd`, `eslint.cmd`, and `vitest.cmd` were present after repair. Version commands resolved Next 16.3.6, TypeScript 5.9.3, ESLint 9.39.5, and Vitest 5.0.2.
- `package.json` and `pnpm-lock.yaml` were unchanged; the lockfile SHA-256 matched the pre-repair backup.
- Sequential root checks passed: `pnpm exec tsc --noEmit`; `pnpm lint`; `pnpm test` (**35 files, 216 tests passed**).
- An isolated production build passed, including its TypeScript check and static page generation.
- The recovery snapshot and process/dependency records are under `D:\gravifire-recovery-20261113-123504`. The original user worktree and existing `.next`, data, NASA source files, normalized evidence, and artifacts were included in the repository snapshot.

## HTTP route verification

All requested pages returned HTTP 200 and rendered the expected page heading in server HTML.

| Route | HTTP | Rendered heading / check |
|---|---:|---|
| `/` | 200 | GRAVIFIRE |
| `/dashboard` | 200 | Mission fire evidence dashboard |
| `/experiments` | 200 | NASA Experiment Explorer |
| `/applicability` | 200 | Compare NASA conditions with a mission scenario |
| `/recommend/investigations` | 200 | Investigation relevance ranking |
| `/mission-control` | 200 | MISSION CONTROL |
| `/mission-control/dossier` | 200 | AEGIS EVIDENCE DOSSIER |
| `/mission-control/manual` | 200 | Route rendered successfully |
| `/ask` | 200 | ASK GRAVIFIRE |
| `/experiments/bass-ii/runs/B1` | 200 | B1 evidence record rendered |
| `/mission-control/play/m0?review=1` | 200 | M0 game route rendered |
| `/mission-control/play/m1?review=1` | 200 | M1 game route rendered |
| `/mission-control/play/m4?review=1` | 200 | M4 game route rendered |
| `/mission-control/play/m6?review=1` | 200 | M6 game route rendered |

The BASS-II evidence flow loaded its evidence asset through `/api/evidence/bass-ii/evidence-e82f64268c51efee` with HTTP 200. The page/browser checks verified B1, PSI-25, source SHA-256 `71e792bf6b5fb5ea620c5dd70fbbac05515992e12aefcf5dff47312caa48c042`, and source row 2.

## EMBER API checks

`POST /api/ask` returned HTTP 200 for each verified query:

- B1 initial oxygen question: `ANSWERED`, `DIRECT`, answer reports source-reported `22.2%` by volume, citation `PSI-25:Test-B1`.
- Lunar partial-gravity fire question: `INSUFFICIENT_EVIDENCE`, explicitly reports no direct lunar or Martian partial-gravity record in the verified catalog.
- PMMA lunar-habitat safety question: `INSUFFICIENT_EVIDENCE`, explicitly refuses to certify material or habitat fire safety.
- Lunar fire-prevention ranking: `PARTIALLY_ANSWERED`, gives deterministic NASA Investigation Relevance v1 scores and descriptions, and says the ranking is not a safety/performance score.

## Browser and game regressions

The full Playwright suite was run twice after recovery: once against the isolated production build on port 3001 and again against the original-mode development service on port 3000. The final live-service run passed **4/4 tests**. It exercised the BASS-II B1 source/provenance path and scientific limitations; EMBER ranking/refusal/partial-gravity behavior; required dashboard, evidence, Dossier, and Mission Control navigation; M0/M1/M4/M6 science links and campaign-state compatibility; prevention/detection/suppression controls; mobile/tablet layout; keyboard focus; and automated axe scans.

The first isolated production run had one harness timeout because a fresh M0 session presents its first-visit tutorial over the dashboard link. The harness now dismisses that existing tutorial before testing navigation. The corrected suite passed against both production and development modes. No application gameplay or scientific behavior was changed for this adjustment.

## Runtime logs and outstanding issues

- All inspected server route and API requests returned 200. The Next server emitted no server-side runtime exceptions, module resolution failures, or missing dependency errors during the health checks.
- The game/browser emitted PlayCanvas warnings for `uTime` uniforms on M0 incident flame/smoke materials and a deprecation warning for `Entity#getGuid` (“Use Entity#guid instead”). These did not cause browser console errors captured by the acceptance tests or prevent game routes/navigation from working. They remain technical cleanup items.
- Manual NVDA screen-reader verification remains pending. Automated axe and keyboard checks are not full accessibility certification; follow [the manual checklist](12-manual-accessibility-checklist.md).
- No scientific limitations were removed: B1 has no normalized combustion outcome observation, and the microgravity-to-lunar/Martian partial-gravity evidence gap remains explicit.
- No commit, push, deployment, or publication was performed.
