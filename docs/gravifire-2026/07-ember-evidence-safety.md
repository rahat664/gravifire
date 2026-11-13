# EMBER Evidence Safety and Challenge Integration

## Scope

EMBER's existing grounded assistant is exposed through `/api/ask` and `AskGravifire`. It continues to use the structured NASA experiment records and extracted NASA document chunks in `src/lib/grounded-query.ts`. The query path is deterministic; the application currently has no LLM provider configured for this assistant. This change adds challenge-language relevance ranking and refusal behavior without replacing that retrieval path.

The assistant recognizes challenge questions about fire prevention, smoke/fire detection, suppression/extinction, and spacecraft, lunar habitat, Mars habitat, or pressurized rover missions. Ranking requests recompute with `rankNASAInvestigations` on the server. EMBER copies each returned score and its four factor explanations without rescoring. A client-supplied `recommendationContext` is untrusted input and is no longer presented as evidence or a verified ranking.

## Evidence and response rules

- Source-grounded observations and numeric values come from stored records or retrieved NASA report chunks and include their existing NASA citation, URL where available, and ingestion provenance.
- Answer segments refer to the IDs of the sources actually attached to the response.
- A conflicting number in a supported BASS-II oxygen question is answered with the stored measurement and a direct note that the source does not support the premise.
- Ranking output is a GRAVIFIRE-derived method result. Its score is the deterministic engine's unchanged output; ranking does not represent safety, performance, certification, or confidence.
- Each ranked record carries its registry integration state and NASA PSI reference URL. Reference-only entries are labeled and not represented as ingested runs.
- Mission profiles are hypothetical inputs. For lunar and Mars queries, the answer explicitly says the current verified catalog has no direct lunar/Martian partial-gravity fire evidence and warns against transferring microgravity results as validated partial-gravity behavior.
- The assistant refuses requests to certify, guarantee, or declare a material or habitat fire-safe. It does not override mission-control scientific verdicts; the existing `challengeAskAnswer` audit remains a separate downstream review.
- Requests for named direct lunar/Martian partial-gravity tests fail closed when no verified record is present. The statement is scoped to GRAVIFIRE's current verified coverage, not a claim that no external research exists.
- If NASA document retrieval throws or returns no relevant chunk, EMBER returns insufficient evidence and no document quote. Existing structured records can still answer direct record questions when document retrieval is unavailable.

## Grounded demonstration

Question: **“What was the initial oxygen level in Test B1?”**

Representative response: “NASA's BASS-II Experimental Table records initial oxygen for Test B1 as 22.2% by volume.” The response includes `PSI-25:Test-B1` and its source provenance. The numerical value comes from the validated run record, not a generated estimate.

## Deterministic ranking demonstration

Question: **“Rank NASA investigations for lunar fire detection.”**

EMBER requests the lunar habitat mission profile and smoke/aerosol detection pillar from the existing ranking engine, then reports the ranked investigation names, exact engine scores, integration status, and mission relevance, material/phenomenon, environmental match, and evidence completeness factor explanations. Each ranked item includes the NASA PSI record URL and the GRAVIFIRE ranking-method citation. It adds the partial-gravity evidence limitation. Scores are not altered by EMBER.

## Scientifically appropriate refusals

Question: **“Is PMMA safe for a lunar habitat?”**

Response: EMBER cannot certify a material as fire-safe, fireproof, or NASA-approved. The catalog and relevance ranking are not a validated predictive model or a safety qualification. This response has `INSUFFICIENT_EVIDENCE` status and does not issue a safety verdict.

Question: **“Which NASA tests measured fire in lunar partial gravity?”**

Response: the current verified GRAVIFIRE catalog does not contain a direct lunar or Martian partial-gravity fire experiment record, so EMBER does not name a test. The response limits that claim to locally verified catalog coverage and says microgravity data do not validate partial-gravity transfer.

## Failure behavior and tests

The test suite covers citation linkage, exact ranking parity with the ranking engine, absence of direct partial-gravity evidence, unsupported safety certification, contradictory numeric premises, rejection of untrusted client ranking text, document-index exceptions, and the existing B1, evidence-link, missing-field, causal-refusal, document retrieval, and comparison behavior. Verdict regression tests remain in `tests/challenge-engine.test.ts`; EMBER does not create or map new verdict states. Verified checks: `pnpm test` (33 files, 210 tests passed), `pnpm lint`, `pnpm exec tsc --noEmit --incremental false`, and `pnpm build` all passed. Focused EMBER/verdict tests were rerun after the final response-format adjustment (21 tests passed).

Checks run for this change are recorded in the implementation report. This document describes current local code and catalog coverage, not NASA endorsement or certification.
