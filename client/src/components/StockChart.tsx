'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData } from '@/types/stock';

interface StockChartProps {
  data: StockData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    return data
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10)
      .map(stock => ({
        name: stock.symbol,
        value: stock.totalValue,
        change: stock.change * stock.shares,
        changePercent: stock.changePercent,
      }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#0e1628] text-gray-100 p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-gray-300">Value: ₹{d.value.toLocaleString()}</p>
          <p className={`${d.change >= 0 ? 'text-emerald-500' : 'text-red-500'} font-semibold`}>
            Change: {d.change >= 0 ? '+' : ''}₹{d.change.toFixed(2)} ({d.changePercent.toFixed(2)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aa4b2' }} angle={-20} height={40} />
          <YAxis tick={{ fontSize: 11, fill: '#9aa4b2' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} name="Total Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
