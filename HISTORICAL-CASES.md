# Historical research cases

These are sourced event examples for testing detection, not a validated investment strategy. Contract lead time, net funding, company scale, price reaction and subsequent returns have not been backtested.

| Case | Established event | What to test |
|---|---|---|
| AeroVironment | January 22, 2007 IPO pricing announcement; trading scheduled for January 23. The announcement describes DoD users of its small UAS. | How early publicly available award and company information preceded a traditional IPO; separate the filing date from the listing date. |
| Palantir | NYSE records a direct listing on September 30, 2020. | Correctly distinguish a direct listing from a traditional IPO; examine pre-listing government business in original filings. |
| Red Cat / Teal | Company announced U.S. Army Short Range Reconnaissance production selection on November 19, 2024. | Detect a named-program production transition without treating target quantities or selection as money already obligated. |
| Virgin Orbit | Company announced Chapter 11 filing on April 4, 2023 in a release filed with the SEC. | Negative-control candidate: contracts and space-sector attention do not establish financial resilience. Contract-history linkage remains to be researched. |

Sources:
- AeroVironment: https://investor.avinc.com/news-releases/news-release-details/aerovironment-inc-announces-pricing-initial-public-offering
- NYSE: https://www.nyse.com/data-insights/opening-and-trading-direct-listings
- Red Cat: https://ir.redcatholdings.com/news-events/press-releases/detail/160/red-cat-announces-production-selection-for-u-s-army-short-range-reconnaissance-program
- Virgin Orbit SEC-filed release: https://www.sec.gov/Archives/edgar/data/1843388/000162828023010459/a230404ex991-pressrelease.htm

Backtest method: reconstruct only information available before the event, retain source publication and first-seen timestamps, compare net obligations with company revenue when available, evaluate failures alongside successes, and measure both discovery lag and false positives. Do not use later filings to simulate earlier knowledge.
