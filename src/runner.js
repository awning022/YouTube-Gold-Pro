const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'automation.log');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function appendLog(level, message) {
  ensureLogDir();
  const stamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `${stamp} [${level}] ${message}\n`, 'utf8');
}

module.exports = {
  info(message) { appendLog('INFO', message); },
  success(message) { appendLog('SUCCESS', message); },
  warn(message) { appendLog('WARN', message); },
  error(message) { appendLog('ERROR', message); }
};
