# Current implementation checklist

Current specification: DEVELOPMENT-INSTRUCTIONS.md. Older plans and milestone reports are historical. No public/commercial phase is declared complete.

## Phase 0 — implemented and verified locally
- [x] 0.1: Side-effect-free SAM polling; atomic checkpoints; successful-page preservation; persistent charged attempts; controlled polling and killed-process recovery regressions.
- [x] 0.2: Realistic currency/amount award language, modifications, options, uncertainty, date-only staleness and multiple passage-level candidates. All classifications remain provisional. Written amounts are not falsely converted to verified economics.
- [x] 0.3: Separate publication value/precision, observation, fetch, attempt and processing provenance; stable observations on reprocessing; success-based freshness.
- [x] 0.4: Six health states, successful/attempted/scheduled checks, failure counts, quotas and coverage information. Successful 304s clear stale errors.
- [x] 0.5: Alert rules/read states can be changed from an ingestion-readonly dashboard. Local shared-store locks protect alerts, funding commits and document-index commits. Device-local watchlists remain separate.
- [x] 0.6: Server-side evidence pagination/filtering/sorting, explicit private data directory, classification caching and atomic JSON writes. Hosted transactional storage is deferred until before multiple users.
- [x] 0.7: README is the single current setup guide; runtime/package/UI use 0.17. Older plans are labelled historical.

Phase 0 local acceptance: regression suites pass. Production load, network failure campaigns, power-loss durability and hosted multiuser acceptance have not been established. Local locks are not distributed locks.

## Phase 1 — started, incomplete
- [x] Stable provisional source-event model with procurement stage, source identifiers, financial fields, linked documents, confidence, extraction version and correction history.
- [x] Source-document versions, passage IDs, unverified candidates and cached-snapshot review.
- [x] Paginated source-event timeline and stage filters.
- [x] Strict cross-host headline candidate review with primary links, dated evidence, persistent related/distinct decisions and changed-evidence invalidation. Host differences are not verified publisher independence.
- [x] Conservative anchored rewording candidates, numeric/stage/amount guards, explanatory subject overlap, publication-bound review IDs and readable historical decisions.
- [x] Manual reviewed-repeat visibility with same-rule/snapshot/hash gates, explicit keep/restore, retained evidence/read states and automatic invalidation on changed reviews/evidence.
- [ ] Audited verified-event merge/split, broad paraphrase/syndication linking, measured match quality and automatic duplicate-alert suppression.
- [ ] Approximately 30–50 verified public contractors and historical subsidiary/parent mappings.
- [x] Company research pages with exact mention timelines, issuer context, dated relationships, original-source links and saved-document inspection. Persistent local-server watches and evidence-linked notes verified across worker/dashboard processes.
- [ ] Unify legacy browser watchlists with server watches; hosted accounts and shared research notes remain pending.
- [x] Persistent research inbox in the main Alerts view; new/existing matches and source updates distinguished, before/after fields retained, formatting/classifier-only repeats suppressed and legacy snapshots preserved.
- [x] Browser award-rule migration and unified persistent rules/history/read states. Loaded-page matching remains separate from background headline collection; browser-submitted award snapshots are explicitly unverified.
- [x] Explicit saved funding/document change watches, first baselines, signed transaction corrections, passage diffs, unchanged/upgrade suppression and persistent unified history. Saved-store checks are local; explicit watched records now receive bounded scheduled retrieval.
- [x] Bounded scheduled funding/approved-HTML refreshes in the ingestion owner, persistent attempts/budget, failure backoff, interrupted-job recovery and visible status.
- [ ] Cross-publisher deduplication, assessed financial materiality and reviewed scope/options extraction.
- [ ] Manually reviewed benchmark with measured precision, recall and entity accuracy. 95% confirmed precision is a proposed target, not an achieved result.

Next implementation priority: unified alerts and material-change detection, while continuing verified government-recipient identifier bindings and dated ownership review. PDF/document attachment support remains pending.

## Later phases — pending
Research differentiation, incremental SEC/agency/social integrations, authentication/user isolation, invited beta, production database and backups, billing/provider-rights review, and point-in-time market evaluation remain future work. No paid integration or hosted deployment has been activated.

Entity work started: dated Raytheon Company → RTX corporate evidence is reviewed and displayed. Recipient UEI/CAGE binding is not verified; no award tickers are assigned. See ENTITY-REVIEW-RTX.md.
