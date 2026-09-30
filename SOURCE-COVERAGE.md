# Source coverage and manual setup

## Current coverage
USAspending prime and reported contract subaward searches are connected. Seven announcement/news collectors are configured: NASA news releases, NASA technology, Breaking Defense, Lockheed Martin newsroom, RTX news RSS, GSA news releases and HHS news releases. The SEC public issuer directory is also connected for configured ticker/CIK research matches. They retain headlines, original links, source class, publication time when supplied, first-seen time, title hashes and research cues in a durable local store. Collection runs at startup and hourly while the local server is running. This is headline collection, not full-article extraction or complete coverage. SAM Opportunities v2 notice metadata collection is now connected and verified with partial coverage of a seven-day posted-date window (up to 300 notices per scan). SEC filing, SBIR and social adapters remain pending. A scan retains at most 100 feed entries per source; historical backfill remains pending.

## Collection priorities
| Source family | What to collect | Method and next step |
|---|---|---|
| USAspending | Awards, modifications/transactions, reported subawards, recipients | Existing award/subaward adapter; add transaction history and bulk backfill |
| SAM.gov | Opportunities, award notices, attachments, entity identifiers, contract awards | Official APIs/data exports; configure appropriate account access and keys |
| Agency websites | Procurement announcements, acquisition forecasts, budget/program documents | RSS when offered, public page/PDF collection otherwise; agency-specific adapters |
| SBIR/STTR | Awards, abstracts, phases, company identifiers and technology areas | Official download/API; reconcile overlapping awards against contract records |
| SEC EDGAR | Issuer identity, S-1/F-1, amendments, 8-K, 10-K/10-Q, withdrawals | Official submissions/filing data; identified, rate-limited server requests |
| Prime contractors | Award releases, supplier announcements, program milestones, supplier portals' public sections | Company newsroom feeds/pages, public PDFs, document change detection |
| Smaller/private suppliers | Customer wins, partnerships, facilities, fundraising, investor announcements | Public company websites and announcements; verify parent/recipient identity |
| News and trade publications | Program details, supplier names, awards and financing | RSS/licensed APIs or accessible public pages; group syndicated copies |
| X | Company/agency posts, named program mentions, supplier claims, IPO leads | Authorized search/feed access; verify current access and budget first |
| Reddit/forums | Procurement discussion, company/program leads | Available APIs or permitted public pages; retain thread/post provenance |
| LinkedIn/jobs | Company announcements, hiring concentrations, new facilities | Accessible company pages, job feeds, licensed access or manual evidence; availability varies |
| YouTube/podcasts | Interviews, program briefings, company statements | Available descriptions/transcripts, event timing and source link |
| State/local sources | Incentives, facilities, expansion approvals, local reporting | Public development-agency announcements and meeting documents |
| Optional paid intelligence | Supplier/ownership coverage, private company financing, procurement enrichment | Integrate only after user chooses provider, access and spending limit |

## Evidence handling
- Tag source class independently of confidence: official record, official announcement, company statement, independent reporting, or social/forum lead.
- Preserve URL, source ID, publisher/author, publication time, first-seen time, claimed event time, retrieval time, extracted text and content hash when retention is supported.
- Identify company/UEI/CAGE/CIK, prime/recipient roles, PIID/program, award versus opportunity, funded amount versus ceiling, and explicit versus inferred relationships.
- Match an underlying event before counting corroboration. Ten reposts of one release are one evidence family, not ten independent confirmations.
- Track corrections, deleted/changed pages, stale sources, ingestion errors, pagination gaps and coverage windows.
- Social posts may create research leads. They must not silently become confirmed awards, supplier relationships or IPO events.
- Fetch public information through APIs, downloads, feeds and permitted page collection. Account-only/licensed sources require authorized access. Do not bypass login controls or other access restrictions.
- Use domain-specific rate limits, conditional requests, content-change checks, retries, queues and cache. Do not claim universal coverage of private, classified or unreported activity.

## Search patterns
Combine company aliases and program identifiers with:
- Contract: awarded, selected, task order, delivery order, modification, exercised option, incremental funding.
- Supplier: subcontract, selected supplier, production partner, supplier agreement, prime name, program name, PIID.
- Expansion: production ramp, funded backlog, new facility, manufacturing capacity, hiring, additional shift.
- Financing/IPO: registration statement, S-1, F-1, proposed listing, IPO, funding round, strategic investment.
- Negative evidence: termination, deobligation, protest, delayed production, withdrawn registration, contract cancellation.

Use platform-native query syntax in each adapter. A social keyword match is not a company identity match. Collect the original claim and its context rather than merely counting keywords.

## Setup handled and remaining user input
Public-source discovery, a 20-company research watchlist, seven headline collectors plus the SEC issuer directory, source health, evidence storage and four sourced historical cases are now prepared. See research-watchlist.json and HISTORICAL-CASES.md. Name variants are search terms; ownership and issuer identities still require verification.

Remaining inputs only you can supply:
1. SAM access is connected in server memory. Rotate the chat-shared key before long-term use and reconfigure locally after restarting the server.
2. X developer access and a spending limit before paid access is connected.
3. Any existing private subscriptions or permitted exports you want included. No purchase is required for the current collectors.

## Next build sequence
The durable headline evidence store, source registry, source health and initial agency/company/news collectors are implemented. Next add SEC/SBIR ingestion, cross-source identity and event matching, SAM access, authorized social searches and event clustering and continuous hosted collection. Server-stored headline rules, alert history and read state are now implemented. The green terminal UI should show live/queued/needs-access/failed status for every source and drill into evidence behind every signal.

References: https://api.usaspending.gov/docs/endpoints ; https://open.gsa.gov/api/get-opportunities-public-api/ ; https://www.sec.gov/about/developer-resources ; https://www.sbir.gov/data-resources ; https://docs.x.com/x-api/posts/search/introduction

