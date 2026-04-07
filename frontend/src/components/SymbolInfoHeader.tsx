export interface SymbolInfoHeaderProps {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export default function SymbolInfoHeader({ symbol, name, price, changePercent }: SymbolInfoHeaderProps) {
  const positive = changePercent >= 0;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">{symbol}</h1>
        <span className="text-slate-400">{name}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-3xl font-bold text-slate-50">
          {price.toLocaleString()}
        </span>
        <span className={positive ? "text-emerald-400" : "text-red-400"}>
          {positive ? "+" : ""}{changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
