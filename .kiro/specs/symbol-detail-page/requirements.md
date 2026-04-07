# 需求文档：标的详情页（Symbol Detail Page）静态 UI

## 简介

为 QuantBoard 金融看板应用实现标的详情页的静态 UI 版本。该页面通过路由 `/symbol/:symbolId` 访问，使用 Lightweight Charts v5 渲染专业的 K 线图（蜡烛图），展示标的基本信息、成交量柱状图、技术指标（EMA 均线和 MACD），并支持时间周期切换。本阶段所有数据使用硬编码的 mock 数据，后续再接入 WebSocket/轮询获取实时数据。

## 术语表

- **Symbol_Detail_Page**：标的详情页面组件，通过路由 `/symbol/:symbolId` 渲染，展示某个金融标的的完整行情信息
- **Candlestick_Chart**：K 线图（蜡烛图）组件，使用 Lightweight Charts v5 的 CandlestickSeries 渲染 OHLC 数据
- **Volume_Histogram**：成交量柱状图，叠加在 K 线图下方的独立价格轴区域，展示每根 K 线对应的成交量
- **Period_Switcher**：时间周期切换器，允许用户在不同 K 线时间粒度之间切换（如 1D、1W、1M）
- **Symbol_Info_Header**：标的信息头部区域，展示标的名称、当前价格、涨跌幅等基本信息
- **Mock_Data**：硬编码的模拟数据，用于静态 UI 阶段替代真实 API 数据
- **OHLC**：Open（开盘价）、High（最高价）、Low（最低价）、Close（收盘价）的缩写，K 线图的基础数据结构
- **EMA_Overlay**：指数移动平均线（Exponential Moving Average），叠加在 K 线图上的趋势指标线，本期支持 EMA12 和 EMA26 两条均线
- **MACD_Panel**：MACD 指标面板（Moving Average Convergence Divergence），在 K 线图下方独立区域展示 MACD 线、信号线和柱状图
- **Indicator_Toggle**：技术指标开关控件，允许用户启用或关闭 EMA 和 MACD 指标的显示

## 需求

### 需求 1：标的信息头部展示

**用户故事：** 作为投资者，我希望在详情页顶部看到标的的基本行情信息，以便快速了解当前价格和涨跌状态。

#### 验收标准

1. WHEN 用户通过路由 `/symbol/:symbolId` 进入页面，THE Symbol_Detail_Page SHALL 从 Mock_Data 中根据 symbolId 查找对应的标的数据并渲染 Symbol_Info_Header
2. THE Symbol_Info_Header SHALL 展示标的代码（symbol）、标的名称（name）、当前价格（price）和涨跌幅（changePercent）
3. WHEN 涨跌幅为正值，THE Symbol_Info_Header SHALL 以绿色（如 text-emerald-400）展示涨跌幅数值并附带 "+" 前缀
4. WHEN 涨跌幅为负值，THE Symbol_Info_Header SHALL 以红色（如 text-red-400）展示涨跌幅数值
5. WHEN symbolId 在 Mock_Data 中不存在，THE Symbol_Detail_Page SHALL 展示"未找到该标的"的提示信息
6. THE Symbol_Info_Header SHALL 使用深色主题样式（bg-slate-900 / text-slate-100 色板），与 QuantBoard 整体视觉风格保持一致

### 需求 2：K 线图渲染

**用户故事：** 作为投资者，我希望看到标的的专业 K 线图，以便分析价格走势和波动情况。

#### 验收标准

1. THE Candlestick_Chart SHALL 使用 Lightweight Charts v5 的 CandlestickSeries 渲染 OHLC 蜡烛图
2. THE Candlestick_Chart SHALL 使用 Mock_Data 中硬编码的 OHLC 数据（每个时间周期至少包含 30 根 K 线数据）
3. THE Candlestick_Chart SHALL 以绿色渲染阳线（收盘价高于开盘价），以红色渲染阴线（收盘价低于开盘价）
4. THE Candlestick_Chart SHALL 展示时间轴（timeScale）和价格轴（priceScale），并使用深色主题配色
5. THE Candlestick_Chart SHALL 支持鼠标拖拽平移和滚轮缩放交互
6. THE Candlestick_Chart SHALL 在容器宽度变化时自适应调整图表尺寸（响应式）
7. WHEN 组件卸载时，THE Candlestick_Chart SHALL 调用 chart.remove() 释放 Lightweight Charts 实例，防止内存泄漏

### 需求 3：成交量柱状图

**用户故事：** 作为投资者，我希望在 K 线图下方看到成交量柱状图，以便结合量价关系分析行情。

#### 验收标准

1. THE Volume_Histogram SHALL 使用 Lightweight Charts v5 的 HistogramSeries 渲染成交量数据
2. THE Volume_Histogram SHALL 叠加在 Candlestick_Chart 下方的独立价格轴（priceScaleId）区域内
3. THE Volume_Histogram SHALL 与 Candlestick_Chart 共享同一个 chart 实例和时间轴，确保时间对齐
4. WHEN 对应 K 线为阳线，THE Volume_Histogram SHALL 以绿色渲染该根成交量柱
5. WHEN 对应 K 线为阴线，THE Volume_Histogram SHALL 以红色渲染该根成交量柱

### 需求 4：时间周期切换

**用户故事：** 作为投资者，我希望切换不同的时间周期查看 K 线图，以便从不同时间维度分析走势。

#### 验收标准

1. THE Period_Switcher SHALL 提供至少三个时间周期选项：1D（日线）、1W（周线）、1M（月线）
2. WHEN 用户点击某个时间周期按钮，THE Period_Switcher SHALL 高亮显示当前选中的周期按钮
3. WHEN 用户切换时间周期，THE Candlestick_Chart SHALL 使用对应周期的 Mock_Data 重新渲染 K 线图和 Volume_Histogram
4. THE Period_Switcher SHALL 默认选中 1D（日线）周期
5. THE Period_Switcher SHALL 使用与整体深色主题一致的按钮样式（未选中态为 slate 色调，选中态为蓝色高亮）

### 需求 5：页面布局与导航

**用户故事：** 作为用户，我希望详情页有清晰的布局结构和返回导航，以便在看板各页面之间顺畅切换。

#### 验收标准

1. THE Symbol_Detail_Page SHALL 采用单列垂直布局：顶部为 Symbol_Info_Header，其下为 Period_Switcher 和 Indicator_Toggle，再下方为 Candlestick_Chart（含 EMA_Overlay 和 Volume_Histogram），最下方为 MACD_Panel
2. THE Symbol_Detail_Page SHALL 提供返回按钮或面包屑导航，允许用户返回上一页面（Markets 或 Dashboard）
3. THE Symbol_Detail_Page SHALL 在 QuantBoard 的 Layout 组件内渲染（通过 React Router 的 Outlet）
4. THE Symbol_Detail_Page SHALL 使用深色主题背景（bg-slate-950），与全局 Layout 保持视觉一致

### 需求 6：EMA 均线指标

**用户故事：** 作为投资者，我希望在 K 线图上叠加 EMA 均线，以便判断价格趋势方向和支撑阻力位。

#### 验收标准

1. THE EMA_Overlay SHALL 使用 Lightweight Charts v5 的 LineSeries 在 K 线图上叠加渲染 EMA 均线
2. THE EMA_Overlay SHALL 默认展示两条均线：EMA12（短期，蓝色）和 EMA26（长期，橙色）
3. THE EMA_Overlay SHALL 基于 Mock_Data 中的收盘价（close）在前端计算 EMA 值（纯前端计算，不依赖后端）
4. THE EMA_Overlay SHALL 与 Candlestick_Chart 共享同一个 chart 实例和价格轴，确保价格对齐
5. WHEN 用户通过 Indicator_Toggle 关闭 EMA 指标，THE EMA_Overlay SHALL 从图表中隐藏

### 需求 7：MACD 指标面板

**用户故事：** 作为投资者，我希望在 K 线图下方看到 MACD 指标，以便通过金叉死叉信号辅助交易决策。

#### 验收标准

1. THE MACD_Panel SHALL 在 K 线图下方的独立区域渲染 MACD 指标
2. THE MACD_Panel SHALL 展示三个元素：MACD 线（DIF，蓝色 LineSeries）、信号线（DEA，橙色 LineSeries）、MACD 柱状图（DIF-DEA，HistogramSeries）
3. THE MACD_Panel SHALL 使用标准参数：快线周期 12、慢线周期 26、信号线周期 9
4. THE MACD_Panel SHALL 基于 Mock_Data 中的收盘价在前端计算 MACD 值（纯前端计算）
5. WHEN MACD 柱状图值为正，THE MACD_Panel SHALL 以绿色渲染柱体
6. WHEN MACD 柱状图值为负，THE MACD_Panel SHALL 以红色渲染柱体
7. THE MACD_Panel SHALL 与 Candlestick_Chart 共享同一个 chart 实例和时间轴，确保时间对齐
8. WHEN 用户通过 Indicator_Toggle 关闭 MACD 指标，THE MACD_Panel SHALL 从图表中隐藏

### 需求 8：技术指标开关

**用户故事：** 作为投资者，我希望能自由开关技术指标的显示，以便根据需要简化或丰富图表信息。

#### 验收标准

1. THE Indicator_Toggle SHALL 提供 EMA 和 MACD 两个独立的开关按钮
2. THE Indicator_Toggle SHALL 默认开启 EMA 和 MACD 指标
3. WHEN 用户点击某个指标开关，THE Indicator_Toggle SHALL 切换该指标的显示/隐藏状态，并更新按钮的视觉状态（开启态为蓝色高亮，关闭态为 slate 色调）
4. THE Indicator_Toggle SHALL 与 Period_Switcher 在同一行展示，位于 K 线图上方

### 需求 9：Mock 数据结构

**用户故事：** 作为开发者，我希望 mock 数据结构清晰且与未来 API 数据格式对齐，以便后续无缝替换为真实数据源。

#### 验收标准

1. THE Mock_Data SHALL 为每个标的提供 OHLC 格式的 K 线数据，包含 time、open、high、low、close 字段
2. THE Mock_Data SHALL 为每根 K 线提供对应的 volume（成交量）字段
3. THE Mock_Data SHALL 为至少三个时间周期（1D、1W、1M）分别提供独立的数据集
4. THE Mock_Data SHALL 为 marketItems 中已有的标的（如 BTCUSDT、ETHUSDT、AAPL 等）提供对应的 K 线数据
5. THE Mock_Data SHALL 集中存放在 `frontend/src/data/mockData.ts` 文件中，与现有 mock 数据共存
6. THE Mock_Data SHALL 导出明确的 TypeScript 类型定义（如 CandleData、SymbolKlineData），确保类型安全

### 需求 10：隐私合规

**用户故事：** 作为用户，我希望详情页不展示任何个人隐私信息，以保护我的投资隐私。

#### 验收标准

1. THE Symbol_Detail_Page SHALL 仅展示公开市场行情数据（价格、涨跌幅、成交量、K 线图）
2. THE Symbol_Detail_Page SHALL 不展示任何持仓数量、持仓成本、盈亏金额等个人隐私信息
