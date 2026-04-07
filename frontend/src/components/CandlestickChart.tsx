import { useRef, useEffect } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import type { CandleData } from "../data/mockData";
import { calculateEMA, calculateMACD } from "../utils/indicators";

export interface CandlestickChartProps {
  data: CandleData[];
  showEMA: boolean;
  showMACD: boolean;
}

export default function CandlestickChart({ data, showEMA, showMACD }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const ema12SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema26SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdDifSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdDeaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // Create chart instance once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#334155" },
      timeScale: {
        borderColor: "#334155",
        timeVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Volume histogram series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // ResizeObserver for responsive sizing
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          try {
            chart.applyOptions({ width, height });
          } catch {
            // ignore resize errors during teardown
          }
        }
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      ema12SeriesRef.current = null;
      ema26SeriesRef.current = null;
      macdDifSeriesRef.current = null;
      macdDeaSeriesRef.current = null;
      macdHistSeriesRef.current = null;
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || data.length === 0) return;

    candleSeriesRef.current.setData(
      data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })),
    );

    volumeSeriesRef.current.setData(
      data.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? "rgba(38,166,154,0.5)" : "rgba(239,83,80,0.5)",
      })),
    );

    chartRef.current?.timeScale().fitContent();
  }, [data]);

  // EMA overlay: dynamically add/remove EMA12 and EMA26 LineSeries
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (showEMA && data.length > 0) {
      const closes = data.map((d) => d.close);
      const ema12Values = calculateEMA(closes, 12);
      const ema26Values = calculateEMA(closes, 26);

      const ema12Data = data.map((d, i) => ({ time: d.time, value: ema12Values[i] }));
      const ema26Data = data.map((d, i) => ({ time: d.time, value: ema26Values[i] }));

      // Create series if they don't exist yet
      if (!ema12SeriesRef.current) {
        ema12SeriesRef.current = chart.addSeries(LineSeries, {
          color: "#2962FF",
          lineWidth: 1,
          priceScaleId: "right",
        });
      }
      if (!ema26SeriesRef.current) {
        ema26SeriesRef.current = chart.addSeries(LineSeries, {
          color: "#FF6D00",
          lineWidth: 1,
          priceScaleId: "right",
        });
      }

      ema12SeriesRef.current.setData(ema12Data);
      ema26SeriesRef.current.setData(ema26Data);
    } else {
      // Remove EMA series when toggled off
      if (ema12SeriesRef.current) {
        chart.removeSeries(ema12SeriesRef.current);
        ema12SeriesRef.current = null;
      }
      if (ema26SeriesRef.current) {
        chart.removeSeries(ema26SeriesRef.current);
        ema26SeriesRef.current = null;
      }
    }
  }, [showEMA, data]);

  // MACD panel: dynamically add/remove DIF line, DEA line, and MACD histogram
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (showMACD && data.length > 0) {
      const closes = data.map((d) => d.close);
      const { dif, dea, histogram } = calculateMACD(closes);

      const difData = data.map((d, i) => ({ time: d.time, value: dif[i] }));
      const deaData = data.map((d, i) => ({ time: d.time, value: dea[i] }));
      const histData = data.map((d, i) => ({
        time: d.time,
        value: histogram[i],
        color: histogram[i] >= 0 ? "#26a69a" : "#ef5350",
      }));

      // Create series if they don't exist yet
      if (!macdDifSeriesRef.current) {
        macdDifSeriesRef.current = chart.addSeries(LineSeries, {
          color: "#2962FF",
          lineWidth: 1,
          priceScaleId: "macd",
        });
        macdDifSeriesRef.current.priceScale().applyOptions({
          scaleMargins: { top: 0.7, bottom: 0 },
        });
      }
      if (!macdDeaSeriesRef.current) {
        macdDeaSeriesRef.current = chart.addSeries(LineSeries, {
          color: "#FF6D00",
          lineWidth: 1,
          priceScaleId: "macd",
        });
      }
      if (!macdHistSeriesRef.current) {
        macdHistSeriesRef.current = chart.addSeries(HistogramSeries, {
          priceScaleId: "macd",
        });
      }

      macdDifSeriesRef.current.setData(difData);
      macdDeaSeriesRef.current.setData(deaData);
      macdHistSeriesRef.current.setData(histData);
    } else {
      // Remove MACD series when toggled off
      if (macdDifSeriesRef.current) {
        chart.removeSeries(macdDifSeriesRef.current);
        macdDifSeriesRef.current = null;
      }
      if (macdDeaSeriesRef.current) {
        chart.removeSeries(macdDeaSeriesRef.current);
        macdDeaSeriesRef.current = null;
      }
      if (macdHistSeriesRef.current) {
        chart.removeSeries(macdHistSeriesRef.current);
        macdHistSeriesRef.current = null;
      }
    }
  }, [showMACD, data]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: 500 }}
    />
  );
}
