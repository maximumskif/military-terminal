# Classifier v5 to v6 comparison

Same 31-case fixture: 059e55dee3c03568db866078da26c83e9136c55e50191c4dc39609a29abb9e0f

- Stage agreement: 28/31 to 31/31.
- Definitive-award precision: 5/5 to 6/6; recall: 5/6 to 6/6.
- Final-solicitation recall: 0/1 to 1/1.
- Enacted-funding recall: 0/1 to 1/1.
- Duplicate candidate checks: 10/10 in both runs.
- Identity abstention controls: 6/6 in both runs; verified bindings remain unmeasured.

These fixes were tuned against the development sample. Perfect agreement here is not held-out or production performance. Fifteen additional wording controls exercise negation, speculation, draft status, non-procurement awards, and financial separation. Existing detection snapshots remain frozen; classifier-only changes must not create source-change alerts.
