# Requirements adoption and implementation sequence

The supplied MONITOR-REQUIREMENTS.md governs the monitor. Alerts support research; they do not imply a buy/sell recommendation, causal stock-price effect, or probability of profit. The public-market focus does not remove coverage of all U.S. agencies or the earlier interest in public-listing evidence.

## Current build against the specification

| Area | Implemented | Remaining |
|---|---|---|
| Public sources | USAspending award/subaward search and selected-prime transactions; bounded SAM opportunity notices; initial agency/company/news headlines; SEC issuer directory | SAM Contract Awards, forecasts, additional agency and investor-relations sources, committees, protest decisions and SEC filings |
| Social accounts | Supplied candidate handles saved with ingestion disabled | Official-website verification, stable account IDs, change/inactivity monitoring and authorized platform access |
| Event extraction | Simple research cues and SAM's supplied notice type | One primary event type, context, negation, speculation, historical references and linked-document/attachment review |
| Company identity | Exact UEI grouping in results; configured ticker/CIK directory matches | Recipient-to-parent verification, CAGE, joint ventures, ownership effective dates and current listing verification |
| Financial data | Signed transaction obligations and optional SAM notice award amounts kept separately | Base values, ceilings, guarantees, options, attributable allocation, duration, renewal status and conditions |
| Materiality | Single-prime net funding windows | Sourced trailing revenue/backlog, compatible period definitions, attributable value and missing-data safeguards |
| Timing and novelty | First-seen, last-seen, source publication strings, title hashes and same-source/URL duplicate suppression | Timestamp precision/timezone metadata, event-family clustering, earliest known disclosure and meaningful document revisions |
| Alert history | Server-stored headline rules, version matches and read state | Full requested alert format, independent evidence dimensions and defensible HIGH/MEDIUM/LOW priority |
| Market context | None connected | Licensed/public market-data access, detection-time quotes, sessions, spreads, liquidity and benchmarks |
| Validation | Calculation, persistence and ingestion tests | Detection-time evidence freezing, paper tracking, realistic execution costs and separate out-of-sample evaluation |

Existing headline matches remain unverified research leads. A SEC ticker match alone does not verify an award recipient's public parent. A retrieved old transaction does not become a newly awarded contract. Zero funding in a complete date window means no reported net funding in that window, not missing company revenue or an absence of business.

## Revised next priorities

1. **Event and evidence records.** Implement the supplied event taxonomy and a full alert detail view. Default to OTHER_OR_UNCLEAR when context is insufficient. Preserve date-only precision; show absent financial fields as UNKNOWN. Keep source confidence, event certainty, materiality and novelty separate. Acceptance: solicitations, negotiations, proposals, grants, loans, vehicle ceilings and signed awards cannot silently become funded orders.
2. **Read the underlying evidence.** Collect permitted primary documents and accessible attachments, preserving originals/versions or supported extracts and hashes. Identify negation, speculative and historical language. Acceptance: headline-only records cannot be labeled fully reviewed; extracted amounts cite their supporting passage and value type.
3. **Identity and supplier relationships.** Resolve legal recipients and documented parents, subsidiaries and joint ventures using identifiers and effective dates. Add Redwire and BlackSky as research candidates. Acceptance: undisclosed allocations remain UNKNOWN and no unconfirmed supplier receives attributed revenue.
4. **Funding and financial materiality.** Extend transaction collection to company-level histories, then SEC revenue/backlog evidence. Acceptance: prevent double counting, treat deobligations as signed changes, separate cumulative totals from new obligations, and annualize only disclosed duration and attributable values with an approximation label.
5. **Coverage and novelty.** Add SAM award records, forecasts, priority agency/company/committee sources and protest decisions. Improve SAM paging/backfill within account limits. Cluster reposts and repeated announcements by identifiers, recipients, event types and documents. Acceptance: coverage gaps remain visible and syndicated content is not independent corroboration.
6. **Validate and connect social candidates.** Verify each supplied handle through an official organization website, obtain stable IDs through authorized access, and record changes/inactivity. Acceptance: unverified candidates remain disabled; old posts and political announcements route to appropriately labeled research queues.
7. **Market context and paper evaluation.** Freeze available evidence and quotes at detection. Add session-aware returns, benchmarks, volume, spread and liquidity only with supported data. Evaluate positive and negative cases out of sample with realistic costs. Acceptance: pre-detection price moves never appear as achievable strategy returns, and no automatic trades are generated.

Account handles, political offices, ownership, listings and source URLs must be verified when their adapters are implemented. Saving the user-provided watchlist is not that verification. Market data access and X access remain unconfigured. These parameters introduce implementation requirements, not evidence of a proven trading edge.
