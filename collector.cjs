const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createAlerts } = require('./persistent-alerts.cjs');
const { createSamAdapter } = require('./sam-adapter.cjs');
const { classify, eventTypes } = require('./event-classifier.cjs');
const { acquireCollectorLock } = require('./collector-lock.cjs');
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
  const sam = createSamAdapter(dataDir);
  const alerts = createAlerts(dataDir, watchlist, {readOnly});
  let running = false;
  function save() {
    if (readOnly) throw new Error('Read-only dashboard; collection and rule changes belong to the active worker');
    fs.writeFileSync(filename + '.tmp', JSON.stringify(store, null, 2));
    fs.renameSync(filename + '.tmp', filename);
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
        store.health[source.id] = { status: 'needs_access_or_adapter', reason: source.reason };
        return 0;
      }
      let records, etag = null, coverage = null;
      if (source.kind === 'sam') {
        const result = await sam.collect(); records = result.records; coverage = result.coverage;
      } else {
        const headers = { 'User-Agent': 'ContractSentinel/0.8 public-feed-research', Accept: 'application/rss+xml, application/atom+xml, text/html;q=0.8' };
        if (previous?.etag) headers['If-None-Match'] = previous.etag;
        const response = await fetch(source.url, { headers, signal: AbortSignal.timeout(20000) });
        if (response.status === 304) { store.health[source.id] = { ...previous, status: 'healthy', checkedAt: now }; return 0; }
        const text = await readResponse(response);
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
        const hash = crypto.createHash('sha256').update(source.kind === 'sam' ? JSON.stringify(record) : record.title).digest('hex');
        const cueText = source.kind === 'sam' ? [record.title, record.award?.recipientName, record.noticeType === 'Award Notice' ? 'contract' : ''].join(' ') : record.title;
        const annotation = parsers.annotate(cueText, watchlist);
        const prior = old.get(id);
        if (prior) {
          prior.lastSeen = now;
          if (prior.titleHash !== hash) prior.previousTitles = [...(prior.previousTitles || []), { title: prior.title, changedAt: now }];
          Object.assign(prior, record, annotation, { titleHash: hash });
        } else {
          const row = { id, ...record, sourceId: source.id, sourceName: source.name, sourceClass: source.class, firstSeen: now, lastSeen: now, titleHash: hash, ...annotation, verification: 'unverified_research_lead', collectionScope: source.kind === 'sam' ? 'SAM notice metadata' : source.kind === 'rss' ? 'feed headline' : 'newsroom index headline' };
          store.evidence.push(row); old.set(id, row); added++;
        }
      }
      store.health[source.id] = {
        status: source.kind === 'sam' ? coverage.status : source.kind === 'issuers' || records.length ? 'healthy' : 'no_records',
        checkedAt: now, lastSuccess: source.kind === 'sam' && !coverage.successfulRequests ? previous?.lastSuccess || null : now,
        records: source.kind === 'issuers' ? store.issuers.length : records.length, etag, ...(coverage ? { coverage } : {})
      };
      store.jobs[source.id].failures = coverage?.warnings?.length ? (job.failures || 0) + 1 : 0;
    } catch (error) {
      store.health[source.id] = { ...previous, status: 'failed', checkedAt: now, error: error.message };
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
      store.lastScan = new Date().toISOString(); alerts.evaluate(store.evidence); save();
      return { added, total: store.evidence.length };
    } finally { running = false; }
  }
  function snapshot() {
    if (readOnly) reload();
    return {
      sources: sources.map(s => ({ ...s, health: store.health[s.id] || { status: s.kind === 'pending' ? 'needs_access_or_adapter' : 'not_scanned' }, job: store.jobs[s.id] || null,
        stale: Boolean(store.jobs[s.id]?.nextScheduledAt && Date.now() > Date.parse(store.jobs[s.id].nextScheduledAt) + (store.jobs[s.id].pollMinutes || 60) * 60000) })),
      evidence: [...store.evidence].sort((a, b) => b.firstSeen.localeCompare(a.firstSeen)).map(r => ({ ...r, event: classify(r) })),
      eventTypes, samConfigured: sam.configured(), samCollection: sam.status(), watchlist, issuers: store.issuers || [], alerts: alerts.snapshot(), lastScan: store.lastScan, running, readOnly
    };
  }
  return {
    scan, snapshot, close: release,
    setSamKey(value) { writable(); sam.setKey(value); store.health['sam-opportunities'] = { status: sam.configured() ? 'configured_not_scanned' : 'needs_access_or_adapter', reason: sam.configured() ? 'Key held in server memory; scan to verify access' : 'Configure a SAM API key locally' }; save(); },
    addRule(input) { writable(); const rule = alerts.addRule(input); alerts.evaluate(store.evidence); return rule; },
    removeRule(id) { writable(); return alerts.removeRule(id); }, markAlertRead(id) { writable(); return alerts.markRead(id); }
  };
}
module.exports = { createCollector, ...parsers };
