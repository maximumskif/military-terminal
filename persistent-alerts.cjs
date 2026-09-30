const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {classify}=require('./event-classifier.cjs');
const CUES=['contract','supplier','growth','ipo','negative'];
function createAlerts(dataDir,watchlist){
 const file=path.join(dataDir,'alerts.json');let store={version:1,rules:[],events:[]};
 if(fs.existsSync(file)){store=JSON.parse(fs.readFileSync(file));if(!Array.isArray(store.rules)||!Array.isArray(store.events))throw new Error('Invalid alert store; preserved for recovery');}
 function save(){fs.writeFileSync(file+'.tmp',JSON.stringify(store,null,2));fs.renameSync(file+'.tmp',file);}
 function addRule(input){if(!input||typeof input!=='object'||!CUES.includes(input.cue)||!(input.company===''||watchlist.some(c=>c.name===input.company)))throw new Error('Choose a valid company and cue');if(store.rules.some(r=>r.company===input.company&&r.cue===input.cue))throw new Error('That rule already exists');if(store.rules.length>=100)throw new Error('Maximum 100 rules');const rule={id:crypto.randomUUID(),company:input.company,cue:input.cue,createdAt:new Date().toISOString()};store.rules.push(rule);save();return rule;}
 function evaluate(evidence){const seen=new Set(store.events.map(e=>e.id));for(const rule of store.rules){for(const row of evidence){if(!row.cues.includes(rule.cue)||(rule.company&&!row.companyMentions.includes(rule.company)))continue;const id=crypto.createHash('sha256').update(rule.id+'|'+row.id+'|'+row.titleHash).digest('hex');if(seen.has(id))continue;store.events.push({id,ruleId:rule.id,evidenceId:row.id,title:row.title,url:row.url,sourceName:row.sourceName,sourceClass:row.sourceClass,cue:rule.cue,company:rule.company,createdAt:new Date().toISOString(),firstSeen:row.firstSeen,readAt:null,verification:'unverified_research_lead',eventSnapshot:classify(row)});seen.add(id);}}save();}
 function removeRule(id){const before=store.rules.length;store.rules=store.rules.filter(r=>r.id!==id);if(before===store.rules.length)throw new Error('Rule not found');save();}
 function markRead(id){const event=store.events.find(e=>e.id===id);if(!event)throw new Error('Alert not found');event.readAt=event.readAt||new Date().toISOString();save();}
 function snapshot(){return {rules:store.rules,events:[...store.events].reverse(),unread:store.events.filter(e=>!e.readAt).length};}
 return {addRule,evaluate,removeRule,markRead,snapshot};
}
module.exports={createAlerts};
