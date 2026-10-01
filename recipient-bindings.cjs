const {day}=require('./funding-analysis.cjs');
function covered(record,asOf){return day(asOf)!==null&&day(record.effectiveFrom)!==null&&day(record.evidenceAsOf)!==null&&asOf>=record.effectiveFrom&&asOf<=record.evidenceAsOf&&(!record.effectiveUntil||day(record.effectiveUntil)!==null&&asOf<record.effectiveUntil);}
function resolveWithLedger(recipient,asOf,ledger){
 const unknown=reason=>({status:'unresolved',publicParent:null,ticker:null,reason});
 if(day(asOf)===null)return unknown('A valid YYYY-MM-DD evidence date is required.');
 const identifiers=['uei','cage'].filter(k=>typeof recipient?.[k]==='string'&&recipient[k].trim());
 if(!identifiers.length)return unknown('No verified recipient identifier supplied. Name or brand similarity does not assign a ticker.');
 const valid=(ledger.identifierBindings||[]).filter(b=>b.reviewStatus==='reviewed_official_record'&&b.sourceUrl&&/^https:\/\//.test(b.sourceUrl)&&b.supportingPassage&&covered(b,asOf));
 const sets=identifiers.map(k=>new Set(valid.filter(b=>b.kind===k&&b.value===recipient[k].trim()).map(b=>b.entityId)));
 if(sets.some(s=>!s.size))return unknown('A supplied identifier has no reviewed binding covering this date.');
 const ids=[...sets[0]].filter(id=>sets.every(s=>s.has(id)));
 if(ids.length!==1)return {status:'ambiguous',publicParent:null,ticker:null,reason:'Supplied identifiers do not establish one consistent entity.'};
 const entity=ledger.entities.filter(e=>e.id===ids[0]);if(entity.length!==1)return unknown('Binding points to a missing or ambiguous legal entity.');
 const relationships=ledger.relationships.filter(r=>r.childId===ids[0]&&r.reviewStatus==='reviewed_primary_filing'&&r.sources?.some(s=>s.url&&s.supportingPassage)&&covered(r,asOf));
 if(relationships.length!==1)return unknown('No unique reviewed parent relationship covers this date.');
 const relationship=relationships[0],parents=ledger.entities.filter(e=>e.id===relationship.parentId);
 if(parents.length!==1)return unknown('Reviewed relationship has no unique parent entity.');
 const parent=parents[0],listing=parent.publicListing;
 return {status:'identifier_and_relationship_verified',legalRecipient:entity[0].legalName,publicParent:parent.legalName,ticker:listing?.evidenceAsOf===asOf&&listing.sourceUrl&&listing.supportingPassage?listing.ticker:null,relationshipId:relationship.id,bindingIds:valid.filter(b=>b.entityId===ids[0]&&identifiers.some(k=>b.kind===k&&b.value===recipient[k].trim())).map(b=>b.id),reason:'Reviewed recipient bindings and dated parent evidence agree; ticker requires listing evidence for the requested date.'};
}
module.exports={resolveWithLedger};
