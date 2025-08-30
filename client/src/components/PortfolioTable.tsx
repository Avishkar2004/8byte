"use client";

import { useMemo, useState } from "react";
import { StockData } from "@/types/stock";

interface PortfolioTableProps {
  data: StockData[];
  filter?: string;
  dense?: boolean;
}

type SortKey = keyof Pick<
  StockData,
  | "companyName"
  | "purchasePrice"
  | "shares"
  | "investment"
  | "weight"
  | "exchange"
  | "currentPrice"
  | "presentValue"
  | "gainLoss"
  | "peRatio"
  | "sector"
>;

type SortDirection = "asc" | "desc";

const headers: { key: SortKey | "latestEarnings"; label: string }[] = [
  { key: "companyName", label: "Particulars" },
  { key: "purchasePrice", label: "Purchase Price" },
  { key: "shares", label: "Qty" },
  { key: "investment", label: "Investment" },
  { key: "weight", label: "Portfolio (%)" },
  { key: "exchange", label: "NSE/BSE" },
  { key: "currentPrice", label: "CMP" },
  { key: "presentValue", label: "Present Value" },
  { key: "gainLoss", label: "Gain/Loss" },
  { key: "peRatio", label: "P/E Ratio" },
  { key: "latestEarnings", label: "Latest Earnings" },
];

const PortfolioTable: React.FC<PortfolioTableProps> = ({ data, filter = "", dense = false }) => {
  const [sortKey, setSortKey] = useState<SortKey>("presentValue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const q = filter.toLowerCase();
    return data.filter(
      (d) =>
        d.companyName.toLowerCase().includes(q) ||
        d.symbol.toLowerCase().includes(q) ||
        d.sector.toLowerCase().includes(q)
    );
  }, [data, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, StockData[]>();
    for (const row of filteredData) {
      const arr = map.get(row.sector) || [];
      arr.push(row);
      map.set(row.sector, arr);
    }
    return Array.from(map.entries()).map(([sector, rows]) => ({
      sector,
      rows,
    }));
  }, [filteredData]);

  const sortRows = (rows: StockData[]) => {
    const copied = [...rows];
    copied.sort((a, b) => {
      const aVal = a[sortKey] as unknown as number | string;
      const bVal = b[sortKey] as unknown as number | string;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copied;
  };

  const onHeaderClick = (key: SortKey | "latestEarnings") => {
    if (key === "latestEarnings") return; // not sortable
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (value: number, fraction = 2) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    }).format(value);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const rowPad = dense ? "py-2" : "py-3";

  return (
    <div className="overflow-x-auto">
      {grouped.map(({ sector, rows }) => {
        const isCollapsed = collapsed[sector] === true;
        const sectorInvestment = rows.reduce((s, r) => s + r.investment, 0);
        const sectorPresent = rows.reduce((s, r) => s + r.presentValue, 0);
        const sectorGain = sectorPresent - sectorInvestment;
        const isGain = sectorGain >= 0;
        const sorted = sortRows(rows);
        return (
          <div
            key={sector}
            className="mb-8 border border-white/5 rounded-xl"
          >
            <button
              onClick={() =>
                setCollapsed({ ...collapsed, [sector]: !isCollapsed })
              }
              className="w-full px-4 py-3 flex items-center justify-between bg-[#0e1628] relative z-[1]"
            >
              <div className="font-semibold text-gray-100 flex items-center gap-2">
                <span
                  className={`inline-block transition-transform ${
                    isCollapsed ? "rotate-[-90deg]" : ""
                  }`}
                >
                  ▶
                </span>
                <span>{sector}</span>
                <span className="badge">{rows.length} stocks</span>
              </div>
              <div className="text-xs text-gray-300 flex gap-4">
                <span>
                  Investment:{" "}
                  <strong className="text-gray-100">
                    {formatCurrency(sectorInvestment, 0)}
                  </strong>
                </span>
                <span>
                  Present:{" "}
                  <strong className="text-gray-100">
                    {formatCurrency(sectorPresent, 0)}
                  </strong>
                </span>
                <span className={isGain ? "text-emerald-500" : "text-red-500"}>
                  P/L: <strong>{formatCurrency(sectorGain, 0)}</strong>
                </span>
              </div>
            </button>
            {!isCollapsed && (
              <table className="min-w-[1200px] divide-y divide-white/5">
                <thead className="bg-[#0e1628]">
                  <tr>
                    {headers.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => onHeaderClick(key)}
                        className={`px-6 ${rowPad} text-left text-[11px] font-medium text-gray-200 uppercase tracking-wider cursor-pointer hover:text-white sticky top-0 z-[5] bg-[#0e1628]`}
                      >
                        <div className="flex items-center">
                          {label}
                          <span className="ml-2 text-gray-500">
                            {sortKey === key
                              ? sortDirection === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-[#0b1220] divide-y divide-white/5">
                  {sorted.map((row) => {
                    const isPositive = row.gainLoss >= 0;
                    const earnings = row.latestEarnings;
                    const earningsText = `${
                      earnings?.date
                        ? new Date(earnings.date).toLocaleDateString()
                        : "—"
                    }${
                      Number.isFinite(earnings?.eps)
                        ? ` · EPS ${earnings.eps}`
                        : ""
                    }`;
                    return (
                      <>
                        <tr key={row.symbol} className="hover:bg-white/5">
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-100`}
                          >
                            {row.companyName}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {formatCurrency(row.purchasePrice)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {row.shares.toLocaleString()}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap font-medium text-gray-100`}
                          >
                            {formatCurrency(row.investment, 0)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {formatPercent(row.weight)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {row.exchange}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap font-semibold text-gray-100`}
                          >
                            {formatCurrency(row.currentPrice)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap font-semibold text-gray-100`}
                          >
                            {formatCurrency(row.presentValue, 0)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap font-semibold ${
                              isPositive ? "text-emerald-500" : "text-red-500"
                            }`}
                          >
                            {formatCurrency(row.gainLoss, 0)}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {row.peRatio ? row.peRatio.toFixed(2) : "N/A"}
                          </td>
                          <td
                            className={`px-6 ${rowPad} whitespace-nowrap text-gray-300`}
                          >
                            {earningsText}
                          </td>
                        </tr>
                        <tr className="md:hidden">
                          <td
                            colSpan={headers.length}
                            className="px-6 pb-4 text-xs text-gray-400"
                          >
                            <div className="flex items-center gap-4">
                              <span>
                                P/E:{" "}
                                <span className="text-gray-200">
                                  {row.peRatio ? row.peRatio.toFixed(2) : "N/A"}
                                </span>
                              </span>
                              <span>
                                Latest:{" "}
                                <span className="text-gray-200">
                                  {earningsText}
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioTable;
