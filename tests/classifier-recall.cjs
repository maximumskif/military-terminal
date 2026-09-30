const assert=require('node:assert/strict');const {classify}=require('../event-classifier.cjs');
const row=title=>({title,sourceClass:'independent_reporting',publishedAt:'2026-09-29',firstSeen:'2026-09-30T12:00:00Z'});
for(const [title,expected] of [
 ['Company nabs $50 million contract for naval radar','DEFINITIVE_CONTRACT_AWARD'],
 ['Company nabbed a £20 million contract for support','DEFINITIVE_CONTRACT_AWARD'],
 ['Agency issued a request for proposals for radar','FINAL_SOLICITATION'],
 ['Agency issued a request for quotation for equipment','FINAL_SOLICITATION'],
 ['Appropriations enacted for radar programs','ENACTED_FUNDING'],
 ['Company might nab a contract for radar','OTHER_OR_UNCLEAR'],
 ['Company reportedly nabs $50 million contract','OTHER_OR_UNCLEAR'],
 ['Company has not nabbed a contract','OTHER_OR_UNCLEAR'],
 ['Agency could issue a request for proposals','OTHER_OR_UNCLEAR'],
 ['Agency did not issue a request for proposals','OTHER_OR_UNCLEAR'],
 ['Appropriations not enacted for radar','OTHER_OR_UNCLEAR'],
 ['Proposed funding includes appropriations for radar','PROPOSED_FUNDING'],
 ['Appropriations committee meets on Tuesday','OTHER_OR_UNCLEAR'],
 ['Company nabs an industry award for radar','OTHER_OR_UNCLEAR'],
 ['Draft request for proposals for radar','DRAFT_SOLICITATION']
]){const result=classify(row(title));assert.equal(result.eventType,expected,title);assert.equal(result.classificationStatus,'provisional_requires_review');assert.equal(result.financial.newlyObligatedAmount,null);assert.equal(result.identity.publicParent,null);}
assert.equal(classify(row('Company nabs $50 million contract for naval radar')).financial.headlineAmount.value,50000000);
assert.equal(classify(row('Company nabbed a £20 million contract for support')).financial.headlineAmount.currency,'GBP');
assert.equal(classify(row('Previously, Company nabbed a contract last year')).priority,'LOW');
console.log('PASS expanded award verbs and solicitation/appropriation relevance with uncertainty, negation, draft, non-procurement and financial guards');
