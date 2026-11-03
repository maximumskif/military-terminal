// Usage: npm run refresh:pulse [-- --months 27]   |   npm run refresh:pulse -- --repair (re-fetch only incomplete months)
// Retrieves monthly federal contract obligations (USAspending spending_by_category/recipient, award types A–D, by action
// date) for every reviewed UEI binding and writes <data dir>/pulse-observations.json. The server attributes these to
// public parents at request time with the current ledger (revenue-pulse.cjs). Text search on a UEI also returns records
// whose parent is that UEI, so only rows whose own UEI is bound are kept. Batches over ~20 UEIs return HTTP 503, so
// batches of 15 are used and split on 503. A month with any failed batch is recorded as incomplete (totals suppressed).
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const {atomicJson}=require('../storage.cjs');const {monthRange,monthEnd,pulseUeis}=require('../revenue-pulse.cjs');
const root=path.join(__dirname,'..'),dataDir=path.resolve(process.env.SENTINEL_DATA_DIR||path.join(root,'../../work/sentinel-data'));
const args=process.argv.slice(2),repair=args.includes('--repair'),mi=args.indexOf('--months'),count=mi>=0?Number(args[mi+1]):27;if(!Number.isInteger(count)||count<1||count>60){console.error('--months must be 1–60');process.exit(2);}
const API='https://api.usaspending.gov/api/v2/search/spending_by_category/recipient/',UA={'Content-Type':'application/json','User-Agent':'ContractSentinel/0.18 revenue-pulse'};
const ledger=JSON.parse(fs.readFileSync(path.join(root,'entity-ledger.json'))),ueis=pulseUeis(ledger),bound=new Set(ueis);
const now=new Date(),lastMonth=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1)).toISOString().slice(0,7),months=monthRange(lastMonth,count);
const wait=ms=>new Promise(s=>setTimeout(s,ms));
async function post(body){for(let attempt=0;attempt<5;attempt++){let r;try{r=await fetch(API,{method:'POST',headers:UA,body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});}catch(e){if(attempt===4)throw new Error('network error: '+e.message);await wait(4000*2**attempt);continue;}
 if(r.ok){const text=await r.text();return {json:JSON.parse(text),sha256:crypto.createHash('sha256').update(text).digest('hex')};}
 if(r.status===503&&body.filters.recipient_search_text.length>5){const e=new Error('HTTP 503');e.split=true;throw e;}
 if(r.status<500&&r.status!==429)throw new Error('HTTP '+r.status);await wait(4000*2**attempt);}throw new Error('failed after retries');}
async function batch(month,list,out){const start=month+'-01',end=monthEnd(month);
 try{for(let page=1;page<=20;page++){const {json,sha256}=await post({filters:{award_type_codes:['A','B','C','D'],recipient_search_text:list,time_period:[{start_date:start,end_date:end,date_type:'action_date'}]},limit:100,page});
   out.hashes.push(sha256);for(const r of json.results||[])if(bound.has(r.uei)&&typeof r.amount==='number')out.rows.push({month,uei:r.uei,name:r.name||null,amount:r.amount});if(!json.page_metadata?.hasNext)return true;}
  throw new Error('more than 20 result pages');}
 catch(e){if(e.split){const h=Math.ceil(list.length/2);const a=await batch(month,list.slice(0,h),out),b=await batch(month,list.slice(h),out);return a&&b;}out.errors.push(`${month} [${list.length} UEIs]: ${e.message}`);return false;}}
(async()=>{
 try{fs.mkdirSync(dataDir,{recursive:true});fs.accessSync(dataDir,fs.constants.W_OK);}catch(e){console.error(`Data directory ${dataDir} is not writable (${e.code}); set SENTINEL_DATA_DIR.`);process.exit(2);}
 const chunks=[];for(let i=0;i<ueis.length;i+=15)chunks.push(ueis.slice(i,i+15));
 const prior=repair?JSON.parse(fs.readFileSync(path.join(dataDir,'pulse-observations.json'))):null,useMonths=prior?prior.months:months,target=prior?prior.incompleteMonths:months;
 if(prior&&!target.length){console.log('No incomplete months to repair.');return;}
 const jobs=target.flatMap(m=>chunks.map(c=>({m,c}))),state=new Map(target.map(m=>[m,{rows:[],hashes:[],errors:[],failed:[]}]));let next=0,done=0,queue=jobs;
 async function worker(){while(next<queue.length){const {m,c}=queue[next++];const s=state.get(m);if(!await batch(m,c,s))s.failed.push(c);if(++done%50===0)console.log(`${done}/${jobs.length} batches`);}}
 await Promise.all(Array.from({length:3},worker));
 // Sequential second pass over failed batches (connection failures arrive in bursts).
 const retry=[...state].flatMap(([m,s])=>s.failed.map(c=>({m,c})));
 if(retry.length){console.log(`retrying ${retry.length} failed batches sequentially`);await wait(20000);for(const s of state.values()){s.failed=[];s.errors=[];}queue=retry;next=0;await worker();}
 const observations=prior?prior.observations.filter(o=>!target.includes(o.month)):[],incompleteMonths=[],errors=[];const seen=new Set(observations.map(o=>o.month+'|'+o.uei));
 for(const m of target){const s=state.get(m);if(s.failed.length)incompleteMonths.push(m);errors.push(...s.errors);for(const r of s.rows){const k=r.month+'|'+r.uei;if(seen.has(k))continue;seen.add(k);observations.push(r);}}
 observations.sort((a,b)=>a.month.localeCompare(b.month)||a.uei.localeCompare(b.uei));
 const hashes=[...state.values()].flatMap(s=>s.hashes).join('|');
 // A repair keeps the original retrievedAt so provisional/settled boundaries do not shift.
 const snapshot={version:1,retrievedAt:prior?prior.retrievedAt:new Date().toISOString(),...(prior?{repairedAt:new Date().toISOString(),repairedMonths:target}:{}),source:API,awardTypes:['A','B','C','D'],dateType:'action_date',months:useMonths,ueiCount:ueis.length,observations,incompleteMonths,errors:errors.slice(0,50),responseSha256:crypto.createHash('sha256').update((prior?prior.responseSha256+'|':'')+hashes).digest('hex')};
 atomicJson(path.join(dataDir,'pulse-observations.json'),snapshot);
 console.log(`${ueis.length} UEIs × ${useMonths.length} months (${useMonths[0]}–${useMonths.at(-1)})${prior?`, repaired ${target.join(', ')}`:''}: ${observations.length} UEI-month observations; incomplete months: ${incompleteMonths.join(', ')||'none'}`);
 for(const e of errors.slice(0,10))console.log('error',e);console.log('wrote',path.join(dataDir,'pulse-observations.json'));
})().catch(e=>{console.error(e);process.exit(1);});
