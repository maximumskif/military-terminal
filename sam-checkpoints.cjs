const fs = require('node:fs');
const path = require('node:path');
const { easternToday } = require('./funding-analysis.cjs');
const {atomicJson}=require('./storage.cjs');
const ENDPOINT = 'https://api.sam.gov/opportunities/v2/search';

function integer(value, fallback, max) {
  const n = Number(value ?? fallback);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error('Invalid SAM collection configuration');
  return n;
}
function apiDate(day) { const [year, month, date] = day.split('-'); return `${month}/${date}/${year}`; }
function previousDay(day, count) {
  const date = new Date(day + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() - count);
  return date.toISOString().slice(0, 10);
}

function createCheckpointCollector(dataDir, normalizeNotice, options = {}) {
  if (!dataDir) throw new Error('SAM persistence directory is required');
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'sam-collection.json');
  let state = { version: 1, windows: {}, usage: {}, history: [], backoffUntil: null };
  if (fs.existsSync(file)) {
    state = JSON.parse(fs.readFileSync(file));
    if (state.version !== 1 || !state.windows || !state.usage || !Array.isArray(state.history)) throw new Error('Invalid SAM checkpoints; preserved for recovery');
  }
  if(!options.readOnly)for(const attempt of state.history)if(attempt.status==='started'){attempt.status='interrupted_unknown_outcome';attempt.recoveredAt=new Date().toISOString();}
  const dailyLimit = integer(options.dailyLimit ?? process.env.SAM_DAILY_REQUEST_LIMIT, 25, 10000);
  const requestsPerScan = integer(options.requestsPerScan ?? process.env.SAM_REQUESTS_PER_SCAN, 3, 20);
  const backfillDays = integer(options.backfillDays ?? process.env.SAM_BACKFILL_DAYS, 7, 365);
  const clock = options.clock || (() => new Date());
  const today = options.today || easternToday;
  let busy = false;

  function save() {
    atomicJson(file,state);
  }
  function initializeWindows(day) {
    for (let i = 0; i < backfillDays; i++) {
      const date = previousDay(day, i);
      if (!state.windows[date]) state.windows[date] = {
        date, nextPage: 0, pagesRead: 0, reportedTotal: null, notices: {},
        passExhaustedAt: null, lastSuccess: null, lastPriorityRefresh: null,
        failureCount: 0, retryAt: null
      };
    }
    save();
  }
  function status() {
    const snapshot = options.readOnly && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : state;
    const day = today();
    const used = snapshot.usage[day] || 0;
    const windows = Object.values(snapshot.windows).sort((a, b) => a.date.localeCompare(b.date)).map(w => ({
      date: w.date, nextPage: w.nextPage, pagesRead: w.pagesRead,
      collected: Object.keys(w.notices).length, reportedTotal: w.reportedTotal,
      passExhaustedAt: w.passExhaustedAt, lastSuccess: w.lastSuccess, retryAt: w.retryAt,
      status: !w.passExhaustedAt ? 'incomplete' : Object.keys(w.notices).length < (w.reportedTotal || 0) ? 'gaps_after_pass' : 'pass_exhausted_not_snapshot'
    }));
    const backoff = snapshot.backoffUntil && Date.parse(snapshot.backoffUntil) > clock().getTime() ? snapshot.backoffUntil : null;
    return { day, used, dailyLimit, remaining: Math.max(0, dailyLimit - used), requestsPerScan,
      nextEligibleAt: backoff || (used >= dailyLimit ? `After the next ${'America/New_York'} calendar-day quota window` : 'Eligible now'),
      quotaTimezone: 'America/New_York', windows, requestHistory: structuredClone(snapshot.history.slice(-25)) };
  }
  async function readPage(key, window, page, kind, signal) {
    const day = today();
    if ((state.usage[day] || 0) >= dailyLimit) throw new Error('Local persistent SAM quota exhausted');
    const attempt = { at: clock().toISOString(), provider: 'SAM', window: window.date, page, kind, status: 'started' };
    state.usage[day] = (state.usage[day] || 0) + 1;
    state.history.push(attempt);
    state.history = state.history.slice(-2000);
    save(); // Charge before the request: a crash cannot erase usage.
    const url = new URL(ENDPOINT);
    url.search = new URLSearchParams({ api_key: key, postedFrom: apiDate(window.date), postedTo: apiDate(window.date), limit: '100', offset: String(page) });
    try {
      let response;
      try { response = await fetch(url, { signal, redirect: 'error', headers: { Accept: 'application/json' } }); }
      catch { throw new Error('SAM connection failed; credentials omitted from diagnostics'); }
      attempt.httpStatus = response.status;
      if (!response.ok) {
        const retry = response.headers?.get('retry-after');
        if (response.status === 429) {
          const until = retry && /^\d+$/.test(retry) ? clock().getTime() + Number(retry) * 1000 : retry ? Date.parse(retry) : NaN;
          state.backoffUntil = new Date(Number.isFinite(until) ? Math.max(until, clock().getTime() + 1000) : clock().getTime() + 3600000).toISOString();
        }
        throw new Error(`SAM HTTP ${response.status}`);
      }
      const reader = response.body.getReader();
      let bytes = 0; const chunks = [];
      while (true) {
        let result;
        try { result = await reader.read(); } catch { throw new Error('SAM response interrupted'); }
        if (result.done) break;
        bytes += result.value.length;
        if (bytes > 5000000) { await reader.cancel(); throw new Error('SAM response exceeds size limit'); }
        chunks.push(Buffer.from(result.value));
      }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new Error('Invalid SAM JSON response'); }
      if (!Array.isArray(data.opportunitiesData) || !Number.isInteger(data.totalRecords) || data.totalRecords < 0 || data.opportunitiesData.length > 100) throw new Error('Invalid SAM response shape');
      const records = data.opportunitiesData.map(normalizeNotice);
      if (!records.length && page * 100 < data.totalRecords) throw new Error("SAM pagination gap; checkpoint preserved");
      for (const record of records) window.notices[record.noticeId] = {...record,last_successful_fetch_at:clock().toISOString(),last_attempted_check_at:clock().toISOString()};
      window.reportedTotal = data.totalRecords;
      if (kind === "priority_refresh" && window.nextPage * 100 < data.totalRecords) window.passExhaustedAt = null;
      window.pagesRead++;
      window.lastSuccess = clock().toISOString();
      window.failureCount = 0; window.retryAt = null;
      if (page === 0) window.lastPriorityRefresh = clock().toISOString();
      if (kind !== 'priority_refresh') {
        window.nextPage = page + 1;
        if ((page + 1) * 100 >= data.totalRecords) window.passExhaustedAt = clock().toISOString();
        else if (!records.length) throw new Error('SAM pagination gap; window requires revisit');
      }
      attempt.status = 'success'; attempt.records = records.length;
      save(); // Persist each successful page, including its normalized notices.
    } catch (error) {
      attempt.status = 'failed'; attempt.error = error.message;
      window.failureCount++;
      window.retryAt = state.backoffUntil || new Date(clock().getTime() + Math.min(3600000, 30000 * 2 ** Math.min(window.failureCount - 1, 7))).toISOString();
      save(); throw error;
    }
  }
  async function collect(key) {
    if (options.readOnly) throw new Error("Read-only SAM adapter");
    if (busy) throw new Error('SAM collection already running');
    busy = true;
    const errors = []; let successfulRequests = 0; const touched = new Set();
    try {
      const day = today(); initializeWindows(day);
      const signal = AbortSignal.timeout(60000);
      for (let slot = 0; slot < requestsPerScan; slot++) {
        if ((state.usage[day] || 0) >= dailyLimit || state.backoffUntil && Date.parse(state.backoffUntil) > clock().getTime()) break;
        const windows = Object.values(state.windows);
        const eligible = w => !w.retryAt || Date.parse(w.retryAt) <= clock().getTime();
        // Reserve the first request for recent changes; remaining requests advance backfill.
        const recent = windows.filter(w => w.date >= previousDay(day, 1) && eligible(w) && (!w.lastPriorityRefresh || clock().getTime() - Date.parse(w.lastPriorityRefresh) >= 3600000)).sort((a, b) => (a.lastPriorityRefresh || '').localeCompare(b.lastPriorityRefresh || '') || b.date.localeCompare(a.date))[0];
        let window, page, kind;
        if (slot === 0 && recent) { window = recent; page = 0; kind = recent.nextPage > 0 ? 'priority_refresh' : 'backfill'; }
        else {
          window = windows.filter(w => eligible(w) && !w.passExhaustedAt).sort((a, b) => a.date.localeCompare(b.date))[0];
          if (!window) {
            window = windows.filter(w => eligible(w) && w.passExhaustedAt && clock().getTime() - Date.parse(w.passExhaustedAt) >= 86400000).sort((a, b) => a.passExhaustedAt.localeCompare(b.passExhaustedAt))[0];
            if (window) { window.nextPage = 0; window.passExhaustedAt = null; save(); }
          }
          if (!window) break;
          page = !touched.has(window.date) && window.nextPage > 1 ? window.nextPage - 1 : window.nextPage; kind = 'backfill';
        }
        try { await readPage(key, window, page, kind, signal); touched.add(window.date); successfulRequests++; }
        catch (error) { errors.push(error.message); break; }
      }
      const quota = status();
      const all = Object.values(state.windows);
      const records = [...new Map(all.flatMap(w => Object.values(w.notices)).map(r => [r.noticeId, r])).values()];
      const exhausted = quota.windows.every(w => w.status === 'pass_exhausted_not_snapshot');
      return { records, coverage: {
        postedFrom: apiDate(all.map(w => w.date).sort()[0]), postedTo: apiDate(day),
        returned: records.length, total: quota.windows.reduce((n, w) => n + (w.reportedTotal || 0), 0),
        complete: false, passExhausted: exhausted, incompleteWindows: quota.windows.filter(w => w.status !== 'pass_exhausted_not_snapshot').length,
        reportedTotalsKnown: quota.windows.every(w => w.reportedTotal !== null), windows: quota.windows,
        requestsToday: quota.used, quota, successfulRequests, warnings: errors,
        status: errors.length ? 'degraded' : successfulRequests ? 'healthy' : quota.remaining === 0 ? 'quota_wait' : 'idle',
        scope: 'Resumable daily posted-date windows; mutable pagination is not a stable or complete snapshot'
      } };
    } finally { busy = false; }
  }
  return { collect, status };
}
module.exports = { createCheckpointCollector };
