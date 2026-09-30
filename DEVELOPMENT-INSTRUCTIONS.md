MILITARY TERMINAL / CONTRACT SENTINEL — DEVELOPMENT INSTRUCTIONS

Repository: https://github.com/maximumskif/military-terminal

OBJECTIVE

Improve the existing project into a reliable government-contract intelligence platform that tracks upcoming procurements, awards, funding changes, and related disclosures; maps them to publicly traded companies; and helps users research potentially market-relevant developments.

The end goal is a fully functional product that can be used by the general public and eventually sold as a subscription service.

Preserve the terminal-style design while improving usability, reliability, and clarity.

Inspect the current repository before implementing changes. Identify what is already implemented, partially implemented, missing, or superseded. Build on working functionality rather than replacing it unnecessarily.

The technical findings below came from a review of commit 9b13ffbd27987c6cfff1ca691b3a1f968acc091c. Verify whether they still apply before making changes.

Do not stop after generating another roadmap. Implement the work in phases, starting with reliability and data correctness.


CORE PRODUCT WORKFLOW

The finished product should let a user:

1. Follow a company, agency, program, or procurement topic.
2. Discover a relevant new development.
3. Understand exactly what changed.
4. Identify the contractor and its verified publicly traded parent.
5. Distinguish potential contract value from actual funding.
6. Inspect the underlying evidence.
7. Save research and receive future updates.

Clearly distinguish confirmed facts, extracted information, estimates, and unresolved questions.

Do not assume that a contract announcement creates a profitable trade.


PHASE 0 — FIX RELIABILITY AND DATA CORRECTNESS

0.1 — Repair SAM checkpoint concurrency

- Inspect sam-checkpoints.cjs.
- A previous simulated reproduction found that calling status() during an in-flight collection could replace the state object being updated.
- The request completed successfully, but its records and checkpoint progress were not retained.
- Make status reads side-effect free.
- Preserve active writer state across asynchronous operations.
- Use atomic persistence.
- Add regression coverage for dashboard polling during collection, interrupted collection, and restart recovery.

Acceptance criteria:
- Status polling cannot interfere with collection.
- Successful responses persist their records and checkpoints.
- Interrupted jobs resume without silent data loss or duplicate events.


0.2 — Improve event classification

- Fix handling of realistic phrases such as “Company awarded a $200 million contract.”
- Support currency symbols, written amounts, award variations, modifications, options, and multiple events in a document.
- Distinguish solicitations, selections, awards, funding actions, and company statements.
- Preserve uncertainty when the wording does not justify a definitive classification.
- Add realistic announcement fixtures rather than testing only simplified phrases.

Acceptance criteria:
- Common award language is classified correctly.
- Ambiguous statements remain visibly uncertain.
- Classification changes do not create false confirmed awards.


0.3 — Correct timestamp and staleness handling

Store these separately:

- source_published_at
- source_publication_precision
- first_observed_at
- last_successful_fetch_at
- last_attempted_check_at
- processed_at

Requirements:
- Handle date-only publication values consistently.
- Do not invent an exact publication time.
- Reprocessing cached data must not make it appear newly retrieved.
- Calculate source freshness from successful upstream checks.
- Preserve original observation timestamps through reprocessing.


0.4 — Improve source health reporting

Support these states:

- Healthy
- Delayed
- Quota-limited
- Failing
- Disabled
- Never successfully collected

Display:
- Last successful collection.
- Last attempted collection.
- Next scheduled attempt.
- Consecutive failure count.
- Useful error description.
- Quota or rate-limit status.
- Historical coverage limitations.

A repeatedly failing source must not appear healthy simply because another attempt was scheduled.


0.5 — Separate collector ownership from user actions

- Keep ingestion ownership separate from user-owned writes.
- A dashboard connected to a standalone worker must still allow watchlist edits, alert rules, and read-state changes.
- Audit funding refreshes and other writes for consistent ownership and locking.
- Make configuration status reflect the active collector.
- Document that a local PID lock is not a distributed lock.


0.6 — Improve storage and response behavior

- Stop returning the entire evidence collection on every dashboard request.
- Add server-side pagination, filtering, and sorting.
- Avoid reclassifying unchanged historical records.
- Make the data directory explicitly configurable.
- Use atomic persistence immediately.
- Move to transactional shared storage before supporting multiple users.


0.7 — Reconcile documentation

- Update README instructions to match actual behavior.
- Resolve inconsistent version identifiers.
- Document worker and dashboard startup clearly.
- Document credentials and optional integrations.
- Label older plans as historical.
- Maintain one authoritative setup and operating guide.


PHASE 1 — COMPLETE THE CORE RESEARCH EXPERIENCE

Initial scope:
- Approximately 30–50 publicly traded defense and aerospace companies.
- Relevant subsidiaries and contractor aliases.
- Configurable coverage so the universe can expand later.


1.1 — Create a canonical event model

Separate source documents from real-world events.

A government announcement, company release, and news article may describe the same event. Link them when evidence supports the relationship.

Do not merge separate awards merely because their headlines resemble each other.

Each event should include:

- Internal event ID.
- Event type.
- Procurement stage.
- Agency.
- Program.
- Contractor.
- Verified public parent.
- Ticker, where verified.
- Contract identifiers.
- Solicitation identifiers.
- Original source identifiers.
- Linked documents.
- Financial amounts and amount types.
- Publication and observation timestamps.
- Classification confidence.
- Entity-resolution confidence.
- Extraction version.
- Correction history.


1.2 — Model procurement stages accurately

Support:

- Forecast.
- Sources sought.
- Solicitation.
- Selection.
- Award.
- Modification.
- Cancellation.
- Completion.

Requirements:
- Allow missing stages, branching, multiple recipients, and uncertain relationships.
- Do not treat a solicitation as an award.
- Do not treat selection as confirmed funding.
- Do not force every procurement into a perfectly linear sequence.


1.3 — Build verified company resolution

Map:

Contractor → Subsidiary → Public parent → Ticker

Requirements:
- Store evidence supporting each relationship.
- Store effective dates.
- Account for acquisitions, renamed entities, and ticker changes.
- Support unresolved and ambiguous matches.
- Avoid assigning a ticker based only on similar company names.
- Provide an administrative correction workflow.
- Preserve historical mappings for point-in-time research.


1.4 — Separate financial amount meanings

Represent these independently:

- Contract ceiling.
- Obligations from the reported action.
- Cumulative obligations, when available.
- Potential option value.
- Performance period.
- Shared multiple-award ceiling.
- Unknown recipient allocation.

Requirements:
- Preserve negative obligations and deobligations.
- Do not interpret a ceiling as revenue.
- Do not assume one recipient receives an entire shared ceiling.
- Prevent double-counting modifications and previously reported totals.
- Show unknown values explicitly.


1.5 — Build an evidence drawer

For each important claim, display:

- Source title.
- Source URL.
- Supporting passage.
- Publication date and precision.
- First observation time.
- Extraction status.
- Whether the claim is source text or automated interpretation.

Requirements:
- Retain document versions and hashes where permitted.
- Show missing or incomplete evidence.
- Preserve correction history.
- Make verification possible without searching through unrelated documents.


1.6 — Unify alert behavior

- Consolidate browser-local and server-persisted alerts.
- Use consistent matching and deduplication.
- Handle event updates separately from new events.
- Preserve the event snapshot that triggered each alert.
- Do not silently rewrite old alerts when classifications change.
- Support watchlists, saved rules, and read states through one coherent system.


1.7 — Build company research pages

Include:

- Event timeline.
- Verified subsidiaries.
- Related programs.
- Observed awards.
- Funding changes.
- Negative developments.
- Source coverage.
- Watch controls.
- Saved research.

Clearly distinguish observed contracting activity from comprehensive company exposure.


1.8 — Establish a quality benchmark

- Create a manually reviewed sample of realistic events.
- Include awards, solicitations, modifications, speculative statements, old announcements, and ambiguous company names.
- Measure classification precision and recall separately.
- Measure entity-resolution accuracy separately.
- Report unresolved cases and sample size.
- Use at least 95% precision for “confirmed” classifications as a proposed target, not an achieved claim.
- Do not improve apparent precision by silently hiding most relevant events.

Phase completion:
A new user can follow five companies, inspect an event, understand its financial meaning, and verify its evidence without reading internal documentation.


PHASE 2 — ADD DIFFERENTIATED RESEARCH FEATURES

2.1 — Material-change alerts

- Detect changes in funding, deadline, recipient, scope, options, and cancellation status.
- Display previous value, new value, and supporting evidence.
- Suppress repeated alerts for unchanged syndicated announcements.
- Explain why the change matters to the user’s saved rule.


2.2 — Program dossiers

- Group related solicitations, awards, modifications, budget references, protests, and company disclosures.
- Present a sourced timeline.
- Explain uncertain relationships.
- Allow users to follow a program independently of a company.


2.3 — Selection-to-funding tracker

- Track the progression from announcement or selection to award and obligation evidence.
- Show which stages are confirmed.
- Identify what remains unverified.
- Alert when new evidence confirms or changes the earlier interpretation.


2.4 — Company exposure map

- Organize observed contracting activity by agency, program, subsidiary, and business segment.
- Show coverage limitations.
- Avoid presenting incomplete award data as complete revenue exposure.
- Keep supported financial measures separate from inferred relationships.


2.5 — Negative-development monitoring

Track:

- Deobligations.
- Cancellations.
- Delays.
- Terminations.
- Adverse modifications.

Explain whether each development affects one action, one contract, or a broader program.


2.6 — Recompete calendar

- Surface approaching performance-end dates.
- Track explicitly identified follow-on opportunities.
- Distinguish inferred research dates from official deadlines.
- Support reminders and watch rules.
- Do not imply that every expiring contract will be recompeted.


2.7 — Research notebooks

- Allow users to save a thesis, supporting evidence, open questions, and updates.
- Attach notes to companies, programs, and events.
- Start with private notes.
- Add shared team research later.
- Preserve source references when notes are exported.


2.8 — Coverage-aware search

- Show which sources and periods were searched.
- Identify unavailable sources and incomplete historical coverage.
- Make clear that no results does not prove no relevant activity occurred.
- Provide useful filters for company, agency, stage, amount type, date, and confidence.


2.9 — Explainable relevance ranking

Keep these dimensions separate:

- Company relevance.
- Source reliability.
- Novelty.
- Financial certainty.
- Potential materiality.

Requirements:
- Explain why an event ranks highly.
- Let users adjust relevance preferences.
- Avoid an unexplained “profit potential” score.
- Avoid treating a large headline amount as automatically material.


2.10 — Missing-evidence prompts

Show what would strengthen or change an assessment.

Examples:
- Missing award identifier.
- Unclear recipient allocation.
- Unverified public-parent mapping.
- No confirmed obligation amount.
- Unclear relationship to an earlier announcement.


2.11 — Observation timing

- Record when this system first observed a development.
- Link subsequent corroborating disclosures.
- Measure observed timing differences.
- Do not claim to be first across the internet without evidence.
- Do not equate early observation with a proven trading advantage.

Phase completion:
Users can answer:
- What changed?
- Is it funded?
- Which company is involved?
- What supports that conclusion?
- What remains unknown?


PHASE 3 — EXPAND SOURCE COVERAGE SELECTIVELY

Prioritize in this order:

1. Actual SEC filings and relevant company disclosures.
2. Full documents and attachments behind existing announcements.
3. Additional official agency procurement and award sources.
4. Budget, program, and protest information.
5. Selective social monitoring for discovery and corroboration.

For each integration:

- Verify current official documentation.
- Verify authentication requirements.
- Verify quotas and rate limits.
- Verify retention, display, export, and redistribution permissions.
- State whether the integration is operational, awaiting credentials, disabled, or planned.
- Never display placeholder data as live.
- Implement retries, backoff, deduplication, identifiers, and timestamps.
- Make paid sources optional and budget-controlled.

Source scorecard:

- Unique relevant events contributed.
- Successful collection rate.
- Observed publication-to-ingestion delay.
- Duplicate percentage.
- Extraction quality.
- Cost per useful event.
- Coverage gaps.
- Permitted product uses.

Specific requirements:

- Verify current SEC API access policies before implementation.
- Do not assume SAM opportunities responses provide complete revision history.
- Preserve source versions where permitted.
- Treat social posts as attributed statements or discovery leads unless stronger evidence exists.
- Do not purchase services or enable uncontrolled paid collection without approval.

Phase completion:
Each source contributes measurable incremental value rather than simply increasing the number of feeds.


PHASE 4 — SECURE PRIVATE BETA

Initial audience:
Investors and analysts researching publicly traded contractors.

Initial group:
Approximately 10–20 invited users.

Required features:

- Authentication through an established solution.
- Enforced user isolation.
- User-owned watchlists, rules, notes, and read states.
- Account recovery.
- Rate limits and abuse controls.
- Simple onboarding.
- Email alerts.
- Delivery retries and delivery status.
- Unsubscribe controls.
- Correction and feedback reporting.
- Visible source freshness and coverage.
- Clear loading, empty, error, and incomplete-data states.
- Responsive layouts.
- Accessible navigation.
- Readable typography while preserving the terminal identity.

Onboarding flow:

Choose companies → Inspect a sample event → Configure an alert

Measure:

- First-watchlist completion.
- Weekly return usage.
- Evidence links opened.
- Alerts marked useful.
- Alerts marked irrelevant.
- Reasons alerts are dismissed.
- Repeated research tasks completed.
- Willingness to pay after actual use.

Phase completion:
Users repeatedly return for a specific research task, and feedback explains what provides value and what is missing.


PHASE 5 — PUBLIC AND COMMERCIAL READINESS

5.1 — Production architecture

- Use transactional shared storage appropriate for a hosted application.
- PostgreSQL is a reasonable default.
- Collect each source once.
- Evaluate user rules against the shared event corpus.
- Use durable background jobs.
- Add retry handling and failed-job inspection.
- Add database migrations.
- Add automated backups.
- Test restoration.
- Add indexed search and pagination.
- Define retention policies.
- Avoid distributed infrastructure until deployment needs justify it.


5.2 — Security and operations

- Separate development, staging, and production credentials.
- Protect secrets.
- Exclude secrets from client responses and logs.
- Test cross-account access restrictions.
- Monitor collection delays, processing failures, delivery failures, and source costs.
- Provide administrative tools for corrections, source suspension, and support.
- Document incident response and recovery procedures.
- Establish realistic operational targets and measure them.


5.3 — Commercial readiness

- Review provider permissions for public display, retention, exports, and resale.
- Prepare product terms and privacy practices.
- Obtain appropriate review of investment-related positioning.
- Use hosted checkout.
- Verify billing webhook signatures.
- Make billing event processing idempotent.
- Enforce subscription entitlements server-side.
- Provide cancellation and account-deletion workflows.
- Establish a support channel.
- Track costs per active customer.


5.4 — Packaging experiments

Free:
- Limited company watchlists.
- Basic search.
- Digest.

Research:
- Expanded watchlists.
- Immediate alerts.
- Event histories.
- Program dossiers.
- Exports.

Team:
- Shared research.
- Annotations.
- Seats.
- Administrative controls.

Treat pricing and packaging as hypotheses to validate.

Defer a customer-facing API until demand, redistribution permissions, and usage costs are understood.

Phase completion:
The service can recover from failures, protect user data, explain disputed events, and support paying users at understood costs.


PHASE 6 — MARKET RESEARCH AND POINT-IN-TIME EVALUATION

Build this after collection and event interpretation are reliable.

Requirements:

- Preserve what the system actually knew at each moment.
- Use original observation timestamps.
- Retain historical company mappings.
- Retain revisions and corrections.
- Handle market sessions.
- Use corporate-action-adjusted price data.
- Compare outcomes with broad-market and sector benchmarks.
- Account for earnings and other overlapping news.
- Include realistic delivery delays.
- Include transaction costs and slippage.
- Use out-of-sample evaluation.
- Prevent look-ahead bias.
- Prevent survivorship bias.

Evaluate separately:

1. Was the event identified correctly?
2. Was it observed early enough to be useful?
3. Was there a subsequent market response?
4. Did any apparent trading result persist after costs?

Historical data downloaded today must not be treated as proof the system had that information at the historical event time.

Do not present unvalidated backtests or event scores as reliable trading predictions.


IMMEDIATE IMPLEMENTATION ORDER

1. Verify and fix the SAM checkpoint state race.
2. Correct timestamp, cached-record, and source-freshness behavior.
3. Expand realistic classification regression cases.
4. Introduce canonical events and source-document versions.
5. Verify subsidiary-to-public-parent mappings.
6. Build a company page with an event timeline and evidence drawer.
7. Unify alerts.
8. Add material-change detection.
9. Add authentication and user isolation.
10. Prepare a small private beta.
11. Use feedback to prioritize dossiers, filings coverage, and research notebooks.


WORKING RULES

- Inspect current code before changing it.
- Preserve existing working features.
- Avoid unrelated rewrites.
- Prioritize correctness before additional source volume.
- Use meaningful tests for failure modes and important workflows.
- Keep confirmed facts, estimates, unknowns, and planned features visibly distinct.
- Do not invent credentials, source coverage, live integrations, or successful tests.
- Continue work that does not depend on missing credentials.
- Clearly document blocked integrations.
- Keep deployment and paid-service activation separate from local implementation.
- Maintain a current implementation checklist.
- Document important architecture decisions.
- Do not claim a phase is complete until its acceptance criteria are met.

After each phase, report:

- What changed.
- What was verified.
- Remaining limitations.
- Any credentials or decisions required.
- Whether acceptance criteria were met.
- The next implementation priority.


PRODUCT PROMISE

“Follow government-contract developments affecting companies you research, understand what changed, and verify the evidence quickly.”