const assert=require('node:assert/strict');const {buildPulse,monthRange,monthEnd,pulseUeis}=require('../revenue-pulse.cjs');
// Synthetic entities and evidence only; never added to the operational ledger.
const rev=(fiscalYearEnd,value)=>({fiscalYearEnd,value,currency:'USD',reviewStatus:'reviewed_primary_filing',sourceUrl:'https://filing.example/10k',supportingPassage:'Total revenue'});
const ledger={entities:[{id:'parent',legalName:'Synthetic Parent',cik:'0000000001',revenueEvidence:[rev('2025-12-31',12000)]},{id:'child',legalName:'Synthetic Child'},{id:'late',legalName:'Late Child'}],
 identifierBindings:[{id:'b1',kind:'uei',value:'CHILDUEI0001',entityId:'child',reviewStatus:'reviewed_official_record',effectiveFrom:'2020-01-01',evidenceAsOf:'2026-10-30',sourceUrl:'https://record.example/1',supportingPassage:'x'},
  {id:'b2',kind:'uei',value:'PARENTUEI001',entityId:'parent',reviewStatus:'reviewed_official_record',effectiveFrom:'2020-01-01',evidenceAsOf:'2026-10-30',sourceUrl:'https://record.example/2',supportingPassage:'x'},
  {id:'b3',kind:'uei',value:'LATEUEI00001',entityId:'late',reviewStatus:'reviewed_official_record',effectiveFrom:'2020-01-01',evidenceAsOf:'2026-10-30',sourceUrl:'https://record.example/3',supportingPassage:'x'}],
 relationships:[{id:'r1',childId:'child',parentId:'parent',type:'subsidiary',reviewStatus:'reviewed_primary_filing',effectiveFrom:'2024-01-01',evidenceAsOf:'2025-12-31',sources:[{url:'https://filing.example/ex21',supportingPassage:'Synthetic Child'}],continuation:{basis:'government_record_continuation',through:'2026-10-14',secEvidenceAsOf:'2025-12-31',sources:[{url:'https://record.example/award',supportingPassage:'award names parent'}]}},
  {id:'r2',childId:'late',parentId:'parent',type:'subsidiary',reviewStatus:'reviewed_primary_filing',effectiveFrom:'2025-06-01',evidenceAsOf:'2025-12-31',sources:[{url:'https://filing.example/ex21',supportingPassage:'Late Child'}]}]};
assert.deepEqual(monthRange('2026-02',3),['2025-12','2026-01','2026-02']);assert.equal(monthEnd('2024-02'),'2024-02-29');assert.deepEqual(pulseUeis(ledger),['CHILDUEI0001','LATEUEI00001','PARENTUEI001']);
const months=monthRange('2026-10',27),obs=[];
for(const m of months){obs.push({month:m,uei:'CHILDUEI0001',amount:m<'2025-08'?50:100});obs.push({month:m,uei:'PARENTUEI001',amount:-10});obs.push({month:m,uei:'LATEUEI00001',amount:7});}
obs.push({month:'2025-01',uei:'NOTBOUND0001',amount:1e9});
let p=buildPulse({months,observations:obs,retrievedAt:'2026-11-02T20:00:00Z'},ledger),x=p.parents[0];
assert.equal(p.parents.length,1);assert.equal(x.parent,'Synthetic Parent');
// Settled through 2026-07 (July 31 + 90 days <= Nov 2); trailing 2025-08..2026-07, prior 2024-08..2025-07.
assert.deepEqual(x.trailing12.window,['2025-08','2026-07']);assert.deepEqual(x.prior12.window,['2024-08','2025-07']);
assert.equal(x.series.find(s=>s.month==='2026-08').settled,false);
// Child counts only from its 2024-01-01 relationship and through its continuation; late child 2025-06..2025-12 (no continuation); registrant always.
const t12=12*(100-10)+5*7;assert.equal(x.trailing12.obligations,t12);
const priorExpected=['2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07'].reduce((t,m)=>t+50-10+(m>='2025-06'?7:0),0);
assert.equal(x.prior12.obligations,priorExpected);assert.equal(x.changePercent,Math.round((t12/priorExpected-1)*10000)/100);
assert.equal(x.revenueSharePercent,Math.round(t12/12000*10000)/100);assert.equal(x.revenue.fiscalYearEnd,'2025-12-31');assert.equal(x.usesContinuation,true);
assert.equal(x.series.find(s=>s.month==='2024-08').boundUeis,2);assert.equal(x.series.find(s=>s.month==='2025-08').boundUeis,3);assert.equal(x.series.find(s=>s.month==='2026-02').boundUeis,2);
// Unbound rows never count; out-of-window bound rows are reported as excluded, not attributed.
assert.ok(!p.excluded.some(e=>e.uei==='NOTBOUND0001'));const late=p.excluded.find(e=>e.uei==='LATEUEI00001');assert.equal(late.months[0],'2024-08');assert.equal(late.months.length,20);assert.equal(late.amount,7*20);
const childAfter=p.excluded.find(e=>e.uei==='CHILDUEI0001');assert.deepEqual(childAfter.months,['2026-10']);
// An incomplete month suppresses its value and the trailing total that includes it.
p=buildPulse({months,observations:obs,retrievedAt:'2026-11-02T20:00:00Z',incompleteMonths:['2026-01']},ledger);x=p.parents[0];
assert.equal(x.series.find(s=>s.month==='2026-01').obligations,null);assert.equal(x.trailing12.obligations,null);assert.equal(x.changePercent,null);assert.ok(x.missing.some(m=>/not fully retrieved/.test(m)));assert.notEqual(x.prior12.obligations,null);
// Too few months: no trailing totals.
p=buildPulse({months:months.slice(-6),observations:obs,retrievedAt:'2026-11-02T20:00:00Z'},ledger);assert.equal(p.parents[0].trailing12.obligations,null);assert.ok(p.parents[0].missing.some(m=>/Fewer than 12/.test(m)));
console.log('PASS revenue pulse: point-in-time UEI attribution, ownership/continuation windows, 90-day settlement, trailing/prior totals, revenue share, unbound and out-of-window exclusion, incomplete-month suppression');
