const fs=require('node:fs'),path=require('node:path');
const {atomicJson,fileLock}=require('./storage.cjs');
const {summarize,easternToday}=require('./funding-analysis.cjs');
const ENDPOINT='https://api.usaspending.gov/api/v2/transactions/',AWARD_ENDPOINT='https://api.usaspending.gov/api/v2/awards/';
const HEADERS={'User-Agent':'ContractSentinel/0.18 public-contract-research'};
async function readJson(response,limit,label){const reader=response.body.getReader();let bytes=0,chunks=[];while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>limit){await reader.cancel();throw new Error(label+' response exceeds size limit');}chunks.push(Buffer.from(value));}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
const uei=v=>typeof v==='string'&&/^[A-Z0-9]{12}$/.test(v.trim())?v.trim():null,text=v=>typeof v==='string'&&v.trim()?v.trim().slice(0,300):null;
// Award-level recipient as reported by USAspending. A failure here never discards the transaction history.
async function fetchRecipient(id,signal){const response=await fetch(AWARD_ENDPOINT+encodeURIComponent(id)+'/',{headers:HEADERS,signal});if(!response.ok)throw new Error(`USAspending award HTTP ${response.status}`);const data=await readJson(response,2000000,'Award');const r=data?.recipient;if(!r||typeof r!=='object')throw new Error('Award response has no recipient');return {name:text(r.recipient_name),uei:uei(r.recipient_uei),parentName:text(r.parent_recipient_name),parentUei:uei(r.parent_recipient_uei),sourceEndpoint:AWARD_ENDPOINT,retrievedAt:new Date().toISOString()};}
function validId(id){return typeof id==='string'&&id.length<=250&&/^CONT_AWD_[A-Za-z0-9_.-]+$/.test(id);}
function createFundingStore(dataDir){
 const file=path.join(dataDir,'funding.json');fs.mkdirSync(dataDir,{recursive:true});let store={version:1,awards:{}};const pending=new Set();
 if(fs.existsSync(file)){store=JSON.parse(fs.readFileSync(file));if(!store.awards||typeof store.awards!=='object'||Array.isArray(store.awards))throw new Error('Invalid funding store; preserved for recovery');}
 function reload(){if(fs.existsSync(file)){const next=JSON.parse(fs.readFileSync(file));if(!next.awards||typeof next.awards!=='object'||Array.isArray(next.awards))throw new Error('Invalid funding store');store=next;}}
 function view(award){return {...award,summary:summarize(award.transactions,easternToday(),award.complete)};}
 function get(id){reload();if(!validId(id))throw new Error('Invalid prime award identifier');return store.awards[id]?view(store.awards[id]):null;}
 function list(){reload();return Object.values(store.awards).map(a=>({awardId:a.awardId,fetchedAt:a.fetchedAt,complete:a.complete,rows:a.transactions.length})).sort((a,b)=>b.fetchedAt.localeCompare(a.fetchedAt));}
 async function refresh(id){
  if(!validId(id))throw new Error('Invalid prime award identifier');if(pending.has(id)||pending.size>=2)throw new Error('Funding collection busy; retry shortly');pending.add(id);
  try{const transactions=[],seen=new Map(),signal=AbortSignal.timeout(60000);let complete=false,pages=0;
   for(let page=1;page<=4;page++){const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',...HEADERS},body:JSON.stringify({award_id:id,page,limit:500,sort:'action_date',order:'desc'}),signal});if(!response.ok)throw new Error(`USAspending HTTP ${response.status}`);
    const data=await readJson(response,5000000,'Transaction');if(!Array.isArray(data.results)||typeof data.page_metadata?.hasNext!=='boolean')throw new Error('Invalid transaction response');if(data.results.length>500||(!data.results.length&&data.page_metadata.hasNext))throw new Error('Invalid transaction pagination');
    for(const r of data.results){if(typeof r.id!=='string'||!r.id)throw new Error('Transaction identifier missing');const fingerprint=JSON.stringify(r);if(seen.has(r.id)){if(seen.get(r.id)!==fingerprint)throw new Error('Transactions changed during pagination; retry collection');continue;}seen.set(r.id,fingerprint);transactions.push(r);}
    pages=page;if(!data.page_metadata.hasNext){complete=true;break;}
   }
   let recipient=null,recipientError=null;try{recipient=await fetchRecipient(id,signal);}catch(error){recipientError=String(error.message||error).slice(0,200);}
   const award={awardId:id,sourceEndpoint:ENDPOINT,sourceUrl:'https://www.usaspending.gov/award/'+encodeURIComponent(id),fetchedAt:new Date().toISOString(),complete,pages,limit:2000,transactions,recipient,recipientError};summarize(transactions,easternToday(),complete);
   const release=fileLock(file);try{reload();if(!recipient&&store.awards[id]?.recipient)award.recipient=store.awards[id].recipient;const next={...store,awards:{...store.awards,[id]:award}};atomicJson(file,next);store=next;}finally{release();}return view(award);
  }finally{pending.delete(id);}
 }
 return {get,list,refresh};
}
module.exports={createFundingStore,validId};

