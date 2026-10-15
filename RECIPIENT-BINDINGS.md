# Reviewed recipient identifier bindings

Recipient resolution now requires dated, reviewed identifier evidence in `entity-ledger.json.identifierBindings`. An entity name or an unreviewed `uei`/`cage` attribute cannot assign a public parent. Every supplied identifier must have a reviewed binding covering the requested date, and the bindings must agree on one legal entity. A missing identifier binding, conflicting identifiers, invalid date, ambiguous parent, or ownership outside the reviewed interval prevents resolution.

Each binding records `id`, `kind` (`uei` or `cage`), `value`, `entityId`, `reviewStatus` (`reviewed_official_record`), `effectiveFrom`, `evidenceAsOf`, optional exclusive `effectiveUntil`, `sourceUrl`, and `supportingPassage`. Review status is a local research assertion; this module does not authenticate the source or independently verify a passage. Adding an operational binding requires checking the official record first. A relationship must separately have reviewed filing evidence covering the date. Tickers still require listing evidence for the exact requested date.

## Operational bindings

| Legal entity | Public parent | UEIs bound | Review file | Resolves for dates |
|---|---|---:|---|---|
| Raytheon Company | RTX Corporation | 41 | reviews/recipients/raytheon-company.json | 2020-04-03 – 2025-12-31 |
| Rockwell Collins, Inc. (Collins Aerospace) | RTX Corporation | 1 | reviews/recipients/rockwell-collins-inc.json | 2018-11-26 – 2025-12-31 |
| Goodrich Corporation (Collins Aerospace) | RTX Corporation | 7 | reviews/recipients/goodrich-corporation.json | 2012-07-26 – 2025-12-31 |
| Hamilton Sundstrand Corporation (Collins Aerospace) | RTX Corporation | 3 | reviews/recipients/hamilton-sundstrand-corporation.json | 2007-10-01 – 2025-12-31 (relationship from 1999-06-10) |
| RTX Corporation itself (Pratt & Whitney division, East Hartford) | — (registrant) | 2 | reviews/recipients/rtx-corporation.json | 2007-10-01 – 2026-10-15 |

Collins Aerospace and Pratt & Whitney are segment/brand names. Collins contracts are bound to its Exhibit 21 legal entities; ownership dates come from the 2018 (Rockwell Collins), 2012 (Goodrich) and 1999 (Hamilton Sundstrand) Form 10-K acquisition passages, continued by the 2025 Exhibit 21 listing. Pratt & Whitney's U.S. engine contracts are awarded to UEI QN1BCFY7JDJ5, legal name RTX CORPORATION (alternate names include "UNITED TECHNOLOGIES CORPORATION PRATT AND WHITNEY DIVISION"). Bindings to an entity with a CIK resolve to that registrant directly (`identifier_verified_public_registrant`) without a relationship, so they cover current dates. Former names (United Technologies Corp until 2020-04-06; Raytheon Technologies Corp until 2023-06-29, from SEC formerNames) were accepted on transactions via `--former`; resolutions report the current registrant name.

Excluded for lack of a parent link to RTX: four Rockwell Collins, Inc. UEIs (including J4Q3HP6NHK47, ~$433M) self-parented under QJ58YL55YKF3, one self-parented Goodrich UEI (JZNWHLVKADJ9) and one Hamilton Sundstrand UEI (NFZTKCLHXAB7). These may be the same legal entities; binding them needs state-of-incorporation evidence (e.g. the SAM entity API). Collins subsidiaries such as Rockwell Collins Simulation & Training Solutions LLC and Hamilton Sundstrand Space Systems International, Inc. are not yet reviewed.

The usable window is the intersection of the binding interval (earliest contract transaction under each UEI, search floor 2007-10-01, through the 2026-10-15 review) and the reviewed SEC relationship (2020-04-03 through the 2025-12-31 Exhibit 21). The 2026-06-30 10-Q mentions Raytheon Company but does not restate its subsidiary status, so 2026 events do not yet resolve; the FY2026 10-K Exhibit 21 should extend coverage. Five same-name records were excluded: they are self-parented legacy Raytheon parent records (including the pre-merger parent UEI KLW3ZYL15493) or have no contract transactions.

Evidence source: USAspending recipient profiles, which republish SAM.gov registration data; they are not SAM.gov itself. Each candidate required an exact legal-name match, a child-level record, a current reported parent of RTX CORP (UEI PPLZG8J3N9D4) and the same legal name on its earliest and latest contract transactions. USAspending's undated parent history is inconsistent (for example, it lists a Rockwell Collins Australia entry sharing RTX's DUNS number) and is not relied on. Review was automated-assisted by Claude on 2026-10-15; state of incorporation was not independently confirmed per UEI. CAGE codes are not bound.

## Adding bindings

1. `node tools/recipient-candidates.cjs "<legal name>" <parent UEI> <ledger entity id> reviews/recipients/<slug>.json` collects candidates and exclusions with response hashes.
2. Inspect every candidate (location, transaction span, reported parents).
3. `node tools/promote-recipient-review.cjs reviews/recipients/<slug>.json "<reviewer>" [--exclude UEI,...]` merges them into the ledger; conflicting existing bindings stop the promotion.
4. The legal entity must already have a reviewed, dated SEC relationship to its parent.

Synthetic tests remain isolated from the operational ledger.
