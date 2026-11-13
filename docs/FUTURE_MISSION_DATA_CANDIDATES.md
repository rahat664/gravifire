# Future Mission Data Candidates

This shortlist is generated from evidence that is already present in the
current normalized runtime. It does not implement M2, M3, or M5 and does not
turn a source record into a prediction.

## SAFFIRE-III / PSI-100 S1–S2

- Why interesting: SIBAL source rows preserve concurrent and opposed flow
  direction, physical dimensions, and camera identifiers after the M1/M4
  campaign sequence.
- Directly claimable: the PSI-100 table records the listed source values for
  S1 and S2.
- Not claimable: burn duration, spread rate, oxygen, ignition outcome, or a
  causal effect of direction; those fields are not present in this table.
- Gameplay concept: a provenance audit mission about source conflicts and what
  a later flight table does and does not add to the Saffire comparison.

## BASS-II / PSI-25 B1 and the validated run set

- Why interesting: BASS-II has 129 validated records with structured oxygen,
  CO2, CO, sample, and instrument fields, plus a linked B1 video asset.
- Directly claimable: the normalized runtime reports source-table values and
  the B1 media provenance link.
- Not claimable: a universal suppression result, causal mechanism, or any
  interpretation not represented in the source fields and linked documents.
- Gameplay concept: trace one instrument record from source row to evidence
  media and document context.

## SPICE / PSI-107 observation records

- Why interesting: 469 operating-condition observations expose fuel, nozzle,
  fuel-rate, and air-rate coverage with explicit duplicate and missing-value
  handling.
- Directly claimable: the source contains operating-condition observations;
  the runtime does not treat each row as an independent flame.
- Not claimable: a smoke-point result, flame-length result, or one-to-one test
  count from the row count.
- Gameplay concept: build a coverage map while distinguishing observations
  from experiments.

## FLEX-2 / PSI-68 configuration envelopes

- Why interesting: eight validated configuration envelopes define fuel,
  pressure, oxygen, temperature, gas-mixture, and flow options.
- Directly claimable: those options are present in the source configuration
  records.
- Not claimable: every Cartesian combination was flown, or any burn/extinction
  outcome for an unobserved combination.
- Gameplay concept: design a next-experiment envelope without simulating its
  result.

## PSI-26 BASS source archive

- Why interesting: the merged repository contains PSI-26 metadata and research
  documents.
- Directly claimable: source metadata and research context are available.
- Not claimable: a validated PSI-26 run-level result in the current GRAVIFIRE
  runtime. The family remains SOURCE_AVAILABLE_BUT_NOT_INGESTED.
- Gameplay concept: a future ingestion-audit mission only after a family
  schema, parser, validator, and provenance review are completed.
