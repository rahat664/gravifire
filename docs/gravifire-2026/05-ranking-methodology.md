# NASA investigation relevance ranking methodology

## Purpose and scope

The investigation ranking is a deterministic discovery aid at `/recommend/investigations`. It orders the investigations in the verified coverage registry for a mission type, research pillar, cataloged material, scientific-question text, and optional environmental conditions. It ranks **research relevance**, not material safety, fire safety, evidence strength, NASA endorsement, or certification. It does not replace `/recommend`, whose existing `Coverage Gap Ranking v1` proposes under-sampled BASS-II conditions.

Implementation: `src/lib/investigation-ranking.ts`, types in `src/types/investigation-ranking.ts`, UI adapter in `src/components/recommendations/InvestigationRankingExplorer.tsx`, and tests in `tests/investigation-ranking.test.ts`. Inputs come from `nasaInvestigationCoverage`, `nasaInvestigations`, and the Step 4 evidence applicability adapters. No language model or generated score is used.

## Score

Each factor is in the closed interval 0..1. The displayed total is rounded to six decimal places for output and to three places in the UI.

| Factor | Weight | Rule |
| --- | ---: | --- |
| Mission relevance | 0.30 | Fixed mapping between the selected mission profile and the registry-assigned research pillar(s); use the highest assigned pillar score for an investigation. |
| Material / phenomenon applicability | 0.25 | Arithmetic mean of (a) exact informative question-token overlap against cataloged title, family, pillar, category, materials, capabilities, and normalized source material labels and (b) exact material-label match. An unspecified component is neutral at 0.50; a specified but unmatched component scores 0. |
| Environmental condition match | 0.20 | For the supplied conditions plus the qualitative gravity assumption of the selected mission profile, select the linked run/configuration record with the most matches. Score is matches divided by all active condition dimensions. Mismatch and unknown each receive zero match credit. |
| Evidence completeness | 0.25 | Verified integrations score by presence of four provenance artifacts: hashed source manifest, hashed raw source, normalized artifact, and ingestion report. Reference-only is capped at 0.20; unavailable/unverified is 0. |

The total is:

```text
0.30 × mission relevance
+ 0.25 × material / phenomenon applicability
+ 0.20 × environmental condition match
+ 0.25 × evidence completeness
```

### Mission-to-pillar mapping

These are explicit product relevance judgments for discovery, not empirical probabilities or NASA priorities. They are stored as constants in the engine, versioned by `NASA Investigation Relevance v1`.

| Mission profile | Solid material flammability | Spacecraft material flammability | Smoke / aerosol detection | Droplet combustion / extinguishment |
| --- | ---: | ---: | ---: | ---: |
| Spacecraft | 0.85 | 1.00 | 0.90 | 0.70 |
| Lunar habitat | 0.90 | 0.80 | 1.00 | 0.75 |
| Mars habitat | 0.90 | 0.80 | 1.00 | 0.75 |
| Pressurized rover | 0.90 | 0.80 | 0.95 | 0.75 |

The score is the maximum value among an investigation's registry-assigned pillars. Missing pillar metadata results in 0, not an inferred match. Mission-specific oxygen, pressure and airflow values are not assumed; the UI leaves those conditions blank. The qualitative gravity default is inherited from Step 4: microgravity for spacecraft, partial gravity for lunar/Mars habitats, unknown for a pressurized rover. This qualitative profile assumption is visible in the UI and counted as an active comparison dimension unless the user overrides it.

## Query and filter behavior

- Research-pillar selection is an exact registry filter.
- Material selection is an exact normalized label match against catalog metadata and verified normalized run/configuration material labels. Investigations with no matching label are excluded from that filtered result; unknown materials are never inferred from neighboring records or research prose.
- Question matching uses lowercase, unique, sorted alphanumeric tokens and removes this fixed stop-word set: `about`, `after`, `again`, `against`, `and`, `are`, `can`, `does`, `for`, `from`, `how`, `into`, `that`, `the`, `their`, `them`, `this`, `through`, `under`, `using`, `what`, `when`, `where`, `which`, `with`, `would`. It uses exact tokens, with no stemming, synonym expansion, embedding, or semantic interpretation. The material/phenomenon score uses matched query tokens divided by all remaining informative query tokens. If no query is entered, the question component is neutral at 0.50 for every candidate. An optional filter can require at least one exact catalog token match.
- Optional environmental conditions use the same typed source record extraction and `MATCHED` / `MISMATCHED` / `UNKNOWN` comparison as Step 4. Exact condition filtering requires a single linked record that matches every active condition. Unknown dimensions cannot pass that filter.
- `topN` is optional in the API; the UI shows all filtered candidates.

## Missing-data and status treatment

An unknown experimental condition receives no environmental match credit. If no condition is requested, the environmental factor is 0 with an explanation; it is not redistributed to the other factors. If source records are not linked, the investigation receives zero environmental points and the missing link is explained. Missing question terms remain in the denominator, reducing lexical applicability. Missing pillars receive zero mission credit. Missing integration artifacts lower completeness.

`verified_and_ingested` means this repository has the registry-described normalized evidence artifacts; run counts communicate local coverage, not scientific quality. `reference_only` entries remain discoverable, visibly carry the reference-only label, have no verified run-level environmental match credit, and have completeness capped at 0.20. `unavailable_or_unverified` entries receive zero completeness. Metadata absence never creates a confidence bonus.

The result includes factor scores, matched/missing terms and condition dimensions, selected supporting record ID, PSI reference URL, status, local record count/kind, and investigation limitations. Ties are resolved by stable investigation ID order after descending score. The engine uses no timestamps or randomness, so the same catalog and request produce byte-equivalent JSON output.

## Reproducible example from verified metadata

Request:

```json
{
  "missionType": "SPACECRAFT",
  "researchPillar": "solid_material_flammability",
  "material": "PMMA",
  "scientificQuestion": "How does oxygen affect PMMA flame spread?",
  "conditions": { "oxygenFraction": 22.2 }
}
```

Verified result under `NASA Investigation Relevance v1`:

| Rank | Investigation | Status and source | Mission | Material / phenomenon | Conditions | Completeness | Total |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | BASS-II (`PSI-25`) | `verified_and_ingested`, 129 local records | 0.85 | 0.90 | 1.00 | 1.00 | **0.930** |

Condition support record: NASA source record `B1`; the selected spacecraft profile contributes qualitative `MICROGRAVITY` and the request supplies 22.2% oxygen. The normalized BASS-II record reports microgravity investigation context and an exact initial oxygen value of 22.2% (PSI-25 Experimental Table; source hash and row are retained in normalized provenance). The PSI source page is [NASA PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25). This is condition similarity only; it does not infer an outcome or safety status.

Reproduction command from the repository root:

```powershell
pnpm exec tsx -e "import { rankNASAInvestigations } from './src/lib/investigation-ranking'; console.log(JSON.stringify(rankNASAInvestigations({missionType:'SPACECRAFT',researchPillar:'solid_material_flammability',material:'PMMA',scientificQuestion:'How does oxygen affect PMMA flame spread?',conditions:{oxygenFraction:22.2}}),null,2));"
```

## Verification

`tests/investigation-ranking.test.ts` verifies deterministic results and stable tie ordering; pillar, material and question filtering; reference-only status and completeness cap; unknown-condition zero credit; exact-condition filtering; and that reference-only missing data does not outscore verified BASS-II on completeness or lexical applicability for a flame-spread question. The engine does not modify evidence verdict enums or the existing BASS-II coverage-gap recommendation algorithm.
