# Running Contract Sentinel

Start `server.cjs` with Node.js 24 or newer, then open http://127.0.0.1:4175/.

No additional packages are required. The collector scans at startup and hourly while the process remains running. Closing the server stops collection. Evidence persists in `work/sentinel-data/evidence.json` in this workspace; do not delete it if you want to retain collection history.

The Sources panel shows seven configured public headline collectors and the SEC issuer directory, pending integrations, source health, evidence links and search cues. USAspending award searches are separate live requests. Company mentions are research matches, not verified ownership relationships. Cross-publisher event clustering is future work. Research alert rules, versioned evidence matches and read history are stored in the local alerts.json file alongside evidence.

SAM and X access require your own account credentials. Do not put credentials in chat or source files. Paid access needs a chosen spending cap before integration. This local build has no hosted deployment.

## Funding history
Inspect a scanner award and choose Funding history. A subaward opens the linked prime history. Saved histories are available under Funding history after reload. Collection is on demand; Refresh checks USAspending again. The funding.json store contains transaction snapshots.

30/90/365-day comparisons use equal adjacent calendar windows ending on the New York date. Amounts are net obligations, not contract ceilings or company revenue. Percentage change is unavailable for a nonpositive prior baseline. Collection is capped at 2,000 transactions; incomplete histories or invalid/missing values suppress affected totals. Source reporting delays still apply. Company-wide growth rankings are not implemented.

## SAM notice collection
SAM access is configured under Source intelligence using the local password field. The key is sent to the loopback server and api.sam.gov only, held in server memory, and cleared when that process stops. It is not retained in this project or evidence exports. A server environment variable SAM_API_KEY is also supported. Rotate any key shared in chat before long-term use.

The verified connector collected 300 notices from a seven-day posted-date window that contained 6,188 notices at the first successful scan. This is partial coverage. It follows SAM's documented page-index offsets 0, 1, 2, retains notice metadata and award details when supplied, and marks opportunities separately from award notices. Full descriptions, attachments, all notice versions and historical backfill are not collected.

Collection is capped at three requests per scan and 25 requests per New York day per server process. The local request counter resets on process restart; SAM's own account limits still apply. HTTP errors and diagnostics omit credentials, and cross-host redirects are rejected.

## Structured events
Source intelligence includes an event-type filter and expandable research records. Classifications are provisional headline/notice-metadata interpretations, with separate evidence dimensions and UNKNOWN financial/identity fields. New alerts freeze their classification at creation; older alerts have no retroactively invented detection-time snapshot. No HIGH priorities or automatic trades arise from headline rules. Linked-document review, event-family deduplication, identity verification and materiality analysis remain pending.

For timestamped sources, publication more than seven days before first detection triggers a conservative stale-publication flag and LOW review priority. This is a review heuristic, not proof of event novelty or the earliest public disclosure.
