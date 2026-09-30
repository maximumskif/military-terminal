const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {atomicJson,fileLock}=require('./storage.cjs');
const {classify}=require('./event-classifier.cjs');
const {observation,changes}=require('./alert-changes.cjs');
const CUES=['contract','supplier','growth','ipo','negative'];
function createAlerts(dataDir,watchlist,options={}){
 const file=path.join(dataDir,'alerts.json');let store={version:1,rules:[],events:[]};
 if(fs.existsSync(file)){store=JSON.parse(fs.readFileSync(file));if(!Array.isArray(store.rules)||!Array.isArray(store.events))throw new Error('Invalid alert store; preserved for recovery');}
 function save(){atomicJson(file,store);}
 function reload(){if(fs.existsSync(file)){const value=JSON.parse(fs.readFileSync(file));if(!Array.isArray(value.rules)||!Array.isArray(value.events))throw new Error('Invalid alert store; preserved for recovery');store=value;}}
 function transaction(action){const release=fileLock(file);try{reload();return action();}finally{release();}}
 function addRule(input){if(!input||typeof input!=='object'||!CUES.includes(input.cue)||!(input.company===''||watchlist.some(c=>c.name===input.company)))throw new Error('Choose a valid company and cue');if(store.rules.some(r=>r.company===input.company&&r.cue===input.cue))throw new Error('That rule already exists');if(store.rules.length>=100)throw new Error('Maximum 100 rules');const rule={id:crypto.randomUUID(),company:input.company,cue:input.cue,createdAt:new Date().toISOString()};store.rules.push(rule);save();return rule;}
 function evaluate(evidence){
 store.observations ||= {};
 const seen=new Set(store.events.map(e=>e.id));
 for(const rule of store.rules)for(const row of evidence){
  const key=rule.id+'|'+row.id,current=observation(row),matched=row.cues.includes(rule.cue)&&(!rule.company||row.companyMentions.includes(rule.company));
  let prior=store.observations[key];
  if(!prior){const legacy=store.events.filter(e=>e.ruleId===rule.id&&e.evidenceId===row.id).at(-1);if(legacy){if(legacy.contentHash===row.titleHash||legacy.id===crypto.createHash('sha256').update(rule.id+'|'+row.id+'|'+row.titleHash).digest('hex')||!legacy.contentHash){store.observations[key]=current;continue;}}}
  if(!matched&&!prior)continue;
  const delta=prior&&prior.titleHash!==row.titleHash?changes(prior,current):[];
  store.observations[key]=current;
  if(prior&&!delta.length)continue;
  const id=crypto.createHash('sha256').update(rule.id+'|'+row.id+'|'+row.titleHash).digest('hex');if(seen.has(id))continue;
  const kind=prior?'evidence_update':Date.parse(row.firstSeen)>=Date.parse(rule.createdAt)?'new_source_evidence':'existing_evidence_match';
  store.events.push({id,ruleId:rule.id,evidenceId:row.id,title:row.title,url:row.url,sourceName:row.sourceName,sourceClass:row.sourceClass,cue:rule.cue,company:rule.company,createdAt:new Date().toISOString(),firstSeen:row.firstSeen,readAt:null,verification:'unverified_research_lead',contentHash:row.titleHash,kind,changes:delta,previousContentHash:prior?.titleHash||null,ruleExplanation:prior?'Previously matched this saved company/cue rule; source evidence changed.':'Matched saved company/cue rule. May include evidence collected before the rule was created.',financialMateriality:'not_assessed',eventSnapshot:row.event||classify(row)});seen.add(id);
 }save();
 }
 function removeRule(id){const before=store.rules.length;store.rules=store.rules.filter(r=>r.id!==id);if(before===store.rules.length)throw new Error('Rule not found');save();}
 function markRead(id){const event=store.events.find(e=>e.id===id);if(!event)throw new Error('Alert not found');event.readAt=event.readAt||new Date().toISOString();save();}
 function snapshot(){if(fs.existsSync(file)){store=JSON.parse(fs.readFileSync(file));if(!Array.isArray(store.rules)||!Array.isArray(store.events))throw new Error('Invalid alert store');}return {rules:store.rules,events:[...store.events].reverse(),unread:store.events.filter(e=>!e.readAt).length};}
 return {addRule:input=>transaction(()=>addRule(input)),evaluate:rows=>transaction(()=>evaluate(rows)),removeRule:id=>transaction(()=>removeRule(id)),markRead:id=>transaction(()=>markRead(id)),snapshot};
}
module.exports={createAlerts};
