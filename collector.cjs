const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createEventStore}=require('./event-store.cjs');
const { createAlerts } = require('./persistent-alerts.cjs');
const { createSamAdapter } = require('./sam-adapter.cjs');
const { classify, eventTypes, timestamp, CLASSIFIER_VERSION } = require('./event-classifier.cjs');
const { acquireCollectorLock } = require('./collector-lock.cjs');
const {atomicJson}=require('./storage.cjs');
const {sourceHealth}=require('./source-health.cjs');
const parsers = require('./source-parsers.cjs');

async function readResponse(response) {
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const reader = response.body.getReader();
  let bytes = 0; const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > 5000000) { await reader.cancel(); throw new Error('Source exceeds 5MB limit'); }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString('utf8');
}
function createCollector(dataDir, options = {}) {
  fs.mkdirSync(dataDir, { recursive: true });
  const readOnly = Boolean(options.readOnly);
  const release = readOnly ? () => {} : acquireCollectorLock(dataDir);
  const filename = path.join(dataDir, 'evidence.json');
  const sources = JSON.parse(fs.readFileSync(path.join(__dirname, 'sources.json')));
  const watchlist = JSON.parse(fs.readFileSync(path.join(__dirname, 'research-watchlist.json')));
  let store = { version: 1, evidence: [], health: {}, jobs: {}, lastScan: null };
  function reload() {
    if (!fs.existsSync(filename)) return;
    const next = JSON.parse(fs.readFileSync(filename));
    if (!Array.isArray(next.evidence) || !next.health) throw new Error('Invalid evidence store; preserved for recovery');
    store = { ...next, jobs: next.jobs || {} };
  }
  reload();
  if (!readOnly) for (const job of Object.values(store.jobs)) if (job.running) { job.running = false; job.recoveredAt = new Date().toISOString(); }
  const sam = createSamAdapter(dataDir,{readOnly});
  const events=createEventStore(dataDir);
  const alerts = createAlerts(dataDir, watchlist, {readOnly});
  let running = false;const classifications=new Map();
  function classified(row){const key=row.id+'|'+row.titleHash+'|'+CLASSIFIER_VERSION;if(row.event?.version===CLASSIFIER_VERSION&&row.classificationHash===row.titleHash)return row.event;if(!classifications.has(key))classifications.set(key,classify(row));return classifications.get(key);}
  if(!readOnly)for(const row of store.evidence){row.first_observed_at ||= row.firstSeen;row.source_published_at ??=row.publishedAt||null;row.source_publication_precision ||=timestamp(row.publishedAt).precision;if(row.event?.version!==CLASSIFIER_VERSION||row.classificationHash!==row.titleHash){row.event=classified(row);row.classificationHash=row.titleHash;row.processed_at=new Date().toISOString();}}
  function save() {
    if (readOnly) throw new Error('Read-only dashboard; collection and rule changes belong to the active worker');
    atomicJson(filename,store);
  }
  function writable() { if (readOnly) throw new Error('Read-only dashboard; configure and manage the collection process directly'); }
  async function collectSource(source) {
    const now = new Date().toISOString();
    const previous = store.health[source.id];
    const job = store.jobs[source.id] || {};
    store.jobs[source.id] = { ...job, running: true, startedAt: now };
    save();
    let added = 0;
    try {
      if (source.kind === 'pending' || source.kind === 'sam' && !sam.configured()) {
        store.health[source.id] = {...previous,status:'needs_access_or_adapter',reason:source.reason};
        return 0;
      }
      let records,etag=null,coverage=null,fetchedAt=null;
      if (source.kind === 'sam') {
        const result = await sam.collect(); records = result.records; coverage = result.coverage;
      } else {
        const headers = { 'User-Agent': 'ContractSentinel/0.11 public-feed-research', Accept: 'application/rss+xml, application/atom+xml, text/html;q=0.8' };
        if (previous?.etag) headers['If-None-Match'] = previous.etag;
        const response = await fetch(source.url, { headers, signal: AbortSignal.timeout(20000) });
        if (response.status === 304) { store.health[source.id] = { ...previous, status:'healthy',checkedAt:now,lastSuccess:new Date().toISOString(),last_successful_fetch_at:new Date().toISOString(),last_attempted_check_at:now, error: null, reason: null }; store.jobs[source.id].failures=0; return 0; }
        const text = await readResponse(response);fetchedAt=new Date().toISOString();
        etag = response.headers.get('etag');
        if (source.kind === 'issuers') {
          const directory = Object.values(JSON.parse(text));
          if (!directory.length || !directory.every(r => Number.isInteger(r.cik_str) && typeof r.ticker === 'string' && typeof r.title === 'string')) throw new Error('Invalid SEC issuer directory');
          store.issuers = watchlist.filter(c => c.researchTicker).map(c => {
            const match = directory.find(r => r.ticker === c.researchTicker);
            return { researchName: c.name, status: match ? 'SEC issuer directory match' : 'unresolved', ...(match ? { legalName: match.title, ticker: match.ticker, cik: String(match.cik_str).padStart(10, '0'), sourceUrl: source.url, checkedAt: now } : {}), relationshipScope: 'Issuer only; aliases and award recipients not verified' };
          }); records = [];
        } else records = source.kind === 'rss' ? parsers.parseFeed(text, source) : parsers.parseIndex(text, source);
      }
      const old = new Map(store.evidence.map(r => [r.id, r]));
      for (const record of records) {
        const id = crypto.createHash('sha256').update(source.id + '|' + record.url).digest('hex');
        const {last_successful_fetch_at: fetchTime,last_attempted_check_at: attemptTime,...payload}=record;
        const hash = crypto.createHash('sha256').update(source.kind === 'sam' ? JSON.stringify(payload) : record.title).digest('hex');
        const provenance={source_published_at:record.publishedAt||null,source_publication_precision:timestamp(record.publishedAt).precision,last_successful_fetch_at:source.kind==='sam'?fetchTime||null:fetchedAt,last_attempted_check_at:source.kind==='sam'?attemptTime||null:now,processed_at:new Date().toISOString()};
        const cueText = source.kind === 'sam' ? [record.title, record.award?.recipientName, record.noticeType === 'Award Notice' ? 'contract' : ''].join(' ') : record.title;
        const annotation = parsers.annotate(cueText, watchlist);
        const prior = old.get(id);
        if (prior) {
          prior.lastSeen = provenance.last_successful_fetch_at||prior.lastSeen;
          if (prior.titleHash !== hash) prior.previousTitles = [...(prior.previousTitles || []), { title: prior.title, changedAt: now }];
          Object.assign(prior, record, annotation, provenance, { titleHash: hash,first_observed_at:prior.first_observed_at||prior.firstSeen });
          if(!prior.event||prior.event.version!==CLASSIFIER_VERSION||prior.classificationHash!==hash){prior.event=classify(prior);prior.classificationHash=hash;}
        } else {
          const row = { id, ...record, sourceId: source.id, sourceName: source.name, sourceClass: source.class, firstSeen:provenance.processed_at,first_observed_at:provenance.processed_at,...provenance,lastSeen:provenance.last_successful_fetch_at||now,titleHash: hash, ...annotation, verification: 'unverified_research_lead', collectionScope: source.kind === 'sam' ? 'SAM notice metadata' : source.kind === 'rss' ? 'feed headline' : 'newsroom index headline' };
          row.event=classify(row);row.classificationHash=hash;store.evidence.push(row); old.set(id, row); added++;
        }
      }
      store.health[source.id] = {
        status: source.kind === 'sam' ? coverage.status : source.kind === 'issuers' || records.length ? 'healthy' : 'no_records',
        checkedAt:now,last_attempted_check_at:source.kind==='sam'?coverage.quota.requestHistory.at(-1)?.at||previous?.last_attempted_check_at||null:now,last_successful_fetch_at:source.kind==='sam'?coverage.successfulRequests?coverage.windows.map(w=>w.lastSuccess).filter(Boolean).sort().at(-1):previous?.last_successful_fetch_at||previous?.lastSuccess||null:fetchedAt,lastSuccess:source.kind==='sam'&&!coverage.successfulRequests?previous?.lastSuccess||null:fetchedAt||new Date().toISOString(),
        records: source.kind === 'issuers' ? store.issuers.length : records.length, etag, ...(coverage ? { coverage } : {})
      };
      store.jobs[source.id].failures = coverage?.warnings?.length ? (job.failures || 0) + 1 : 0;
    } catch (error) {
      store.health[source.id] = { ...previous, status: 'failed', checkedAt: now,last_attempted_check_at:now, error: error.message };
      store.jobs[source.id].failures = (job.failures || 0) + 1;
    } finally {
      const current = store.jobs[source.id];
      const minutes = source.pollMinutes || (source.kind === 'issuers' ? 1440 : 60);
      const wait = current.failures ? Math.min(3600000, 60000 * 2 ** Math.min(current.failures - 1, 6)) : minutes * 60000;
      Object.assign(current, { running: false, finishedAt: new Date().toISOString(), nextScheduledAt: new Date(Date.now() + wait).toISOString(), pollMinutes: minutes });
      save();
    }
    return added;
  }
  async function scan({ force = true } = {}) {
    writable(); if (running) return { busy: true };
    running = true;
    let added = 0;
    try {
      const queue = sources.filter(s => force || !store.jobs[s.id]?.nextScheduledAt || Date.parse(store.jobs[s.id].nextScheduledAt) <= Date.now());
      const workers = Array.from({ length: Math.min(3, queue.length) }, async () => {
        while (queue.length) { const source = queue.shift(); added += await collectSource(source); }
      });
      await Promise.all(workers);
      store.collectorConfiguration={samConfigured:sam.configured(),checkedAt:new Date().toISOString()};store.lastScan = new Date().toISOString(); events.reconcile(store.evidence);alerts.evaluate(store.evidence); save();
      return { added, total: store.evidence.length };
    } finally { running = false; }
  }
  function snapshot(options={}) {
    if (readOnly) reload();
    const page=Math.max(1,Math.min(1000000,Number.parseInt(options.page,10)||1)),pageSize=Math.max(1,Math.min(100,Number.parseInt(options.pageSize,10)||50));
    const query=String(options.query||'').slice(0,200).toLowerCase();
    const filtered=store.evidence.filter(r=>(!query||[r.title,...r.companyMentions,...r.cues,r.agency||'',r.solicitationNumber||''].join(' ').toLowerCase().includes(query))&&(!options.sourceClass||r.sourceClass===options.sourceClass)&&(!options.eventType||classified(r).eventType===options.eventType)&&(!options.cuesOnly||r.cues.length||r.companyMentions.length));
    const publicationTime=row=>{const t=timestamp(row.source_published_at||row.publishedAt);return t.precision==='date'||t.timezone==='UTC'?Date.parse(t.value):-Infinity;};filtered.sort(options.sort==='published'?(a,b)=>publicationTime(b)-publicationTime(a)||b.firstSeen.localeCompare(a.firstSeen):(a,b)=>b.firstSeen.localeCompare(a.firstSeen));
    return {
      sources:sources.map(s=>({...s,health:sourceHealth(s,store.health[s.id]||{},store.jobs[s.id]||{}),job:store.jobs[s.id]||null})),
      evidence:filtered.slice((page-1)*pageSize,page*pageSize).map(r=>({...r,first_observed_at:r.first_observed_at||r.firstSeen,source_published_at:r.source_published_at||r.publishedAt||null,source_publication_precision:r.source_publication_precision||timestamp(r.publishedAt).precision,event:classified(r)})),
      pagination:{page,pageSize,total:filtered.length,pages:Math.max(1,Math.ceil(filtered.length/pageSize))},totalEvidence:store.evidence.length,
      eventTypes,samConfigured:readOnly?Boolean(store.collectorConfiguration?.samConfigured):sam.configured(),samCollection:sam.status(),watchlist,issuers:store.issuers||[],alerts:alerts.snapshot(),lastScan:store.lastScan,running,readOnly
    };
  }
  function getEvidence(id){if(readOnly)reload();return store.evidence.find(r=>r.id===id)||null;}
  return {
    scan,snapshot,getEvidence,queryEvents:events.query,close:release,
    setSamKey(value) { writable(); sam.setKey(value);store.collectorConfiguration={samConfigured:sam.configured(),checkedAt:new Date().toISOString()}; store.health['sam-opportunities'] = {...store.health['sam-opportunities'],status: sam.configured() ? 'configured_not_scanned' : 'needs_access_or_adapter', reason: sam.configured() ? 'Key held in server memory; scan to verify access' : 'Configure a SAM API key locally' }; save(); },
    addRule(input) { if(readOnly)reload();const rule = alerts.addRule(input); alerts.evaluate(store.evidence); return rule; },
    removeRule(id) { return alerts.removeRule(id); }, markAlertRead(id) { return alerts.markRead(id); }
  };
}
module.exports = { createCollector, ...parsers };

