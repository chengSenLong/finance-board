import type { HoldingItem } from "../data/mockData";

interface HoldingsListProps {
  holdings: HoldingItem[];
}

export default function HoldingsList({ holdings }: HoldingsListProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-300">持仓列表</h2>
      <ul className="divide-y divide-slate-800">
        {holdings.map((item) => (
          <li key={item.symbol} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-50">{item.symbol}</span>
              <span className="text-xs text-slate-400">{item.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-50">
                {item.price.toLocaleString()}
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
          </li>
        ))}
      </ul>
    </div>
  );
}
