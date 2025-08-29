import { NextResponse } from 'next/server';
import { StockData } from '@/types/stock';

const BACKEND_URL = process.env.BACKEND_URL;

// Backend response interfaces
interface CmpResponse {
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface PeResponse {
  peRatio: number;
}

interface EarningsResponse {
  latestEarnings: { date: string; eps: number; revenue: number };
}

// Mock portfolio data - ideally loaded from DB or uploaded file
const mockPortfolioData: Array<{
  symbol: string;
  companyName: string;
  sector: string;
  purchasePrice: number;
  shares: number;
  exchange: string;
  investment: number;
}> = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', purchasePrice: 150.0, shares: 100, exchange: 'NASDAQ', investment: 150.0 * 100 },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology', purchasePrice: 320.0, shares: 50, exchange: 'NASDAQ', investment: 320.0 * 50 },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', sector: 'Technology', purchasePrice: 125.0, shares: 75, exchange: 'NASDAQ', investment: 125.0 * 75 },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Discretionary', purchasePrice: 140.0, shares: 60, exchange: 'NASDAQ', investment: 140.0 * 60 },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', sector: 'Automotive', purchasePrice: 230.0, shares: 40, exchange: 'NASDAQ', investment: 230.0 * 40 },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', purchasePrice: 700.0, shares: 15, exchange: 'NASDAQ', investment: 700.0 * 15 },
];

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchBackend<T>(path: string, attempt = 1): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 429 && attempt < 3) {
        await delay(300 * attempt);
        return fetchBackend<T>(path, attempt + 1);
      }
      throw new Error(`Backend ${path} failed: ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    const rows: StockData[] = [];

    for (let i = 0; i < mockPortfolioData.length; i++) {
      const h = mockPortfolioData[i];
      try {
        if (BACKEND_URL) {
          // Stagger each symbol by 100ms to avoid burst
          await delay(100 * i);
        }

        let cmpData: CmpResponse;
        let peData: PeResponse;
        let earnData: EarningsResponse;

        if (BACKEND_URL) {
          [cmpData, peData, earnData] = await Promise.all<[
            CmpResponse,
            PeResponse,
            EarningsResponse
          ]>([
            fetchBackend<CmpResponse>(`/api/cmp/${h.symbol}`),
            fetchBackend<PeResponse>(`/api/pe/${h.symbol}`),
            fetchBackend<EarningsResponse>(`/api/earnings/${h.symbol}`),
          ]);
        } else {
          // Fallback: reuse previous logic if no backend
          cmpData = { currentPrice: h.purchasePrice * 1.1, previousClose: h.purchasePrice * 1.095, change: h.purchasePrice * 0.005, changePercent: 0.45, volume: 1000000 };
          peData = { peRatio: 25 };
          earnData = { latestEarnings: { date: '2024-01-01', eps: 1.0, revenue: 0 } };
        }

        const presentValue = cmpData.currentPrice * h.shares;
        const gainLoss = presentValue - h.investment;

        rows.push({
          symbol: h.symbol,
          companyName: h.companyName,
          sector: h.sector,
          exchange: h.exchange,
          purchasePrice: h.purchasePrice,
          shares: h.shares,
          investment: h.investment,
          currentPrice: cmpData.currentPrice,
          previousClose: cmpData.previousClose,
          change: cmpData.change,
          changePercent: cmpData.changePercent,
          volume: cmpData.volume,
          peRatio: peData.peRatio,
          marketCap: 0,
          latestEarnings: earnData.latestEarnings,
          presentValue,
          totalValue: presentValue,
          gainLoss,
          weight: 0,
        });
      } catch (e) {
        console.error('Row build failed', e);
      }
    }

    const total = rows.reduce((s, r) => s + r.presentValue, 0) || 1;
    for (const r of rows) r.weight = (r.presentValue / total) * 100;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
