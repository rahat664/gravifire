# Evidence applicability and mission-condition contract

## Scope

The applicability layer compares source-reported NASA experiment conditions to a user-entered hypothetical mission profile. Its output is an **interpretation of condition similarity** (`MATCHED`, `MISMATCHED`, or `UNKNOWN`), not an experiment verdict, fire-behavior prediction, safety decision, or certification. Existing mission verdict enums (`EXACT`, `BOUND`, `INSUFFICIENT`, `CONTRADICTED`, `REFUSAL`, `SYSTEM_TEST`) and challenge verdict contracts are unchanged.

The implementation is in `src/types/applicability.ts`, `src/lib/evidence-applicability.ts`, and `src/components/applicability/ApplicabilityExplorer.tsx`; the interactive page is `/applicability`. Source records are the existing normalized `NASAExperimentRun` records and verified FLEX-2 `FLEX2ConfigurationEnvelope` records. No generated normalized JSON was edited.

## Evidence and provenance model

Each condition retains its value, display unit, raw value, raw/source unit, source field, origin state and a `MissionEvidenceReference`. References retain the source investigation, family, record ID, URL, raw source value, source unit and a note with source file, row and SHA-256 where that manifest provenance exists. Run records use their existing source and provenance; FLEX-2 envelopes retain their own source fields and configuration-envelope type.

Condition origins are `SOURCE_REPORTED`, `SOURCE_CONTEXT`, `DERIVED_FROM_SOURCE`, `NOT_REPORTED`, and `HYPOTHETICAL_SCENARIO`. A source-reported label never implies an instrument measured it: in particular, ISS / microgravity text is qualitative investigation context, not a numeric gravity measurement. FLEX-2 settings are ranges or discrete option sets; they are not relabeled as selected run conditions or measurements.

| Source family | Conditions surfaced when the normalized source reports them | Deliberate unknowns / qualifications |
| --- | --- | --- |
| BASS-II | Initial oxygen from an exact source gas measurement; material description; explicit microgravity investigation context | Fan and air display are not physical airflow; pressure and geometry are not inferred |
| SAFFIRE-I / II | Exact oxygen, airflow and sample dimensions where exact normalized fields exist; material; ISS context only if explicit microgravity wording exists | Sample shape and pressure are not inferred; range/approximate oxygen is not treated as an exact scalar |
| SAFFIRE-III | Exact source airflow and dimensions | No combustion outcome, oxygen or pressure is inferred from the dimensional table |
| SAME / SAME-R | Exact airflow/inlet velocity and source material/sample description | Aging and sensor fields are not labeled as fire outcomes; oxygen, pressure and gravity remain unknown unless source context explicitly says otherwise |
| FLEX | Exact oxygen mole fraction, pressure, fuel, and droplet diameter where present | Droplet is the only explicitly represented geometry; no solid-sample dimensions or airflow are inferred |
| FLEX-2 | Fuel configuration, oxygen and pressure option sets, airflow and droplet-size ranges as an experiment configuration envelope | No run selection, gravity, or fire outcome is invented from a configuration envelope |

These rules are applied per record, not merely per family: absent, non-exact, or source-ambiguous values remain unknown.

The registry exposes gravity, oxygen fraction, pressure, airflow, fuel/material, sample geometry, sample size, and measurement type. An absent value stays null. No BASS-II fan/air display is translated into physical airflow. Sample dimensions only appear where normalized run parameters provide them; size remains a source-described string where multiple axes are reported. Measurement type lists populated normalized observations and fields with exact source status. It does not assume that aging, weight loss, or sensor records are fire outcomes.

## Unit and comparison rules

- FLEX mole fraction is converted to percent by multiplying by 100; both the original value and `mole fraction` source unit are retained.
- FLEX pressure in mmHg is converted to kPa with factor `0.133322368`.
- FLEX-2 option-set pressure in atm is shown in kPa with factor `101.325`; source option values, raw text and `atm` source unit remain attached.
- FLEX-2 option sets and numeric ranges are represented as descriptive strings. Comparing such a set/range to one mission scalar produces `UNKNOWN`, not a match based on membership or an invented run assignment.
- Numeric run-level values match only on exact equality after declared unit normalization. The sources do not establish a general measurement-uncertainty tolerance, so no tolerance is invented. Text labels compare case-insensitively for exact textual equality only; the UI says this does not prove material or geometry equivalence.
- A match is not evidence of equivalent fire behavior. A mismatch is not evidence of safety or failure.

## Mission scenarios

The selectable profiles are spacecraft, lunar habitat, Mars habitat, and pressurized rover. Lunar and Mars profiles start with qualitative `PARTIAL_GRAVITY`; spacecraft starts with qualitative `MICROGRAVITY`; rover gravity is unknown. These labels are scenario assumptions, not numerical setpoints. Oxygen, pressure, airflow, fuel/material, geometry, sample size and measurement type are blank until the user supplies hypothetical values. Switching profiles resets to those documented assumptions. User-entered values have no source reference and remain `HYPOTHETICAL_SCENARIO`.

When source context is microgravity and the selected mission regime is partial gravity, the system reports a gravity mismatch and an explicit transferability warning. No numerical lunar or Mars gravity is inferred here.

## Scientific content classes and refusal boundary

- `MEASURED_RESULT`: populated normalized measurement fields whose source status is exact in the run record. The measurement-type row lists those fields and cautions that an environmental input, aging/sensor record and combustion outcome have different roles. These values remain in the NASA source record.
- `MODELED_RESULT`: none is generated by this feature.
- `SOURCE_REPORTED_CONDITION` / `CONFIGURATION_ENVELOPE`: experimental source inputs and setup records, preserved with their source qualification.
- `INTERPRETATION`: the applicability comparison labels and explanations.
- `HYPOTHETICAL_SCENARIO`: user-profile assumptions only.

Every comparison returns `NO_SAFETY_OR_CERTIFICATION_CONCLUSION` and includes explicit limits. GRAVIFIRE does not claim NASA certification or material safety. The UI retains the existing verdict contracts separately and does not map applicability labels into them.

## Validation and regression coverage

`validateConditionSet` ensures all dimensions exist and that unknown, source-backed and hypothetical states are internally consistent. `validateNASAConditionEvidence` checks verified run data status where applicable, source URL schemes, source-record identity, field/raw-value correspondence and duplicate reference IDs. `tests/evidence-applicability.test.ts` covers the full normalized run catalog, source links, duplicate references, missing-state consistency, mission assumptions, partial-gravity warnings, conversion provenance, and FLEX-2 option/range behavior.

## Known limits

- The comparator is intentionally not an outcome-transfer model; it does not adjust for microgravity versus partial gravity beyond flagging the evidence-domain gap.
- Most mission environmental conditions are not pre-filled because the app does not establish authoritative mission-specific habitat setpoints.
- Investigation-level contextual gravity can be unavailable even where a mission was conducted aboard ISS; only explicit source environment text mentioning microgravity is surfaced as that context.
- FLEX-2 configuration envelopes do not provide run-level gravity or measured fire outcomes in this comparison.
- Source record semantics and any source conflicts remain governed by their existing ingestion contracts. This layer does not repair or override them.
