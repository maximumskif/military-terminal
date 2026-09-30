# Contract Sentinel quality benchmark

Generated: 2026-09-30T22:32:01.522Z

Small development benchmark: headline-stage interpretation, conservative candidate selection, and entity abstention. Not independent human review or production accuracy.

Fixture SHA-256: 059e55dee3c03568db866078da26c83e9136c55e50191c4dc39609a29abb9e0f

Classifier version: 6

## Event classification

Sample: 31; exact agreement: 100.0%.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|
| CANCELLATION_OR_TERMINATION | 2 | 100.0% | 100.0% |
| CONTRACT_MODIFICATION | 1 | 100.0% | 100.0% |
| CONTRACT_VEHICLE_AWARD | 1 | 100.0% | 100.0% |
| DEFINITIVE_CONTRACT_AWARD | 6 | 100.0% | 100.0% |
| DOWN_SELECTION | 1 | 100.0% | 100.0% |
| DRAFT_SOLICITATION | 1 | 100.0% | 100.0% |
| ENACTED_FUNDING | 1 | 100.0% | 100.0% |
| FINAL_SOLICITATION | 1 | 100.0% | 100.0% |
| FUNDED_TASK_OR_DELIVERY_ORDER | 1 | 100.0% | 100.0% |
| GRANT | 1 | 100.0% | 100.0% |
| INDUSTRIAL_EXPANSION | 1 | 100.0% | 100.0% |
| LOAN_OR_GUARANTEE | 1 | 100.0% | 100.0% |
| OPTION_EXERCISE | 1 | 100.0% | 100.0% |
| OTHER_OR_UNCLEAR | 6 | 100.0% | 100.0% |
| PROCUREMENT_FORECAST | 1 | 100.0% | 100.0% |
| PRODUCTION_TRANSITION | 1 | 100.0% | 100.0% |
| PROPOSED_FUNDING | 1 | 100.0% | 100.0% |
| PROTEST_OR_CORRECTIVE_ACTION | 1 | 100.0% | 100.0% |
| PROTOTYPE_AWARD | 1 | 100.0% | 100.0% |
| SOURCES_SOUGHT_RFI | 1 | 100.0% | 100.0% |

Failures:

None in this sample.

## Entity abstention controls

Sample: 6; exact agreement: 100.0%.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|
| unresolved | 6 | 100.0% | 100.0% |

Failures:

None in this sample.

## Duplicate candidate selection

Sample: 10; exact agreement: 100.0%.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|
| candidate | 2 | 100.0% | 100.0% |
| excluded | 8 | 100.0% | 100.0% |

Failures:

None in this sample.

## Limits

This is a development sample labeled by Codex from supplied headline wording and constructed controls, not independent human ground truth or a representative production evaluation. Source links document headline provenance; underlying awards were not verified. Duplicate labels measure candidate eligibility, not whether two real awards are identical. Entity cases test safe abstention only; verified positive bindings: 0. All classifications remain provisional. Confirmed precision is unmeasured; 95% is a proposed target. Unknown or excluded cases remain in the denominators.
