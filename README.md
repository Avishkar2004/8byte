# 📊 Portfolio Dashboard

A dynamic, real-time portfolio management dashboard built with Next.js and Node.js that displays live stock data..

## 🚀 Features

### 📈 Portfolio Management
- **Real-time Stock Data**: Live CMP (Current Market Price) from Yahoo Finance
- **Financial Metrics**: P/E Ratio and Latest Earnings from Google Finance
- **Dynamic Updates**: Auto-refresh every 15 seconds for live data
- **Sector Grouping**: Stocks organized by sectors with summary totals
- **Gain/Loss Tracking**: Color-coded profit/loss indicators

### 🎨 User Interface
- **Professional Design**: Dark theme inspired by Angel One
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Interactive Table**: Sortable columns, collapsible sectors
- **Visual Charts**: Portfolio performance visualization
- **Search & Filter**: Find stocks quickly

### ⚡ Technical Features
- **Full-Stack Architecture**: Next.js frontend + Express.js backend
- **Real-time Updates**: Live data fetching with caching
- **Error Handling**: Graceful handling of API failures
- **Performance Optimized**: Caching, rate limiting, request staggering
- **TypeScript**: Full type safety across the application

## 🏗️ Project Structure

```
8byte/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js 14 App Router
│   │   ├── components/    # React Components
│   │   └── types/         # TypeScript Definitions
│   ├── package.json
│   └── README.md
├── backend/               # Express.js Backend
│   ├── server.js         # Main server file
│   ├── package.json
│   └── README.md
├── .gitignore            # Root gitignore
└── README.md            # This file
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Hooks** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Cheerio** - HTML parsing (for scraping)
- **Node-cache** - In-memory caching
- **Express-rate-limit** - Rate limiting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Avishkar2004/8byte
cd 8byte
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment
Create `backend/.env`:
```env
PORT=4000
NODE_ENV=development
```

#### Frontend Environment
Create `client/.env.local`:
```env
BACKEND_URL=http://localhost:4000
```

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on: http://localhost:4000

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on: http://localhost:3000

## 📊 Portfolio Data Structure

The dashboard displays the following columns:

| Column | Description | Source |
|--------|-------------|---------|
| **Particulars** | Stock Name | Static data |
| **Purchase Price** | Buy price per share | Static data |
| **Quantity** | Number of shares | Static data |
| **Investment** | Purchase Price × Quantity | Calculated |
| **Portfolio (%)** | Weight in portfolio | Calculated |
| **NSE/BSE** | Stock exchange code | Static data |
| **CMP** | Current Market Price | Yahoo Finance API |
| **Present Value** | CMP × Quantity | Calculated |
| **Gain/Loss** | Present Value - Investment | Calculated |
| **P/E Ratio** | Price-to-Earnings ratio | Google Finance API |
| **Latest Earnings** | Recent earnings data | Google Finance API |

## 🔧 API Endpoints

### Backend APIs
- `GET /health` - Health check
- `GET /api/cmp/:symbol` - Get current market price
- `GET /api/pe/:symbol` - Get P/E ratio
- `GET /api/earnings/:symbol` - Get latest earnings

### Frontend APIs
- `GET /api/portfolio` - Get complete portfolio data

## 🎯 Key Features Explained

### Real-time Updates
- CMP, Present Value, and Gain/Loss update every 15 seconds
- Uses `setInterval` for periodic data refresh
- Implements request staggering to avoid rate limits

### Sector Grouping
- Stocks are grouped by secto
- Each sector shows:
  - Total Investment
  - Total Present Value
  - Total Gain/Loss
- Collapsible sections for better organization

### Error Handling
- Graceful handling of API failures
- Retry logic with exponential backoff
- Fallback values for missing data
- User-friendly error messages

### Performance Optimization
- In-memory caching (15-second TTL)
- Rate limiting (300 requests/minute)
- Request staggering (100ms delay between requests)
- React memoization for component optimization

## 🎨 UI/UX Features

### Dark Theme
- Professional dark color scheme
- High contrast for readability
- Accent colors for gains/losses

### Responsive Design
- Mobile-first approach
- Horizontal scrolling for tables
- Adaptive layouts for different screen sizes

### Interactive Elements
- Sortable table columns
- Collapsible sector sections
- Search functionality
- Density toggle for table rows

## 🔍 Troubleshooting

### Common Issues

#### 1. Module Parse Failed (favicon.ico)
```bash
# Solution: Clear Next.js cache
cd client
rm -rf .next
npm run dev
```

#### 2. Backend Connection Failed
- Ensure backend is running on port 4000
- Check `BACKEND_URL` in `client/.env.local`
- Verify no firewall blocking the connection

#### 3. API Rate Limits
- The app implements automatic retry logic
- If persistent, increase rate limits in backend configuration

#### 4. Table Columns Not Visible
- Hard refresh the page (Ctrl+F5)
- Check browser console for errors
- Ensure all CSS is loaded properly

### Development Commands

#### Backend
```bash
cd backend
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

#### Frontend
```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=4000                    # Server port
NODE_ENV=development         # Environment mode
CACHE_TTL=15000             # Cache TTL in milliseconds
RATE_LIMIT_WINDOW=60000     # Rate limit window
RATE_LIMIT_MAX=300          # Max requests per window
```

### Frontend (.env.local)
```env
BACKEND_URL=http://localhost:4000  # Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000  # Public API URL
```

## 🙏 Acknowledgments

- **Yahoo Finance** - For stock price data
- **Google Finance** - For financial metrics
- **Angel One** - UI/UX inspiration
- **Next.js Team** - Amazing React framework
- **Express.js Team** - Robust backend framework
