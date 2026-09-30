# Contract Sentinel 0.10 — setup and operating guide

Product promise: Follow government-contract developments affecting companies you research, understand what changed, and verify the evidence quickly.

This README is the authoritative operating guide. DEVELOPMENT-INSTRUCTIONS.md is the current development specification; IMPLEMENTATION-CHECKLIST.md records implementation and acceptance status. Earlier phase plans and milestone reports describe historical states.

## Local startup

Requires Node.js 24+. No additional packages are required. From this project directory, run `node server.cjs`, then open http://127.0.0.1:4175/.

Set SENTINEL_DATA_DIR to an absolute private data directory before starting. The workspace default is ../../work/sentinel-data relative to the project. The server checks due jobs every minute; normal feeds are scheduled hourly and the SEC issuer directory daily. Failed jobs back off. Closing the collection process stops ingestion.

To separate ingestion from the dashboard, start `node worker.cjs` with the same SENTINEL_DATA_DIR. Start the dashboard with SENTINEL_READ_ONLY=1 and `node server.cjs`. That setting means ingestion is managed by the worker: server alert rules and read states remain editable, and funding/document retrieval remain available. Existing browser watchlists are device-local and remain editable. They are not yet unified with server watchlists.

Exactly one collector may own the evidence directory. The PID lock and per-store mutation locks apply to processes on one local machine; they are not distributed locks or a hosted multiuser database. Concurrent store writes reload the latest state before committing. A busy store rejects the operation for retry instead of overwriting another writer. Transactional shared storage and account isolation are required before multiuser deployment.

## Credentials and optional sources

Use SAM_API_KEY in the collector process environment, or the local SAM form when the dashboard owns ingestion. Form credentials stay in process memory and disappear on restart. A worker-connected dashboard displays the saved collector configuration and disables its key form. The configuration is last reported state, not a guarantee that the worker is alive.

SAM_DAILY_REQUEST_LIMIT defaults to a conservative local budget of 25, SAM_REQUESTS_PER_SCAN to 3, and SAM_BACKFILL_DAYS to 7. Confirm your actual account allowance before raising limits. Daily accounting persists across restarts, is charged before requests, and cannot count other applications or earlier unrecorded usage. Recent windows refresh while daily backfill resumes with overlap. Mutable pagination and notice history are not represented as exhaustive coverage.

X, Reddit, SBIR and SEC filing ingestion remain unconfigured/planned; the SEC ticker directory is operational but does not verify award-recipient ownership. Paid sources are optional and have not been activated.

## Evidence and source health

The evidence endpoint pages and filters on the server, with a maximum 100 records per response (50 by default). The dashboard exposes evidence pages, source class, query and provisional event type filters. No-result searches do not establish absence of activity.

Publication value/precision, first observation, last successful fetch, attempted check and processing time are separate. Cached SAM reprocessing preserves its original successful-fetch time. A 304 response is a successful upstream check; it does not rewrite the evidence's observation time. Legacy records retain known timestamps; missing historical fetch information is not invented.

Health states: healthy, delayed, quota-limited, failing, disabled, and never successfully collected. Panels show successful/attempted checks, next scheduled attempt, failures, quota details where available and historical limits. Freshness is based on successful upstream checks, not the next scheduled attempt.

## Documents and events

RETRIEVE / REVIEW DOCUMENT preserves approved HTML sources and version hashes, extracted passages and comparisons. Prior snapshots remain accessible when a new retrieval fails, with a visible stale-snapshot notice. Extraction and classification versions are recorded. Formatting changes and extraction-version changes are distinguished from source text changes. Fixed approved hosts, HTTPS, pinned public IPv4, no redirects, a 20-second deadline and 5MB limit bound retrieval. PDF and OCR support are pending.

EVENT TIMELINE displays stable provisional source-event IDs, stages and correction history. A source event is distinct from a real-world event verified across publishers. Similar headlines, awards and modifications are never automatically merged. Document passages can contain multiple event candidates; ambiguity is retained. Public-parent identity, ticker assignment, allocation and economics remain unresolved unless supported. Headline currency mentions are extracted amounts, not obligations or revenue. Written amount phrases can support classification while their numeric value stays unknown.

Classifications are cached by evidence hash and classifier version. Existing alert snapshots are retained; reclassification does not rewrite what an old alert said. Server alerts deduplicate by rule, source evidence and content hash. Cross-publisher deduplication, material-change alerts and unified browser/server alerts remain pending.

## Funding

Funding history loads selected prime transactions from USAspending; subawards link to their prime. Saved histories persist. Refresh is on demand, capped at 2,000 transactions. Missing or invalid values and incomplete collection suppress affected totals. Signed net obligations, positive funding and deobligations remain separate from ceilings and revenue. 30/90/365-day windows compare equal adjacent New York calendar periods; percentage change requires a positive prior net. Reporting delays still apply.

## Validation and backups

`npm test` runs the regression suites. They cover status polling during SAM collection, killed jobs and recovery, realistic event wording, timestamps, source health, independent-dashboard writes, shared funding commits, document failures and event corrections. These tests do not establish measured production classification precision or provider uptime.

Source and documentation are backed up to the public GitHub repository. Credentials, collected documents, runtime evidence, notes and alert state must remain private and are excluded. This workspace also maintains a separate private runtime archive. Hosted authentication, subscriptions, email delivery and production deployment are not enabled.

## Reviewed identity evidence
The first corporate relationship ledger is visible in Source Intelligence. Each link retains primary filing passages, effective/observed dates and limitations. The Raytheon Company/RTX entry is dated corporate evidence; it does not create a government recipient binding. See ENTITY-REVIEW-RTX.md.

## Company research workspace

The Companies view combines exact research-name mentions, paginated source events, issuer-directory data and reviewed dated corporate relationships. Open original sources or inspect previously saved HTML documents. Ten events are shown per company page. These mentions do not verify legal award recipients, current public-parent ownership or company-wide funding exposure.

WATCH COMPANY saves a private server-side research preference. ALERT ON CONTRACT MENTIONS creates a separate persistent alert rule; collection must remain running. Save private notes with selected evidence references; references are checked against stored evidence on the server. Watches and notes survive process restarts and are editable from the worker-connected dashboard. Unsaved note text is kept separately for each company while this browser page remains open. Source attachments apply to the displayed timeline page.

The initial list contains 22 research names, not a verified public-contractor universe. Legacy browser watchlists remain separate. Company notes are for one local operator; authentication, account isolation, team sharing, unified alerts and material-change alerts remain pending. Private state is stored in research.json under SENTINEL_DATA_DIR and excluded from public source backups.
