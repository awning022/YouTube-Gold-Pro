const { chromium } = require('playwright');
const { config } = require('./config');
const logger = require('./logger');

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadProxies() {
  const filePath = require('path').join(process.cwd(), 'proxies.txt');
  if (!require('fs').existsSync(filePath)) return [];

  const raw = require('fs').readFileSync(filePath, 'utf8');
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'));
}

function parseArgs(argv) {
  const options = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === '--query') options.searchQuery = next;
    if (arg === '--min') options.minWatchSeconds = Number(next);
    if (arg === '--max') options.maxWatchSeconds = Number(next);
    if (arg === '--sessions') options.sessionCount = Number(next);
    if (arg === '--headless') options.headless = (next || 'true') !== 'false';
    if (arg === '--stealth') options.stealth = (next || 'true') !== 'false';
    if (arg === '--randomize') options.randomize = (next || 'true') !== 'false';
    if (arg === '--locale') options.locale = next;
    if (arg === '--timezone') options.timezone = next;
  }

  return options;
}

async function runSingleSession(sessionIndex, totalSessions, mergedOptions, proxies) {
  const sessionOptions = { ...mergedOptions };

  if (proxies.length > 0) {
    sessionOptions.proxy = proxies[Math.floor(Math.random() * proxies.length)];
  }

  logger.info(`=== Session ${sessionIndex}/${totalSessions} starting ===`);

  try {
    const browser = await chromium.launch({
      headless: sessionOptions.headless !== false,
      args: sessionOptions.stealth ? ['--disable-blink-features=AutomationControlled'] : []
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      locale: sessionOptions.locale || 'pt-BR',
      timezoneId: sessionOptions.timezone || 'America/Sao_Paulo',
      viewport: { width: 1440, height: 900 }
    });

    const page = await context.newPage();
    const query = sessionOptions.searchQuery || config.searchQuery;
    const minWatch = Number(sessionOptions.minWatchSeconds || 20);
    const maxWatch = Number(sessionOptions.maxWatchSeconds || 60);

    await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    await page.waitForTimeout(2000);

    const firstVideo = page.locator('a#video-title').first();
    if (await firstVideo.count()) {
      await firstVideo.click();
      await page.waitForTimeout(randomBetween(minWatch * 1000, maxWatch * 1000));
      logger.success(`Session ${sessionIndex}: completed Playwright flow for ${query}`);
    } else {
      logger.warn(`Session ${sessionIndex}: search results were not available for ${query}`);
    }

    await browser.close();
    return true;
  } catch (error) {
    logger.error(`Session ${sessionIndex} failed: ${error.message}`);
    return false;
  }
}

async function runBatch(options = {}) {
  const finalOptions = {
    ...config,
    ...options,
    startedAt: options.startedAt || new Date().toISOString()
  };

  const totalSessions = Number(finalOptions.sessionCount || 1);
  const proxies = loadProxies();
  let successCount = 0;
  let failureCount = 0;

  for (let index = 0; index < totalSessions; index += 1) {
    if (index > 0) {
      const wait = randomBetween(2000, 6000);
      logger.info(`Waiting ${wait} ms before next session...`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }

    const ok = await runSingleSession(index + 1, totalSessions, finalOptions, proxies);
    if (ok) successCount += 1;
    else failureCount += 1;
  }

  const result = {
    searchQuery: finalOptions.searchQuery,
    status: failureCount > 0 ? 'completed_with_errors' : 'completed',
    successCount,
    failureCount,
    totalSessions,
    startedAt: finalOptions.startedAt,
    finishedAt: new Date().toISOString(),
  };

  logger.success(`Batch completed: ${successCount}/${totalSessions} successful`);
  return result;
}

if (require.main === module) {
  (async () => {
    const cliOptions = parseArgs(process.argv.slice(2));
    const result = await runBatch(cliOptions);
    console.log(JSON.stringify(result, null, 2));
  })().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runBatch, parseArgs, loadProxies };
