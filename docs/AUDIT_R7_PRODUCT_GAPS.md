# R7 product gap audit

| Surface | Status | Evidence |
|---|---|---|
| Precomputed R7 adapter | COMPLETE | `src/lib/r7/adapter.ts` loads handover JSON and source rows. |
| Queue / SIBAL PRIORITY-1 | COMPLETE | `VideoDemoClient` queue consumes `missions/M1.json` payload. |
| Verdict card/stamp | COMPLETE | `R7VerdictCard`, `VerdictStamp`; precomputed fields only. |
| Virtual Lab comparison | COMPLETE | M1 branch panes include concurrent, opposed, and refusal branch. |
| EMBER WHY | PARTIAL | Explanation and clickable citations exist; currently concise scripted R7 explanation, not the main Ask runtime. |
| Citation source viewer | PARTIAL | R7 adapter exposes precomputed source rows and highlighted row view; broader archive viewer is separate. |
| Refusal / insufficient card | COMPLETE | TC-SIBAL-SCALE-01, missing evidence, change conditions, R5 next experiments, log-gap local state. |
| Evidence lineage | PARTIAL | Four-family visual exists; selected-lineage matching is simplistic and should be audited before claiming universal lineage. |
| Hold-out proof | COMPLETE | R4 holdout values are rendered only when the whitelist entry matches the source file/render string. |
| Numbers whitelist | COMPLETE | `Proof` checks the whitelist before displaying proof values. |
| Mission Control campaign | SEPARATE | Uses current campaign runtime and does not automatically consume R7 screen data. |

The R7 screen package is a valid capture surface, not a replacement for the campaign or science workspace.
