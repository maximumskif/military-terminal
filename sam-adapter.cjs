const {easternToday}=require('./funding-analysis.cjs');
const ENDPOINT='https://api.sam.gov/opportunities/v2/search';
function normalizeNotice(r){
 if(typeof r.noticeId!=='string'||! /^[a-zA-Z0-9-]{16,64}$/.test(r.noticeId)||typeof r.title!=='string')throw new Error('Invalid SAM notice');
 const award=r.award&&typeof r.award==='object'?r.award:null;
 return {title:r.title,url:`https://sam.gov/opp/${encodeURIComponent(r.noticeId)}/view`,publishedAt:r.postedDate||null,noticeId:r.noticeId,noticeType:r.type||null,solicitationNumber:r.solicitationNumber||null,agency:r.fullParentPathName||r.department||null,naics:r.naicsCode||null,responseDeadline:r.responseDeadLine||null,active:r.active||null,award:award?{number:award.number||null,date:award.date||null,amount:award.amount==null||award.amount===''?null:Number.isFinite(Number(award.amount))?Number(award.amount):null,recipientName:award.awardee?.name||null,recipientUei:award.awardee?.ueiSAM||null}:null};
}
function createSamAdapter(){let key=process.env.SAM_API_KEY||'',lastDay='',requests=0;
 function setKey(value){if(typeof value!=='string'||value.length>200||value&& !/^[A-Za-z0-9_.-]{20,200}$/.test(value))throw new Error('Invalid API key format');key=value;}
 function configured(){return Boolean(key)}
 async function collect(){if(!key)throw new Error('SAM key not configured');const today=easternToday();if(today!==lastDay){lastDay=today;requests=0;}const to=new Date(today+'T12:00:00Z'),from=new Date(to);from.setUTCDate(from.getUTCDate()-6);const date=d=>`${String(d.getUTCMonth()+1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}/${d.getUTCFullYear()}`;const rows=[],ids=new Set();let total=0,complete=false;const signal=AbortSignal.timeout(60000);
  for(let offset=0;offset<3;offset++){if(requests>=25)throw new Error('Local SAM daily request limit reached');const url=new URL(ENDPOINT);url.search=new URLSearchParams({api_key:key,postedFrom:date(from),postedTo:date(to),limit:'100',offset:String(offset)}).toString();requests++;let response;try{response=await fetch(url,{signal,redirect:'error',headers:{Accept:'application/json'}})}catch{throw new Error('SAM connection failed; credentials omitted from diagnostics');}if(!response.ok)throw new Error(`SAM HTTP ${response.status}`);
   const reader=response.body.getReader();let bytes=0,chunks=[];while(true){let result;try{result=await reader.read()}catch{throw new Error('SAM response interrupted')};if(result.done)break;bytes+=result.value.length;if(bytes>5000000){await reader.cancel();throw new Error('SAM response exceeds size limit')}chunks.push(Buffer.from(result.value));}
   let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new Error('Invalid SAM JSON response')};if(!Array.isArray(data.opportunitiesData)||!Number.isInteger(data.totalRecords)||data.totalRecords<0)throw new Error('Invalid SAM response shape');total=data.totalRecords;for(const raw of data.opportunitiesData){const row=normalizeNotice(raw);if(!ids.has(row.noticeId)){ids.add(row.noticeId);rows.push(row)}}if((offset+1)*100>=total){complete=true;break}if(!data.opportunitiesData.length)throw new Error('SAM pagination ended unexpectedly');
  }
  return {records:rows,coverage:{postedFrom:date(from),postedTo:date(to),complete,returned:rows.length,total,limit:300,requestsToday:requests,scope:'Latest notice versions posted within seven days; not a full backfill'}};
 }
 return {setKey,configured,collect};
}
module.exports={createSamAdapter,normalizeNotice};
