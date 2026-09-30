GOVERNMENT CONTRACT AND PUBLIC-MARKET SIGNAL MONITOR

OBJECTIVE
Monitor public announcements for upcoming government procurements, contract awards, funded orders, production transitions, cancellations and funding changes affecting publicly traded companies.

Generate evidence-backed research alerts. Do not automatically interpret a contract announcement as a buy or sell signal.

X ACCOUNT WATCHLIST

Government / procurement:
@SemperCitiusSDA — Space Development Agency
@DIU_x — Defense Innovation Unit
@DARPA — Defense Advanced Research Projects Agency
@NAVSEA — Naval Sea Systems Command
@NAVAIRNews — Naval Air Systems Command
@NAVWARHQ — Naval Information Warfare Systems Command
@DLAMIL — Defense Logistics Agency
@NASA — NASA
@BARDA — Biomedical Advanced Research and Development Authority
@ENERGY — Department of Energy

Companies:
@AeroVironment — AeroVironment — AVAV
@KratosDefense — Kratos Defense & Security Solutions — KTOS
@RocketLab — Rocket Lab — RKLB
@RedwireSpace — Redwire — RDW
@BlackSky_Inc — BlackSky — BKSY
@PalantirTech — Palantir Technologies — PLTR
@L3HarrisTech — L3Harris Technologies — LHX
@NorthropGrumman — Northrop Grumman — NOC

Senators / representatives:
@SenatorCollins — Susan Collins — Maine shipbuilding and manufacturing
@SenatorWicker — Roger Wicker — Mississippi shipbuilding and defense
@SenJackReed — Jack Reed — Rhode Island submarine industrial base
@RepJoeCourtney — Joe Courtney — Connecticut submarine procurement
@RobWittman — Rob Wittman — naval programs and defense procurement

Governors / state offices:
@GovNedLamont — Connecticut
@GovernorKayIvey — Alabama
@GovAbbott — Texas governor’s office

ACCOUNT VALIDATION
- Verify each handle against its official organization website before ingestion.
- Store the platform’s stable account ID when available.
- Detect handle changes, inactive accounts and impersonators.
- A verification badge alone is insufficient proof of identity.
- Use authorized platform APIs or licensed data access.
- Do not assume every account posts every relevant announcement.

ADDITIONAL PRIMARY SOURCES

SAM Contract Opportunities:
https://sam.gov/opportunities
API documentation:
https://open.gsa.gov/api/get-opportunities-public-api/

SAM Contract Awards:
https://open.gsa.gov/api/contract-awards/

USAspending:
https://www.usaspending.gov/
API documentation:
https://api.usaspending.gov/docs/

SEC EDGAR public APIs:
https://www.sec.gov/search-filings/edgar-application-programming-interfaces
Public submissions and financial-data APIs require no API key.

Government procurement forecasts:
https://acquisitiongateway.gov/forecast
https://www.acquisition.gov/procurement-forecasts

DHS acquisition forecasts:
https://apfs-cloud.dhs.gov/forecast/

Space Development Agency:
https://www.sda.mil/

DIU opportunities:
https://www.diu.mil/work-with-us/open-solicitations

DARPA opportunities:
https://www.darpa.mil/work-with-us/opportunities

NAVAIR:
https://www.navair.navy.mil/

NAVSEA:
https://www.navsea.navy.mil/

Congress legislation and funding:
https://www.congress.gov/
https://api.congress.gov/

Also monitor:
- Each tracked company’s investor-relations newsroom and SEC filings.
- Each tracked agency’s official newsroom and procurement notices.
- Each tracked politician’s official press-release page.
- House and Senate Armed Services Committee documents.
- House and Senate Appropriations Committee documents.
- Relevant official bid-protest decisions.
- Current Pentagon daily contract announcements, resolving any official URL redirects.

INITIAL SECTOR PRIORITIES
1. Military satellites, spacecraft, launch and ground systems.
2. Unmanned systems, autonomy and counter-drone technology.
3. Defense electronics, communications and propulsion.
4. Government software, AI, cybersecurity and intelligence.
5. Shipbuilding, submarines and associated suppliers.
6. Medical countermeasures and government stockpile procurement.
7. Nuclear, energy infrastructure and strategic manufacturing.

KEYWORDS: CONFIRMED AWARDS / ORDERS
"contract awarded"
"awarded a contract"
"contract award"
"task order"
"delivery order"
"purchase order"
"funded order"
"funds obligated"
"obligated at the time of award"
"production contract"
"follow-on contract"
"follow-on production"
"option exercised"
"exercised an option"
"contract modification"
"contract extension"
"sole-source award"
"definitive contract"
"minimum guarantee"

KEYWORDS: UPCOMING PROCUREMENT
"sources sought"
"request for information"
"RFI"
"draft solicitation"
"draft RFP"
"request for proposals"
"RFP"
"request for quotation"
"RFQ"
"presolicitation"
"pre-solicitation"
"industry day"
"procurement forecast"
"acquisition forecast"
"commercial solutions opening"
"CSO"
"broad agency announcement"
"BAA"
"anticipated award"
"proposal deadline"
"recompete"
"intent to sole source"
"notice of intent"
"down-selection"
"downselect"
"selected for negotiations"

KEYWORDS: PROGRAM PROGRESSION
"prototype agreement"
"other transaction agreement"
"OTA"
"production transition"
"low-rate initial production"
"LRIP"
"full-rate production"
"Milestone C"
"operational deployment"
"program of record"
"initial operating capability"
"follow-on order"

KEYWORDS: FUNDING / INDUSTRIAL CAPACITY
"appropriation"
"appropriations"
"enacted"
"supplemental funding"
"budget request"
"authorization"
"NDAA"
"funding secured"
"funding allocated"
"funding obligated"
"Defense Production Act"
"production capacity"
"manufacturing expansion"
"facility expansion"
"stockpile"
"strategic reserve"
"offtake agreement"

KEYWORDS: NEGATIVE / UNCERTAINTY
"contract terminated"
"termination for convenience"
"termination for default"
"stop-work order"
"award cancelled"
"award canceled"
"solicitation cancelled"
"solicitation canceled"
"option not exercised"
"funding withdrawn"
"deobligation"
"scope reduction"
"lost recompete"
"bid protest"
"protest sustained"
"corrective action"
"award rescinded"
"production delay"
"cost overrun"

MATCHING RULES
- Keywords identify candidates, not conclusions.
- Require contextual relevance to procurement, funding or the tracked company.
- Disambiguate acronyms such as AI, RFI, CSO and option.
- Detect negation, speculation, historical references and quoted statements.
- Read linked documents, not just the post headline.
- Include attachments when accessible.
- Identify whether a post describes a new event or repeats an earlier announcement.

EVENT CLASSIFICATION
Assign one primary event type:
- PROCUREMENT_FORECAST
- SOURCES_SOUGHT_RFI
- DRAFT_SOLICITATION
- FINAL_SOLICITATION
- DOWN_SELECTION
- PROTOTYPE_AWARD
- CONTRACT_VEHICLE_AWARD
- DEFINITIVE_CONTRACT_AWARD
- FUNDED_TASK_OR_DELIVERY_ORDER
- OPTION_EXERCISE
- CONTRACT_MODIFICATION
- PRODUCTION_TRANSITION
- PROPOSED_FUNDING
- ENACTED_FUNDING
- GRANT
- LOAN_OR_GUARANTEE
- INDUSTRIAL_EXPANSION
- PROTEST_OR_CORRECTIVE_ACTION
- CANCELLATION_OR_TERMINATION
- OTHER_OR_UNCLEAR

Keep procurement contracts, grants, loans, investment announcements and company-funded capital expenditure separate.

ENTITY RESOLUTION
- Extract the exact legal recipient.
- Resolve subsidiaries, joint ventures and publicly traded parents.
- Match CAGE, UEI, CIK and ticker where available.
- Verify current ownership and listing status.
- Record ownership effective dates for historical analysis.
- Distinguish prime contractor from subcontractor.
- Do not assign revenue to an unconfirmed supplier.
- Do not assume a joint venture’s entire award belongs to one parent.
- If recipient allocation is undisclosed, mark it UNKNOWN.

FINANCIAL EXTRACTION
Extract separately:
- Headline announced amount.
- Base contract value.
- Maximum potential value / ceiling.
- Amount newly obligated.
- Cumulative obligations, if stated.
- Guaranteed minimum.
- Unexercised options.
- Company-specific allocation.
- Shared vehicle ceiling.
- Currency.
- Contract duration.
- Performance start and end dates.
- Expected revenue timing, if explicitly disclosed.
- New work versus replacement / renewal.
- Contract type, including fixed-price or cost-reimbursement.
- Funding contingencies and performance conditions.

Never:
- Treat an IDIQ ceiling as secured revenue.
- Divide a shared ceiling equally among awardees.
- Treat an unexercised option as committed revenue.
- Treat obligations as immediate recognized revenue or profit.
- Treat a modification’s cumulative total as entirely new money.
- Treat “selected for negotiations” as a signed award.
- Treat proposed or authorized funding as an awarded contract.
- Fill missing financial fields with zero or invented estimates.

MATERIALITY ANALYSIS
Calculate when supported:
- Newly obligated amount / trailing-12-month company revenue.
- Firm company-attributable contract value / trailing-12-month revenue.
- Contract value / disclosed backlog, using compatible definitions.
- Rough annual contract value / annual revenue, only when duration and attributable value are known.

Label annualization as an approximation, not a revenue forecast.

Assess:
- Is the work incremental or replacing existing business?
- Was it already included in guidance or backlog?
- Does it introduce a new customer, program or production phase?
- Are margins or execution risks disclosed?
- Is there evidence of follow-on potential, or merely speculation?
- Could a cancellation materially affect expected business?

NOVELTY AND TIMING
Store separately:
- Event / award date.
- Original source publication timestamp.
- Post publication timestamp.
- First detection timestamp.
- Last update timestamp.
- Earliest known matching public announcement.

Rules:
- Preserve timezone and normalize timestamps to UTC.
- Do not invent an intraday time for a date-only source.
- Earliest known publication is not necessarily the first public disclosure.
- Deduplicate by contract ID, solicitation ID, recipient, event type and document.
- Retain meaningful updates such as newly funded orders.
- Do not count syndicated releases or reposts as independent confirmations.
- Do not classify an old award as new because it appeared later in SAM or USAspending.

MARKET CONTEXT
For a verified public-company match, record:
- Price at detection.
- Market session: premarket, regular, after-hours or closed.
- Return since earliest known publication, when available.
- Return since detection.
- Relevant benchmark / sector return.
- Trading volume and relative volume.
- Bid-ask spread.
- Available liquidity.

Do not:
- Infer causation solely from simultaneous price movement.
- Assume good contract news implies a positive stock return.
- Treat price movement before detection as achievable strategy returns.
- Generate an automatic trade from keyword matches alone.

ALERT PRIORITY

HIGH — IMMEDIATE RESEARCH REVIEW
- New primary-source award or funded order.
- Recipient and publicly traded parent verified.
- Financial significance supported by extracted data.
- Meaningful production transition.
- Material cancellation, lost recompete or funding reduction.

MEDIUM — RESEARCH QUEUE
- Down-selection or prototype award.
- New solicitation naming a relevant program.
- Award with undisclosed financial terms.
- Enacted funding with a plausible but unconfirmed company connection.
- Politician announcement awaiting the underlying award document.

LOW — BACKGROUND / DIGEST
- General policy statements.
- Requested funding.
- Factory visits or ribbon cuttings without new financial details.
- Routine delivery milestones.
- Reposts, anniversary posts and previously disclosed awards.
- Broad sector commentary without a named procurement or recipient.

Use separate labels for:
- Source confidence.
- Event certainty.
- Financial materiality.
- Novelty.
- Market reaction already observed.

Do not collapse these into an asserted probability of profit.

ALERT OUTPUT FORMAT

Headline:
Company:
Ticker:
Legal recipient:
Government buyer:
Program:
Event type:
Contract / solicitation ID:
Newly obligated amount:
Base value:
Ceiling:
Options:
Company allocation:
Duration:
New business or renewal:
Materiality assessment:
Source confidence:
Event certainty:
Earliest known publication:
First detected:
Prior related announcement:
Price change since publication:
Price change since detection:
Primary-source URL:
Supporting-source URLs:
Why this may matter:
What remains unknown:
Priority:

VALIDATION BEFORE LIVE TRADING
- Paper-track alerts first.
- Save the information available at detection time.
- Include negative events, failed signals and losing companies.
- Avoid hindsight and look-ahead bias.
- Evaluate returns from realistic detection and execution times.
- Include spread, slippage, fees and liquidity constraints.
- Compare against sector and market benchmarks.
- Evaluate on a separate out-of-sample period.
- Rank sources by novel, verified, material alerts and measured timeliness.
- Do not assume this watchlist has a proven trading edge.