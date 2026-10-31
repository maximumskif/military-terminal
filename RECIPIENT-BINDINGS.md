# Reviewed recipient identifier bindings

Recipient resolution now requires dated, reviewed identifier evidence in `entity-ledger.json.identifierBindings`. An entity name or an unreviewed `uei`/`cage` attribute cannot assign a public parent. Every supplied identifier must have a reviewed binding covering the requested date, and the bindings must agree on one legal entity. A missing identifier binding, conflicting identifiers, invalid date, ambiguous parent, or ownership outside the reviewed interval prevents resolution.

Each binding records `id`, `kind` (`uei` or `cage`), `value`, `entityId`, `reviewStatus` (`reviewed_official_record`), `effectiveFrom`, `evidenceAsOf`, optional exclusive `effectiveUntil`, `sourceUrl`, and `supportingPassage`. Review status is a local research assertion; this module does not authenticate the source or independently verify a passage. Adding an operational binding requires checking the official record first. A relationship must separately have reviewed filing evidence covering the date. Tickers still require listing evidence for the exact requested date.

## Operational bindings

| Legal entity | Public parent | UEIs | Resolves for |
|---|---|---:|---|
| Aerojet Rocketdyne of DE, Inc. | L3Harris Technologies, Inc. | 1 | 2023-07-28 – 2026-01-02 |
| Aerojet Rocketdyne, Inc. | L3Harris Technologies, Inc. | 4 | 2023-07-28 – 2026-01-02 |
| Amentum Environment & Energy, Inc. | Amentum Holdings, Inc. | 1 | 2025-10-03 – 2025-10-03 |
| Amentum Services, Inc. | Amentum Holdings, Inc. | 3 | 2025-10-03 – 2025-10-03 |
| Amentum Technology, Inc. | Amentum Holdings, Inc. | 8 | 2025-10-03 – 2025-10-03 |
| Bath Iron Works Corporation | General Dynamics Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Bell Textron Inc. | Textron Inc. | 1 | 2020-01-04 – 2026-01-03 |
| Booz Allen Hamilton Inc. | Booz Allen Hamilton Holding Corporation | 4 | 2020-03-31 – 2026-03-31 |
| BWXT Nuclear Operations Group, Inc. | BWX Technologies, Inc. | 1 | 2019-12-31 – 2025-12-31 |
| BWXT Technical Services Group, Inc. | BWX Technologies, Inc. | 1 | 2022-12-31 – 2025-12-31 |
| CACI Azure Summit Technology, LLC | CACI International Inc | 1 | 2026-06-30 – 2026-06-30 |
| CACI Enterprise Solutions, LLC | CACI International Inc | 2 | 2019-06-30 – 2026-06-30 |
| CACI LGS Innovations LLC | CACI International Inc | 2 | 2020-06-30 – 2026-06-30 |
| CACI NSS, LLC | CACI International Inc | 2 | 2019-06-30 – 2026-06-30 |
| CACI Technologies, LLC | CACI International Inc | 1 | 2019-06-30 – 2026-06-30 |
| CACI, INC. – FEDERAL | CACI International Inc | 1 | 2019-06-30 – 2026-06-30 |
| Curtiss Wright Controls Inc. | Curtiss-Wright Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Curtiss-Wright Electro-Mechanical Corporation | Curtiss-Wright Corporation | 2 | 2019-12-31 – 2025-12-31 |
| Curtiss-Wright Flow Control Corporation | Curtiss-Wright Corporation | 1 | 2019-12-31 – 2025-12-31 |
| DynCorp International LLC | Amentum Holdings, Inc. | 2 | 2025-10-03 – 2025-10-03 |
| Electric Boat Corporation | General Dynamics Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Enlighten, LLC | Huntington Ingalls Industries, Inc. | 1 | 2025-12-31 – 2025-12-31 |
| Florida Turbine Technologies, Inc. | Kratos Defense & Security Solutions, Inc. | 1 | 2022-12-25 – 2025-12-28 |
| General Dynamics Information Technology, Inc. | General Dynamics Corporation | 6 | 2019-12-31 – 2025-12-31 |
| General Dynamics Land Systems Inc. | General Dynamics Corporation | 1 | 2019-12-31 – 2025-12-31 |
| General Dynamics Mission Systems, Inc. | General Dynamics Corporation | 14 | 2019-12-31 – 2025-12-31 |
| General Dynamics Ordnance and Tactical Systems, Inc. | General Dynamics Corporation | 2 | 2019-12-31 – 2025-12-31 |
| Goodrich Corporation | RTX Corporation | 7 | 2012-07-26 – 2025-12-31 |
| Hamilton Sundstrand Corporation | RTX Corporation | 4 | 1999-06-10 – 2025-12-31 |
| HII Fleet Support Group LLC | Huntington Ingalls Industries, Inc. | 1 | 2018-12-31 – 2023-12-31 |
| HII Mission Technologies Corp. | Huntington Ingalls Industries, Inc. | 4 | 2022-12-31 – 2025-12-31 |
| HII Technical Solutions Corporation | Huntington Ingalls Industries, Inc. | 1 | 2018-12-31 – 2025-12-31 |
| Huntington Ingalls Incorporated | Huntington Ingalls Industries, Inc. | 2 | 2018-12-31 – 2025-12-31 |
| KBR Services, LLC | KBR, Inc. | 2 | 2023-12-29 – 2026-01-02 |
| KBR Wyle Services, LLC | KBR, Inc. | 9 | 2023-12-29 – 2026-01-02 |
| Kratos Defense & Rocket Support Services, Inc. | Kratos Defense & Security Solutions, Inc. | 1 | 2020-12-27 – 2025-12-28 |
| Kratos Microwave, Inc. | Kratos Defense & Security Solutions, Inc. | 1 | 2024-12-29 – 2025-12-28 |
| L3 Technologies, Inc. | L3Harris Technologies, Inc. | 17 | 2019-06-29 – 2026-01-02 |
| L3Harris Technologies, Inc. | — (registrant) | 14 | binding dates through 2026-10-15 |
| Leidos, Inc. | Leidos Holdings, Inc. | 13 | 2021-01-01 – 2026-01-02 |
| Lockheed Martin Corporation | — (registrant) | 41 | binding dates through 2026-10-15 |
| Mercury Mission Systems, LLC | Mercury Systems, Inc. | 1 | 2020-07-03 – 2026-07-03 |
| Mercury Systems, Inc. | — (registrant) | 4 | binding dates through 2026-10-30 |
| National Steel and Shipbuilding Company | General Dynamics Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Northrop Grumman Systems Corporation | Northrop Grumman Corporation | 53 | 2019-12-31 – 2025-12-31 |
| Nuclear Fuel Services, Inc. | BWX Technologies, Inc. | 1 | 2019-12-31 – 2025-12-31 |
| PAE Applied Technologies LLC | Amentum Holdings, Inc. | 1 | 2025-10-03 – 2025-10-03 |
| PAE Government Services, Inc. | Amentum Holdings, Inc. | 1 | 2025-10-03 – 2025-10-03 |
| Parsons Government Services Inc. | Parsons Corporation | 4 | 2019-12-31 – 2025-12-31 |
| Parsons Government Services International Inc. | Parsons Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Parsons Technical Services Inc. | Parsons Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Raytheon Company | RTX Corporation | 42 | 2020-04-03 – 2025-12-31 |
| Rockwell Collins, Inc. | RTX Corporation | 5 | 2018-11-26 – 2025-12-31 |
| RTX Corporation | — (registrant) | 3 | binding dates through 2026-10-15 |
| Science Applications International Corporation | — (registrant) | 2 | binding dates through 2026-10-15 |
| Sikorsky Aircraft Corporation | Lockheed Martin Corporation | 1 | 2015-11-06 – 2025-12-31 |
| Space Ground System Solutions, Inc. | Parsons Corporation | 1 | 2020-12-31 – 2025-12-31 |
| Textron Aviation Defense LLC | Textron Inc. | 1 | 2020-01-04 – 2026-01-03 |
| Textron Aviation Inc. | Textron Inc. | 1 | 2020-01-04 – 2026-01-03 |
| Textron Systems Corporation | Textron Inc. | 2 | 2021-01-02 – 2026-01-03 |
| The Boeing Company | — (registrant) | 30 | binding dates through 2026-10-15 |
| URS Federal Services International, Inc. | Amentum Holdings, Inc. | 1 | 2025-10-03 – 2025-10-03 |
| V2X Systems LLC | V2X, Inc. | 2 | 2020-12-31 – 2025-12-31 |
| Williams Electric Co., Inc. | Parsons Corporation | 1 | 2019-12-31 – 2025-12-31 |
| Xator LLC | Parsons Corporation | 1 | 2022-12-31 – 2025-12-31 |

Active bindings: 344; retired: 2. Generated by tools/binding-summary.cjs.

### Parent corroboration (revised 2026-10-15)

USAspending recipient-profile parent fields can be stale: Sikorsky's profile still reports RTX CORP as its parent a decade after Lockheed acquired it, while its latest award record reports Lockheed Martin (ZFN2JJXBLZT3). The candidate tool therefore requires the parent on each UEI's latest award record to match, records profile-parent disagreement as a warning, and the promotion tool retires existing bindings that a newer review excludes (kept in `retiredBindings` with reasons). Re-verifying the RTX family under this rule recovered seven UEIs (including Rockwell Collins J4Q3HP6NHK47, Goodrich JZNWHLVKADJ9, Hamilton Sundstrand NFZTKCLHXAB7, Raytheon GMBYU6KAN9J3 and Pratt & Whitney Jupiter NHXNJALUN738) and retired two (Raytheon K1H5GGQPBLV5 and Goodrich QPHKSN6NVFB8) whose latest award names an implausible parent, ROCKWELL COLLINS AUSTRALIA PTY LIMITED (EGAVSJTA2D81), apparently a USAspending data error.

Lockheed: Exhibit 21 is a subsidiaries-only listing. Revenue uses the consolidated "Sales" line (FY2020–2025). Excluded: Archbald, PA (MAENKG4UJLK8) because its profile parent is Sikorsky Support Services, Inc., suggesting a different legal entity; MJENSFHZJP11 and a second Sikorsky record (UT9HCKX9F6Q4) whose latest awards are self-parented. Sikorsky's pre-2015 UTC ownership is not modeled.

Collins Aerospace and Pratt & Whitney are segment/brand names. Collins contracts are bound to its Exhibit 21 legal entities; ownership dates come from the 2018 (Rockwell Collins), 2012 (Goodrich) and 1999 (Hamilton Sundstrand) Form 10-K acquisition passages, continued by the 2025 Exhibit 21 listing. Pratt & Whitney's U.S. engine contracts are awarded to UEI QN1BCFY7JDJ5, legal name RTX CORPORATION (alternate names include "UNITED TECHNOLOGIES CORPORATION PRATT AND WHITNEY DIVISION"). Bindings to an entity with a CIK resolve to that registrant directly (`identifier_verified_public_registrant`) without a relationship, so they cover current dates. Former names (United Technologies Corp until 2020-04-06; Raytheon Technologies Corp until 2023-06-29, from SEC formerNames) were accepted on transactions via `--former`; resolutions report the current registrant name.

Originally excluded for lack of a parent link: four self-parented Rockwell Collins, Inc. UEIs, one Goodrich and one Hamilton Sundstrand UEI. The later latest-award re-verification recovered three Rockwell Collins UEIs (including J4Q3HP6NHK47, ~$433M), the Goodrich and the Hamilton Sundstrand UEI; Rockwell Collins QJ58YL55YKF3 has no contract transactions. Collins subsidiaries such as Rockwell Collins Simulation & Training Solutions LLC and Hamilton Sundstrand Space Systems International, Inc. are not yet reviewed.

### Northrop Grumman, General Dynamics, Boeing, L3Harris (2026-10-15)

Northrop Grumman Systems Corporation and seven General Dynamics subsidiaries (Electric Boat, Bath Iron Works, GDIT, Land Systems, Mission Systems, OTS, NASSCO) are listed as 100% owned in both the FY2019 and FY2025 Exhibit 21; coverage starts at the 2019-12-31 listing rather than formation or acquisition dates. The Boeing Company and L3Harris Technologies, Inc. (formerly Harris Corporation) are bound to the registrants directly. L3 Technologies, Inc. is a subsidiary from the 2019-06-29 merger (FY2020 10-K: "L3 continuing as the surviving corporation and a direct wholly-owned subsidiary of Harris") through the fiscal 2025 Exhibit 21 (2026-01-02). L3Harris uses 52/53-week fiscal years; revenue evidence records the actual fiscal year-end dates.

General Dynamics reports two parent UEIs (VF58HFRNGEL8 and FAZSFFE6CST9), both GENERAL DYNAMICS CORP with the same headquarters DUNS 001381284; both are accepted as the parent (the candidate tool accepts a comma-separated parent list). Excluded: GD Mission Systems D8CMPLV4GKR5 (profile parent Battelle Memorial Institute), self-parented GDIT, Land Systems, Mission Systems and OTS records, and an L3 Technologies record whose latest award names Regal Rexnord. Historical profile parents accepted as stale: Titan II Inc. (Northrop), CSRA LLC (GDIT), ITT Corporation and L-3 Communications Holdings (L3Harris/L3).

Not yet reviewed: renamed L3Harris subsidiaries (L3Harris Technologies Integrated Systems L.P., L3Harris Global Communications, Inc. and others), General Dynamics OTS variants (General Dynamics-OTS, Inc.; GD OTS (Wilkes Barre), LLC), Gulfstream, Boeing subsidiaries (Insitu) and Northrop Grumman Corporation's own UEIs.

The usable window is the intersection of the binding interval (earliest contract transaction under each UEI, search floor 2007-10-01, through the 2026-10-15 review) and the reviewed SEC relationship (2020-04-03 through the 2025-12-31 Exhibit 21). The 2026-06-30 10-Q mentions Raytheon Company but does not restate its subsidiary status, so 2026 events do not yet resolve; the FY2026 10-K Exhibit 21 should extend coverage. Five same-name records were excluded: they are self-parented legacy Raytheon parent records (including the pre-merger parent UEI KLW3ZYL15493) or have no contract transactions.

Evidence source: USAspending recipient profiles, which republish SAM.gov registration data; they are not SAM.gov itself. Each candidate required an exact legal-name match, a child-level record, a current reported parent of RTX CORP (UEI PPLZG8J3N9D4) and the same legal name on its earliest and latest contract transactions. USAspending's undated parent history is inconsistent (for example, it lists a Rockwell Collins Australia entry sharing RTX's DUNS number) and is not relied on. Review was automated-assisted by Claude on 2026-10-15; state of incorporation was not independently confirmed per UEI. CAGE codes are not bound.

### Leidos, SAIC, Booz Allen, KBR, Huntington Ingalls (2026-10-15)

Leidos, Inc. is Leidos Holdings' "direct 100%-owned subsidiary and principal operating company" (FY2020 and FY2025 10-Ks); it was named Science Applications International Corporation before the 2013-09-27 spin-off. The current SAIC registrant (CIK 1571123, formerly SAIC Gemini, Inc.) is bound directly, with `--not-before 2013-09-27` so that pre-spin-off transactions under the shared name cannot assign the new SAIC. Its Reston UEI MMLKPW9JLX64 lists alternate name SAIC GEMINI INC.; a self-parented Chantilly record (W86MRS1GLQW5) and other self-parented SAIC-named records are excluded. Leidos subsidiary records whose latest-award parent is Leidos, Inc.'s Reston UEI (MDSWM6MB1BH7) are accepted because that UEI itself passed against Leidos Holdings (ZL41ERXMPAR3).

KBR Wyle Services, LLC and KBR Services, LLC appear in the FY2023 and FY2025 "Subsidiaries of Registrant" lists without ownership percentages; no filing passage states wholly owned status, so ownershipPercentage is null. KBR Wyle records parented only by the KBR Wyle rollup UEI TGPKTMN8YL31 (no child record to verify) are excluded. Stale Honeywell profile parents reflect KBR's 2016 acquisition of Honeywell Technology Solutions.

Booz Allen Hamilton Inc. (FY2020 listing; FY2026 10-K: "a wholly owned subsidiary of Booz Allen Hamilton Holding Corporation") and Huntington Ingalls Incorporated (100% in the FY2021 Exhibit 21; listed FY2025) are bound after a broader `--keyword` pass (Booz Allen: McLean, Eatontown, Annapolis Junction, Norfolk; HII: Newport News and Pascagoula). Aerojet Rocketdyne, Inc. and Aerojet Rocketdyne of DE, Inc. are indirect L3Harris subsidiaries from 2023-07-28: the completion 8-K states Aerojet Rocketdyne (the Delaware holding company) became "a wholly owned subsidiary of L3Harris", and both operating entities are listed in the fiscal 2025 Exhibit 21; ownership of each operating entity is inferred, not stated.

The candidate tool previously took only the first transaction from a UEI text search, which can match child records of that UEI; it now pages until the exact recipient appears. Re-running affected reviews recovered Raytheon's legacy parent UEI KLW3ZYL15493 and Rockwell Collins QJ58YL55YKF3 (latest-award parent RTX in both).

### Textron (2026-10-29)

Textron Inc. (CIK 217346, NYSE: TXT) uses 52/53-week fiscal years; revenue evidence for FY2020–2025 records the actual year-end dates (2021-01-02 through 2026-01-03) from the Consolidated Statements of Operations and matches the us-gaap:Revenues facts. The Exhibit 21 header states "Unless indicated otherwise, all entities listed are wholly-owned"; none of the bound entities carries another percentage. Bell Textron Inc. (Delaware), Textron Aviation Inc. (Kansas) and Textron Aviation Defense LLC (Delaware) are listed in the fiscal 2019 (2020-01-04) and fiscal 2025 (2026-01-03) Exhibit 21s. All four latest-award parents are Textron Inc. (UEI HKUMGJBEMKN3, a parent-level rollup).

Textron Systems Corporation starts at the fiscal 2020 listing (2021-01-02). The fiscal 2019 list shows a Delaware Textron Systems Corporation and a Maryland AAI Corporation; fiscal 2020 onward lists only a Maryland Textron Systems Corporation, suggesting AAI was renamed and the Delaware entity combined. No reviewed filing states this, so AAI-era dates are not modeled. Both bound UEIs (Hunt Valley SNJ8YY61GB95, Wilmington MA R9MCJ6BRC8M7) carry the current legal name; state of incorporation per UEI was not confirmed.

Excluded: Bell Textron Inc. Broussard, LA (KUZ4MEX7N6Y3) and Textron Systems Corp, New Orleans (WEE9WFHMACH9, the former Textron Marine & Land Systems), whose latest awards are self-parented. The New Orleans record is the largest Textron Systems recipient by contract amount; it needs separate parent corroboration. Not yet reviewed: Textron Inc.'s own awards, Howe & Howe, Overwatch Systems, AAI Services Corporation, Airborne Tactical Advantage Company and Textron eAviation entities.

### CACI (2026-10-30)

CACI International Inc (CIK 16058, NYSE: CACI) reports June 30 fiscal years; revenue evidence covers FY2021–2026 from the Consolidated Statements of Operations and matches the us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax facts. On 2026-10-20 the board changed the fiscal year end to December 31 (8-K Item 5.03, filed 2026-10-21) with a July 1 – December 31, 2026 transition period to be reported on Form 10-KT; that six-month period must not be recorded as annual revenue evidence. SEC formerNames lists only the current name.

Exhibit 21.1 gives no ownership percentages and no filing passage names these entities as wholly owned, so relationships record `ownershipPercentage: null` (as for KBR). CACI, INC. – FEDERAL, CACI NSS, LLC, CACI Technologies, LLC and CACI Enterprise Solutions, LLC appear in every listing from fiscal 2019 (2019-06-30) through fiscal 2026 (2026-06-30). Fiscal 2020–2025 list "LGS Innovations LLC" and fiscal 2026 only "CACI LGS Innovations LLC"; fiscal 2025 has a truncated "CACI Azure Summit" entry. The LGS rename now follows the brand-rename rule (see Corroboration rules) and resolves from fiscal 2020; the truncated Azure Summit entry is not a rename, so it starts at the fiscal 2026 listing and resolves only on 2026-06-30 until the 10-KT subsidiary list extends it. All six bound UEIs have latest-award parent CACI INTERNATIONAL INC (UEI QSRTXLFKV857).

Bound since 2026-10-30 under the intermediate-parent rule: CACI NSS, LLC Chantilly (EELEC8QCC3N8, $472M, via the CACI NSS rollup Y9CDLHK3A125) and CACI Enterprise Solutions HLEJZK5FZR54. Excluded: CACI NSS Colorado Springs (L2TTR2QRV8H9); CACI, LLC – COMMERCIAL (E5E6SMMJYPL3, ZKJREJ8CK539) and CACI-ISS, LLC (EPPXR2P9KYU6), all self-parented. The CACI International Inc registrant UEI QSRTXLFKV857 is unbound: the transaction text search returns child records first and no earliest transaction under that UEI was found. Not yet reviewed: CACI Premier Technology, CACI Dynamic Systems, CACI-WGI, CACI-Athena, Six3 entities, CACI TechWorx and ARKA Group, L.P. (acquired 2026).

### Parsons (2026-10-30)

Parsons Corporation (CIK 275880, NYSE: PSN) reports calendar fiscal years; revenue evidence covers FY2020–2025 from the Consolidated Statements of Income and matches the us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax facts. SEC formerNames records a one-day "PARSON CORP" entry (2019-02-11).

Exhibit 21.1 gives jurisdictions but no ownership percentages, so relationships record `ownershipPercentage: null`. Parsons Government Services Inc. (Nevada), Parsons Government Services International Inc. (Delaware), Williams Electric Co., Inc. (Florida) and Parsons Technical Services Inc. (Delaware) start at the fiscal 2019 listing; Space Ground System Solutions, Inc. (Florida) at fiscal 2020; Xator LLC (Florida) at fiscal 2022. The fiscal 2022 Form 10-K calls "Xator Corporation, which we acquired on May 31, 2022" a wholly owned subsidiary, but that names a different legal form than the listed Xator LLC, so the date and ownership are not applied. All nine bound UEIs have latest-award parent PARSONS CORPORATION (UEI FFCMDLMXRK49).

Exhibit 21.1 also lists a Delaware "Parsons Corporation" subsidiary with the registrant's name, so the registrant UEI FFCMDLMXRK49 is not bound. Excluded: Parsons Government Services Inc. Aberdeen Proving Ground (DT2NPK1X9HD5) and Huntsville (QJD7W4CUEN63), self-parented. Seven further Parsons Government Services UEIs listed as USAspending children of FFCMDLMXRK49 (CA, VA, CO ×2, MO, GA, IN) do not appear in the contract recipient search and are not reviewed. Also not yet reviewed: Incadence Strategic Solutions (listed fiscal 2022 and 2025 only), Blackhorse, Polaris Alpha entities, BlackSignal, Argotek and the 2025 acquisitions (TRS Group, Chesapeake Technology International, Applied Sciences Consulting).

### BWXT (2026-10-30)

BWX Technologies, Inc. (CIK 1486957, NYSE: BWXT; named Babcock & Wilcox Co until the 2015 spin-off, same CIK) reports calendar fiscal years; revenue evidence covers FY2020–2025 from the Consolidated Statements of Income and matches the us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax facts.

Exhibit 21.1 lists significant subsidiaries with a percentage-of-ownership column, so relationships record 100%. Nuclear Fuel Services, Inc. and BWXT Nuclear Operations Group, Inc. (both Delaware) start at the fiscal 2019 listing; BWXT Technical Services Group, Inc. (Delaware) first appears in fiscal 2022. All three bound UEIs (Erwin TN SMJQJGD5JEJ3, Lynchburg VA WJYVCPD5HKK7 and PZDQCRZW7GJ3) have latest-award parent BWX TECHNOLOGIES, INC. (UEI CMT4S6G76QB5); profiles also report the pre-spin-off parent BABCOCK & WILCOX COMPANY, THE (LT3WQQAWCK75), which is not relied on.

Excluded: BWXT Advanced Technologies LLC (UEI UMBKD2WKD8N5), self-parented. BWXT Nuclear Energy, Inc. and BWXT mPower, Inc. have no contract recipient records. Not reviewed: BWXT NOG Technologies, BWXT Conversion Services, Diamond Power International and Idaho Treatment Group (not on the significant-subsidiary list), the NNSA management-and-operating joint ventures (BWXT Y-12, BWXT Pantex, Consolidated Nuclear Security, Fluor-BWXT Portsmouth, Newport News Nuclear BWXT-Los Alamos, BWXT Enrichment Operations), which are not wholly owned or not listed, and the registrant UEI CMT4S6G76QB5.

### Curtiss-Wright (2026-10-30)

Curtiss-Wright Corporation (CIK 26324, NYSE: CW) reports calendar fiscal years; revenue evidence covers FY2020–2025 (Total net sales, Consolidated Statements of Earnings). FY2021 uses the 2,500,761 thousand reported in the fiscal 2023 Form 10-K; the fiscal 2022 Form 10-K reported 2,505,931 thousand.

Exhibit 21 states that all listed subsidiaries are "wholly owned by the Corporation, directly or indirectly", so relationships record 100% from the fiscal 2019 listing. The fiscal 2024 list omits Curtiss-Wright Electro-Mechanical Corporation, which appears in every other year; the exhibit says omitted subsidiaries are not significant, so the gap is recorded as a limitation, not an ownership change.

Curtiss-Wright's SAM hierarchy is fragmented: most recipient records are self-parented or report the Curtiss-Wright Flow Control Service, LLC rollup (J9V9SJL4CW97) as parent. Only two records have latest-award parent CURTISS-WRIGHT CORPORATION (PF8PJNVEPTJ1): Electro-Mechanical, Wellsville NY (MWAKL633WET8) and Controls, Shelby NC (N257NEGSDQJ9). Bound since 2026-10-30 under the intermediate-parent rule: Electro-Mechanical Cheswick PA (JKZNKGGWYZ87, $21M) and Flow Control Corporation Farmingdale NY (NYGUEDY27AM8), both via the Flow Control Service rollup. Excluded: Electro-Mechanical Chesapeake VA, Chula Vista CA, Bethlehem PA and Summerville SC; Controls TMFLTAKP1KH2; Flow Control Service Aston PA and Idaho Falls, all self-parented. Metal Improvement Company and Dy4 Systems returned no contract recipient records.

### Leonardo DRS (not bound, 2026-10-30)

Leonardo DRS, Inc. (CIK 1833756, Nasdaq: DRS) subsidiary records (e.g. DRS Network & Imaging Systems, MC27B7LGBL34) report latest-award parent LEONARDO S.P.A. (W8PTMRME1496), the majority shareholder, not the registrant (UEI UP54BEGGMGV5). That parent cannot distinguish DRS subsidiaries from other Leonardo US entities, so no bindings were made. DRS was also not publicly listed before the November 2022 RADA merger.

### V2X (2026-10-30)

V2X, Inc. (CIK 1601548, NYSE: VVX; formerly Vectrus, Inc., same CIK) reports calendar fiscal years; revenue evidence covers FY2020–2025 from the Consolidated Statements of Income (Loss). FY2022 includes Vertex Aerospace only from the July 2022 merger, so FY2020–2022 reflect a smaller company.

Exhibit 21 has no ownership percentages. Fiscal 2020–2024 list a Delaware "Vectrus Systems Corporation"; fiscal 2025 lists only "V2X Systems LLC". The fiscal 2025 Form 10-K and the May 2026 credit agreement amendment state other renames (V2X LLC f/k/a Vertex Aerospace Services LLC; V2X Intermediate LLC f/k/a Vertex Aerospace Intermediate LLC) but not this one, so under the brand-rename rule V2X Systems LLC resolves from the fiscal 2020 Vectrus Systems Corporation listing. Both bound UEIs (Colorado Springs RRFJZGASZJ41, $1.2B; McLean EK2CM5J7DWM8) have latest-award parent V2X, INC. (CG8SV4246V29).

Excluded: V2X Aerospace LLC, Madison MS (NVC1EFKKYB93, $1.7B), self-parented. Not reviewed: Vectrus-J&J Facilities Support and Vectrus Federal Services GmbH (self-parented in search results), V2X LLC and the other renamed Vertex entities.

### Amentum (2026-10-30)

Amentum Holdings, Inc. (CIK 2011286, NYSE: AMTM) became public on 2024-09-27 through the merger with Jacobs Critical Mission Solutions and uses 52/53-week fiscal years ending near September 30. Revenue evidence covers FY2022–2025; FY2022–2024 are the predecessor Amentum Parent Holdings LLC's results and are not comparable to the combined company (FY2025: $14.4B, a 53-week year).

The fiscal 2024 Exhibit 21.1 is titled "Expected Subsidiaries of Combined Co Immediately Following the Merger", so relationships start at the fiscal 2025 listing (2025-10-03) and currently resolve only on that date; the fiscal 2026 Form 10-K (expected late 2026) should extend them. The exhibit gives no ownership percentages. Bound: Amentum Services, Inc. (Chantilly QEMLRQA7PLG4, $3.3B; Huntsville), Amentum Technology, Inc. (eight UEIs, Tullahoma, Tampa, Columbia, Chantilly, Severn), Amentum Environment & Energy, Inc. (Aiken), PAE Government Services, Inc., PAE Applied Technologies LLC, DynCorp International LLC (Fort Worth, Chantilly) and URS Federal Services International, Inc.; all with latest-award parent AMENTUM HOLDINGS INC. (TU4KCXMM9AP6).

Amentum Services Germantown MD (HE89E2BE5G54) is bound under the intermediate-parent rule via bound UEI QEMLRQA7PLG4. Excluded: Amentum Spaceport LLC (KA18WLGL1NQ5, parent Amentum Joint Venture LP). Not reviewed: the DOE cleanup joint ventures (United Cleanup Oak Ridge, Idaho Environmental Coalition, Southern Ohio Cleanup, Four Rivers, Central Plateau, Mission Conversion Services Alliance), JT4 LLC, DZSP 21 LLC and Amentum Parsons Logistics Services, which are joint ventures or not shown as wholly owned.

### Kratos (2026-10-30)

Kratos Defense & Security Solutions, Inc. (CIK 1069258, Nasdaq: KTOS; formerly Wireless Facilities Inc) uses 52/53-week fiscal years; revenue evidence covers FY2020–2025 from the Consolidated Statements of Operations.

Exhibit 21.1 marks only partially owned subsidiaries with a percentage, so unmarked entities record `ownershipPercentage: null`. Kratos Defense & Rocket Support Services, Inc. (San Diego XF6AHNQFTXU5) starts at fiscal 2020; Florida Turbine Technologies, Inc. (Jupiter EJ5QQHF7B1P6) was marked "80.1% owned" in fiscal 2020–2021 and starts at the first unmarked listing, fiscal 2022; Kratos Microwave, Inc. (San Jose PL89EHJU9KE4) starts at fiscal 2024. All have latest-award parent KRATOS DEFENSE & SECURITY SOLUTIONS, INC. (V1Q4EJF67641).

Most large Kratos recipients are self-parented and not bound: Kratos Unmanned Aerial Systems (GURMFDFLENX4, $131M), Kratos Technology & Training Solutions (FLLRPTP8S7N4, $71M), Kratos S2 (D7GMZLLJLXB3), Kratos SRE (GM11ZH81LBY7) and Defense & Rocket Support Huntsville (CQQAZNLAJHG1). Kratos Space & Missile Defense Systems and Kratos S1 were not reviewed.

### Mercury Systems (2026-10-30)

Mercury Systems, Inc. (CIK 1049521, Nasdaq: MRCY; formerly Mercury Computer Systems Inc until 2012) uses 52/53-week fiscal years ending near June 30; revenue evidence covers FY2021–2026 (Net revenues) and matches the us-gaap:Revenues facts.

Four registrant-level UEIs named MERCURY SYSTEMS, INC. (Andover MA J51ULX3CNCZ4, Hudson NH, Chantilly VA, Huntsville AL) have latest-award parent J51ULX3CNCZ4 and are bound to the registrant. Mercury Mission Systems, LLC (Delaware; Torrance CA GELNG3K35FA5) is listed in every Exhibit 21.1 from fiscal 2020 (2020-07-03) through fiscal 2026; the exhibit gives no ownership percentages. Excluded: Mercury Mission Systems Florida (JKV8PJZFAGW7), self-parented. Physical Optics Corporation (DG3AB4E8R4D8) has latest-award parent Mercury but does not appear in any reviewed Exhibit 21.1, so it is not bound.

### Huntington Ingalls (2026-10-30)

Exhibit 21.1 states 100% ownership for every listed subsidiary used here from fiscal 2018 through fiscal 2023; the fiscal 2024 and 2025 lists drop the percentage column. Huntington Ingalls Incorporated now starts at its fiscal 2018 listing (was fiscal 2021). Bound, all with latest-award parent HUNTINGTON INGALLS INDUSTRIES, INC (F9SDJAZFTLG6): HII Mission Technologies Corp. (Delaware; listed from fiscal 2022: McLean VA G5H7HWC4L2R5, Willowbrook IL GS7HBMNZEMK3, Huntsville AL HHT6NC9UT8Z5, Fairborn OH Z6USGD96KM25); HII Technical Solutions Corporation (C17YSNK69P77, from fiscal 2018); HII Fleet Support Group LLC (VGCPT3NSM831, fiscal 2018–2023 only: absent from the fiscal 2024 and 2025 lists, so coverage ends at 2023-12-31); Enlighten, LLC (Maryland, R1V7DQ3VKQP5). Enlighten was listed as “Enlighten IT Consulting LLC” through fiscal 2024; that is not a brand rename, so its relationship starts at the fiscal 2025 listing and resolves only on 2025-12-31 until the fiscal 2026 Exhibit 21.1 extends it. Transactions under the former name are accepted for the UEI (`--former`) because the window starts after the rename.

Not bound: Newport News Nuclear BWXT-Los Alamos (51% joint venture), Continental Maritime of San Diego (not in any reviewed Exhibit 21.1), HII Nuclear Inc. and HII San Diego Shipyard Inc. (listed, but no contract obligations under their UEIs), Huntington Ingalls Unmanned Maritime Systems (the HII UNMANNED MARITIME SYSTEMS INC. record name differs from the listed legal name and carries no contract obligations).

## Corroboration rules (revised 2026-10-30)

**Intermediate parents.** The latest-award parent UEI normally must be the public parent's UEI. `tools/recipient-candidates.cjs` also accepts a different parent UEI as a reviewed intermediate when it is another subsidiary of the same public parent in this ledger: either the intermediate UEI is an active binding of such a subsidiary, or its SAM parent name equals that subsidiary's legal name (normalized for case, punctuation and dashes). The evidence records the basis and whether USAspending also lists the intermediate as a child of the public parent. Self-parented records are never accepted, and the child still needs its own reviewed relationship, so resolution windows are unchanged. Applied: KBR Wyle Lexington Park (L693MQDFLKD1) and two smaller Wyle records via the KBR Wyle Services rollup; CACI NSS Chantilly (EELEC8QCC3N8) via the CACI NSS rollup; CACI Enterprise Solutions HLEJZK5FZR54; Amentum Services Germantown (HE89E2BE5G54) via bound Amentum Services UEI QEMLRQA7PLG4; Curtiss-Wright Electro-Mechanical Cheswick (JKZNKGGWYZ87) and Flow Control Corporation Farmingdale (NYGUEDY27AM8) via the Curtiss-Wright Flow Control Service, LLC rollup (that entity and Flow Control Corporation were added as wholly owned subsidiaries for this purpose). Still rejected: parents outside the ledger group (Rockwell Collins Australia, Regal Rexnord, Amentum Joint Venture LP) and a "SCIENCE APPLICATIONS INTERNATIONAL CORPORATION" parent UEI that may be the pre-2013 entity now named Leidos.

**Brand renames.** A relationship continues across a subsidiary rename not stated in a filing when consecutive annual Exhibit 21 lists show the old name last and the new name first, in the same jurisdiction, the old name is absent from the later list, and the new name equals the old one with the parent's own brand added or substituted. The relationship records `renamedFrom` and cites the old-name listings. Applied: CACI LGS Innovations LLC (LGS Innovations LLC, from fiscal 2020) and V2X Systems LLC (Vectrus Systems Corporation, from fiscal 2020; the registrant itself was renamed Vectrus, Inc. → V2X, Inc.). Not applied: Textron Systems Corporation (fiscal 2019 lists both a Delaware Textron Systems Corporation and a Maryland AAI Corporation, so the predecessor is ambiguous and the names differ) and CACI Azure Summit (a truncated entry, not a rename).

## Adding bindings

1. `node tools/recipient-candidates.cjs "<legal name>" <parent UEI[,UEI]> [--former "A|B"] [--not-before YYYY-MM-DD] [--keyword TEXT] <ledger entity id> reviews/recipients/<slug>.json` collects candidates and exclusions with response hashes.
2. Inspect every candidate (location, transaction span, reported parents).
3. `node tools/promote-recipient-review.cjs reviews/recipients/<slug>.json "<reviewer>" [--exclude UEI,...]` merges them into the ledger; conflicting existing bindings stop the promotion.
4. The legal entity must already have a reviewed, dated SEC relationship to its parent.

Regenerate the table above with `node tools/binding-summary.cjs`. Synthetic tests remain isolated from the operational ledger.
