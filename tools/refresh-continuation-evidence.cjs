// Usage: node tools/refresh-continuation-evidence.cjs [--dry-run] [--only <entity id>]
// Re-reads, for every active UEI binding of a subsidiary with a reviewed parent relationship, the latest contract
// transaction under that UEI and the parent reported on that award record (USAspending, republishing SAM/FPDS data).
// Writes reviews/continuation/<UTC timestamp>.json with response hashes; tools/continue-relationships.cjs then uses the newest
// record per UEI. Records that name a parent outside the ledger group are reported as conflicts (possible divestiture
// or reorganization) and stop continuation before their date. This tool never edits entity-ledger.json.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const {atomicJson}=require('../storage.cjs');
const API='https://api.usaspending.gov/api/v2',UA={'Content-Type':'application/json','User-Agent':'ContractSentinel/0.18 continuation-refresh'};
const args=process.argv.slice(2),dry=args.includes('--dry-run'),oi=args.indexOf('--only'),only=oi>=0?args[oi+1]:null;
const root=path.join(__dirname,'..'),ledger=JSON.parse(fs.readFileSync(path.join(root,'entity-ledger.json'))),today=new Date().toISOString().slice(0,10);
const norm=v=>String(v||'').normalize('NFKC').toUpperCase().replace(/[.,]/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
const reviewed=r=>r.reviewStatus==='reviewed_primary_filing'&&['subsidiary','indirect_subsidiary'].includes(r.type)&&!r.effectiveUntil;
// Expected public-parent UEIs come from the recorded recipient reviews (query.parentUei), grouped by public parent.
const parentUeis=new Map();for(const f of fs.readdirSync(path.join(root,'reviews','recipients')).filter(f=>f.endsWith('.json'))){const q=JSON.parse(fs.readFileSync(path.join(root,'reviews','recipients',f))).query||{};const rel=ledger.relationships.find(r=>r.childId===q.entityId&&reviewed(r));if(!rel)continue;const set=parentUeis.get(rel.parentId)||new Set();for(const u of String(q.parentUei||'').split(',').map(s=>s.trim()).filter(Boolean))set.add(u);parentUeis.set(rel.parentId,set);}
const active=ledger.identifierBindings.filter(b=>b.kind==='uei'&&b.reviewStatus==='reviewed_official_record'),boundTo=new Map(active.map(b=>[b.value,b.entityId]));
// Intermittent connection failures were observed in bursts; back off 5/10/20/40 s.
const wait=ms=>new Promise(s=>setTimeout(s,ms));
async function call(p,body){for(let attempt=0;attempt<5;attempt++){let r;try{r=await fetch(API+p,{method:body?'POST':'GET',headers:UA,body:body&&JSON.stringify(body),signal:AbortSignal.timeout(90000)});}catch(e){if(attempt===4)throw new Error(p+' network error: '+e.message+(e.cause?.code?' ('+e.cause.code+')':''));await wait(5000*2**attempt);continue;}if(r.ok){const text=await r.text();return {json:JSON.parse(text),sha256:crypto.createHash('sha256').update(text).digest('hex')};}if(r.status<500&&r.status!==429)throw new Error(p+' HTTP '+r.status);await wait(5000*2**attempt);}throw new Error(p+' failed after retries');}
// Text search on a UEI also matches records whose parent is that UEI, so page until the exact recipient appears.
async function latest(uei){for(let page=1;page<=5;page++){const {json}=await call('/search/spending_by_transaction/',{filters:{award_type_codes:['A','B','C','D'],recipient_search_text:[uei],time_period:[{start_date:'2007-10-01',end_date:today}]},fields:['Action Date','Recipient Name','Recipient UEI','generated_internal_id'],sort:'Action Date',order:'desc',limit:100,page});const hit=json.results.find(r=>r['Recipient UEI']===uei);if(hit)return hit;if(!json.page_metadata?.hasNext)break;}return null;}
function classify(binding,rel,award){
 const expected=parentUeis.get(rel.parentId)||new Set(),group=new Set(ledger.relationships.filter(r=>r.parentId===rel.parentId&&reviewed(r)).map(r=>r.childId));
 if(award.recipientUei!==binding.value)return {status:'error',reason:'award recipient UEI differs from the binding'};
 if(expected.has(award.parentUei))return {status:'names_parent',reason:'award record names the public parent'};
 if(!award.parentUei||award.parentUei===binding.value)return {status:'self_parented',reason:'award record names no parent or the recipient itself; neither supports nor contradicts continuation'};
 const mid=group.has(boundTo.get(award.parentUei))?boundTo.get(award.parentUei):[...group].find(id=>norm(ledger.entities.find(e=>e.id===id)?.legalName)===norm(award.parentName));
 if(mid)return {status:'names_intermediate',reason:'award record names a reviewed subsidiary of the same public parent',intermediate:{uei:award.parentUei,name:award.parentName,entityId:mid}};
 return {status:'conflict',reason:`award record names parent ${award.parentName||'none'} (UEI ${award.parentUei}) outside the ${rel.parentId} group`};}
(async()=>{
 const work=[];for(const rel of ledger.relationships.filter(reviewed)){if(only&&rel.childId!==only)continue;for(const b of active.filter(b=>b.entityId===rel.childId))work.push({b,rel});}
 const entries=[];let next=0,queue=work;
 async function worker(){while(next<queue.length){const {b,rel}=queue[next++];const entry={entityId:rel.childId,publicParentId:rel.parentId,parents:[...(parentUeis.get(rel.parentId)||[])],uei:b.value};
  try{const t=await latest(b.value);if(!t){entries.push({...entry,status:'error',reason:'no contract transactions found under this UEI'});continue;}
   const {json:a,sha256}=await call('/awards/'+encodeURIComponent(t.generated_internal_id)+'/');
   const award={id:t.generated_internal_id,parentName:a.recipient?.parent_recipient_name||null,parentUei:a.recipient?.parent_recipient_uei||null,recipientUei:a.recipient?.recipient_uei||null,responseSha256:sha256};
   const c=classify(b,rel,award);if(c.intermediate)award.intermediate=c.intermediate;
   entries.push({...entry,status:c.status,reason:c.reason,evidence:{uei:b.value,name:t['Recipient Name'],latestTransaction:{date:t['Action Date'],award:t.generated_internal_id},latestAwardParent:award}});}
  catch(e){entries.push({...entry,status:'error',reason:String(e.message||e).slice(0,200)});}}}
 await Promise.all(Array.from({length:3},worker));
 // Second, sequential pass over lookups that failed in the concurrent pass.
 const failed=new Set(entries.filter(e=>e.status==='error'&&/network error|failed after retries/.test(e.reason)).map(e=>e.uei));
 if(failed.size){console.log(`retrying ${failed.size} failed lookups sequentially`);await wait(15000);for(let i=entries.length-1;i>=0;i--)if(failed.has(entries[i].uei))entries.splice(i,1);queue=work.filter(w=>failed.has(w.b.value));next=0;await worker();}
 entries.sort((x,y)=>x.entityId.localeCompare(y.entityId)||x.uei.localeCompare(y.uei));
 const counts={};for(const e of entries)counts[e.status]=(counts[e.status]||0)+1;
 for(const e of entries.filter(e=>e.status==='conflict'))console.log(`CONFLICT ${e.entityId} ${e.uei} ${e.evidence.latestTransaction.date}: ${e.reason}`);
 for(const e of entries.filter(e=>e.status==='error'))console.log(`error    ${e.entityId} ${e.uei}: ${e.reason}`);
 console.log(`${entries.length} UEIs checked:`,JSON.stringify(counts));
 if(counts.error&&counts.error>entries.length/10){console.error('More than 10% of lookups failed; nothing written. Re-run later.');process.exitCode=1;return;}
 if(dry)return;const dir=path.join(root,'reviews','continuation');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,new Date().toISOString().slice(0,16).replace(/:/g,'')+'Z.json');
 atomicJson(file,{generatedAt:new Date().toISOString(),source:API,rule:'government_record_continuation (RECIPIENT-BINDINGS.md)',only,counts,entries});console.log('wrote',path.relative(root,file));
})().catch(e=>{console.error(e);process.exit(1);});
