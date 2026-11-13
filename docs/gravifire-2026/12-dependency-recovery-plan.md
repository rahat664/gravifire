# Root dependency recovery and release preflight

Date: 2026-11-13  
Repository: `D:\gravifire`  
Branch: `integration/game-merge`  
State: diagnostic only; no dependency repair was run.

## Read-only findings

- The worktree contains extensive existing dirty and untracked Steps 1–11 work. `git status --short` was captured; `pnpm-lock.yaml` is not modified. Preserve the full working tree. No reset, cleanup, restore, checkout, or dependency mutation was performed in this pass.
- Runtime versions: Node `v24.19.0`; pnpm `12.3.4`. `package.json` declares `pnpm@12.3.4`; the lockfile is version 9. The committed lockfile is unchanged. Earlier isolated `pnpm install --frozen-lockfile` succeeded against the same manifest/lockfile. No root frozen install was run during this diagnostic pass.
- Root `node_modules/.bin` is absent, including `tsc.cmd`, `eslint.cmd`, `vitest.cmd`, and `next.cmd`. Root `node_modules/.pnpm` is absent. The root `node_modules` directory still has package junctions, but links for `next`, `react`, `typescript`, `eslint`, and `vitest` point into `D:\gravifire-acceptance-build-20261113\node_modules\.pnpm\...`, an earlier isolated build directory. Thus the root dependency tree is redirected/incomplete, not merely missing command shims.
- Port 3000 is listening on `[::]:3000`, owned by Node PID 19648, parent PID 10008. PID 19648's command line runs Next from `D:\gravifire\node_modules\.pnpm\next...`. The parent chain includes `pnpm run dev` (pnpm.exe PID 24144). The process is still running and was not stopped or restarted.
- Read-only HTTP checks returned **500** for `/`, `/dashboard`, and `/experiments`. This makes the running application unhealthy at the time of this audit despite the listener being alive. The generic response body disclosed no more detail.
- No concurrent dependency-install pnpm process was found. The pnpm process still present belongs to the running dev service. Do not mistake it for permission to alter or terminate the service.

## Likely cause and confidence

The most likely original staging failure was concurrent pnpm commands operating on the same root virtual store: `pnpm exec tsc`, `pnpm lint`, and `pnpm test` were launched together. The reported failure attempted to move `node_modules/.pnpm/esbuild.../node_modules` into a staging directory and got Windows `os error 2`, consistent with another pnpm operation moving or replacing that path at the same time.

The later observed state has an additional, confirmed cause from the previous acceptance work: an isolated-build `node_modules` junction was not removed when PowerShell `Remove-Item` failed. A subsequent isolated `pnpm install` ran through that still-present junction. Current root package links point to the intermediate build directory, while root `.pnpm` and `.bin` are missing. This explains why the root project commands are unavailable. The current HTTP 500s are consistent with the broken dependency paths, although a precise server-side exception was not available from the generic HTTP response. No claim is made that this is the only application error.

The live process command line also resolves its Next entry point below the broken root `.pnpm` path. Existing in-memory Node module caches may let some already-loaded code continue running, but new requests, lazy imports, recompiles, or child workers can fail. The observed 500 responses prove the live application cannot currently be treated as healthy. Do not attempt repair while this process is running: replacing dependency links/files could affect the process unpredictably.

## Maintenance prerequisites

Before any repair:

1. Obtain explicit user approval for a maintenance window that permits dependency changes and a controlled stop/restart of the port 3000 service. This diagnostic step does not grant that approval.
2. Notify users of the current outage and agree on a short window. Capture the current listener PID/command, `git status --short`, `git diff --stat`, and hashes of `package.json` and `pnpm-lock.yaml`.
3. Keep the current user worktree and NASA data intact. Do not use `git clean`, `git reset`, `git checkout`, `pnpm install --force`, or recursive deletion as routine recovery steps.
4. Keep both isolated build directories and their `node_modules` untouched until root recovery and rollback review are complete. The root junctions currently reference the first isolated dependency tree.
5. Confirm no other pnpm install/test/build operation is active. The expected `pnpm run dev` service process must be stopped only inside the approved maintenance window, then confirm port 3000 has no listener.

## Proposed repair sequence (approval required; not executed)

1. **Record and preserve state.** Save a timestamped `git status --short`, `git diff --binary` for tracked edits, and a listing of untracked paths to an external backup folder. Copy `package.json` and `pnpm-lock.yaml` there and record SHA-256 hashes. These are recovery records; do not restore over the current worktree automatically.
2. **Back up dependency layout without deleting it.** With the service stopped, copy the root `node_modules` tree to a timestamped external location while preserving junctions as links and avoiding traversal into their targets (PowerShell/Robocopy `/SL` and `/XJ`; inspect the result before proceeding). Also save a textual inventory of each root package junction target and the existence of root `.pnpm` and `.bin`. Do not remove or rename the original tree at this stage.

   Example commands for the approved window (choose a backup drive with adequate free space; the timestamped path must not already exist):

   ```powershell
   $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
   $backup = "E:\gravifire-recovery-$stamp"
   if (Test-Path -LiteralPath $backup) { throw "Backup path exists: $backup" }
   New-Item -ItemType Directory -Path $backup | Out-Null
   git status --short | Set-Content "$backup\git-status.txt"
   git diff --binary | Set-Content "$backup\tracked-work.patch"
   git ls-files --others --exclude-standard | Set-Content "$backup\untracked-paths.txt"
   Copy-Item package.json,pnpm-lock.yaml -Destination $backup
   Get-FileHash package.json,pnpm-lock.yaml -Algorithm SHA256 |
     Format-Table -AutoSize | Out-String | Set-Content "$backup\manifest-hashes.txt"
   Get-ChildItem node_modules -Force |
     Select-Object Name,Attributes,LinkType,Target |
     ConvertTo-Json -Depth 4 | Set-Content "$backup\node-modules-links.json"
   robocopy node_modules "$backup\node_modules-copy" /E /COPY:DAT /DCOPY:DAT /XJ /R:1 /W:1
   if ($LASTEXITCODE -ge 8) { throw "Dependency backup copy failed: $LASTEXITCODE" }
   ```

   `/XJ` prevents following junctions into the isolated build folders. The JSON link inventory is required because the backup copy intentionally does not reproduce linked package targets. This is a forensic/rollback record, not a ready-to-run dependency tree.
3. **Validate the package manager.** Confirm `node --version` and `pnpm --version` again, ensure pnpm is `12.3.4`, and check that the package manifest and tracked lockfile hashes still match the captured values. The current manifest and lockfile were previously installed successfully in an isolated copy; do not regenerate the lockfile.
4. **Attempt a non-destructive frozen install first.** From `D:\gravifire`, with no service or other pnpm process running, run one pnpm command at a time:

   ```powershell
   pnpm install --frozen-lockfile --prefer-offline
   ```

   This should reconstruct `.pnpm`, package links, and `.bin` from the unchanged lockfile and pnpm store without intentionally changing the lockfile. Check `git status --short` and `git diff -- pnpm-lock.yaml package.json` immediately afterward. If pnpm reports access denied, staging errors, or proposes a lockfile change, stop and report; do not escalate to `--force` or delete `node_modules` without separate explicit approval.

5. **Check executable layout.** Read-only check that root `.pnpm` exists and each link target exists. Confirm `node_modules/.bin/{tsc,eslint,vitest,next}.cmd` resolves. Run `pnpm exec tsc --version`, `pnpm exec eslint --version`, `pnpm exec vitest --version`, and `pnpm exec next --version` sequentially.
6. **Verify application without overwriting main `.next`.** First run TypeScript, lint, and tests sequentially:

   ```powershell
   pnpm exec tsc --noEmit
   pnpm lint
   pnpm test
   ```

   Then create a fresh uniquely named isolated copy of the current source, excluding `.git`, root `node_modules`, root `.next`, and only browser output directories; install frozen dependencies inside that copy and build there:

   ```powershell
   pnpm install --frozen-lockfile --prefer-offline
   pnpm exec next build
   ```

   Do not point the build copy's `node_modules` at root with a junction: Next/Turbopack rejects dependency links outside the project filesystem root. Do not copy secrets or change `.next` in the main worktree.
7. **Restore browser coverage only after service restart is authorized.** With permission, start the dev service once and confirm HTTP 200 on `/`, `/dashboard`, and `/experiments` before browser automation. Run the existing Playwright suite from `tests/browser-harness` with `GRAVIFIRE_BASE_URL=http://localhost:3000`. Preserve prior browser artifacts. Do not run multiple pnpm operations concurrently.
8. **Close out.** Record exact commands/results, confirm lockfile and package manifest are unchanged, confirm root `git diff --check`, and compare current `git status --short` with the pre-maintenance record. Do not commit, deploy, or publish.

## Rollback plan (approval required)

- If the frozen install fails before mutating the dependency layout, stop immediately; preserve the failure output and the original tree. Keep the service stopped only if that is within the approved window; otherwise seek direction rather than starting it against broken dependencies.
- If pnpm partially changes `node_modules`, do not recursively delete it. Preserve the failed tree under a new timestamped name only after service-stop approval, then restore the previously captured dependency-layout backup without following junction targets. Because the captured tree may contain links into the intermediate build copy and may itself be unusable, do **not** restart the service on rollback until `next`, React, and executable links resolve correctly. If backup validation fails, leave the service stopped and request a new recovery decision.
- The authoritative source for package contents is the unchanged `pnpm-lock.yaml` plus pnpm's content-addressable store. A repeated frozen install in a clean, newly named isolated copy is the non-destructive validation path before retrying root recovery.
- Never restore or overwrite `src`, `docs`, NASA raw data, generated evidence, the lockfile, or `.next` as part of dependency rollback.

## Remaining blockers

## Approved maintenance execution update — 2026-11-13

The user approved stopping the unhealthy service, backing up the repository/dependency state, and carrying out frozen-lockfile recovery and verification. The following steps were completed:

- Captured the pre-repair Git state, tracked diff patch, untracked path inventory, manifest hashes, root dependency-link inventory, and process IDs at `D:\gravifire-recovery-20261113-123504`.
- Stopped the previously identified port 3000 process tree (pnpm launcher PID 24144 and descendants, including server PID 19648). Port 3000 now has no listener. The original service was not restarted because approval covered stopping and repair, not restarting it.
- Copied the full repository snapshot, including the existing `.next`, user changes, NASA data, normalized evidence, and artifacts, to `D:\gravifire-recovery-20261113-123504\repository-snapshot`. Robocopy reported 3,806 files / 1.326 GB copied, zero failed. No cleanup was performed.
- Ran one root install only: `pnpm install --frozen-lockfile --prefer-offline`. It completed successfully using the existing pnpm store and reported 483 packages installed/relinked. `package.json` and `pnpm-lock.yaml` remain unchanged.
- Confirmed root `node_modules/.pnpm` and `.bin` are present and `tsc.cmd`, `eslint.cmd`, `vitest.cmd`, and `next.cmd` resolve. Their version checks report TypeScript 5.9.3, ESLint 9.39.5, Vitest 5.0.2, and Next 16.3.6.
- Root checks passed sequentially: `pnpm exec tsc --noEmit`; `pnpm lint`; `pnpm test` (**35 files, 216 tests passed**).
- Built current source in the fresh isolated copy `D:\gravifire-release-build-20261113`, with its own frozen-lockfile install and `.next`. Production build and its TypeScript step passed and generated 23 static pages / 27 listed application routes. The main repository `.next` was not used as the build output directory.
- Started that isolated production build temporarily at `127.0.0.1:3001` for browser verification, then stopped it. Final Playwright result: **4 passed, 0 failed**. On the first run the test did not dismiss the existing M0 first-visit brief before clicking the overlayed science link; the harness now dismisses the brief and re-tests the intended keyboard/navigation flow. The corrected suite passed. The prior first-run trace/artifacts were preserved at `D:\gravifire-recovery-20261113-123504\browser-artifacts-production-first-run`.
- `git diff --check` passed. The only application/worktree additions since the prior audit are this recovery documentation and the browser test's first-visit M0 tutorial interaction; no NASA data or generated NASA evidence were changed.

### Remaining blockers after repair

1. At the end of the Step 12 maintenance pass, port 3000 remained stopped pending approval. The user subsequently approved restarting it; it is now running and verified healthy as recorded in [service health report](13-service-health-report.md).
2. Manual NVDA screen-reader verification remains unperformed; see [manual accessibility checklist](12-manual-accessibility-checklist.md).
3. Manual accessibility verification remains an acceptance follow-up. The final browser suite was also rerun successfully against the original port 3000 service; the isolated production browser run is recorded separately above.
