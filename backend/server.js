const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const cors = require('cors');
const pino = require('pino');
const pretty = require('pino-pretty');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;
const CACHE_TTL_SEC = parseInt(process.env.CACHE_TTL_SEC || '15', 10); // default 15 seconds

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const logger = pino(pretty({ translateTime: 'SYS:standard', ignore: 'pid,hostname' }));
const cache = new NodeCache({ stdTTL: CACHE_TTL_SEC, checkperiod: 2 * CACHE_TTL_SEC });

const limiter = rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

const http = axios.create({ timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });

function cacheKey(type, symbol) {
  return `${type}:${symbol}`.toUpperCase();
}

async function getCachedOrFetch(key, fetcher, ttl = CACHE_TTL_SEC) {
  const hit = cache.get(key);
  if (hit) return hit;
  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
}

// NOTE: Real-world: use yahoo-finance2 for quotes instead of scraping
async function fetchYahooQuote(symbol) {
  // Fallback scraping of Yahoo Finance quote page
  const url = `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`;
  const { data: html } = await http.get(url);
  const $ = cheerio.load(html);
  // Very brittle selectors; replace with official/unofficial API in production
  const priceText = $('fin-streamer[data-field="regularMarketPrice"]').first().text() || $('fin-streamer[data-field="regularMarketPreviousClose"]').first().text();
  const prevCloseText = $('td[data-test="PREV_CLOSE-value"]').text();
  const volumeText = $('td[data-test="TD_VOLUME-value"]').text();
  const price = parseFloat(priceText.replace(/[\,\s]/g, ''));
  const previousClose = parseFloat(prevCloseText.replace(/[\,\s]/g, ''));
  const volume = parseInt(volumeText.replace(/[\,\s]/g, ''), 10);
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  if (!Number.isFinite(price)) throw new Error('Failed to parse CMP');
  return { currentPrice: price, previousClose, change, changePercent, volume };
}

// Google Finance scraping for P/E and earnings (brittle; replace with a stable API)
async function fetchGoogleFinancials(symbol) {
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}`;
  const { data: html } = await http.get(url);
  const $ = cheerio.load(html);
  // Attempt to read P/E (TTM) and recent earnings date
  const peLabel = $('div:contains("P/E ratio")').closest('div').next().text();
  const peRatio = parseFloat((peLabel || '').replace(/[\,\s]/g, ''));
  const earningsDate = $('div:contains("Earnings date")').closest('div').next().text() || '';
  const epsText = $('div:contains("EPS")').closest('div').next().text() || '';
  const eps = parseFloat(epsText.replace(/[\,\s]/g, ''));
  return {
    peRatio: Number.isFinite(peRatio) ? peRatio : NaN,
    latestEarnings: { date: earningsDate, eps: Number.isFinite(eps) ? eps : NaN, revenue: NaN },
  };
}

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/api/cmp/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const key = cacheKey('cmp', symbol);
    const data = await getCachedOrFetch(key, () => fetchYahooQuote(symbol));
    res.json(data);
  } catch (err) {
    logger.error({ err }, 'CMP fetch failed');
    res.status(502).json({ error: 'Failed to fetch CMP' });
  }
});

app.get('/api/pe/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const key = cacheKey('pe', symbol);
    const data = await getCachedOrFetch(key, () => fetchGoogleFinancials(symbol));
    res.json({ peRatio: data.peRatio });
  } catch (err) {
    logger.error({ err }, 'PE fetch failed');
    res.status(502).json({ error: 'Failed to fetch P/E ratio' });
  }
});

app.get('/api/earnings/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const key = cacheKey('earnings', symbol);
    const data = await getCachedOrFetch(key, () => fetchGoogleFinancials(symbol));
    res.json({ latestEarnings: data.latestEarnings });
  } catch (err) {
    logger.error({ err }, 'Earnings fetch failed');
    res.status(502).json({ error: 'Failed to fetch earnings' });
  }
});

app.listen(PORT, () => {
  logger.info(`Backend listening on :${PORT}`);
});
