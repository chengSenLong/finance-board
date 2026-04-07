export interface IndicatorToggleProps {
  showEMA: boolean;
  showMACD: boolean;
  onToggleEMA: () => void;
  onToggleMACD: () => void;
}

export default function IndicatorToggle({ showEMA, showMACD, onToggleEMA, onToggleMACD }: IndicatorToggleProps) {
  const btnClass = (active: boolean) =>
    `rounded px-3 py-1 text-sm font-medium transition-colors ${
      active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
    }`;

  return (
    <div className="flex gap-1">
      <button onClick={onToggleEMA} className={btnClass(showEMA)}>EMA</button>
      <button onClick={onToggleMACD} className={btnClass(showMACD)}>MACD</button>
    </div>
  );
}
