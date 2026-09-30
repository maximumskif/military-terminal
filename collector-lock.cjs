const fs = require('node:fs');
const path = require('node:path');

function acquireCollectorLock(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'collector.lock');
  if (fs.existsSync(file)) {
    const old = JSON.parse(fs.readFileSync(file));
    let alive = true;
    try { process.kill(old.pid, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; else throw new Error('Cannot verify collector ownership'); }
    if (alive) throw new Error('Another collector owns this data directory. Use a read-only dashboard or stop that collector.');
    fs.unlinkSync(file);
  }
  const fd = fs.openSync(file, 'wx');
  fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  fs.closeSync(fd);
  let released = false;
  function release() {
    if (released) return;
    released = true;
    if (fs.existsSync(file) && JSON.parse(fs.readFileSync(file)).pid === process.pid) fs.unlinkSync(file);
  }
  process.once('exit', release);
  return release;
}
module.exports = { acquireCollectorLock };
