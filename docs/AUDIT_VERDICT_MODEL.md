# Verdict model audit

## Campaign model

- `EXACT`: direct source comparison/result displayed from current campaign evidence.
- `BOUND`: relevant material evidence exists but the fictional application or important conditions differ.
- `INSUFFICIENT`: current archive cannot support the requested conclusion.
- `CONTRADICTED`: a recorded prediction conflicts with the observed/source result.
- `REFUSAL`: GRAVIFIRE deliberately declines unsupported extrapolation, especially the M6 combined Mars-habitat condition.

Campaign `EXACT` is an evidence display state, not certification. M1/M4 use prediction comparison separately from the formal source verdict.

## R7 model

`/video-demo` renders precomputed R7 values such as `SUPPORTED`, `CONTRADICTED`, and `INSUFFICIENT` from the handover bundle. It has its own `VerdictStamp`/`R7VerdictCard`; it must not be silently mapped to campaign `EXACT` or `REFUSAL`.

## Recommendation

Keep the two vocabularies separate in code types and UI labels. Add an explicit adapter only when a product surface needs to explain the relationship. Never derive a safety classification, confidence, or grade in the browser.
