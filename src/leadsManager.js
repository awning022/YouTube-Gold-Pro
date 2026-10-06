const fs = require('fs');
const path = require('path');

const LEADS_DIR = path.join(process.cwd(), 'leads');

function ensureLeadsDir() {
  if (!fs.existsSync(LEADS_DIR)) {
    fs.mkdirSync(LEADS_DIR, { recursive: true });
  }
}

function saveLeads(leads, filename = null) {
  ensureLeadsDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = filename || `leads-${timestamp}.json`;
  const filePath = path.join(LEADS_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf8');

  const csvPath = filePath.replace(/\.json$/, '.csv');
  const csvContent = convertToCsv(leads);
  fs.writeFileSync(csvPath, csvContent, 'utf8');

  return { jsonPath: filePath, csvPath };
}

function convertToCsv(leads) {
  if (!Array.isArray(leads) || leads.length === 0) {
    return 'name,email,phone,age,cpf,source,collectedAt\n';
  }

  const headers = ['name', 'email', 'phone', 'age', 'cpf', 'source', 'collectedAt'];
  const csvRows = [headers.join(',')];

  leads.forEach((lead) => {
    const row = headers.map((header) => {
      const value = lead[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
    csvRows.push(row);
  });

  return csvRows.join('\n');
}

function listLeads() {
  ensureLeadsDir();
  const files = fs.readdirSync(LEADS_DIR);

  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const filePath = path.join(LEADS_DIR, f);
      const stat = fs.statSync(filePath);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      return {
        filename: f,
        path: filePath,
        size: stat.size,
        count: Array.isArray(data.leads) ? data.leads.length : (Array.isArray(data) ? data.length : 0),
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getLatestLeads() {
  const leads = listLeads();
  if (!leads.length) return null;

  const latest = leads[0];
  const data = JSON.parse(fs.readFileSync(latest.path, 'utf8'));

  return {
    ...latest,
    data: Array.isArray(data.leads) ? data.leads : (Array.isArray(data) ? data : []),
  };
}

module.exports = {
  saveLeads,
  convertToCsv,
  listLeads,
  getLatestLeads,
  ensureLeadsDir,
};
