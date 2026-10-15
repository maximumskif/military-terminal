const {day}=require('./funding-analysis.cjs');const {resolveWithLedger}=require('./recipient-bindings.cjs');
const VERSION=1,DAY=86400000;
// Reviewed annual revenue on the parent entity: revenueEvidence[{fiscalYearEnd,value,currency,reviewStatus,sourceUrl,sourceSection,supportingPassage}].
function revenue(entity,asOf){const t=day(asOf);return (entity?.revenueEvidence||[]).filter(r=>r.reviewStatus==='reviewed_primary_filing'&&/^https:\/\//.test(r.sourceUrl||'')&&r.supportingPassage&&typeof r.value==='number'&&r.value>0&&day(r.fiscalYearEnd)!==null&&day(r.fiscalYearEnd)<=t&&t-day(r.fiscalYearEnd)<=548*DAY).sort((a,b)=>b.fiscalYearEnd.localeCompare(a.fiscalYearEnd))[0]||null;}
function assessFinancialMateriality(event,ledger){
 const missing=[],amount=event?.financial?.headlineAmount,asOf=[event?.timestamps?.eventDate,event?.timestamps?.sourcePublication].map(t=>t?.value&&String(t.value).slice(0,10)).find(v=>day(v)!==null)||null;
 if(!amount||typeof amount.value!=='number')missing.push('No stated amount in the source');else if(amount.currency!=='USD')missing.push(amount.currency?'Amount is not in USD; no reviewed conversion':'Amount currency not established');
 if(!asOf)missing.push('No valid event or publication date for point-in-time resolution');
 const recipient={uei:event?.identity?.recipientUei||undefined,cage:event?.identity?.recipientCage||undefined};let resolution=null,parent=null,annual=null;
 if(!recipient.uei&&!recipient.cage)missing.push('No government recipient identifier (UEI/CAGE); company-name mentions are research cues only');
 else if(asOf){resolution=resolveWithLedger(recipient,asOf,ledger);if(resolution.status!=='identifier_and_relationship_verified')missing.push('Recipient not resolved to a reviewed public parent: '+resolution.reason);else{const parentId=ledger.relationships.find(r=>r.id===resolution.relationshipId)?.parentId;parent=ledger.entities.find(e=>e.id===parentId);annual=revenue(parent,asOf);if(!annual)missing.push('No reviewed parent annual revenue within 18 months before the event date');else if(annual.currency!=='USD')missing.push('Parent revenue evidence is not in USD');}}
 const caveats=['Headline amount type (ceiling, base, obligation, allocation) is unverified; ratio is an upper bound','Multi-year contract value is not annualized','Shared multiple-award ceilings are not allocated to one recipient'];
 if(event?.eventType==='CONTRACT_VEHICLE_AWARD')caveats.push('Contract vehicle award: recipient allocation is unknown and may be a small fraction of the ceiling');
 if(missing.length)return {version:VERSION,status:'not_assessable',band:null,ratio:null,missing,caveats,parent:resolution?.publicParent||null};
 const ratio=amount.value/annual.value,band=ratio>=0.05?'large':ratio>=0.01?'notable':'small';
 return {version:VERSION,status:'upper_bound_estimate',band,ratio:Math.round(ratio*1e6)/1e6,amount:{value:amount.value,currency:'USD'},revenue:{value:annual.value,fiscalYearEnd:annual.fiscalYearEnd,sourceUrl:annual.sourceUrl,sourceSection:annual.sourceSection||null,supportingPassage:annual.supportingPassage},parent:resolution.publicParent,relationshipId:resolution.relationshipId,asOf,missing:[],caveats,explanation:`Stated amount equals ${(ratio*100).toFixed(2)}% of ${resolution.publicParent} annual revenue for fiscal year ended ${annual.fiscalYearEnd} (bands: <1% small, 1–5% notable, ≥5% large). Upper bound only; not a revenue forecast.`};
}
const materialityLabel=a=>a.status==='upper_bound_estimate'?'upper_bound_'+a.band:'not_assessable';
module.exports={VERSION,assessFinancialMateriality,materialityLabel};
