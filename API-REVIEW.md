# API reference review

The USAspending repository supplied by the user is the official service code and API-contract reference: https://github.com/fedspendingtransparency/usaspending-api

Reviewed API contracts confirm that permanent generated award IDs are supported by the transactions endpoint, net funding is available as federal_action_obligation, and transaction action/modification fields should remain visible. Award-ID filters accept quoted IDs for exact matching; the dashboard uses this format. The observed exact-ID HTTP 503 remains unresolved upstream.

Useful next contracts to review: recipient profiles, transaction search and bulk award/transaction downloads for company-wide funding baselines and reliable backfill. Running the full upstream service requires its data stores and loaded spending data; cloning the repository alone does not supply a local government-data mirror.

References:
- https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/transactions.md
- https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/search_filters.md
- https://open.gsa.gov/api/get-opportunities-public-api/

SAM's production endpoint, mandatory posted-date range, page-index offsets and notice/award fields were implemented from the official documentation. The key is held only in the local server's memory and never in this review.
