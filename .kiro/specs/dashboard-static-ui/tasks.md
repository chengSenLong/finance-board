# 实现计划：Dashboard 概览看板静态 UI

## 概述

基于设计文档，将 Dashboard 页面拆分为 Mock 数据模块、各独立组件、页面组装和路由更新四个阶段，逐步实现。所有代码使用 React 19 + TypeScript 5.9 + Tailwind CSS v4 + Lightweight Charts v5。

## 任务列表

- [x] 1. 创建 Mock 数据模块与类型定义
  - [x] 1.1 创建 `frontend/src/data/mockData.ts`，定义并导出所有 TypeScript 接口类型（MarketIndex、HoldingItem、HoldingSlice、PricePoint、PriceCardData）
    - 导出类型安全的接口定义
    - _需求: 6.2, 7.3_
  - [x] 1.2 在 `mockData.ts` 中编写并导出 mock 数据：市场指数（≥4项）、持仓列表（≥5项）、持仓占比（≥4项）、价格卡片数据（≥4张，每张 chartData ≥20 个数据点）
    - 数值需符合金融场景合理范围（BTC 价格合理区间、百分比涨跌合理范围）
    - _需求: 2.2, 3.3, 4.2, 5.1, 5.6, 6.1, 6.2, 6.3_
  - [x] 1.3 编写属性测试：Mock 数据金融合理性
    - **Property 7: Mock 数据金融合理性**
    - 验证所有价格为正数、涨跌百分比在 -100% 到 +100% 之间、chartData 价格序列为正数
    - **验证: 需求 6.3**

- [ ] 2. 实现 MarketTickerBar 组件
  - [x] 2.1 创建 `frontend/src/components/MarketTickerBar.tsx`
    - 定义 MarketTickerBarProps 接口，通过 Props 接收 MarketIndex 数组
    - 横向 flex 布局展示各指数项：名称、格式化数值、涨跌百分比
    - 涨跌颜色：正数 `text-emerald-400`，负数 `text-red-400`
    - 背景样式 `bg-slate-900/50`，圆角
    - _需求: 2.1, 2.3, 2.4, 2.5, 2.6, 7.1, 7.2, 7.3_
  - [ ]* 2.2 编写属性测试：涨跌百分比颜色映射（MarketTickerBar）
    - **Property 1: 涨跌百分比颜色映射**
    - 生成随机 changePercent 值，验证正数对应 `text-emerald-400`、负数对应 `text-red-400`
    - **验证: 需求 2.4, 2.5**
  - [ ]* 2.3 编写属性测试：组件渲染所有必需数据字段（MarketTickerBar）
    - **Property 2: 组件渲染所有必需数据字段**
    - 生成随机 MarketIndex 数据，验证渲染输出包含 name、value、changePercent
    - **验证: 需求 2.3**

- [ ] 3. 实现 HoldingsList 组件
  - [x] 3.1 创建 `frontend/src/components/HoldingsList.tsx`
    - 定义 HoldingsListProps 接口，通过 Props 接收 HoldingItem 数组
    - 卡片容器：`bg-slate-900` 背景、`border-slate-800` 边框、圆角
    - 列表项：左侧标的代码+名称，右侧价格+涨跌百分比
    - 涨跌颜色规则同上
    - 不展示持仓数量、市值、盈亏等隐私信息
    - _需求: 3.1, 3.2, 3.4, 3.5, 7.1, 7.2, 7.3_
  - [ ]* 3.2 编写属性测试：持仓列表隐私数据不可见
    - **Property 3: 持仓列表隐私数据不可见**
    - 生成包含隐私字段（quantity、marketValue、pnl）的随机数据，验证渲染输出不包含这些值
    - **验证: 需求 3.2**

- [ ] 4. 实现 HoldingsChart 组件
  - [x] 4.1 创建 `frontend/src/components/HoldingsChart.tsx`
    - 定义 HoldingsChartProps 接口，通过 Props 接收 HoldingSlice 数组
    - 使用 Canvas API（useRef + useEffect）绘制环形图（Doughnut Chart）
    - 环形图中心展示持仓标的总数量
    - 图例（Legend）展示颜色标识、名称、百分比
    - 卡片样式与 HoldingsList 一致
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_
  - [ ]* 4.2 编写属性测试：持仓占比图渲染完整图例与中心计数
    - **Property 4: 持仓占比图渲染完整图例与中心计数**
    - 生成随机 HoldingSlice 数组，验证图例完整性和中心数字等于数组长度
    - **验证: 需求 4.3, 4.5**

- [x] 5. 检查点 - 确保基础组件正常
  - 确保所有已实现组件无编译错误，如有问题请向用户确认。

- [ ] 6. 实现 MiniChart 组件
  - [x] 6.1 创建 `frontend/src/components/MiniChart.tsx`
    - 定义 MiniChartProps 接口（data: PricePoint[], positive: boolean）
    - 使用 Lightweight Charts v5 的 `createChart` 创建图表实例
    - 添加 Area Series 渲染走势线
    - 隐藏时间轴、价格轴、网格线、十字线
    - 涨色：线条 `rgba(16, 185, 129, 0.8)`，填充 `rgba(16, 185, 129, 0.1)`
    - 跌色：线条 `rgba(239, 68, 68, 0.8)`，填充 `rgba(239, 68, 68, 0.1)`
    - 图表背景透明
    - useEffect cleanup 中调用 `chart.remove()` 销毁实例
    - _需求: 5.5, 5.6, 5.7, 5.8, 5.9, 7.1, 7.2, 7.3_
  - [ ]* 6.2 编写属性测试：迷你图颜色随涨跌方向变化
    - **Property 5: 迷你图颜色随涨跌方向变化**
    - 生成随机 positive 布尔值，验证 Area Series 颜色配置正确
    - **验证: 需求 5.8, 5.9**

- [ ] 7. 实现 PriceCard 组件
  - [x] 7.1 创建 `frontend/src/components/PriceCard.tsx`
    - 定义 PriceCardProps 接口，通过 Props 接收 PriceCardData
    - 卡片容器：`bg-slate-900` 背景、`border-slate-800` 边框、圆角
    - 上部：标的代码+名称、价格+涨跌百分比（颜色规则同上）
    - 下部：嵌入 MiniChart 组件
    - 点击整张卡片使用 React Router `<Link>` 导航至 `/symbol/:symbolId`
    - _需求: 5.2, 5.3, 5.4, 5.5, 5.10, 5.11, 7.1, 7.2, 7.3, 8.3_
  - [ ]* 7.2 编写属性测试：价格卡片点击导航正确性
    - **Property 6: 价格卡片点击导航正确性**
    - 生成随机 symbol 字符串，验证 Link 的 to 属性为 `/symbol/{symbol}`
    - **验证: 需求 5.11**

- [ ] 8. 组装 Dashboard 页面与路由更新
  - [x] 8.1 更新 `frontend/src/pages/Dashboard.tsx`
    - 从 `data/mockData.ts` 导入所有 mock 数据
    - 按顺序组装：MarketTickerBar → HoldingsList 与 HoldingsChart 并排（grid 两列）→ PriceCard 网格
    - 响应式布局：桌面端（≥768px）多列，移动端（<768px）单列堆叠
    - 页面背景 `bg-slate-950`，文字 `text-slate-50`
    - _需求: 1.1, 1.2, 1.3, 1.4, 6.1_
  - [x] 8.2 更新 `frontend/src/router.tsx`，将 symbol 路由从 `path: 'symbol'` 改为 `path: 'symbol/:symbolId'`
    - _需求: 8.1_
  - [x] 8.3 更新 `frontend/src/pages/Symbol.tsx`，通过 `useParams()` 获取 `symbolId` 并展示占位内容
    - 若 symbolId 为 undefined 则展示默认占位文本
    - _需求: 8.2_
  - [ ]* 8.4 编写属性测试：Symbol 页面展示路由参数
    - **Property 8: Symbol 页面展示路由参数**
    - 生成随机 symbolId，验证页面渲染输出包含该 symbolId
    - **验证: 需求 8.2**

- [ ] 9. 最终检查点 - 确保所有代码正常
  - 确保所有组件无编译错误、页面渲染正常，如有问题请向用户确认。

## 备注

- 标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP 交付
- 每个任务均引用了对应的需求编号，确保可追溯性
- 属性测试验证设计文档中定义的通用正确性属性
- 所有组件通过 Props 接收数据，不直接引用 mock 模块，便于后续替换真实 API
