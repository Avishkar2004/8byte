export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  peRatio: number;
  marketCap: number;
  volume: number;
  sector: string;
  latestEarnings: {
    date: string;
    eps: number;
    revenue: number;
  };
  // Portfolio-specific fields
  purchasePrice: number; // Purchase Price
  shares: number; // Quantity
  exchange: string; // NSE/BSE
  // Computed fields
  investment: number; // purchasePrice * shares
  totalValue: number; // alias: presentValue
  presentValue: number; // currentPrice * shares
  gainLoss: number; // presentValue - investment
  weight: number; // portfolio percentage
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  totalGainLoss: number;
  numberOfStocks: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
