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

/** K 线数据（OHLCV） */
export interface CandleData {
  time: string;    // "2024-01-15" 格式
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 标的 K 线数据集（按周期） */
export interface SymbolKlineMap {
  '1D': CandleData[];
  '1W': CandleData[];
  '1M': CandleData[];
}

/** 所有标的的 K 线数据索引 */
export type SymbolKlineData = Record<string, SymbolKlineMap>;

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

// ─── Markets 页面数据 ─────────────────────────────────────

/** 市场行情项 */
export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: "crypto" | "stock";
}

/** 全市场行情列表 */
export const marketItems: MarketItem[] = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 67234.50, changePercent: 2.15, change24h: 1415.32, volume24h: 28_500_000_000, marketCap: 1_320_000_000_000, category: "crypto" },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3456.78, changePercent: 1.87, change24h: 63.45, volume24h: 15_200_000_000, marketCap: 415_000_000_000, category: "crypto" },
  { symbol: "BNBUSDT", name: "BNB", price: 584.32, changePercent: -0.65, change24h: -3.82, volume24h: 1_800_000_000, marketCap: 87_000_000_000, category: "crypto" },
  { symbol: "SOLUSDT", name: "Solana", price: 142.56, changePercent: 4.23, change24h: 5.78, volume24h: 3_200_000_000, marketCap: 62_000_000_000, category: "crypto" },
  { symbol: "XRPUSDT", name: "XRP", price: 0.5234, changePercent: -1.12, change24h: -0.0059, volume24h: 1_500_000_000, marketCap: 28_000_000_000, category: "crypto" },
  { symbol: "ADAUSDT", name: "Cardano", price: 0.4521, changePercent: 0.89, change24h: 0.004, volume24h: 620_000_000, marketCap: 16_000_000_000, category: "crypto" },
  { symbol: "DOGEUSDT", name: "Dogecoin", price: 0.1234, changePercent: -2.34, change24h: -0.003, volume24h: 890_000_000, marketCap: 17_500_000_000, category: "crypto" },
  { symbol: "AAPL", name: "Apple", price: 189.45, changePercent: -0.32, change24h: -0.61, volume24h: 54_000_000, marketCap: 2_950_000_000_000, category: "stock" },
  { symbol: "TSLA", name: "Tesla", price: 245.67, changePercent: 3.45, change24h: 8.19, volume24h: 112_000_000, marketCap: 780_000_000_000, category: "stock" },
  { symbol: "NVDA", name: "NVIDIA", price: 875.30, changePercent: 1.56, change24h: 13.45, volume24h: 45_000_000, marketCap: 2_150_000_000_000, category: "stock" },
  { symbol: "MSFT", name: "Microsoft", price: 415.20, changePercent: 0.42, change24h: 1.74, volume24h: 22_000_000, marketCap: 3_080_000_000_000, category: "stock" },
  { symbol: "GOOGL", name: "Alphabet", price: 174.85, changePercent: -0.78, change24h: -1.38, volume24h: 25_000_000, marketCap: 2_160_000_000_000, category: "stock" },
  { symbol: "AMZN", name: "Amazon", price: 186.50, changePercent: 1.23, change24h: 2.27, volume24h: 38_000_000, marketCap: 1_940_000_000_000, category: "stock" },
  { symbol: "META", name: "Meta", price: 502.30, changePercent: -1.45, change24h: -7.39, volume24h: 18_000_000, marketCap: 1_280_000_000_000, category: "stock" },
];

// ─── K 线 Mock 数据 ───────────────────────────────────────

/** 生成 OHLCV K 线数据 */
function generateCandleData(
  startDate: string,
  basePrice: number,
  points: number,
  volatility: number,
  intervalDays: number,
): CandleData[] {
  const data: CandleData[] = [];
  let prevClose = basePrice;
  const start = new Date(startDate);
  const baseVolume = basePrice * 1000;

  for (let i = 0; i < points; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i * intervalDays);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const open = prevClose;
    const close = open * (1 + (Math.random() - 0.48) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const volume = Math.round(baseVolume * (0.5 + Math.random()));

    data.push({
      time: `${yyyy}-${mm}-${dd}`,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });

    prevClose = close;
    if (prevClose < basePrice * 0.3) prevClose = basePrice * 0.3;
  }

  return data;
}

/** 为单个标的生成三个周期的 K 线数据 */
function generateSymbolKline(basePrice: number, volatility: number): SymbolKlineMap {
  return {
    '1D': generateCandleData('2024-05-01', basePrice, 60, volatility, 1),
    '1W': generateCandleData('2023-06-01', basePrice, 52, volatility * 1.5, 7),
    '1M': generateCandleData('2021-07-01', basePrice, 36, volatility * 2.5, 30),
  };
}

/** 所有标的的 K 线 mock 数据 */
export const symbolKlineData: SymbolKlineData = {
  BTCUSDT: generateSymbolKline(64000, 0.03),
  ETHUSDT: generateSymbolKline(3200, 0.035),
  AAPL: generateSymbolKline(185, 0.015),
  TSLA: generateSymbolKline(230, 0.04),
  NVDA: generateSymbolKline(850, 0.025),
};
