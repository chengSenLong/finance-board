export type Period = '1D' | '1W' | '1M';

export interface PeriodSwitcherProps {
  current: Period;
  onChange: (period: Period) => void;
}

const periods: Period[] = ['1D', '1W', '1M'];

export default function PeriodSwitcher({ current, onChange }: PeriodSwitcherProps) {
  return (
    <div className="flex gap-1">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            p === current
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
