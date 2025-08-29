"use client";

import { useState, useEffect } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import StockChart from "@/components/StockChart";
import PortfolioSummary from "@/components/PortfolioSummary";
import { StockData } from "@/types/stock";

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [dense, setDense] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
    const id = setInterval(fetchPortfolioData, 15000);
    return () => clearInterval(id);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/portfolio", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await response.json();
      setPortfolioData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchPortfolioData();
  };

  if (loading && portfolioData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-400">
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  if (error && portfolioData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-100 mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time insights into your investment portfolio
          </p>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by stock or sector..."
                className="w-64 max-w-full bg-[#0b1220] text-gray-100 placeholder:text-gray-500 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-emerald-600"
              />
              <button
                onClick={refreshData}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-md"
              >
                Refresh
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={dense}
                  onChange={(e) => setDense(e.target.checked)}
                />
                Compact rows
              </label>
            </div>
          </div>
        </div>

        <PortfolioSummary data={portfolioData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Portfolio Performance
            </h3>
            <StockChart data={portfolioData} />
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Sector Distribution
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart component will be implemented here
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Portfolio Holdings
          </h3>
          <PortfolioTable data={portfolioData} filter={filter} dense={dense} />
        </div>
      </div>
    </div>
  );
}
