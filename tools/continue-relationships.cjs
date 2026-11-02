// Usage: node tools/continue-relationships.cjs "<reviewer>" [--dry-run]
// Government-record continuation (approved 2026-11-02): extends a reviewed subsidiary relationship past its last
// Exhibit 21 date to the latest contract action on which the child's own bound UEI award record still names the public
// parent (or a reviewed intermediate subsidiary of it), from the recorded recipient reviews in reviews/recipients/ and the
// refreshed award records in reviews/continuation/ (tools/refresh-continuation-evidence.cjs). A refreshed record naming a
// parent outside the group stops continuation before its date.
// Guards: the SEC evidence must be the parent's latest reviewed annual filing (equal to its latest reviewed revenue
// fiscal year end), the award date must be after that evidence, and the extension is capped at 456 days (15 months).
// The SEC evidenceAsOf is never changed; the extension is stored separately in relationship.continuation.
const fs=require('node:fs'),path=require('node:path');const {atomicJson}=require('../storage.cjs');
const {CONTINUATION_BASIS,CONTINUATION_MAX_DAYS,addDays}=require('../recipient-bindings.cjs');
const [reviewer,flag]=process.argv.slice(2);if(!reviewer||reviewer.startsWith('--')){console.error('Usage: continue-relationships.cjs "<reviewer>" [--dry-run]');process.exit(2);}
const dry=flag==='--dry-run',root=path.join(__dirname,'..'),ledgerFile=path.join(root,'entity-ledger.json'),reviewDir=path.join(root,'reviews','recipients');
const ledger=JSON.parse(fs.readFileSync(ledgerFile)),today=new Date().toISOString().slice(0,10);
const evidence=[];for(const f of fs.readdirSync(reviewDir).filter(f=>f.endsWith('.json')).sort()){const d=JSON.parse(fs.readFileSync(path.join(reviewDir,f)));const parents=String(d.query?.parentUei||'').split(',').map(s=>s.trim()).filter(Boolean);for(const c of d.candidates||[])evidence.push({file:'reviews/recipients/'+f,entityId:d.query?.entityId,parents,e:c.evidence});}
// Refreshed award records from tools/refresh-continuation-evidence.cjs. Conflicts name a parent outside the group.
const refreshDir=path.join(root,'reviews','continuation'),conflicts=[];
if(fs.existsSync(refreshDir))for(const f of fs.readdirSync(refreshDir).filter(f=>f.endsWith('.json')).sort()){const d=JSON.parse(fs.readFileSync(path.join(refreshDir,f)));for(const x of d.entries||[]){if(!x.evidence)continue;const item={file:'reviews/continuation/'+f,entityId:x.entityId,parents:x.parents||[],e:x.evidence};if(x.status==='conflict')conflicts.push(item);else if(['names_parent','names_intermediate'].includes(x.status))evidence.push(item);}}
const reviewed=r=>r.reviewStatus==='reviewed_primary_filing'&&['subsidiary','indirect_subsidiary'].includes(r.type);
const latestRevenue=id=>(ledger.entities.find(e=>e.id===id)?.revenueEvidence||[]).filter(r=>r.reviewStatus==='reviewed_primary_filing').map(r=>r.fiscalYearEnd).sort().at(-1)||null;
const report=[];
for(const rel of ledger.relationships){
 if(!reviewed(rel))continue;const skip=reason=>{if(rel.continuation)delete rel.continuation;report.push({id:rel.id,status:'not_continued',reason});};
 if(rel.effectiveUntil){skip('relationship has an end date');continue;}
 if(rel.evidenceAsOf!==latestRevenue(rel.parentId)){skip(`SEC evidence ${rel.evidenceAsOf} is not the parent's latest reviewed annual filing (${latestRevenue(rel.parentId)})`);continue;}
 const ueis=new Set(ledger.identifierBindings.filter(b=>b.entityId===rel.childId&&b.kind==='uei'&&b.reviewStatus==='reviewed_official_record').map(b=>b.value));
 const cap=addDays(rel.evidenceAsOf,CONTINUATION_MAX_DAYS);
 const qualifying=evidence.filter(x=>x.entityId===rel.childId&&ueis.has(x.e.uei)).map(x=>{const a=x.e.latestAwardParent,t=x.e.latestTransaction;if(!a||!t||a.id!==t.award||a.recipientUei!==x.e.uei||!/^\d{4}-\d{2}-\d{2}$/.test(t.date||''))return null;
  let basis=null;if(x.parents.includes(a.parentUei))basis='award record names the public parent';
  else if(a.intermediate?.entityId){const mid=ledger.relationships.find(r=>r.childId===a.intermediate.entityId&&r.parentId===rel.parentId&&reviewed(r)&&!r.effectiveUntil&&r.evidenceAsOf===rel.evidenceAsOf);if(mid)basis=`award record names reviewed intermediate ${a.intermediate.name} (${mid.id})`;}
  return basis&&t.date>rel.evidenceAsOf?{x,a,t,basis}:null;}).filter(Boolean).sort((p,q)=>q.t.date.localeCompare(p.t.date));
 // A later award record naming a parent outside the group may reflect a divestiture: continuation stops before it.
 const conflict=conflicts.filter(x=>x.entityId===rel.childId&&ueis.has(x.e.uei)&&x.e.latestTransaction?.date>rel.evidenceAsOf).sort((p,q)=>p.e.latestTransaction.date.localeCompare(q.e.latestTransaction.date))[0]||null;
 const usable=conflict?qualifying.filter(q=>q.t.date<conflict.e.latestTransaction.date):qualifying;
 if(conflict)console.log(`CONFLICT   ${rel.id}: ${conflict.e.uei} award ${conflict.e.latestAwardParent.id} (${conflict.e.latestTransaction.date}) names ${conflict.e.latestAwardParent.parentName} (UEI ${conflict.e.latestAwardParent.parentUei}); continuation stops before it — review for divestiture`);
 if(!usable.length){skip(conflict?'only award records after a conflicting parent record name the parent':'no bound-UEI award record after the SEC evidence names the parent');continue;}
 const best=usable[0],through=best.t.date<cap?best.t.date:cap;
 rel.continuation={basis:CONTINUATION_BASIS,through,secEvidenceAsOf:rel.evidenceAsOf,cappedAt:cap,capped:through!==best.t.date,reviewedAt:today,reviewer,...(conflict?{conflict:{uei:conflict.e.uei,date:conflict.e.latestTransaction.date,award:conflict.e.latestAwardParent.id,parentName:conflict.e.latestAwardParent.parentName,parentUei:conflict.e.latestAwardParent.parentUei,reviewFile:conflict.file}}:{}),
  sources:[{url:'https://www.usaspending.gov/award/'+encodeURIComponent(best.a.id),apiUrl:'https://api.usaspending.gov/api/v2/awards/'+encodeURIComponent(best.a.id)+'/',reviewFile:best.x.file,responseSha256:best.a.responseSha256||null,section:'USAspending award record, latest contract action',supportingPassage:`${best.x.e.name} | UEI ${best.a.recipientUei} | award ${best.a.id} latest action ${best.t.date} | reported parent ${best.a.parentName} (UEI ${best.a.parentUei}) | ${best.basis}`}],
  limitations:['Government award records report the SAM registration parent at the time of the action; they are not an SEC ownership disclosure','A divestiture or reorganization after the last Exhibit 21 that the award record does not yet reflect would not be detected',`Extension is capped at ${CONTINUATION_MAX_DAYS} days after the last Exhibit 21; a new annual filing is then required`]};
 report.push({id:rel.id,status:'continued',through,capped:rel.continuation.capped,basis:best.basis});
}
const continued=report.filter(r=>r.status==='continued');
for(const r of report)console.log(r.status==='continued'?`continued  ${r.id} → ${r.through}${r.capped?' (capped)':''}`:`skipped    ${r.id}: ${r.reason}`);
console.log(`${continued.length} continued, ${report.length-continued.length} not continued${dry?' (dry run; ledger unchanged)':''}`);
if(!dry){ledger.reviewedAt=today;atomicJson(ledgerFile,ledger);}
