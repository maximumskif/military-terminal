const fs=require('node:fs'),path=require('node:path');
const {resolveWithLedger}=require('./recipient-bindings.cjs');
function loadLedger(){return JSON.parse(fs.readFileSync(path.join(__dirname,'entity-ledger.json')));}
function resolveRecipient(recipient,asOf){return resolveWithLedger(recipient,asOf,loadLedger());}
module.exports={loadLedger,resolveRecipient};
