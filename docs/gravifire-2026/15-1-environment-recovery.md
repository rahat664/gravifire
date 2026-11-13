# Step 15.1 environment recovery report

**Date:** 2026-11-13
**Environment:** Windows, `D:\gravifire`, branch `integration/game-merge`
**Outcome:** **RECOVERED / HEALTHY** — root dependencies are local and resolve, the isolated production build passes, the development service is healthy on port 3000, and all automated checks requested here passed. This is not a release-readiness declaration; manual NVDA verification remains pending.

## Incident and root cause

The Step 15 build attempt used a writable junction from a temporary project copy's `node_modules` to `D:\gravifire\node_modules`. Running `pnpm run build` in that copy triggered dependency installation. pnpm then wrote package junctions using the temporary copy's `.pnpm` path through the shared `node_modules` junction. A later root `pnpm run lint` attempted to remove/recreate the modules directory and failed with `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` / access denied. The root then had 18 top-level package links resolving into `%TEMP%\gravifire-step15-isolated-build`, with no root `.pnpm` virtual store or `.bin` shims. Next PID 21244 stayed alive but returned HTTP 500 because it could not resolve `next/package.json`.

The older recovery snapshot also documents links into `D:\gravifire-acceptance-build-20261113`. The shared writable junction made it possible for package-manager operations in one project context to repoint links in the other. A build must never share a writable `node_modules` directory with the active checkout.

## Safety, backup, and process handling

- Confirmed the earlier snapshot `D:\gravifire-recovery-20261113-123504` was readable, including its repository snapshot, tracked-work patch, untracked-path list, package files, link inventory, and pre-incident process/port records.
- Created a fresh physical worktree backup at `D:\gravifire-recovery-20261113-step15-1` before dependency recovery. It contains the current source, docs, tests, research materials and evidence files, plus Git status, dependency-link inventory and process-tree records. `.git`, root `node_modules`, and root `.next` were excluded; Git status and prior snapshot patch/inventory remain available separately.
- Nine critical file SHA-256 checks matched immediately after backup. After recovery, SHA-256 comparisons for all files under `src/data/nasa/raw`, `data/nasa/normalized`, `data/nasa/provenance`, and `data/nasa/manifests` matched the backup.
- `package.json` and `pnpm-lock.yaml` SHA-256 values match both the fresh backup and the earlier snapshot.
- Before stopping the server, process inspection showed the original `pnpm run dev` tree: pnpm PID 20908 → Next CLI PID 26796 → server PID 21244 → Turbopack worker PID 7972. There was no pnpm install process. The authorized unhealthy server process tree was stopped; port 3000 was confirmed free.
- No NASA source data, normalized evidence artifacts, dependency versions, or application verdict/ranking contracts were changed during recovery. No Git reset, clean, commit, push, deployment or publication occurred.

## Dependency recovery

With the unhealthy service stopped and no active pnpm process, ran exactly once in the root:

```powershell
pnpm install --frozen-lockfile --prefer-offline
```

Result: lockfile accepted and unchanged; **483 packages reused, 0 downloaded**; pnpm 12.3.4 restored a root-local `node_modules/.pnpm` and `.bin` layout. Next.js 16.3.6, TypeScript 5.9.3, ESLint 9.39.5 and Vitest 5.0.2 resolve from the root. Playwright 1.65.0 resolves from its existing `tests/browser-harness/node_modules` installation. All 18 root package junctions resolve, none are broken, and none target either temporary build directory.

## Independent production build

Created a new physical source copy at `D:\gravifire-step15-1-build-20261113`, excluding `.git`, the active root `.next`, and dependency directories. Six source/package sentinels matched the repository. The copy received its own root-local dependency installation using the frozen lockfile; it uses its own `node_modules/.pnpm` and writes build output only to its own `.next`.

```powershell
Set-Location D:\gravifire-step15-1-build-20261113
pnpm install --frozen-lockfile --prefer-offline
pnpm run build
```

**Build passed.** Next 16.3.6/Turbopack compiled successfully, completed the TypeScript phase, generated all 23 static pages, and finalized route optimization. Root `.next` was not used as a build output directory. The pnpm content-addressable store was reused for immutable package contents; no writable `node_modules` junction was shared.

## Verification results

| Check | Result |
|---|---|
| Full Vitest suite | **218/218 passed**, 36 files; includes SAME and SAME-R table terminology and challenge-evidence citation assertions |
| TypeScript | **Passed** — `pnpm exec tsc --noEmit` |
| ESLint | **Passed** — `pnpm run lint` |
| Isolated production build | **Passed** — independent physical copy, 23 static pages generated |
| Full Playwright suite | **5/5 passed** |
| Automated accessibility | **Passed** — existing dashboard/routes/dialog Axe assertions plus the new header regression across M0/M1/M4/M6 at desktop and mobile; no reported violations |
| `git diff --check` | **Passed**; Git emitted line-ending conversion notices for existing modified files only |
| NASA raw/normalized/provenance/manifests hash comparison | **Passed** — all compared files match the fresh backup |
| package/lock integrity | **Passed** — `package.json` and `pnpm-lock.yaml` match the earlier recovery snapshot |

Pre-recovery attempts are recorded as environment failures, not passing checks: Turbopack rejected the external dependency junction; webpack could not resolve Next.js through the same junction; and root ESLint could not start because pnpm's dependency-directory removal failed with access denied. All requested checks were rerun after recovery, using an independent physical build copy, and passed.

Playwright results, screenshots and Axe JSON were written under `D:\gravifire-recovery-20261113-step15-1\playwright-results` and `D:\gravifire-recovery-20261113-step15-1\artifacts`. The browser run verified BASS-II B1's source-reported 22.2% oxygen, PSI-25 citation/source hash, unknown combustion outcome and partial-gravity warning; EMBER's deterministic ranking explanation and safety/partial-gravity refusals; and M0/M1/M4/M6 mission context and campaign-state compatibility. The header test checked no overlap, keyboard reachability and visible focus, hit testing, badge readability, link navigation and accessible names at both viewport sizes.

## Service restoration and health

Restarted the original command `pnpm run dev` from `D:\gravifire`, with the default environment/configuration and existing `next.config.ts`. The listener is PID **21384** on `0.0.0.0:3000` and `[::]:3000`; the original service remains running. Startup log reports Next.js 16.3.6 ready. Sanitized stdout/stderr logs are in the fresh recovery folder.

All requested route checks returned **HTTP 200**:

`/`, `/dashboard`, `/experiments`, `/experiments/same-comparison`, `/applicability`, `/recommend/investigations`, `/mission-control`, `/mission-control/dossier`, `/mission-control/manual`, `/ask`, `/lab`, and review routes `/mission-control/play/m0|m1|m4|m6?review=1`.

Playwright additionally verified B1 Evidence DNA navigation and source provenance, NASA dashboard context links from all four missions, and EMBER evidence responses. Server logs show successful page/API requests with no missing-module errors, `MODULE_NOT_FOUND`, failed compilation, or Turbopack internal error after restart.

## Git and data integrity

All previously uncommitted and untracked application work remains present. The branch remains `integration/game-merge`. `package.json` and `pnpm-lock.yaml` are unchanged; `git diff --check` passes. All NASA source and generated evidence files listed in the comparison above remain byte-identical to the verified pre-recovery backup. Changes from the targeted remediation are preserved; no unrelated application scope was added.

## Prevention and remaining checks

1. Keep every build in a fresh physical source copy with its own frozen-lockfile dependency installation and `.next` output. Never junction or symlink a build copy's writable `node_modules` to the active repository.
2. Before any pnpm installation, inspect `Win32_Process` for an existing installer and inspect the link targets under `node_modules`. Run one installation at a time; stop the dev server first when repairing root dependencies.
3. Verify package links resolve inside that checkout, package/lock hashes remain unchanged, and the root service health is restored before further work.
4. Keep browser artifacts and logs in a separate recovery/results directory or use a reporter config that does not overwrite existing harness artifacts.
5. Manual NVDA with Chrome or Firefox remains unperformed. Use the checklist in `12-manual-accessibility-checklist.md`; automated Axe results are not a manual screen-reader audit.
6. Step 14's scientific coverage limits remain: no direct lunar/Martian partial-gravity combustion records, local SAME/SAME-R tables omit detector-response/alarm outcomes, BASS is reference-only, FLEX's local/report count discrepancy is unresolved, and FLEX-2 is configuration-only.

The service and requested automated verification are healthy. GRAVIFIRE is **not declared release-ready** while the manual accessibility check and the documented scientific coverage limitations remain.
