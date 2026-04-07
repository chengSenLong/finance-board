/**
 * 技术指标计算工具模块
 * 纯函数实现，不依赖后端，便于单元测试和属性测试
 */

/**
 * 计算 EMA（指数移动平均线）
 * @param closes 收盘价序列
 * @param period EMA 周期（如 12、26）
 * @returns EMA 值序列，长度与 closes 相同
 */
export function calculateEMA(closes: number[], period: number): number[] {
  if (closes.length === 0) return [];

  const k = 2 / (period + 1);
  const ema: number[] = [closes[0]];

  for (let i = 1; i < closes.length; i++) {
    ema.push(closes[i] * k + ema[i - 1] * (1 - k));
  }

  return ema;
}

/**
 * 计算 MACD 指标
 * @param closes 收盘价序列
 * @param fastPeriod 快线周期，默认 12
 * @param slowPeriod 慢线周期，默认 26
 * @param signalPeriod 信号线周期，默认 9
 * @returns { dif, dea, histogram }
 */
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): { dif: number[]; dea: number[]; histogram: number[] } {
  const emaFast = calculateEMA(closes, fastPeriod);
  const emaSlow = calculateEMA(closes, slowPeriod);

  const dif = emaFast.map((v, i) => v - emaSlow[i]);
  const dea = calculateEMA(dif, signalPeriod);
  const histogram = dif.map((v, i) => v - dea[i]);

  return { dif, dea, histogram };
}
