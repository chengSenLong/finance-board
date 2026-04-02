# 技术设计文档：Dashboard 概览看板静态 UI

## 概述

本设计文档描述 QuantBoard 应用 Dashboard 概览看板页面的静态 UI 实现方案。该页面是用户进入应用后的首页（路由 `/`），用于展示市场概览指标、用户持仓列表与占比图、以及核心关注标的的价格卡片。

本期为纯静态 UI 阶段，所有数据使用硬编码的 mock 数据，不对接后端 API。页面遵循深色主题设计规范，使用 Tailwind CSS v4 编写样式，金融迷你图表使用 Lightweight Charts v5 渲染。

### 关键设计决策

1. **环形图使用 Canvas 手绘实现**：不引入额外图表库（如 Chart.js），使用原生 Canvas API 绘制 Doughnut Chart，保持依赖最小化，符合 2核2GB 服务器的资源约束。
2. **Mock 数据集中管理**：所有 mock 数据存放在 `frontend/src/data/mockData.ts` 中，组件通过 Props 接收数据，不直接引用 mock 模块，便于后续替换为真实 API 数据。
3. **Lightweight Charts v5 渲染迷你图**：Price_Card 中的 Mini_Chart 使用已安装的 `lightweight-charts` 包，通过 Area Series 渲染走势线，隐藏所有坐标轴和网格线。
4. **组件化拆分**：每个 UI 区块（MarketTickerBar、HoldingsList、HoldingsChart、PriceCard）均为独立组件，存放在 `components/` 目录下，通过 Props 接口接收数据。

## 架构

### 页面结构

```
Layout (已有)
└── Header (已有)
└── <Outlet />
    └── Dashboard Page (本期实现)
        ├── MarketTickerBar        ← 市场概览指标条
        ├── 中间区域 (grid 两列)
        │   ├── HoldingsList       ← 持仓列表
        │   └── HoldingsChart      ← 持仓占比环形图
        └── PriceCard Grid         ← 核心关注标的价格卡片 ×4+
```

### 数据流

```mermaid
graph TD
    A[mockData.ts] -->|import| B[Dashboard.tsx]
    B -->|props| C[MarketTickerBar]
    B -->|props| D[HoldingsList]
    B -->|props| E[HoldingsChart]
    B -->|props| F[PriceCard ×N]
    F -->|内部| G[MiniChart]
    F -->|Link/navigate| H[/symbol/:symbolId]
```

Dashboard.tsx 作为页面容器，从 mock 数据模块导入数据，然后通过 Props 分发给各子组件。组件本身不感知数据来源。

### 文件结构

```
frontend/src/
├── components/
│   ├── MarketTickerBar.tsx    # 市场概览指标条
│   ├── HoldingsList.tsx       # 持仓列表
│   ├── HoldingsChart.tsx      # 持仓占比环形图 (Canvas)
│   ├── PriceCard.tsx          # 价格卡片（含 MiniChart）
│   └── MiniChart.tsx          # Lightweight Charts 迷你图
├── data/
│   └── mockData.ts            # Mock 数据模块（类型 + 数据）
├── pages/
│   ├── Dashboard.tsx          # 页面容器，组装各组件
│   └── Symbol.tsx             # 标的详情页（更新路由参数）
└── router.tsx                 # 路由配置（更新 symbol 路径）
```

## 组件与接口

### 1. MarketTickerBar

市场概览指标条，横向展示关键市场指数。

```typescript
interface MarketIndex {
  name: string;        // 指数名称，如 "S&P 500"
  value: number;       // 当前数值
  changePercent: number; // 涨跌百分比，正数为涨，负数为跌
}

interface MarketTickerBarProps {
  indices: MarketIndex[];
}
```

**渲染逻辑**：
- 横向 flex 布局，各指数项等分空间
- 每项展示：名称、数值（格式化）、涨跌百分比
- 涨跌颜色：正数 `text-emerald-400`，负数 `text-red-400`
- 背景：`bg-slate-900/50`，圆角，底部 margin

### 2. HoldingsList

持仓列表卡片，展示用户持仓标的。

```typescript
interface HoldingItem {
  symbol: string;       // 标的代码，如 "BTCUSDT"
  name: string;         // 标的名称，如 "Bitcoin"
  price: number;        // 当前价格
  changePercent: number; // 涨跌百分比
}

interface HoldingsListProps {
  holdings: HoldingItem[];
}
```

**渲染逻辑**：
- 卡片容器：`bg-slate-900` 背景、`border-slate-800` 边框、圆角
- 卡片标题："持仓列表"
- 列表项：标的代码 + 名称（左侧），价格 + 涨跌百分比（右侧）
- 涨跌颜色规则同上
- 不展示持仓数量、市值、盈亏等隐私信息

### 3. HoldingsChart

持仓占比环形图，使用 Canvas 渲染。

```typescript
interface HoldingSlice {
  name: string;         // 标的名称
  percent: number;      // 占比百分比 (0-100)
  color: string;        // 对应颜色，如 "#f59e0b"
}

interface HoldingsChartProps {
  slices: HoldingSlice[];
}
```

**渲染逻辑**：
- 使用 `<canvas>` 元素，通过 `useRef` + `useEffect` 绘制环形图
- 环形图中心展示持仓标的总数量
- 图例（Legend）在环形图下方，每项包含颜色块、名称、百分比
- 卡片样式与 HoldingsList 一致

### 4. PriceCard

核心关注标的价格卡片，含迷你走势图。

```typescript
interface PricePoint {
  time: string;   // 日期字符串，如 "2024-01-15"
  value: number;  // 价格
}

interface PriceCardData {
  symbol: string;         // 标的代码
  name: string;           // 标的名称
  price: number;          // 当前价格
  changePercent: number;  // 涨跌百分比
  chartData: PricePoint[]; // 迷你图数据点（≥20个）
}

interface PriceCardProps {
  data: PriceCardData;
}
```

**渲染逻辑**：
- 卡片容器：`bg-slate-900` 背景、`border-slate-800` 边框、圆角
- 上部：标的代码 + 名称、价格 + 涨跌百分比
- 下部：MiniChart 迷你走势图
- 点击整张卡片导航至 `/symbol/:symbolId`
- 使用 React Router 的 `<Link>` 或 `useNavigate`

### 5. MiniChart

Lightweight Charts v5 迷你折线图，嵌入 PriceCard 内部。

```typescript
interface MiniChartProps {
  data: PricePoint[];
  positive: boolean;  // true=涨（绿色系），false=跌（红色系）
}
```

**渲染逻辑**：
- 使用 `lightweight-charts` 的 `createChart` 创建图表实例
- 添加 Area Series 渲染走势线
- 隐藏：时间轴（`timeScale.visible: false`）、价格轴（`rightPriceScale.visible: false`）、网格线、十字线
- 涨色：线条 `rgba(16, 185, 129, 0.8)`，填充 `rgba(16, 185, 129, 0.1)`
- 跌色：线条 `rgba(239, 68, 68, 0.8)`，填充 `rgba(239, 68, 68, 0.1)`
- 图表背景透明，与卡片融合
- 通过 `useRef` 管理 DOM 容器，`useEffect` 中创建和销毁图表实例

## 数据模型

### Mock 数据模块 (`frontend/src/data/mockData.ts`)

该模块集中管理所有 Dashboard 页面所需的静态模拟数据，导出类型安全的 TypeScript 数据结构。

#### 类型定义

```typescript
// 市场指数
export interface MarketIndex {
  name: string;
  value: number;
  changePercent: number;
}

// 持仓项
export interface HoldingItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

// 持仓占比
export interface HoldingSlice {
  name: string;
  percent: number;
  color: string;
}

// 价格数据点
export interface PricePoint {
  time: string;
  value: number;
}

// 价格卡片数据
export interface PriceCardData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  chartData: PricePoint[];
}
```

#### Mock 数据示例

**市场指数**（≥4 项）：
| 名称 | 数值 | 涨跌 |
|------|------|------|
| S&P 500 | 5,432.10 | +0.85% |
| 纳斯达克 | 17,123.45 | +1.23% |
| BTC 主导率 | 54.3% | -0.42% |
| 恐惧贪婪指数 | 72 | +3.00% |

**持仓列表**（≥5 项）：
| 代码 | 名称 | 价格 | 涨跌 |
|------|------|------|------|
| BTCUSDT | Bitcoin | 67,234.50 | +2.15% |
| ETHUSDT | Ethereum | 3,456.78 | +1.87% |
| AAPL | Apple | 189.45 | -0.32% |
| TSLA | Tesla | 245.67 | +3.45% |
| NVDA | NVIDIA | 875.30 | +1.56% |

**持仓占比**（≥4 项）：
| 名称 | 占比 | 颜色 |
|------|------|------|
| BTC | 40% | #f59e0b (amber) |
| ETH | 25% | #6366f1 (indigo) |
| AAPL | 20% | #10b981 (emerald) |
| 其他 | 15% | #64748b (slate) |

**价格卡片**（≥4 张）：每张包含 symbol、name、price、changePercent 和 ≥20 个时间点的 chartData。

### 路由更新

当前 `router.tsx` 中 Symbol 路由为 `path: 'symbol'`，需更新为 `path: 'symbol/:symbolId'`，以支持 Price_Card 点击跳转传递标的代码。

Symbol.tsx 需通过 `useParams()` 获取 `symbolId` 并展示占位内容。


## 正确性属性 (Correctness Properties)

*正确性属性是指在系统所有有效执行中都应保持为真的特征或行为——本质上是对系统应做什么的形式化陈述。属性是人类可读规格说明与机器可验证正确性保证之间的桥梁。*

### Property 1: 涨跌百分比颜色映射

*For any* 组件（MarketTickerBar、HoldingsList、PriceCard）渲染的涨跌百分比值，当 `changePercent > 0` 时，该元素应包含 `text-emerald-400` 样式类；当 `changePercent < 0` 时，该元素应包含 `text-red-400` 样式类。

**Validates: Requirements 2.4, 2.5, 3.4, 5.3, 5.4**

### Property 2: 组件渲染所有必需数据字段

*For any* 有效的数据输入：
- MarketTickerBar 的每个 MarketIndex 项，渲染输出应包含该项的 `name`、格式化后的 `value` 和 `changePercent`
- HoldingsList 的每个 HoldingItem 项，渲染输出应包含该项的 `symbol`、`name` 和格式化后的 `price`
- PriceCard 的每个 PriceCardData，渲染输出应包含该项的 `symbol`、`name`、格式化后的 `price` 和 `changePercent`

**Validates: Requirements 2.3, 3.1, 5.2**

### Property 3: 持仓列表隐私数据不可见

*For any* HoldingItem 数据和任意附加的隐私字段（如 quantity、marketValue、pnl、pnlPercent），HoldingsList 组件的渲染输出不应包含这些隐私字段的值。

**Validates: Requirements 3.2**

### Property 4: 持仓占比图渲染完整图例与中心计数

*For any* HoldingSlice 数组，HoldingsChart 组件的渲染输出应：
- 为每个 slice 展示包含颜色标识、名称和百分比的图例项
- 在中心区域展示的数字等于 slice 数组的长度

**Validates: Requirements 4.3, 4.5**

### Property 5: 迷你图颜色随涨跌方向变化

*For any* MiniChart 组件，当 `positive` 为 `true` 时，Area Series 的线条颜色应为绿色系（`rgba(16, 185, 129, ...)`）；当 `positive` 为 `false` 时，线条颜色应为红色系（`rgba(239, 68, 68, ...)`）。

**Validates: Requirements 5.8, 5.9**

### Property 6: 价格卡片点击导航正确性

*For any* PriceCardData，当用户点击该 PriceCard 时，应导航至 `/symbol/{data.symbol}` 路径，其中 `{data.symbol}` 为该卡片数据的 symbol 字段值。

**Validates: Requirements 5.11**

### Property 7: Mock 数据金融合理性

*For any* mock 数据中的数值：
- 价格值应为正数
- 涨跌百分比应在 -100% 到 +100% 之间
- chartData 中的价格序列应为正数且在合理区间内

**Validates: Requirements 6.3**

### Property 8: Symbol 页面展示路由参数

*For any* 有效的 symbolId 字符串，当导航至 `/symbol/{symbolId}` 时，Symbol 页面的渲染输出应包含该 symbolId 文本。

**Validates: Requirements 8.2**

## 错误处理

由于本期为纯静态 UI，不涉及网络请求和异步数据加载，错误处理场景较少：

| 场景 | 处理方式 |
|------|----------|
| Mock 数据为空数组 | 组件应优雅处理空数据，展示空状态或不渲染 |
| MiniChart 容器尺寸为 0 | Lightweight Charts 创建前检查容器尺寸，避免渲染异常 |
| Canvas 不支持（极端情况） | HoldingsChart 使用 `<canvas>` 前无需特殊处理，现代浏览器均支持 |
| 路由参数缺失 | Symbol 页面通过 `useParams` 获取 symbolId，若为 undefined 则展示默认占位文本 |
| Lightweight Charts 实例泄漏 | MiniChart 在 `useEffect` 的 cleanup 函数中调用 `chart.remove()` 销毁实例 |

## 测试策略

### 测试框架选择

- **单元测试 / 组件测试**：Vitest + React Testing Library
- **属性测试 (Property-Based Testing)**：[fast-check](https://github.com/dubzzz/fast-check)（TypeScript 生态最成熟的 PBT 库）
- **测试运行**：`vitest --run`（单次执行，非 watch 模式）

### 测试分层

#### 单元测试（具体示例与边界情况）

- Dashboard 页面在根路径 `/` 渲染（验证需求 1.1）
- Dashboard 页面包含正确的背景色和文字颜色 class（验证需求 1.3）
- Dashboard 页面按正确顺序渲染各区块（验证需求 1.4）
- Mock 数据市场指数至少 4 项（验证需求 2.2）
- Mock 数据持仓列表至少 5 项（验证需求 3.3）
- Mock 数据持仓占比至少 4 项（验证需求 4.2）
- Mock 数据价格卡片至少 4 张（验证需求 5.1）
- Mock 数据 chartData 至少 20 个数据点（验证需求 5.6）
- HoldingsChart 渲染 canvas 元素（验证需求 4.1）
- PriceCard 内渲染 MiniChart 容器（验证需求 5.5）
- MiniChart 配置隐藏坐标轴和网格线（验证需求 5.7）
- 路由配置包含 `/symbol/:symbolId`（验证需求 8.1）
- PriceCard 使用 Link 组件而非原生 a 标签（验证需求 8.3）
- MarketTickerBar 使用 `bg-slate-900/50` 背景（验证需求 2.6）

#### 属性测试（通用属性，跨所有输入验证）

每个属性测试最少运行 100 次迭代。每个测试必须通过注释引用设计文档中的属性编号。

- **Feature: dashboard-static-ui, Property 1: 涨跌百分比颜色映射** — 生成随机 changePercent 值，验证正数对应 emerald、负数对应 red
- **Feature: dashboard-static-ui, Property 2: 组件渲染所有必需数据字段** — 生成随机数据，验证渲染输出包含所有必需字段
- **Feature: dashboard-static-ui, Property 3: 持仓列表隐私数据不可见** — 生成包含隐私字段的随机数据，验证渲染输出不包含隐私值
- **Feature: dashboard-static-ui, Property 4: 持仓占比图渲染完整图例与中心计数** — 生成随机 HoldingSlice 数组，验证图例完整性和中心数字
- **Feature: dashboard-static-ui, Property 5: 迷你图颜色随涨跌方向变化** — 生成随机 positive 布尔值，验证颜色配置正确
- **Feature: dashboard-static-ui, Property 6: 价格卡片点击导航正确性** — 生成随机 symbol 字符串，验证点击后导航路径正确
- **Feature: dashboard-static-ui, Property 7: Mock 数据金融合理性** — 验证所有 mock 数据值在合理范围内
- **Feature: dashboard-static-ui, Property 8: Symbol 页面展示路由参数** — 生成随机 symbolId，验证页面展示该参数

### 测试配置要求

- 每个属性测试使用 `fc.assert(fc.property(...), { numRuns: 100 })` 配置
- 每个属性测试文件头部注释引用对应的设计属性：`// Feature: dashboard-static-ui, Property N: {property_text}`
- 单元测试和属性测试互补：单元测试覆盖具体示例和边界情况，属性测试覆盖通用规则
