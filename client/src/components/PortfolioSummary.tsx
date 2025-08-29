'use client';

import { useMemo } from 'react';
import { StockData, PortfolioSummary as PortfolioSummaryType } from '@/types/stock';

interface PortfolioSummaryProps {
  data: StockData[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ data }) => {
  const summary = useMemo<PortfolioSummaryType>(() => {
    if (data.length === 0) {
      return {
        totalValue: 0,
        totalChange: 0,
        totalChangePercent: 0,
        totalGainLoss: 0,
        numberOfStocks: 0,
      };
    }

    const totalValue = data.reduce((sum, stock) => sum + stock.presentValue, 0);
    const totalChange = data.reduce((sum, stock) => sum + (stock.change * stock.shares), 0);
    const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
    const totalGainLoss = data.reduce((s, x) => s + x.gainLoss, 0);

    return {
      totalValue,
      totalChange,
      totalChangePercent,
      totalGainLoss,
      numberOfStocks: data.length,
    };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const gainClass = summary.totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card p-6">
        <p className="text-xs font-medium text-gray-400">Total Value</p>
        <p className="text-2xl font-semibold text-gray-100 mt-1">{formatCurrency(summary.totalValue)}</p>
      </div>

      <div className="card p-6">
        <p className="text-xs font-medium text-gray-400">Today's Change</p>
        <p className={`text-2xl font-semibold mt-1 ${summary.totalChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(summary.totalChange)}</p>
        <p className={`text-xs mt-1 ${summary.totalChangePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatPercentage(summary.totalChangePercent)}</p>
      </div>

      <div className="card p-6">
        <p className="text-xs font-medium text-gray-400">Total Gain/Loss</p>
        <p className={`text-2xl font-semibold mt-1 ${gainClass}`}>{formatCurrency(summary.totalGainLoss)}</p>
      </div>

      <div className="card p-6">
        <p className="text-xs font-medium text-gray-400">Stocks</p>
        <p className="text-2xl font-semibold text-gray-100 mt-1">{summary.numberOfStocks}</p>
      </div>
    </div>
  );
};

export default PortfolioSummary;
