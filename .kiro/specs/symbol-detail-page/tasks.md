# 实现计划：标的详情页（Symbol Detail Page）静态 UI

## 概述

基于需求和设计文档，将标的详情页拆分为增量式编码任务。从底层工具函数和 mock 数据开始，逐步构建 UI 组件，最终在 Symbol.tsx 页面中组装集成。所有代码使用 TypeScript + React 19 + Tailwind CSS v4 + Lightweight Charts v5。

## 任务列表

- [x] 1. 实现技术指标计算工具模块
  - [x] 1.1 创建 `frontend/src/utils/indicators.ts`，实现 `calculateEMA` 函数
    - 接收收盘价数组 `closes: number[]` 和周期 `period: number`
    - 使用 EMA 公式：乘数 `k = 2 / (period + 1)`，`EMA[0] = closes[0]`，`EMA[i] = closes[i] * k + EMA[i-1] * (1 - k)`
    - 输出长度与输入相同
    - _需求: 6.3_

  - [x] 1.2 在 `indicators.ts` 中实现 `calculateMACD` 函数
    - 接收收盘价数组，可选参数 fastPeriod=12, slowPeriod=26, signalPeriod=9
    - 返回 `{ dif: number[], dea: number[], histogram: number[] }`
    - DIF = EMA(closes, fast) - EMA(closes, slow)；DEA = EMA(DIF, signal)；histogram = DIF - DEA
    - _需求: 7.3, 7.4_

  - [ ]* 1.3 编写 `calculateEMA` 属性测试
    - **Property 3: EMA 计算正确性**
    - **验证: 需求 6.3**

  - [ ]* 1.4 编写 `calculateMACD` 属性测试
    - **Property 4: MACD 柱状图不变量**
    - **验证: 需求 7.4**

- [x] 2. 扩展 Mock 数据
  - [x] 2.1 在 `frontend/src/data/mockData.ts` 中新增 `CandleData`、`SymbolKlineMap`、`SymbolKlineData` 类型定义
    - CandleData 包含 time, open, high, low, close, volume 字段
    - SymbolKlineMap 包含 '1D', '1W', '1M' 三个周期
    - _需求: 9.1, 9.2, 9.6_

  - [x] 2.2 实现 `generateCandleData` 函数并导出 `symbolKlineData`
    - 为 BTCUSDT、ETHUSDT、AAPL、TSLA、NVDA 生成三个周期各 ≥30 根 K 线数据
    - 确保 high ≥ max(open, close)，low ≤ min(open, close)，volume > 0
    - _需求: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 2.3 编写 Mock 数据 OHLCV 结构完整性属性测试
    - **Property 5: Mock 数据 OHLCV 结构完整性**
    - **验证: 需求 9.1, 9.2**

- [ ] 3. 检查点 - 确保工具函数和 Mock 数据正确
  - 确保所有测试通过，如有疑问请询问用户。

- [x] 4. 实现 UI 子组件
  - [x] 4.1 创建 `frontend/src/components/SymbolInfoHeader.tsx`
    - 接收 props: symbol, name, price, changePercent
    - 展示标的代码（text-2xl font-bold）、名称（text-slate-400）、价格（text-3xl font-bold）、涨跌幅
    - 涨跌幅正值 text-emerald-400 带 "+" 前缀，负值 text-red-400
    - 深色主题样式
    - _需求: 1.2, 1.3, 1.4, 1.6_

  - [ ]* 4.2 编写 SymbolInfoHeader 属性测试
    - **Property 1: SymbolInfoHeader 渲染所有必需字段**
    - **验证: 需求 1.2**

  - [ ]* 4.3 编写涨跌幅颜色映射属性测试
    - **Property 2: 涨跌幅颜色映射**
    - **验证: 需求 1.3, 1.4**

  - [x] 4.4 创建 `frontend/src/components/PeriodSwitcher.tsx`
    - 接收 props: current (Period), onChange
    - 渲染 1D / 1W / 1M 三个按钮，选中态 bg-blue-600 text-white，未选中态 bg-slate-800 text-slate-400
    - _需求: 4.1, 4.2, 4.4, 4.5_

  - [x] 4.5 创建 `frontend/src/components/IndicatorToggle.tsx`
    - 接收 props: showEMA, showMACD, onToggleEMA, onToggleMACD
    - 渲染 EMA / MACD 两个独立开关按钮，开启态 bg-blue-600，关闭态 bg-slate-800
    - _需求: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 4.6 编写指标开关幂等性属性测试
    - **Property 7: 指标开关幂等性**
    - **验证: 需求 8.3**

- [x] 5. 实现 K 线图核心组件
  - [x] 5.1 创建 `frontend/src/components/CandlestickChart.tsx`
    - 接收 props: data (CandleData[]), showEMA (boolean), showMACD (boolean)
    - 使用 `createChart` 创建单个 chart 实例，深色主题配置
    - 添加 CandlestickSeries 渲染 K 线主图（阳线绿色 #26a69a，阴线红色 #ef5350）
    - 添加 HistogramSeries 渲染成交量（priceScaleId: 'volume'，scaleMargins top: 0.8）
    - 启用鼠标拖拽平移和滚轮缩放
    - 使用 ResizeObserver 实现容器自适应
    - 组件卸载时调用 chart.remove() 释放资源
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.2 在 CandlestickChart 中实现 EMA 指标叠加
    - 根据 showEMA 动态添加/移除两条 LineSeries（EMA12 蓝色 #2962FF，EMA26 橙色 #FF6D00）
    - 调用 calculateEMA 计算 EMA 值，与 K 线共享 right 价格轴
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.3 在 CandlestickChart 中实现 MACD 指标面板
    - 根据 showMACD 动态添加/移除 DIF 线、DEA 线和 MACD 柱状图
    - 使用独立 priceScaleId: 'macd'，scaleMargins 配置独立区域
    - MACD 柱状图正值绿色、负值红色
    - 调用 calculateMACD 计算指标值
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [ ]* 5.4 编写 MACD 柱状图颜色映射属性测试
    - **Property 8: MACD 柱状图颜色映射**
    - **验证: 需求 7.5, 7.6**

- [ ] 6. 检查点 - 确保所有组件可独立渲染
  - 确保所有测试通过，如有疑问请询问用户。

- [x] 7. 组装 Symbol 页面
  - [x] 7.1 重构 `frontend/src/pages/Symbol.tsx` 页面容器
    - 通过 useParams 获取 symbolId，从 marketItems 查找标的信息，从 symbolKlineData 查找 K 线数据
    - 管理 period、showEMA、showMACD 三个状态（默认 '1D'、true、true）
    - symbolId 不存在时展示"未找到该标的"提示
    - 添加返回导航按钮（← 返回），使用 useNavigate 返回上一页
    - 组装 SymbolInfoHeader、PeriodSwitcher、IndicatorToggle、CandlestickChart
    - 单列垂直布局，深色主题背景 bg-slate-950
    - _需求: 1.1, 1.5, 4.3, 5.1, 5.2, 5.3, 5.4, 10.1, 10.2_

  - [ ]* 7.2 编写隐私合规属性测试
    - **Property 6: 隐私合规**
    - **验证: 需求 10.1, 10.2**

- [ ] 8. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

## 备注

- 标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP 交付
- 每个任务引用了对应的需求编号，确保可追溯性
- 检查点任务用于增量验证，确保每个阶段的代码正确性
- 属性测试验证通用正确性属性，单元测试覆盖具体示例和边界情况
