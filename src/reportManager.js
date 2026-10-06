const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(process.cwd(), 'reports');

function ensureReportDirectory() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function slugify(value) {
  return String(value || 'report')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'report';
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function convertToCsvRows(report) {
  const rows = [[
    'timestamp', 'status', 'query', 'sessions', 'success', 'failed', 'output'
  ]];

  rows.push([
    report.finishedAt || report.startedAt || new Date().toISOString(),
    report.status || 'unknown',
    report.searchQuery || '',
    report.sessionCount || 0,
    report.summary?.successCount || 0,
    report.summary?.failureCount || 0,
    report.output || ''
  ]);

  if (Array.isArray(report.logs) && report.logs.length > 0) {
    report.logs.forEach((line) => {
      rows.push([new Date().toISOString(), 'log', '', '', '', '', line]);
    });
  }

  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function createRunReport(data = {}) {
  ensureReportDirectory();

  const metadata = {
    id: `run-${Date.now()}`,
    createdAt: new Date().toISOString(),
    startedAt: data.startedAt || null,
    finishedAt: data.finishedAt || null,
    status: data.status || 'unknown',
    searchQuery: data.searchQuery || 'lofi hip hop radio',
    sessionCount: Number(data.sessionCount || 1),
    headless: Boolean(data.headless),
    randomize: Boolean(data.randomize),
    stealth: Boolean(data.stealth),
    output: data.output || 'No output recorded.',
    summary: data.summary || {},
    logs: Array.isArray(data.logs) ? data.logs : []
  };

  const prefix = slugify(metadata.searchQuery || 'report');
  const base = `${prefix}-${getTimestamp()}`;
  const jsonPath = path.join(REPORTS_DIR, `${base}.json`);
  const csvPath = path.join(REPORTS_DIR, `${base}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2), 'utf8');
  fs.writeFileSync(csvPath, convertToCsvRows(metadata), 'utf8');

  return { jsonPath, csvPath, metadata };
}

function listReports() {
  ensureReportDirectory();
  const entries = fs.readdirSync(REPORTS_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith('.json') || entry.name.endsWith('.csv')))
    .map((entry) => {
      const filePath = path.join(REPORTS_DIR, entry.name);
      const stat = fs.statSync(filePath);
      return {
        name: entry.name,
        type: entry.name.endsWith('.json') ? 'json' : 'csv',
        size: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        path: filePath
      };
    })
    .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
}

function getLatestReport() {
  const reports = listReports();
  if (!reports.length) return null;

  const latestJson = reports
    .filter((entry) => entry.type === 'json')
    .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))[0];

  if (!latestJson) return null;

  const jsonPath = latestJson.path;
  const csvPath = jsonPath.replace(/\.json$/, '.csv');

  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return { ...JSON.parse(raw), jsonPath, csvPath };
  } catch {
    return null;
  }
}

module.exports = { createRunReport, listReports, getLatestReport, ensureReportDirectory };
