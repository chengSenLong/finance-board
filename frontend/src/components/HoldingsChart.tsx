import { useRef, useEffect } from "react";
import type { HoldingSlice } from "../data/mockData";

interface HoldingsChartProps {
  slices: HoldingSlice[];
}

export default function HoldingsChart({ slices }: HoldingsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 160;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 72;
    const innerR = 48;

    ctx.clearRect(0, 0, size, size);

    let startAngle = -Math.PI / 2;
    for (const slice of slices) {
      const sweep = (slice.percent / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += sweep;
    }

    // 中心数字
    ctx.fillStyle = "#f8fafc"; // slate-50
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(slices.length), cx, cy - 6);

    ctx.fillStyle = "#94a3b8"; // slate-400
    ctx.font = "11px sans-serif";
    ctx.fillText("标的", cx, cy + 12);
  }, [slices]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-300">持仓占比</h2>
      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} role="img" aria-label="持仓占比环形图" />
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1">
          {slices.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-slate-300">{s.name}</span>
              <span className="ml-auto text-slate-400">{s.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
