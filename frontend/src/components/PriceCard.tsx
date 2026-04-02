import { Link } from "react-router-dom";
import type { PriceCardData } from "../data/mockData";
import MiniChart from "./MiniChart";

export interface PriceCardProps {
  data: PriceCardData;
}

export default function PriceCard({ data }: PriceCardProps) {
  const positive = data.changePercent >= 0;

  return (
    <Link
      to={`/symbol/${data.symbol}`}
      className="block rounded-lg border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-50">{data.symbol}</span>
          <span className="text-xs text-slate-400">{data.name}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-50">
            {data.price.toLocaleString()}
          </span>
          <span
            className={`text-xs font-medium ${
              positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {positive ? "+" : ""}
            {data.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      <MiniChart data={data.chartData} positive={positive} />
    </Link>
  );
}
