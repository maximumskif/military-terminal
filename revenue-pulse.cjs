// Contractor revenue pulse: monthly federal contract obligations per public parent, summed over reviewed UEI bindings.
// Each (UEI, month) observation is attributed with point-in-time resolution on the 15th of that month, so a UEI counts
// for a parent only inside its reviewed binding and ownership window. Obligations are not revenue: they fund work over
// time, include deobligations (negative) and exclude classified and unbound activity.
const {resolveWithLedger}=require('./recipient-bindings.cjs');const {revenue}=require('./financial-materiality.cjs');
const VERSION=1,SETTLE_DAYS=90,DAY=86400000;
const RESOLVED=['identifier_and_relationship_verified','identifier_verified_public_registrant'];
const monthEnd=m=>{const [y,mo]=m.split('-').map(Number);return new Date(Date.UTC(y,mo,0)).toISOString().slice(0,10);};
const midMonth=m=>m+'-15';
function monthRange(lastMonth,count){const [y,m]=lastMonth.split('-').map(Number);return Array.from({length:count},(_,i)=>{const d=new Date(Date.UTC(y,m-1-(count-1-i),1));return d.toISOString().slice(0,7);});}
// Every active UEI binding grouped by the public parent it resolves to on any date (used to choose what to fetch).
function pulseUeis(ledger){const ueis=new Set();for(const b of ledger.identifierBindings||[])if(b.kind==='uei'&&b.reviewStatus==='reviewed_official_record')ueis.add(b.value);return [...ueis].sort();}
// DoD contract actions reach FPDS/USAspending with a 90-day delay; months ending inside that window are provisional.
const settled=(month,retrievedAt)=>Date.parse(monthEnd(month))+SETTLE_DAYS*DAY<=Date.parse(retrievedAt);
function buildPulse(snapshot,ledger){
 const {months,observations,retrievedAt,incompleteMonths=[]}=snapshot,incomplete=new Set(incompleteMonths),parents=new Map(),excluded=new Map();
 const cache=new Map(),resolve=(uei,month)=>{const k=uei+'|'+month;if(!cache.has(k))cache.set(k,resolveWithLedger({uei},midMonth(month),ledger));return cache.get(k);};
 const parentOf=id=>{let p=parents.get(id);if(!p){const e=ledger.entities.find(x=>x.id===id);p={parentEntityId:id,parent:e?.legalName||id,cik:e?.cik||null,ueis:new Set(),byMonth:new Map(months.map(m=>[m,{obligations:0,contributors:new Set(),continuation:false}]))};parents.set(id,p);}return p;};
 const bound=new Set(pulseUeis(ledger));
 for(const o of observations){if(!bound.has(o.uei)||!months.includes(o.month)||typeof o.amount!=='number'||!Number.isFinite(o.amount))continue;const r=resolve(o.uei,o.month);
  if(!RESOLVED.includes(r.status)){const x=excluded.get(o.uei)||{uei:o.uei,name:o.name||null,amount:0,months:new Set(),reason:r.reason};x.amount+=o.amount;x.months.add(o.month);excluded.set(o.uei,x);continue;}
  const p=parentOf(r.parentEntityId),slot=p.byMonth.get(o.month);slot.obligations+=o.amount;slot.contributors.add(o.uei);p.ueis.add(o.uei);if(r.relationshipBasis==='government_record_continuation')slot.continuation=true;}
 // Bound UEIs per parent per month (coverage denominator), independent of whether they had activity.
 for(const uei of pulseUeis(ledger))for(const m of months){const r=resolve(uei,m);if(RESOLVED.includes(r.status)){const p=parentOf(r.parentEntityId);p.byMonth.get(m).bound=(p.byMonth.get(m).bound||0)+1;}}
 const round=v=>v==null?null:Math.round(v*100)/100;
 const result=[...parents.values()].map(p=>{
  const series=months.map(m=>{const s=p.byMonth.get(m);return {month:m,obligations:incomplete.has(m)?null:round(s.obligations),boundUeis:s.bound||0,activeUeis:s.contributors.size,settled:settled(m,retrievedAt),continuation:s.continuation,complete:!incomplete.has(m)};});
  const done=series.filter(s=>s.settled),last=done.slice(-12),prior=done.slice(-24,-12),sum=a=>a.length===12&&a.every(s=>s.obligations!==null&&s.boundUeis>0)?round(a.reduce((t,s)=>t+s.obligations,0)):null;
  const trailing12=sum(last),prior12=sum(prior),change=trailing12!=null&&prior12!=null&&prior12>0?Math.round((trailing12/prior12-1)*10000)/100:null;
  const windowEnd=last.length?monthEnd(last.at(-1).month):null,annual=windowEnd?revenue(ledger.entities.find(e=>e.id===p.parentEntityId),windowEnd):null;
  const share=trailing12!=null&&annual&&annual.currency==='USD'?Math.round(trailing12/annual.value*10000)/100:null;
  const missing=[];if(last.length<12)missing.push('Fewer than 12 settled months retrieved');if(prior.length<12)missing.push('Fewer than 24 settled months retrieved for the prior-year comparison');if(done.some(s=>!s.complete))missing.push('Some months were not fully retrieved');if(done.some(s=>!s.boundUeis))missing.push('Some months precede every reviewed binding/ownership window for this parent');if(!annual)missing.push('No reviewed annual revenue within 18 months of the window end');
  return {parentEntityId:p.parentEntityId,parent:p.parent,cik:p.cik,boundUeis:Math.max(...series.map(s=>s.boundUeis)),activeUeis:p.ueis.size,series,
   trailing12:{window:last.length?[last[0].month,last.at(-1).month]:null,obligations:trailing12},prior12:{window:prior.length?[prior[0].month,prior.at(-1).month]:null,obligations:prior12},changePercent:change,
   revenue:annual?{value:annual.value,fiscalYearEnd:annual.fiscalYearEnd,sourceUrl:annual.sourceUrl}:null,revenueSharePercent:share,usesContinuation:last.some(s=>s.continuation),missing};}).sort((a,b)=>(b.trailing12.obligations??-Infinity)-(a.trailing12.obligations??-Infinity));
 return {version:VERSION,retrievedAt,months,settleDays:SETTLE_DAYS,parents:result,excluded:[...excluded.values()].map(x=>({...x,amount:round(x.amount),months:[...x.months].sort()})).sort((a,b)=>Math.abs(b.amount)-Math.abs(a.amount)),
  caveats:['Federal contract obligations by action date (USAspending, award types A–D); obligations fund work over time and are not recognized revenue','Only reviewed UEI bindings are counted; unbound subsidiaries, subawards and classified work are excluded, so totals are a lower bound',`DoD reports contract actions with a ${SETTLE_DAYS}-day delay; months ending within ${SETTLE_DAYS} days of retrieval are provisional and excluded from trailing totals`,'Each UEI-month is attributed by resolving ownership on the 15th of the month']};
}
module.exports={VERSION,SETTLE_DAYS,monthRange,monthEnd,pulseUeis,buildPulse};
