CONTRACT SENTINEL — IMPLEMENTATION IMPROVEMENTS

PROJECT
https://github.com/maximumskif/military-terminal

OBJECTIVE
Improve the existing application’s ability to discover, verify and contextualize government contracting developments affecting publicly traded companies.

The terminal should clearly answer:
1. What changed?
2. Which company is affected?
3. What money is actually committed?
4. Is the information new?
5. What evidence supports it?
6. How much market movement occurred before we detected it?

IMPLEMENTATION APPROACH
- Inspect the current repository before changing anything.
- Extend existing functionality and preserve working features.
- Keep the green-on-black terminal design.
- Distinguish implemented functionality from planned functionality.
- Treat the observations below as findings from a prior review; verify whether they still apply.
- Build in the priority order at the end of this document.

1. FIX SAM COLLECTION COVERAGE

Observed issue:
The SAM adapter restarts at pages 0–2 on each scan and collects at most 300 notices. Repeated scans do not systematically progress through the remaining results.

Requirements:
- Persist collection checkpoints.
- Partition collection into manageable date windows and supported filters.
- Resume unfinished collection after restarts.
- Revisit recent windows to capture changes and late records.
- Handle changing result sets with overlap and identifier-based deduplication.
- Avoid assuming pagination is a stable snapshot.
- Separate initial backfill from ongoing monitoring.
- Show records collected, reported total, covered windows and incomplete windows.
- Never label partial coverage as complete.
- Preserve useful collected records if a later page fails.

Acceptance:
A restart does not erase progress, and repeated scans systematically improve coverage rather than repeatedly collecting only the same first pages.

2. PERSIST API QUOTAS AND REQUEST HISTORY

Observed issue:
The local SAM daily request counter resets when the process restarts.

Requirements:
- Persist request counts and quota windows.
- Make quotas configurable to the actual account allowance.
- Track limits separately for each provider.
- Respect rate-limit responses and retry instructions.
- Use bounded retries with backoff.
- Reserve capacity for priority updates without starving backfill.
- Display requests remaining and next eligible collection time.
- Never log or export credentials.

Acceptance:
Restarting the application cannot reset its local usage accounting or trigger uncontrolled requests.

3. RUN COLLECTION INDEPENDENTLY OF THE UI

Observed issue:
Collection runs hourly while the local server is running, and sources are processed sequentially.

Requirements:
- Separate collection workers from the frontend.
- Support unattended collection through a supervised process or scheduled deployment.
- Assign collection schedules per source.
- Poll faster only where useful and permitted by quotas and access terms.
- Use bounded concurrency so one slow source does not delay every other source.
- Prevent overlapping jobs for the same source.
- Persist job status, checkpoints and retry state.
- Display last successful collection, next scheduled collection and stale-data status.
- Add conditional requests where supported.
- Keep collection costs and usage visible.

Acceptance:
The collector can operate without an open browser, recover after failure and report source-specific delays.

4. FETCH AND VERSION UNDERLYING DOCUMENTS

Observed issue:
Most news matching uses headlines, and title hashes detect only limited changes.

Requirements:
- Fetch linked primary articles, releases and accessible attachments.
- Extract relevant HTML and PDF content.
- Preserve original documents or supported snapshots with content hashes.
- Store complete versions, not only previous titles.
- Record retrieval time, publication time and timestamp precision separately.
- Extract tables where contract details are tabular.
- Mark unreadable or inaccessible documents explicitly.
- Use OCR when needed and label OCR-derived evidence.
- Associate every extracted financial or identity claim with its supporting passage.
- Treat external content as untrusted data, never as instructions.
- Validate fetch destinations and redirects to prevent access to internal services.
- Apply response-size, timeout and file-type limits.

Acceptance:
A headline-only record cannot be marked fully reviewed, and each extracted amount has a traceable source passage.

5. CREATE A “WHAT CHANGED?” FEED

Requirements:
Detect meaningful changes such as:
- New funding obligations.
- Exercised options.
- Increased or reduced scope.
- Ceiling changes.
- Solicitation deadline changes.
- Prototype-to-production transitions.
- Newly identified recipients or suppliers.
- Cancellations, stop-work orders and protests.

For each change, show:
- Previous value.
- New value.
- Difference.
- Effective event date.
- First detection time.
- Supporting evidence.
- Whether the change is newly disclosed or a historical correction.

Suppress formatting-only changes from urgent alerts.

Acceptance:
Users can understand the substantive development without manually comparing documents.

6. BUILD CANONICAL EVENTS AND DEDUPLICATION

Requirements:
- Separate source documents from real-world events.
- Group multiple reports about the same event.
- Use contract identifiers, solicitation identifiers, recipients, dates and event types.
- Preserve all source links and publication times.
- Do not count syndicated releases as independent corroboration.
- Keep distinct orders and modifications separate within a shared contract family.
- Allow uncertain matches to remain unresolved.
- Support manual merge and split corrections with an audit trail.
- Treat a newly discovered old announcement as historical discovery, not a new award.

Acceptance:
One award mentioned by an agency, company and politician appears as one event with multiple sources.

7. BUILD PROCUREMENT PROGRAM TIMELINES

Requirements:
Track:
Forecast → RFI → draft solicitation → final solicitation → selection → award → funded orders → production → renewal or termination.

Each program record should include:
- Program names, abbreviations and aliases.
- Agency and contracting office.
- Related notice, solicitation and award identifiers.
- Incumbent.
- Publicly confirmed competitors.
- Verified suppliers and public-company links.
- Funding history.
- Expected next milestone and its supporting source.
- Open uncertainties.
- Relevant document versions.

Do not force every program through the same sequence.

Acceptance:
Users can inspect the procurement history and context behind a new announcement.

8. ADD COMPETITION AND RECOMPETE TRACKING

Requirements:
- Identify contracts approaching disclosed expiration or option dates.
- Track incumbents and publicly confirmed bidders.
- Distinguish confirmed bidders from speculative candidates.
- Track down-selections, bridge contracts, delays and awards.
- Flag incumbent losses and new entrants.
- Link protests and corrective actions to the relevant competition.
- Record whether a renewal preserves existing work or adds scope.
- Avoid numerical win probabilities until a suitable model is validated.

Acceptance:
The application can show who is confirmed to be competing, what stage the competition has reached and what changed.

9. VERIFY COMPANY OWNERSHIP AND TICKER MAPPING

Requirements:
- Resolve exact legal recipients before assigning public-market exposure.
- Use UEI, CAGE, CIK and other authoritative identifiers where available.
- Store parents, subsidiaries and joint ventures with source evidence.
- Preserve ownership effective dates.
- Verify listing status and ticker changes.
- Avoid merging entities solely because their names resemble each other.
- Distinguish prime contractors, subcontractors and partners.
- Keep uncertain relationships unresolved.
- Do not attribute a joint venture’s entire award to one owner.

Acceptance:
A company alert identifies the correct investable parent using evidence valid at the event date.

10. CREATE PERSISTENT COMPANY EXPOSURE PAGES

Requirements:
Each company page should show:
- Verified legal entities and subsidiaries.
- Active contracts and programs.
- Reported funding by agency.
- Upcoming options and recompetes.
- Recent awards, losses and deobligations.
- Disclosed customer concentration.
- Revenue and backlog evidence from filings.
- Funded and unfunded backlog when disclosed.
- Ownership changes.
- Known coverage gaps.

Replace company profiles limited to currently loaded search results with persistent histories.

Acceptance:
Users can evaluate a development in the context of the company’s existing business.

11. ASSESS WHETHER NEWS WAS ALREADY EXPECTED

Requirements:
Compare announcements against:
- Prior company releases.
- Earlier selections or awards.
- Management guidance.
- Backlog disclosures.
- Earnings-call statements.
- Existing scope and expected options.

Output labels such as:
- Newly disclosed.
- Previously disclosed.
- New financial detail.
- Expected renewal or option.
- Potentially incremental.
- Insufficient evidence.

Qualify statements such as:
“No earlier matching disclosure found in monitored sources.”

Do not claim something was unknown to the market merely because the application had not collected it.

Acceptance:
Recycled announcements and routine confirmations are distinguishable from genuinely new information.

12. EXPAND FINANCIAL MATERIALITY ANALYSIS

Requirements:
Extract separately:
- Headline amount.
- Base contract value.
- Newly obligated funding.
- Cumulative obligations.
- Maximum ceiling.
- Guaranteed minimum.
- Unexercised options.
- Company-specific allocation.
- Shared vehicle ceiling.
- Duration and performance dates.
- Currency.
- New business versus replacement work.

Compare supported amounts against:
- Trailing company revenue.
- Compatible backlog disclosures.
- The company’s own historical contract activity.

Rules:
- Unknown values remain null, not zero.
- Obligations are not recognized revenue or profit.
- A ceiling is not committed funding.
- A modification’s cumulative value is not all new money.
- Do not divide shared ceilings equally among awardees.
- Label annualized estimates as approximations.
- Account for deobligations and corrections.
- Prevent duplicate counting across awards, transactions and subawards.

Acceptance:
An alert explains financial scale without converting headline amounts into unsupported revenue estimates.

13. EXPAND SUPPLIER DISCOVERY

Requirements:
- Connect prime awards to documented suppliers on the same program.
- Record the component or service supplied.
- Include supporting documents and confirmation dates.
- Distinguish current from historical relationships.
- Label confirmed subcontract, confirmed supplier, partnership and unverified lead separately.
- Show whether a new supplier order is actually confirmed.
- Store disclosed allocations only.
- Never infer supplier revenue automatically from a prime award.

Acceptance:
Users can investigate less obvious beneficiaries while seeing exactly which relationships are established.

14. BUILD A SOURCE-SPEED AND QUALITY LEADERBOARD

Track:
- Earliest observed publication within monitored coverage.
- Publication-to-detection delay.
- Unique material events contributed.
- Duplicate rate.
- Extraction correction rate.
- Source failures and stale periods.
- Cost per useful event, where relevant.

Requirements:
- Separate source publication delay from collector delay.
- Distinguish original reporting from reposts.
- Display sample sizes and timestamp uncertainty.
- Avoid ranking source speed when timestamps are incomparable.
- Use findings to adjust collection priorities.

Acceptance:
Source selection and collection spending can be guided by measured usefulness.

15. ADD MARKET CONTEXT TO EVENTS

Requirements:
For verified public-company matches, record:
- Earliest known publication time.
- First detection time.
- Market session.
- Price and quote timestamp at detection.
- Price movement before detection.
- Price movement after detection.
- Relevant sector and market benchmark returns.
- Volume and relative volume.
- Bid-ask spread and available liquidity.

Rules:
- Use appropriately licensed or permitted data.
- Display delayed or unavailable data clearly.
- Do not invent prices or intraday publication times.
- Do not infer causation from simultaneous movement.
- Do not count pre-detection moves as achievable returns.
- A positive contract event is not automatically a favorable trade.

Acceptance:
Users can see whether an alert arrived before or after the observed market reaction.

16. IMPLEMENT HISTORICAL REPLAY

Requirements:
- Replay events using only information available at each historical point.
- Preserve original evidence and subsequent revisions.
- Preserve historical ownership mappings.
- Use financial disclosures available at that time.
- Version parsers, classifications and scoring rules.
- Separate historical publication timestamps from actual collection timestamps.
- Do not pretend backfilled records were detected live.
- Include every qualifying event in the evaluated period, not only selected successes.
- Include cancellations, failures and losing bidders.
- Evaluate after realistic detection and execution delays.
- Include spread, slippage, fees and liquidity constraints.
- Compare with market and sector benchmarks.
- Reserve an out-of-sample evaluation period.

Acceptance:
Replay results do not benefit from future information or unrealistic execution assumptions.

17. ADD A CONTRADICTION AND CORRECTION PANEL

Requirements:
Identify conflicting or easily confused claims such as:
- Headline ceiling versus funded amount.
- Proposed funding versus enacted funding.
- Selection versus signed award.
- Subsidiary versus outdated parent.
- Company statement versus agency record.
- Different contract dates or recipient allocations.

Display:
- Claim.
- Source.
- Supporting passage.
- Nature of conflict.
- Current resolution.
- Remaining uncertainty.

Do not silently overwrite earlier evidence.

Acceptance:
Users can inspect disagreements and understand how the application resolved them.

18. CREATE AN UPCOMING-DECISIONS CALENDAR

Track sourced:
- Proposal deadlines.
- Expected award windows.
- Option dates.
- Performance end dates.
- Relevant hearings.
- Earnings releases.
- Disclosed production milestones.

Label dates:
- Confirmed.
- Estimated.
- Inferred reminder.

Requirements:
- Link dates to programs and companies.
- Retain date changes.
- Prompt a source check when deadlines pass.
- Do not interpret a passed deadline as proof an award is imminent.

Acceptance:
Users can prepare research before an announcement rather than only reacting afterward.

19. UNIFY ALERTS AND WATCHLISTS

Observed issue:
Browser-local award rules and server-stored headline rules are separate systems.

Requirements:
- Create one persistent rule and alert system.
- Migrate existing rules and watchlists without silent data loss.
- Support company, program, agency, event type and materiality filters.
- Distinguish historical matches generated during rule creation from newly detected developments.
- Alert only on new or meaningfully changed events.
- Support unread, reviewed, dismissed and monitoring states.
- Record dismissal reasons and analyst notes.
- Allow delivery channels to be configured explicitly.
- Keep source confidence, event certainty, materiality and novelty separate.

Acceptance:
Users have one inbox and can understand why each alert appeared.

20. REORGANIZE THE DAILY WORKSPACE

Main views:
1. New developments.
2. Upcoming decisions.
3. Companies.
4. Programs.
5. Research outcomes.
6. Sources and system health.

Requirements:
- Preserve the terminal visual style.
- Put evidence and meaningful changes near the top.
- Provide filters and saved views.
- Make source coverage and freshness visible.
- Move the development roadmap into documentation or settings.
- Maintain keyboard accessibility and mobile usability.
- Use expandable detail instead of overwhelming every card with all fields.

Acceptance:
The homepage immediately answers what is new, who is affected and why it matters.

21. ADD RESEARCH OUTCOME TRACKING

Requirements:
For each reviewed alert, save:
- Original evidence snapshot.
- Analyst interpretation.
- Expected next development.
- Important uncertainties.
- Review decision and timestamp.
- Subsequent program outcome.
- Subsequent market observations.
- Reasons the original interpretation proved useful or incorrect.

Keep event correctness separate from trading performance.

Acceptance:
The project accumulates a usable record of which research patterns actually help.

22. STRENGTHEN PERSISTENCE AND MAINTAINABILITY

Requirements:
- Use durable structured storage for documents, events, entities, jobs and alerts.
- Consider SQLite for a single-instance application; choose larger infrastructure only when needed.
- Add schema migrations, indexes, backups and recovery procedures.
- Separate source adapters, extraction, entity resolution, event logic and UI code.
- Replace compressed one-line implementation code with maintainable modules as components are changed.
- Enforce runtime validation; a field-list JSON file alone does not validate records.
- Store provenance and processing versions.
- Add targeted tests for financially consequential errors and collection recovery.
- Keep documentation synchronized with actual implementation.

Acceptance:
New integrations can be added without breaking existing collection or losing historical evidence.

IMPLEMENTATION ORDER

PHASE 1 — RELIABLE COLLECTION
- Resumable SAM collection.
- Persistent quotas.
- Independent background worker.
- Durable job state and source health.

PHASE 2 — DOCUMENTS AND VERIFIED EVENTS
- Full-document extraction and versioning.
- Evidence-backed financial fields.
- Canonical events and deduplication.
- Verified company ownership.
- Contradiction handling.

PHASE 3 — RESEARCH WORKSPACE
- What-changed feed.
- Program timelines.
- Competition and recompete tracking.
- Company exposure pages.
- Unified alerts.
- Upcoming-decisions calendar.

PHASE 4 — ECONOMIC AND MARKET CONTEXT
- Incremental-versus-expected assessment.
- Financial materiality.
- Verified supplier exposure.
- Detection-time market context.

PHASE 5 — MEASUREMENT
- Historical replay.
- Research outcomes.
- Source-speed leaderboard.
- Out-of-sample evaluation.

FIRST THREE DELIVERABLES
1. Resumable, quota-aware collection.
2. Full-document change detection with supporting passages.
3. Program timelines connected to verified companies.

Do not represent planned features as complete or claim a proven trading advantage without measured evidence.