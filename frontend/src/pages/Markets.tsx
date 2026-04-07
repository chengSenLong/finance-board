import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { marketItems, type MarketItem } from "@/data/mockData";

type SortField = "symbol" | "price" | "changePercent" | "volume24h" | "marketCap";
type SortDir = "asc" | "desc";
type CategoryFilter = "all" | "crypto" | "stock";

/** 格式化大数字（成交量、市值） */
function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

/** 格式化价格 */
function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(4)}`;
}

export default function Markets() {
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedItems = useMemo(() => {
    let items = [...marketItems];

    // 分类筛选
    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    // 搜索过滤
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.symbol.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q)
      );
    }

    // 排序
    items.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return items;
  }, [sortField, sortDir, category, search]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-slate-600 ml-1">↕</span>;
    return <span className="text-blue-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const thClass = "px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors select-none";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 + 筛选栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-50">市场全景</h1>
        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索标的..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors w-48"
          />
          {/* 分类切换 */}
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            {(["all", "crypto", "stock"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  category === cat
                    ? "bg-slate-700 text-blue-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat === "all" ? "全部" : cat === "crypto" ? "加密货币" : "股票"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 行情表格 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className={`${thClass} w-12`}>#</th>
                <th className={thClass} onClick={() => handleSort("symbol")}>
                  <span className="flex items-center">标的<SortIcon field="symbol" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort("price")}>
                  <span className="flex items-center justify-end">价格<SortIcon field="price" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort("changePercent")}>
                  <span className="flex items-center justify-end">24h 涨跌<SortIcon field="changePercent" /></span>
                </th>
                <th className={`${thClass} hidden md:table-cell`} onClick={() => handleSort("volume24h")}>
                  <span className="flex items-center justify-end">24h 成交量<SortIcon field="volume24h" /></span>
                </th>
                <th className={`${thClass} hidden lg:table-cell`} onClick={() => handleSort("marketCap")}>
                  <span className="flex items-center justify-end">市值<SortIcon field="marketCap" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedItems.map((item, index) => (
                <MarketRow key={item.symbol} item={item} rank={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
        {sortedItems.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            没有找到匹配的标的
          </div>
        )}
      </div>
    </div>
  );
}

function MarketRow({ item, rank }: { item: MarketItem; rank: number }) {
  const isPositive = item.changePercent >= 0;
  const changeColor = isPositive ? "text-emerald-400" : "text-red-400";

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-4 text-sm text-slate-500">{rank}</td>
      <td className="px-4 py-4">
        <Link to={`/symbol/${item.symbol}`} className="flex items-center gap-3 group">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-xs font-bold text-slate-300 shrink-0">
            {item.symbol.slice(0, 2)}
          </span>
          <div>
            <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
              {item.symbol}
            </div>
            <div className="text-xs text-slate-500">{item.name}</div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-4 text-right text-sm font-mono text-slate-200">
        {formatPrice(item.price)}
      </td>
      <td className={`px-4 py-4 text-right text-sm font-medium ${changeColor}`}>
        {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
      </td>
      <td className="px-4 py-4 text-right text-sm text-slate-400 hidden md:table-cell">
        {formatLargeNumber(item.volume24h)}
      </td>
      <td className="px-4 py-4 text-right text-sm text-slate-400 hidden lg:table-cell">
        {formatLargeNumber(item.marketCap)}
      </td>
    </tr>
  );
}
