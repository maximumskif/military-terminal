# Local storage and event decisions

Single collector ownership remains guarded by a local PID lock. Ingestion readonly mode applies only to evidence/jobs/configuration. User alert changes use a separate short local file lock and reload-before-commit; funding snapshots acquire their store lock after network collection. Document indexes use the same bounded mutation discipline. Atomic JSON commits use a unique temporary file, flush it, then rename it. These primitives support this local application, not distributed or multiuser hosting.

SAM status uses the writer's current state without replacing it. Ingestion-readonly readers load a separate snapshot. Successful pages are committed independently; a killed request remains charged and successful prior pages stay available. Duplicate suppression operates on stable notice/source IDs and payload hashes; fetch/processing times are excluded from the SAM content fingerprint.

Publication timestamps are distinct from observations and processing. Missing legacy fetch timestamps remain unknown. Feed date-only values retain date precision. The stale-publication heuristic does not manufacture an intraday publication time.

Source events are a conservative first event-model layer: one stable ID per evidence identity, no fuzzy cross-publisher merge. Separate awards or modifications cannot be collapsed because they share a title or contract name. Corrections retain the prior interpretation; alert snapshots do not change retroactively. Future reviewed relationship/merge records will add evidence-supported real-world grouping.
