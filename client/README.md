# 📈 Portfolio Dashboard

A modern, real-time portfolio dashboard built with Next.js, TypeScript, and Tailwind CSS. This application displays portfolio information with live data from financial APIs.

## 🚀 Features

- **Real-time Stock Data**: Fetches current market prices from Yahoo Finance
- **Financial Metrics**: Displays P/E ratios and earnings data from Google Finance
- **Interactive Charts**: Visual portfolio performance using Recharts
- **Sortable Tables**: Portfolio holdings with react-table
- **Responsive Design**: Modern UI with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (React framework)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Charts**: Recharts
- **Tables**: react-table
- **Data Fetching**: Axios
- **APIs**: Yahoo Finance & Google Finance (simulated)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 API Integration

### Current Implementation
The application currently uses mock data to simulate API responses. To integrate real financial APIs:

### Yahoo Finance Integration
For real-time stock prices, you can use:

1. **yahoo-finance2** library:
```bash
npm install yahoo-finance2
```

2. Update the `fetchYahooFinanceData` function in `src/app/api/portfolio/route.ts`:
```typescript
import yahooFinance from 'yahoo-finance2';

async function fetchYahooFinanceData(symbol: string) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      currentPrice: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
    };
  } catch (error) {
    console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
    throw error;
  }
}
```

### Google Finance Integration
For P/E ratios and earnings data, you can:

1. **Web Scraping**: Use libraries like `puppeteer` or `cheerio`
2. **Alternative APIs**: Consider using Alpha Vantage, IEX Cloud, or Polygon.io

Example with web scraping:
```typescript
import puppeteer from 'puppeteer';

async function fetchGoogleFinanceData(symbol: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://www.google.com/finance/quote/${symbol}:NASDAQ`);
    
    const peRatio = await page.$eval('[data-field="peRatio"]', el => el.textContent);
    const sector = await page.$eval('[data-field="sector"]', el => el.textContent);
    
    return { peRatio: parseFloat(peRatio), sector };
  } finally {
    await browser.close();
  }
}
```

## 📊 Data Structure

The application uses the following TypeScript interfaces:

```typescript
interface StockData {
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
  shares: number;
  totalValue: number;
  weight: number;
}
```

## 🎨 Components

- **PortfolioTable**: Sortable table displaying stock holdings
- **PortfolioSummary**: Key portfolio metrics and summary cards
- **StockChart**: Interactive charts using Recharts
- **Main Dashboard**: Main page with all components

## 🔄 API Routes

- `GET /api/portfolio`: Fetches portfolio data from financial APIs

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Environment Variables

Create a `.env.local` file for API keys (when using real APIs):

```env
YAHOO_FINANCE_API_KEY=your_api_key_here
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

## 📝 Notes

- **Yahoo Finance**: No official public API available. Use unofficial libraries or web scraping.
- **Google Finance**: No official API. Requires web scraping or alternative data sources.
- **Rate Limiting**: Implement proper rate limiting when using real APIs.
- **Error Handling**: The application includes comprehensive error handling for API failures.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.
