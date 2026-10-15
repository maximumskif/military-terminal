# Material-change ratings, financial materiality and syndicated repeats (v0.18)

## Change ratings (`material-change.cjs`, version 1)

Each change on an evidence-update, saved-funding or saved-document alert is rated:

| Change | Rating |
|---|---|
| Headline wording only | minor |
| Event type gains/loses a supported phrase (to/from OTHER_OR_UNCLEAR) | informational |
| Stage advances / moves earlier; other type change | material (positive / unknown) |
| Type becomes cancellation/termination or protest | material, adverse |
| Stated amount newly appears, currency changes, or moves ≥10% | material |
| Stated amount moves <10%, or disappears | minor |
| Response deadline extended | material, adverse (possible delay) |
| Notice inactive after its deadline | minor (likely archival) |
| Notice inactive before/without a deadline | material, adverse |
| Recipient, UEI, contract ID changed or newly reported | material |
| New deobligation; obligation revised; transaction removed | material |
| New obligation ≥5% of prior positive obligations (or no prior) | material, positive |
| New obligation <5% of prior positive obligations | minor |
| Funding date/description/modification only | minor |
| Added/removed document passage with an event phrase or amount | material |

Scope is `action` or `contract`; program-level impact is never inferred. Thresholds are development defaults, not measured; ratings are not verified real-world changes.

## Financial materiality (`financial-materiality.cjs`, version 1)

Stated amount ÷ reviewed parent annual revenue (bands: <1% small, 1–5% notable, ≥5% large), only when all of the following hold:
a USD amount, a valid event/publication date, a recipient UEI/CAGE with a reviewed binding and parent relationship covering that date, and `revenueEvidence` on the parent (`fiscalYearEnd`, `value`, `currency`, `reviewStatus: reviewed_primary_filing`, `sourceUrl`, `sourceSection`, `supportingPassage`) for a fiscal year ending within 18 months before the date. The result is an upper bound: amount type is unverified, multi-year value is not annualized and shared ceilings are not allocated. Otherwise the alert is `not_assessable` with the missing inputs listed. Operational data: RTX Corporation FY2020–FY2025 total net sales (10-K Item 7, cross-checked against XBRL) reviewed revenue for 11 public parents, and 276 UEI bindings (see RECIPIENT-BINDINGS.md). Live 2026 SAM notices are assessable for registrant-level UEIs (Pratt & Whitney, Lockheed Martin, Boeing, L3Harris, SAIC), which bind to the registrant directly; subsidiary bindings stop at the 2025-12-31 relationship evidence.

## Syndicated repeats (`alert-visibility.cjs`)

Exact normalized headline candidates (different hosts, compatible type/amount, within seven days) are collapsed automatically when both alerts are initial matches from the same rule with matching source hashes and frozen snapshots. Groups keep the earliest alert visible; collapsed alerts are excluded from visible unread. A `distinct` review decision, changed evidence or KEEP THIS ALERT VISIBLE (persisted in alert-visibility.json) undoes the collapse. Manual reviewed hides take precedence. Reworded repeats are never auto-collapsed. Match accuracy is unmeasured.
