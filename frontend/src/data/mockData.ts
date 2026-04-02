// Mock 数据模块 — Dashboard 概览看板静态 UI
// 集中管理所有 mock 数据，便于后续替换为真实 API 数据源

// ─── 类型定义 ───────────────────────────────────────────

/** 市场指数 */
export interface MarketIndex {
  name: string;
  value: number;
  changePercent: number;
}

/** 持仓项 */
export interface HoldingItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

/** 持仓占比 */
export interface HoldingSlice {
  name: string;
  percent: number;
  color: string;
}

/** 价格数据点 */
export interface PricePoint {
  time: string;
  value: number;
}

/** 价格卡片数据 */
export interface PriceCardData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  chartData: PricePoint[];
}

// ─── Mock 数据 ──────────────────────────────────────────

/** 市场指数（≥4 项） */
export const marketIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5432.1, changePercent: 0.85 },
  { name: "纳斯达克", value: 17123.45, changePercent: 1.23 },
  { name: "BTC 主导率", value: 54.3, changePercent: -0.42 },
  { name: "恐惧贪婪指数", value: 72, changePercent: 3.0 },
];

/** 持仓列表（≥5 项） */
export const holdingItems: HoldingItem[] = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 67234.5, changePercent: 2.15 },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3456.78, changePercent: 1.87 },
  { symbol: "AAPL", name: "Apple", price: 189.45, changePercent: -0.32 },
  { symbol: "TSLA", name: "Tesla", price: 245.67, changePercent: 3.45 },
  { symbol: "NVDA", name: "NVIDIA", price: 875.3, changePercent: 1.56 },
];

/** 持仓占比（≥4 项） */
export const holdingSlices: HoldingSlice[] = [
  { name: "BTC", percent: 40, color: "#f59e0b" },
  { name: "ETH", percent: 25, color: "#6366f1" },
  { name: "AAPL", percent: 20, color: "#10b981" },
  { name: "其他", percent: 15, color: "#64748b" },
];

/** 生成连续日期的价格序列 */
function generateChartData(
  startDate: string,
  basePrice: number,
  points: number,
  volatility: number,
): PricePoint[] {
  const data: PricePoint[] = [];
  let price = basePrice;
  const start = new Date(startDate);

  for (let i = 0; i < points; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    data.push({ time: `${yyyy}-${mm}-${dd}`, value: Math.round(price * 100) / 100 });
    price += price * (Math.random() - 0.48) * volatility;
    if (price < basePrice * 0.5) price = basePrice * 0.5;
  }

  return data;
}

/** 价格卡片数据（≥4 张，每张 chartData ≥20 个数据点） */
export const priceCards: PriceCardData[] = [
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    price: 67234.5,
    changePercent: 2.15,
    chartData: generateChartData("2024-06-01", 64000, 30, 0.02),
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    price: 3456.78,
    changePercent: 1.87,
    chartData: generateChartData("2024-06-01", 3200, 30, 0.025),
  },
  {
    symbol: "AAPL",
    name: "Apple",
    price: 189.45,
    changePercent: -0.32,
    chartData: generateChartData("2024-06-01", 192, 30, 0.015),
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: 245.67,
    changePercent: 3.45,
    chartData: generateChartData("2024-06-01", 230, 30, 0.035),
  },
];
