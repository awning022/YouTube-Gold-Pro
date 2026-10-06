<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YouTube Gold Pro</title>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"></script>
    <style>
      :root {
        --bg-1: #050b14;
        --bg-2: #0b1220;
        --bg-3: #121a2a;
        --card: rgba(18, 22, 30, 0.85);
        --border: rgba(168, 85, 247, 0.28);
        --primary: #a855f7;
        --primary-2: #8b5cf6;
        --text: #edf2ff;
        --muted: #a6b9d6;
        --success: #22c55e;
        --error: #ef4444;
        --warning: #f59e0b;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, sans-serif;
        background: radial-gradient(circle at top, rgba(168,85,247,0.18), transparent 30%),
                    linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 45%, var(--bg-3) 100%);
        color: var(--text);
        padding: 24px;
      }

      .shell {
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        text-align: center;
        background: rgba(12, 18, 29, 0.8);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.25);
        margin-bottom: 24px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(2rem, 4vw, 3rem);
        background: linear-gradient(90deg, #f5d0fe, #c084fc, #8b5cf6);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .subtitle {
        color: var(--muted);
        margin: 0;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .card {
        background: linear-gradient(180deg, rgba(20,25,35,0.9), rgba(15,18,24,0.85));
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 18px 40px rgba(2, 6, 23, 0.35);
      }

      .metric-label {
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 700;
      }

      .metric-value {
        font-size: 2.1rem;
        font-weight: 800;
        margin-top: 10px;
      }

      .panel {
        padding: 20px;
      }

      .nav-tabs {
        border-bottom: 1px solid var(--border);
        margin-bottom: 18px;
      }

      .nav-link {
        color: var(--muted);
        border: none;
        border-bottom: 3px solid transparent;
        font-weight: 700;
      }

      .nav-link.active {
        color: white;
        background: rgba(168,85,247,0.12);
        border-color: var(--primary);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin-bottom: 18px;
      }

      label {
        display: block;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        margin-bottom: 8px;
        font-weight: 700;
      }

      input, select, button {
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(168,85,247,0.25);
        background: rgba(12, 16, 22, 0.8);
        color: var(--text);
        padding: 12px 14px;
      }

      input:focus, select:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(168,85,247,0.18);
      }

      .button-row {
        display: flex;
        gap: 12px;
        margin: 18px 0;
      }

      .btn {
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease;
        font-weight: 800;
      }

      .btn:hover { transform: translateY(-2px); }
      .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: white; }
      .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
      .btn-success { background: linear-gradient(135deg, #34d399, #16a34a); color: white; }

      .status-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border);
        background: rgba(5, 11, 20, 0.7);
        border-radius: 16px;
        padding: 18px 20px;
      }

      .status-left { display: flex; align-items: center; gap: 12px; }
      .dot {
        width: 12px; height: 12px; border-radius: 50%; display: inline-block; background: var(--warning);
        box-shadow: 0 0 0 0 rgba(245,158,11,0.5);
      }
      .dot.running { background: var(--success); box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
      .dot.error { background: var(--error); box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }

      .pill {
        background: rgba(148,163,184,0.12);
        border: 1px solid rgba(148,163,184,0.2);
        color: var(--text);
        border-radius: 999px;
        padding: 7px 12px;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .pill.running { background: rgba(34,197,94,0.15); color: #bbf7d0; border-color: rgba(34,197,94,0.35); }
      .pill.error { background: rgba(239,68,68,0.12); color: #fecaca; border-color: rgba(239,68,68,0.35); }

      .small-muted {
        color: var(--muted);
        margin-top: 12px;
        display: block;
      }

      .terminal {
        margin-top: 20px;
        background: rgba(2, 7, 12, 0.95);
        border: 1px solid rgba(34,197,94,0.25);
        border-radius: 12px;
        padding: 16px;
        min-height: 220px;
        font-family: 'Consolas', monospace;
        color: #d1fae5;
        line-height: 1.7;
      }

      .terminal div { margin-bottom: 6px; }
      @media (max-width: 768px) {
        body { padding: 16px; }
        .button-row { flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="header">
        <h1>YouTube Gold Pro</h1>
        <p class="subtitle">Painel Premium de Automação e Coleta de Leads</p>
      </header>

      <div class="metrics">
        <div class="card">
          <div class="metric-label">Total de Views</div>
          <div class="metric-value" id="totalViews">0</div>
        </div>
        <div class="card">
          <div class="metric-label">Minutos Assistidos</div>
          <div class="metric-value" id="minutesWatched">0</div>
        </div>
        <div class="card">
          <div class="metric-label">Proxies Ativos</div>
          <div class="metric-value" id="activeProxies">0</div>
        </div>
      </div>

      <div class="card panel">
        <ul class="nav nav-tabs" id="tabs">
          <li class="nav-item">
            <button class="nav-link active" data-tab="automation">Automação de Vídeo</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-tab="leads">Coletor de Leads</button>
          </li>
        </ul>

        <div id="automation-panel">
          <div class="form-grid">
            <div>
              <label for="searchQuery">Termo de Busca</label>
              <input id="searchQuery" type="text" value="lofi hip hop radio" />
            </div>
            <div>
              <label for="channelName">Nome do Canal</label>
              <input id="channelName" type="text" value="YouTube Gold Pro" />
            </div>
            <div>
              <label for="sessionCount">Sessões</label>
              <input id="sessionCount" type="number" min="1" max="50" value="1" />
            </div>
          </div>

          <div class="form-grid">
            <div>
              <label for="operationMode">Modo de Operação</label>
              <select id="operationMode">
                <option value="view">Apenas Visualização</option>
                <option value="subscribe">Inscrição + Like</option>
              </select>
            </div>
            <div>
              <label for="invisibleMode">Modo Invisível</label>
              <select id="invisibleMode">
                <option value="no">Não</option>
                <option value="yes">Sim</option>
              </select>
            </div>
          </div>

          <div class="button-row">
            <button id="startBtn" class="btn btn-primary">Iniciar Automação</button>
            <button id="stopBtn" class="btn btn-danger">Parar Tudo</button>
            <button id="downloadBtn" class="btn btn-success">Baixar Relatório</button>
          </div>

          <div class="status-box">
            <div class="status-left">
              <span id="statusDot" class="dot"></span>
              <div>
                <div style="font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;">Status</div>
                <strong id="statusText">Aguardando início...</strong>
              </div>
            </div>
            <span id="statusPill" class="pill">Idle</span>
          </div>
          <small id="statusDetails" class="small-muted">Sistema pronto</small>

          <div class="terminal" id="terminal"></div>
        </div>

        <div id="leads-panel" style="display:none;">
          <div class="form-grid">
            <div>
              <label for="leadSource">Fonte</label>
              <input id="leadSource" type="text" value="youtube" />
            </div>
            <div>
              <label for="leadLimit">Limite</label>
              <input id="leadLimit" type="number" value="250" />
            </div>
          </div>
          <div class="button-row">
            <button class="btn btn-success" id="collectLeadsBtn">Coletar Leads</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');
      const statusPill = document.getElementById('statusPill');
      const statusDetails = document.getElementById('statusDetails');
      const terminal = document.getElementById('terminal');

      function setTerminal(lines) {
        terminal.innerHTML = lines.map((line) => `<div>${line}</div>`).join('');
      }

      function setStatus(state, message, details) {
        statusText.textContent = message;
        statusDetails.textContent = details || 'Sistema pronto';

        statusDot.className = 'dot';
        statusPill.className = 'pill';

        if (state === 'running') {
          statusDot.classList.add('running');
          statusPill.classList.add('running');
          statusPill.textContent = 'Running';
        } else if (state === 'error') {
          statusDot.classList.add('error');
          statusPill.classList.add('error');
          statusPill.textContent = 'Error';
        } else if (state === 'completed') {
          statusPill.textContent = 'Complete';
        } else if (state === 'stopped') {
          statusPill.textContent = 'Stopped';
        } else {
          statusPill.textContent = 'Idle';
        }
      }

      async function fetchStatus() {
        try {
          const res = await fetch('/api/status');
          const data = await res.json();

          const latestLogs = Array.isArray(data.logs) ? data.logs : [];
          if (latestLogs.length) setTerminal(latestLogs.slice(-8));

          if (data.running) {
            setStatus('running', data.output || 'Executando...', 'Iniciando processo...');
            return;
          }

          if (data.status === 'error') {
            setStatus('error', data.output || 'Erro detectado', 'Verifique o log de execução');
          } else if (data.status === 'completed') {
            setStatus('completed', data.output || 'Execução finalizada', 'Processo concluído com sucesso');
          } else if (data.status === 'stopped') {
            setStatus('stopped', data.output || 'Automação parou', 'Operação interrompida manualmente');
          } else {
            setStatus('idle', 'Aguardando início...', 'Sistema pronto');
          }
        } catch (error) {
          console.error(error);
        }
      }

      document.querySelectorAll('[data-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          document.querySelectorAll('[data-tab]').forEach((btn) => btn.classList.remove('active'));
          button.classList.add('active');
          const isAutomation = button.dataset.tab === 'automation';
          document.getElementById('automation-panel').style.display = isAutomation ? 'block' : 'none';
          document.getElementById('leads-panel').style.display = isAutomation ? 'none' : 'block';
        });
      });

      document.getElementById('startBtn').addEventListener('click', async () => {
        const payload = {
          searchQuery: document.getElementById('searchQuery').value,
          sessionCount: Number(document.getElementById('sessionCount').value || 1),
          headless: true,
          stealth: true,
          randomize: true
        };

        setStatus('running', 'Iniciando automação...', 'Preparando execução');

        const res = await fetch('/api/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (!res.ok) {
          setStatus('error', result.message || 'Erro ao iniciar', 'Falha de execução');
          return;
        }

        setStatus('running', 'Automação iniciada', 'Executando sessões');
      });

      document.getElementById('stopBtn').addEventListener('click', async () => {
        await fetch('/api/stop', { method: 'POST' });
        setStatus('stopped', 'Parando automação...', 'Solicitação enviada');
      });

      document.getElementById('downloadBtn').addEventListener('click', async () => {
        window.open('/api/report/download?type=json', '_blank');
      });

      document.getElementById('collectLeadsBtn').addEventListener('click', () => {
        setStatus('completed', 'Coleta iniciada', 'Processo de leads em execução');
      });

      setTerminal(['[INFO] Sistema pronto', '[INFO] Dashboard operacional']);
      fetchStatus();
      setInterval(fetchStatus, 2500);
    </script>
  </body>
</html>
