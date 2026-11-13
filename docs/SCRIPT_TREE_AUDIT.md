# `scripts/` vs `Scripts/` audit

The repository contains two case-variant trees. On Windows they can appear interchangeable; on Linux they are distinct paths.

The duplicate trees contain the same named PSI ingestion, parser, normalizer, validator, provenance, video, and audit files. The current package script calls `Scripts/audit-merged-data.ts`; ingestion scripts are called from `scripts/psi/...`. `rg` found no separate application imports of these files; they are command entry points.

| Finding | Result |
|---|---|
| Duplicate names | Yes, across the two trees |
| Package canonical audit command | `Scripts/audit-merged-data.ts` |
| Package family ingestion commands | `scripts/psi/...` |
| Safe automatic deletion | No |
| Recommended action | Hash/compare every pair, select one lowercase canonical tree, update package scripts and docs together, then remove duplicates in a dedicated cleanup commit |

No consolidation was performed in this hardening pass.
