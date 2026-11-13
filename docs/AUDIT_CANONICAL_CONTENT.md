# Canonical content audit

## Source priority

1. Reviewed runtime evidence modules and resolvers (`src/lib/*-evidence.ts`, typed `src/data` modules).
2. Reviewed family adapters/validators and generated normalized artifacts.
3. Verified NASA raw source files and their provenance.
4. Reviewed document-context registries.
5. Current mission definitions.
6. Historical design/story/research markdown, which is never runtime truth automatically.

## Findings

- M1 runtime resolves PSI-98 S1/S2 and uses recorded burn-time values from the normalized runtime.
- M4 runtime resolves SAFFIRE-II 2-1 through 2-4, labels the material `SILICONE`, preserves textual statuses, and keeps document context separate.
- M6 runtime uses `CURRENT INGESTED EVIDENCE DOMAIN` / combined-condition refusal language and does not need a NASA absence claim.
- `data/nasa` generated reports and `Gravifier_research/R7_HANDOVER` are distinct evidence systems. R7 terminology is contract-scoped to `/video-demo`.
- Historical documents contain narrative terms and old scenario language. They are research/design artifacts unless imported by an explicit runtime adapter.

## Search review

Searches covered `PDMS`, `13 s`, `142.7 s`, `2.18 mm/s`, `2.64 mm/s`, `UNFLOWN`, NASA-never-tested language, safe/unsafe/certified/approved, extinction, opposed-flow causal claims, all-four-complete claims, Viton, EPDM, and partial gravity. The important occurrences are either current scoped mission copy, source-preserving data/status fields, R7 handover material, or historical documentation. No finding justified changing current mission science in this audit.

## Required follow-up

Run a dedicated copy linter over runtime-visible strings before adding new missions. Keep historical research unchanged, but prevent old markdown from being imported as UI content without review.
