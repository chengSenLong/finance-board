# 需求文档：Dashboard 概览看板静态 UI

## 简介

为 QuantBoard 金融看板应用实现 Dashboard（概览看板）页面的静态前端 UI。本期仅涉及前端静态页面的构建，所有数据使用硬编码的 mock 数据，不对接后端 API，不涉及真实数据获取。页面需遵循深色主题设计规范，使用 Tailwind CSS v4 进行样式编写，金融迷你图表使用 Lightweight Charts v5 渲染。

## 术语表

- **Dashboard_Page**: QuantBoard 应用的首页概览看板，路由路径为 `/`，用于展示用户持仓概览、市场指标和核心关注标的信息
- **Market_Ticker_Bar**: 页面顶部的市场概览指标条，横向展示关键市场指数（如 S&P 500、纳斯达克、BTC 主导率等）的实时数据
- **Holdings_List**: 展示用户持仓标的列表的卡片组件，仅展示标的名称和当前价格，不展示持仓数量、盈亏等隐私信息
- **Holdings_Chart**: 展示个人持仓占比的环形图（Doughnut Chart）组件，使用 Canvas 或 SVG 渲染
- **Price_Card**: 展示单个核心关注标的（如 BTCUSDT）的实时价格、涨跌幅和迷你价格走势图的卡片组件，点击可跳转至标的详情页
- **Mini_Chart**: 嵌入在 Price_Card 中的微型折线图，使用 Lightweight Charts v5 渲染
- **Mock_Data**: 硬编码在前端代码中的静态模拟数据，用于在无后端 API 的情况下填充 UI

## 需求

### 需求 1：Dashboard 页面整体布局

**用户故事：** 作为用户，我希望打开 QuantBoard 首页时看到一个结构清晰的概览看板，以便快速了解市场状况、我的持仓和关注标的行情。

#### 验收标准

1. WHEN 用户访问根路径 `/`，THE Dashboard_Page SHALL 在 Layout 的 `<Outlet />` 区域内渲染完整的概览看板内容
2. THE Dashboard_Page SHALL 采用响应式网格布局，在桌面端（≥768px）展示多列布局，在移动端（<768px）展示单列堆叠布局
3. THE Dashboard_Page SHALL 遵循深色主题设计规范，使用 `bg-slate-950` 作为页面背景色，`text-slate-50` 作为主文字颜色
4. THE Dashboard_Page SHALL 按从上到下的顺序依次展示：Market_Ticker_Bar 区域、Holdings_List 与 Holdings_Chart 并排区域、Price_Card 列表区域

### 需求 2：市场概览指标条

**用户故事：** 作为用户，我希望在概览看板顶部看到关键市场指数的实时数据，以便一眼掌握大盘环境。

#### 验收标准

1. THE Market_Ticker_Bar SHALL 在页面顶部横向展示一行关键市场指数数据
2. THE Market_Ticker_Bar SHALL 使用 Mock_Data 硬编码至少 4 个市场指数，包括但不限于 S&P 500、纳斯达克综合指数、BTC 主导率、恐惧贪婪指数
3. THE Market_Ticker_Bar SHALL 每个指数项展示指数名称、当前数值和涨跌百分比
4. WHEN 涨跌百分比为正数，THE Market_Ticker_Bar SHALL 使用绿色（`text-emerald-400`）展示涨跌百分比
5. WHEN 涨跌百分比为负数，THE Market_Ticker_Bar SHALL 使用红色（`text-red-400`）展示涨跌百分比
6. THE Market_Ticker_Bar SHALL 使用深色背景样式（`bg-slate-900/50`），与页面整体风格一致

### 需求 3：持仓列表

**用户故事：** 作为用户，我希望在概览看板中看到我持有的标的列表和当前价格，以便快速了解持仓情况，同时不暴露持仓数量和盈亏等隐私信息。

#### 验收标准

1. THE Holdings_List SHALL 以列表形式展示用户持仓的标的，每个标的项仅展示标的代码（如 `BTCUSDT`）、标的名称（如 `Bitcoin`）和当前价格
2. THE Holdings_List SHALL 不展示持仓数量、持仓市值、盈亏金额、盈亏比例等任何涉及隐私的数据
3. THE Holdings_List SHALL 使用 Mock_Data 硬编码至少 5 个持仓标的的数据
4. THE Holdings_List SHALL 每个标的项展示涨跌百分比，正数使用绿色（`text-emerald-400`），负数使用红色（`text-red-400`）
5. THE Holdings_List SHALL 使用深色卡片样式（`bg-slate-900` 背景、`border-slate-800` 边框、圆角）

### 需求 4：持仓占比图

**用户故事：** 作为用户，我希望通过可视化图表直观了解我的持仓分布情况，以便评估资产配置是否合理。

#### 验收标准

1. THE Holdings_Chart SHALL 使用 Canvas 或 SVG 渲染一个环形图（Doughnut Chart），展示各持仓标的的占比
2. THE Holdings_Chart SHALL 使用 Mock_Data 硬编码至少 4 个持仓标的的数据，每个标的包含名称、占比百分比和对应颜色
3. THE Holdings_Chart SHALL 在环形图旁边或下方展示图例（Legend），每个图例项包含颜色标识、标的名称和占比百分比
4. THE Holdings_Chart SHALL 使用深色卡片样式包裹，与 Holdings_List 保持视觉一致性
5. THE Holdings_Chart SHALL 在环形图中心区域展示持仓标的总数量

### 需求 5：核心关注标的价格卡片

**用户故事：** 作为用户，我希望在概览看板中看到我核心关注的几个标的的价格和走势，并能点击跳转到详情页查看更多信息。

#### 验收标准

1. THE Dashboard_Page SHALL 展示至少 4 张 Price_Card，使用 Mock_Data 硬编码数据，标的包括但不限于 BTCUSDT、ETHUSDT、AAPL、TSLA
2. THE Price_Card SHALL 展示标的代码（如 `BTCUSDT`）、标的名称（如 `Bitcoin`）、当前价格和涨跌百分比
3. WHEN 涨跌百分比为正数，THE Price_Card SHALL 使用绿色（`text-emerald-400`）展示涨跌百分比
4. WHEN 涨跌百分比为负数，THE Price_Card SHALL 使用红色（`text-red-400`）展示涨跌百分比
5. THE Price_Card SHALL 包含一个 Mini_Chart，使用 Lightweight Charts v5 的 Area Series 渲染最近的价格走势折线
6. THE Mini_Chart SHALL 使用 Mock_Data 硬编码至少 20 个时间点的价格数据
7. THE Mini_Chart SHALL 隐藏坐标轴、网格线和时间轴，仅展示纯净的走势线条
8. WHEN 标的涨跌为正，THE Mini_Chart SHALL 使用绿色系（`rgba(16, 185, 129, ...)`）作为线条和填充颜色
9. WHEN 标的涨跌为负，THE Mini_Chart SHALL 使用红色系（`rgba(239, 68, 68, ...)`）作为线条和填充颜色
10. THE Price_Card SHALL 使用深色卡片样式，多张 Price_Card 以网格形式排列（桌面端每行 2-4 张）
11. WHEN 用户点击 Price_Card，THE Price_Card SHALL 导航至 `/symbol/:symbolId` 详情页，其中 `:symbolId` 为该标的的代码（如 `BTCUSDT`）

### 需求 6：Mock 数据模块

**用户故事：** 作为开发者，我希望所有 mock 数据集中管理在独立模块中，以便后续对接真实 API 时能方便地替换数据源。

#### 验收标准

1. THE Dashboard_Page SHALL 从独立的 Mock_Data 模块文件中导入所有展示数据
2. THE Mock_Data 模块 SHALL 导出类型安全的 TypeScript 数据结构，包含市场指数、持仓列表和价格卡片所需的全部字段
3. THE Mock_Data 模块 SHALL 提供符合金融场景的合理模拟数值（如 BTC 价格在合理区间、百分比涨跌在合理范围内）

### 需求 7：组件化与可复用性

**用户故事：** 作为开发者，我希望 Dashboard 页面的各个 UI 区块被拆分为独立的 React 组件，以便在后续迭代中复用和维护。

#### 验收标准

1. THE Dashboard_Page SHALL 将 Market_Ticker_Bar、Holdings_List、Holdings_Chart、Price_Card 分别实现为独立的 React 组件，存放在 `frontend/src/components/` 目录下
2. THE 各组件 SHALL 通过 Props 接收数据，组件内部不直接引用 Mock_Data 模块
3. THE 各组件 SHALL 使用 TypeScript 定义明确的 Props 接口类型

### 需求 8：路由衔接

**用户故事：** 作为用户，我希望点击价格卡片后能跳转到标的详情页，以便查看更详细的 K 线图和行情数据。

#### 验收标准

1. THE router 配置 SHALL 将 `/symbol/:symbolId` 路径映射到 Symbol 详情页组件
2. THE Symbol 页面 SHALL 能通过路由参数获取 `symbolId`，并在页面中展示该标的代码（本期仅展示占位内容）
3. THE Price_Card 的跳转 SHALL 使用 React Router 的编程式导航或 `<Link>` 组件，不使用原生 `<a>` 标签
