const {createCheckpointCollector}=require('./sam-checkpoints.cjs');
const os=require('node:os'),path=require('node:path'),fs=require('node:fs');
function normalizeNotice(r){
 if(typeof r.noticeId!=='string'||! /^[a-zA-Z0-9-]{16,64}$/.test(r.noticeId)||typeof r.title!=='string')throw new Error('Invalid SAM notice');
 const award=r.award&&typeof r.award==='object'?r.award:null;
 return {title:r.title,url:`https://sam.gov/opp/${encodeURIComponent(r.noticeId)}/view`,publishedAt:r.postedDate||null,noticeId:r.noticeId,noticeType:r.type||null,solicitationNumber:r.solicitationNumber||null,agency:r.fullParentPathName||r.department||null,naics:r.naicsCode||null,responseDeadline:r.responseDeadLine||null,active:r.active||null,award:award?{number:award.number||null,date:award.date||null,amount:award.amount==null||award.amount===''?null:Number.isFinite(Number(award.amount))?Number(award.amount):null,recipientName:award.awardee?.name||null,recipientUei:award.awardee?.ueiSAM||null}:null};
}

function createSamAdapter(dataDir,options={}) {
 let key=process.env.SAM_API_KEY||'';
 const directory=dataDir||fs.mkdtempSync(path.join(os.tmpdir(),'sentinel-sam-test-'));
 const checkpoints=createCheckpointCollector(directory,normalizeNotice,options);
 function setKey(value){if(typeof value!=='string'||value.length>200||value&&!/^[A-Za-z0-9_.-]{20,200}$/.test(value))throw new Error('Invalid API key format');key=value;}
 function configured(){return Boolean(key)}
 async function collect(){if(!key)throw new Error('SAM key not configured');return checkpoints.collect(key);}
 return {setKey,configured,collect,status:checkpoints.status};
}
module.exports={createSamAdapter,normalizeNotice};
