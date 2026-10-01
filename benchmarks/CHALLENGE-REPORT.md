# Contract Sentinel quality benchmark

Generated: 2026-10-01T19:12:21.676Z

Separate post-tuning challenge sample of constructed headlines. No classifier changes made against these labels in this milestone. Not independent human ground truth or representative production evaluation.

Fixture SHA-256: 5d88d6105a4d1df7ed13495b8e1ebb20338dbad1be87882f995eebb1fbdcfabd

Classifier version: 6

## Event classification

Sample: 12; exact agreement: 66.7%.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|
| CANCELLATION_OR_TERMINATION | 1 | 100.0% | 100.0% |
| DEFINITIVE_CONTRACT_AWARD | 2 | 100.0% | 50.0% |
| DOWN_SELECTION | 1 | not measured | 0.0% |
| DRAFT_SOLICITATION | 1 | 100.0% | 100.0% |
| ENACTED_FUNDING | 2 | 100.0% | 50.0% |
| FINAL_SOLICITATION | 1 | not measured | 0.0% |
| OPTION_EXERCISE | 1 | 100.0% | 100.0% |
| OTHER_OR_UNCLEAR | 2 | 33.3% | 100.0% |
| SOURCES_SOUGHT_RFI | 1 | 100.0% | 100.0% |

Failures:

- challenge-1: expected FINAL_SOLICITATION; observed OTHER_OR_UNCLEAR. Solicitation paraphrase not used for tuning.
- challenge-3: expected DEFINITIVE_CONTRACT_AWARD; observed OTHER_OR_UNCLEAR. Another colloquial award verb.
- challenge-9: expected DOWN_SELECTION; observed OTHER_OR_UNCLEAR. Preferred bidder is not final award.
- challenge-10: expected ENACTED_FUNDING; observed OTHER_OR_UNCLEAR. Signing paraphrase.

## Entity abstention controls

Sample: 0; exact agreement: not measured.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|

Failures:

None in this sample.

## Duplicate candidate selection

Sample: 0; exact agreement: not measured.

| Label | Support | Precision | Recall |
|---|---:|---:|---:|

Failures:

None in this sample.

## Limits

This is a development sample labeled by Codex from supplied headline wording and constructed controls, not independent human ground truth or a representative production evaluation. Source links document headline provenance; underlying awards were not verified. Duplicate labels measure candidate eligibility, not whether two real awards are identical. Entity cases test safe abstention only; verified positive bindings: 0. All classifications remain provisional. Confirmed precision is unmeasured; 95% is a proposed target. Unknown or excluded cases remain in the denominators.
