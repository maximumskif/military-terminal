const path = require('node:path');
const { createCollector } = require('./collector.cjs');
const {createSavedRefresh}=require('./saved-refresh.cjs');
const {createFundingStore}=require('./funding-store.cjs');
const {createDocumentStore}=require('./document-store.cjs');

const dataDir = path.resolve(process.env.SENTINEL_DATA_DIR || path.join(__dirname, '../../work/sentinel-data'));
const collector = createCollector(dataDir);
const funding=createFundingStore(dataDir),documents=createDocumentStore(dataDir);const refresh=createSavedRefresh(dataDir,{rules:()=>collector.snapshot().alerts.rules,refreshFunding:id=>funding.refresh(id),refreshDocument:id=>{const row=collector.getEvidence(id);if(!row)throw new Error('Stored evidence unavailable');return documents.fetchDocument(row)},evaluateChanges:()=>collector.evaluateSavedChanges()});
let stopping = false;

async function tick() {
  if (stopping) return;
  try { await collector.scan({ force: false }); await refresh.tick(); }
  catch { process.stderr.write('Collection job failed; inspect saved source health.\n'); }
}
const timer = setInterval(tick, 60000);
tick();
process.stdout.write('Independent collection worker started. No browser or HTTP server required.\n');
function stop() {
  stopping = true; clearInterval(timer);
  const drain = setInterval(() => {
    if (!collector.snapshot().running&&!refresh.busy) { clearInterval(drain); collector.close(); process.exit(0); }
  }, 100);
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
