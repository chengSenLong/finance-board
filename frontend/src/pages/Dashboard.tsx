import { marketIndices, holdingItems, holdingSlices, priceCards } from "../data/mockData";
import MarketTickerBar from "../components/MarketTickerBar";
import HoldingsList from "../components/HoldingsList";
import HoldingsChart from "../components/HoldingsChart";
import PriceCard from "../components/PriceCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 space-y-6 p-4 md:p-6">
      {/* 市场概览指标条 */}
      <MarketTickerBar indices={marketIndices} />

      {/* 持仓列表 + 持仓占比图 并排 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HoldingsList holdings={holdingItems} />
        <HoldingsChart slices={holdingSlices} />
      </div>

      {/* 核心关注标的价格卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {priceCards.map((card) => (
          <PriceCard key={card.symbol} data={card} />
        ))}
      </div>
    </div>
  );
}
