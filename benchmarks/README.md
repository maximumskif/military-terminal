# Quality benchmark

The separate `challenge-sample.json` was labeled on October 1, 2026 after classifier v6 tuning. Run `npm run benchmark:challenge` to reproduce its report. It contains twelve constructed wording challenges and currently matches eight labels. Four misses are retained. This is a post-tuning development check, not independently collected or human-reviewed ground truth. No classifier rule was changed against this challenge sample in this milestone.

`tests/entity-bindings.cjs` now exercises synthetic positive and adverse identifier-resolution paths. Synthetic successes do not count as verified operational company mappings. See `RECIPIENT-BINDINGS.md` for the required evidence structure.

Run `npm run benchmark` to regenerate the JSON and readable reports. The runner does not fetch data or alter collected evidence, review decisions, alerts, or classifier rules. Evaluation mismatches are reported rather than hidden or treated as a broken test runner.

Version 1 contains 31 stage examples (27 constructed controls and four collected public headlines), six unresolved-identity controls, and ten constructed announcement pairs. Labels were reviewed by Codex for headline interpretation on September 30, 2026. They are not independent human adjudication or verified award facts. Source URLs and observed publication/detection dates accompany collected examples. Synthetic examples have no source attribution. The sample was deliberately selected and is not representative of live traffic.

Precision is correct predictions divided by all predictions of that label. Recall is correct predictions divided by all expected examples of that label. Zero-denominator metrics are null, not 100%. Every unknown classification and excluded pair remains counted. JSON reports split collected headlines from constructed controls. Entity controls only test safe abstention: no verified positive recipient bindings are available, so company-linking accuracy remains unmeasured. Candidate-selection performance is separate from real-world duplicate correctness.

Next evaluation work: independently adjudicate a larger stratified sample, add verified identifier/date bindings and adverse cases, reserve a held-out set before rule tuning, and compare baseline versus new versions on unchanged labels. Record label corrections with reasons and increment fixture version. Reaching 95% confirmed precision is a proposed target; no confirmed classifications are made today.
