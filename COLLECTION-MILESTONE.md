# Collection milestone and remaining implementation

The governing expansion specification is IMPLEMENTATION-IMPROVEMENTS.md. Its priority order is collection reliability, document evidence and verified events, company research workspace, economic/market context, and measurement.

## Implemented in this milestone
- SAM daily posted-date partitions with persistent page checkpoints and saved normalized notices. Previously successful pages survive a later failure.
- Persistent local request accounting charged before each request, configurable daily budget, bounded requests per scan, sanitized request history and Retry-After handling.
- Recent-window refresh plus overlap when resuming backfill. Mutable pagination is explicitly never represented as a complete snapshot.
- Durable per-source jobs and retry schedules, conditional requests, three concurrent sources, and exclusive writer ownership.
- Standalone worker.cjs for collection without a dashboard, plus SENTINEL_READ_ONLY=1 for a separate dashboard reading its saved state.

## Operating limits
SAM_DAILY_REQUEST_LIMIT defaults to a conservative local budget of 25; this is not a verified account allowance. Set it to the allowance confirmed by SAM. Accounting begins with this checkpoint implementation and cannot reconstruct earlier requests or requests made elsewhere. Existing saved evidence remains available. API keys remain in memory or environment variables; restarting clears a key entered through the dashboard.

Run node worker.cjs with SENTINEL_DATA_DIR set to the desired data directory. A separate dashboard using that directory must set SENTINEL_READ_ONLY=1. Collection requires a running process; this change does not install a supervised service or deploy an always-on collector. Source schedules and SAM coverage are returned by the server; the detailed checkpoint display still needs a dashboard view.

## Next ordered work
1. Verify production account allowance, surface quota/window/job details in the dashboard, and validate the worker under supervision.
2. Fetch bounded HTML/PDF documents with safe destination/redirect handling; retain original snapshots and version hashes; extract cited passages and detect substantive changes. Label OCR separately.
3. Build canonical events with audited merges and program timelines. Never merge separate orders or modifications merely because headlines look similar.
4. Add historical ownership, persistent company exposures, economic materiality and market context with explicit unknowns.
5. Add replay, corrections, alert outcomes and collection coverage measurement.

The first manual underlying-document review is DOCUMENT-REVIEW-TOMAHAWK.md. Full document versioning, PDF extraction, automated passage review and program timelines remain pending.

Validation: all six existing test suites pass, including persistent SAM quota/restart/failure/backoff cases and the exclusive writer check. Production credential-backed collection after restarting this milestone has not yet been validated.
