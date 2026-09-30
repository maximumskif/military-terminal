# Current implementation checklist

Current specification: DEVELOPMENT-INSTRUCTIONS.md. Older plans and milestone reports are historical. No public/commercial phase is declared complete.

## Phase 0 — implemented and verified locally
- [x] 0.1: Side-effect-free SAM polling; atomic checkpoints; successful-page preservation; persistent charged attempts; controlled polling and killed-process recovery regressions.
- [x] 0.2: Realistic currency/amount award language, modifications, options, uncertainty, date-only staleness and multiple passage-level candidates. All classifications remain provisional. Written amounts are not falsely converted to verified economics.
- [x] 0.3: Separate publication value/precision, observation, fetch, attempt and processing provenance; stable observations on reprocessing; success-based freshness.
- [x] 0.4: Six health states, successful/attempted/scheduled checks, failure counts, quotas and coverage information. Successful 304s clear stale errors.
- [x] 0.5: Alert rules/read states can be changed from an ingestion-readonly dashboard. Local shared-store locks protect alerts, funding commits and document-index commits. Device-local watchlists remain separate.
- [x] 0.6: Server-side evidence pagination/filtering/sorting, explicit private data directory, classification caching and atomic JSON writes. Hosted transactional storage is deferred until before multiple users.
- [x] 0.7: README is the single current setup guide; runtime/package/UI use 0.9. Older plans are labelled historical.

Phase 0 local acceptance: regression suites pass. Production load, network failure campaigns, power-loss durability and hosted multiuser acceptance have not been established. Local locks are not distributed locks.

## Phase 1 — started, incomplete
- [x] Stable provisional source-event model with procurement stage, source identifiers, financial fields, linked documents, confidence, extraction version and correction history.
- [x] Source-document versions, passage IDs, unverified candidates and cached-snapshot review.
- [x] Paginated source-event timeline and stage filters.
- [ ] Evidence-supported cross-publisher links and audited merge/split workflow.
- [ ] Approximately 30–50 verified public contractors and historical subsidiary/parent mappings.
- [ ] Company research pages, persistent unified watchlists and research notes.
- [ ] Unified alerts and material-change detection.
- [ ] Manually reviewed benchmark with measured precision, recall and entity accuracy. 95% confirmed precision is a proposed target, not an achieved result.

Next implementation priority: verified entity relationships with effective dates, then company pages connecting those relationships to event timelines and supporting evidence. PDF/document attachment support remains pending.

## Later phases — pending
Research differentiation, incremental SEC/agency/social integrations, authentication/user isolation, invited beta, production database and backups, billing/provider-rights review, and point-in-time market evaluation remain future work. No paid integration or hosted deployment has been activated.

Entity work started: dated Raytheon Company → RTX corporate evidence is reviewed and displayed. Recipient UEI/CAGE binding is not verified; no award tickers are assigned. See ENTITY-REVIEW-RTX.md.
