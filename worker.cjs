const path = require('node:path');
const { createCollector } = require('./collector.cjs');

const dataDir = path.resolve(process.env.SENTINEL_DATA_DIR || path.join(__dirname, '../../work/sentinel-data'));
const collector = createCollector(dataDir);
let stopping = false;

async function tick() {
  if (stopping) return;
  try { await collector.scan({ force: false }); }
  catch { process.stderr.write('Collection job failed; inspect saved source health.\n'); }
}
const timer = setInterval(tick, 60000);
tick();
process.stdout.write('Independent collection worker started. No browser or HTTP server required.\n');
function stop() {
  stopping = true; clearInterval(timer);
  const drain = setInterval(() => {
    if (!collector.snapshot().running) { clearInterval(drain); collector.close(); process.exit(0); }
  }, 100);
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
