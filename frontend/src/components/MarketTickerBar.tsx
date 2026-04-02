import type { MarketIndex } from "../data/mockData";

interface MarketTickerBarProps {
  indices: MarketIndex[];
}

export default function MarketTickerBar({ indices }: MarketTickerBarProps) {
  return (
    <div className="flex flex-wrap gap-4 rounded-lg bg-slate-900/50 px-4 py-3">
      {indices.map((item) => (
        <div key={item.name} className="flex flex-1 min-w-[140px] items-center justify-between gap-2 whitespace-nowrap">
          <span className="text-sm text-slate-400">{item.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-50">
              {item.value.toLocaleString()}
            </span>
            <span
              className={`text-xs font-medium ${
                item.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.changePercent >= 0 ? "+" : ""}
              {item.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
