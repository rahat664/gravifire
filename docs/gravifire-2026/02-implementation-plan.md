# GRAVIFIRE 2026 Challenge Implementation Plan

**Prepared:** 2026-11-13  
**Basis:** [Challenge requirements matrix](02-requirements-matrix.md) and [baseline audit](01-baseline-audit.md).  
**Scope:** Sequencing only. No application implementation was changed in this step.

## Product boundary

Build the missing challenge layer as an explainable investigation-relevance and evidence-synthesis workflow that reuses GRAVIFIRE’s existing PSI data, provenance, grounded answer, comparison, and uncertainty systems. Keep three concepts separate:

1. **Investigation relevance:** whether a study’s data and conditions address a user’s mission question.
2. **Evidence interpretation:** what source records show, with direct/analogical/out-of-domain applicability.
3. **Operational safety judgment:** not produced or certified by GRAVIFIRE.

“SI-powered” is not defined as a model class in the statement reviewed. Do not scope general superintelligence or predictive combustion as a prerequisite. Disclose that current retrieval and recommendation logic is deterministic, and do not label information value or investigation relevance as fire/material risk.

## Critical path

### 0. Resolve statement/source uncertainty

- Retry the official challenge page’s Resources tab and capture the actual resource URLs.
- Retrieve the YouTube transcript from the official transcript panel, if available; until then video claims remain unverified.
- Compare the full statement reproduction against official text, especially mission atmosphere values and the partial-gravity status claim.
- Record source versions and retrieval dates in the requirements matrix.

**Exit:** primary-source requirements/resources are confirmed or remain explicitly marked unavailable; no video-derived requirement is used without transcript evidence.

### 1. Define the challenge domain model and taxonomy

Add a reviewable contract before coding:

- Mission profile fields: mission/habitat type, gravity regime, material/application, oxygen concentration, pressure, airflow, geometry, and target need (prevention/detection/suppression).
- Study summary fields: investigation purpose, fuel/material/sample, apparatus/hardware, environment, measurements/sensors, available condition ranges, record type/count, source refs, and limitations.
- Relevance result fields: stable rank, rationale, matched/missing dimensions, source coverage, and scoring-policy version.
- Interpretation states: source-reported observation, derived synthesis, analogical evidence, insufficient evidence, and out-of-domain condition.
- Traceability requirements matching R-05; no inferred numerical defaults when a source field is missing.

Do not put mission-response simulation or safety certification into this contract.

**Exit:** schema and a small hand-reviewed set of profiles/studies cover at least one prevention case (BASS-II/SAFFIRE), one detection case (SAME/SAME-R), and one suppression case (FLEX), plus an intentionally out-of-domain case.

### 2. Implement P0 summary, relevance ranking, and interpretation

- Extend/compose investigation summaries from typed source data and existing `nasaInvestigations` metadata.
- Rank investigations for a chosen mission profile and fire-safety need using explicit deterministic criteria. The first version can use clear rule matches and coverage; avoid presenting an opaque numeric score as scientific risk.
- Add a user-facing path that searches/filters, opens a summary, shows ranked relevance, and opens an interpretation with supporting source records.
- Reuse challenge findings, evidence references, data-status labels, and existing family-specific resolvers where valid.
- Show missing, incompatible, or un-ingested conditions as such. Do not equate a related material or nearest record with direct evidence.

**Exit:** all R-01–R-05 acceptance criteria pass; repeatable rankings, source links, scopes, missingness, and abstention behavior have automated coverage.

### 3. Complete P1 prevention, detection, suppression, and environment coverage

- **Prevention:** connect material flammability/spread evidence from BASS-II and SAFFIRE to mission-profile relevance; clearly flag BASS PSI-26 as not ingested.
- **Detection:** synthesize SAME/SAME-R smoke/aerosol source conditions and available measurements; do not state detector performance unless directly represented by the source records.
- **Suppression:** summarize FLEX suppressant/extinction evidence and applicable conditions; keep it separate from BASS solid-fuel evidence and from fictional M0 choices.
- **Environment:** provide spacecraft/station/lunar/Martian-base/pressurized-rover profiles, marking assumptions and source support for each profile. Compare oxygen, pressure, airflow, material, geometry, and gravity only where the relevant fields and units are defensible.
- **Gravity:** direct microgravity evidence, 1-g references, electric-field analogs, and absent partial-gravity measurements must have visibly different labels.

**Exit:** user can inspect the coverage boundary for each domain/profile and see why the ranked evidence is direct, analogous, or insufficient.

### 4. Add validated source coverage extensions (P2)

- Check PSI/NTRS source availability for ACME/BRE/CFI/E-FIELD, SLICE, DAFT/DAFT-2, and any other challenge-listed studies.
- Ingest each family only after schema, identifier semantics, units, validation, source hashes, and provenance are reviewed.
- Keep un-ingested source metadata visibly separate from validated runtime records.
- Consider Earth-application research mapping only after the spaceflight workflow is stable.

**Exit:** each extension has a source-backed ingestion report and retains raw-vs-normalized values and uncertainty; no synthetic records appear as NASA observations.

### 5. Revisit prediction and interactive incident mechanics only if justified

- A predictive model is an optional challenge consideration, not a P0. First establish an outcome dataset, held-out validation, applicable-domain checks, calibration/uncertainty, and refusal behavior. Do not train/infer from parameter-only records with unknown outcomes.
- Do not model M0 suppression efficacy from its narrative options. If the campaign later needs a response simulation, define it as a separate, explicitly fictional training model with provenance and validation boundaries; it must not alter NASA evidence interpretation.

## Work packages and priority

| Package | Requirement IDs | Priority | Depends on |
|---|---|---|---|
| W0: Primary-source verification | unresolved issues 1–3 | Gate | None |
| W1: Mission/study/interpretation schemas | R-02–R-05, R-09–R-11 | P0 foundation | W0 |
| W2: Investigation summaries and interactive flow | R-01–R-02 | P0 | W1 |
| W3: Explainable mission-relevance ranking | R-03, R-05, R-09 | P0 | W1, W2 |
| W4: Evidence-backed interpretation | R-04–R-05 | P0 | W1–W3 |
| W5: Prevention/detection/suppression coverage | R-06–R-08 | P1 | W1–W4 |
| W6: Mission conditions and gravity applicability | R-09–R-11 | P1 | W1–W5 |
| W7: Broader PSI/NTRS ingestion and Earth application | R-12, R-15 | P2 | W0, W5–W6 |
| W8: Predictive-model research | R-13 | P2 / optional | Validated outcome evidence and W1–W6 |

## Minimal critical path

1. Confirm the official Resources list and retry video captions; retain the current source caveats until successful.
2. Agree the mission-profile, investigation-summary, relevance, interpretation, and traceability contract.
3. Build the smallest end-to-end dashboard path over already validated studies covering BASS-II/SAFFIRE (prevention), SAME/SAME-R (detection), FLEX (suppression), and one out-of-domain mission profile.
4. Meet every P0 acceptance criterion from `02-requirements-matrix.md`, including stable explainable ranking, clickable evidence, data/uncertainty labels, and abstention.
5. Only then expand environment profiles or ingest additional investigation families.

## Verification gates for implementation turns

- Each visible fact links to a raw/normalized NASA record, NASA PSI investigation page, or source document.
- Each displayed ranking is reproducible from the same profile and dataset version and includes its rationale and policy version.
- Missing values remain missing; configuration envelopes, observations, and run outcomes remain semantically distinct.
- The user can see whether evidence is direct, analogous, contradictory, or absent for the selected conditions.
- Science summaries cannot turn mission context or a fictional mission choice into a measured fire outcome or safety certification.
- Preserve the baseline branch/user changes and NASA/generated data; do not run output-generating ingestion or build commands without an explicit artifact-preservation plan.
