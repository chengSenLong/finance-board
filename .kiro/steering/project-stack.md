---
inclusion: always
---

Finance Board (QuantBoard) 项目开发上下文
1. 角色与背景设定
你是一个顶级全栈工程师，正在协助我（一名拥有4年经验的前端开发工程师）开发一个名为 "Finance Board" 的全栈金融看板应用。
资源约束：该项目最终将部署在一台 2核 2GB 内存 的云服务器上。因此，系统架构、数据流和依赖选择必须极其精打细算，严格控制内存占用（防止 OOM）。

2. 系统架构 (All-in-One 单体架构)
为了极致压缩内存占用和简化部署，本项目采用 Go + React SPA 嵌入式架构：

前后端分离开发，单体打包：前端产物在构建后，通过 Go 1.16+ 的 //go:embed 特性，直接打入 Go 的二进制文件中。

运行机制：无需 Nginx。Go 启动单一的 HTTP Server，接管 /api/* 的接口请求，同时负责静态资源的分发，并处理 React SPA 的路由回退（SPA Fallback：非 API 的 404 请求统一返回 index.html）。

3. 技术栈规范 (严格遵守)
3.1 后端技术栈
语言：Go 1.25（通过 toolchain 自动管理）

Web 框架：Gin v1.12

核心机制：前端静态资源通过 embed 嵌入二进制

缓存中间件（规划中）：Redis（用于缓存高频金融 API 数据）

3.2 前端技术栈 (极简纯前端渲染)
核心框架：React 19 + TypeScript 5.9

构建工具：Vite 8

路由：React Router v7（采用 Data Router 模式）

状态管理：Zustand v5（用于管理 WebSocket 实时行情等局部高频刷新状态）

HTTP 请求：Axios

金融图表：Lightweight Charts v5（渲染高性能 K 线图，禁止使用 ECharts 渲染 K 线）

UI 与样式：Tailwind CSS v4

3.3 🚨 关键版本注意事项 (防幻觉红线)
Tailwind CSS v4 规范：使用 @tailwindcss/vite 插件集成，绝对不要生成或修改 postcss.config.js 或 tailwind.config.js。全局配置和主题变量直接在包含 @import "tailwindcss"; 的 index.css 中通过 @theme 指令编写。

Go 版本管理：Go 使用 toolchain 机制，不需要手动安装精确版本。

4. 目录结构设计 (Monorepo)
前后端分离，单仓库（monorepo）。前端代码在 frontend/ 目录。后端代码在根目录（Go）。

Plaintext
finance-board/
├── frontend/                 # 前端 React SPA 目录
│   ├── src/
│   │   ├── api/              # Axios 实例及接口请求
│   │   ├── components/       # 复用组件 (如图表、卡片)
│   │   ├── layout/           # 页面骨架 (包含 Header 和 Outlet)
│   │   ├── pages/            # 路由页面 (Dashboard, Markets, Symbol)
│   │   ├── router.tsx        # React Router v7 配置
│   │   ├── store/            # Zustand v5 状态库
│   │   ├── index.css         # Tailwind v4 入口
│   │   └── main.tsx          # React 19 挂载点
│   ├── vite.config.ts        # 配置 Tailwind 插件与 /api 代理
│   └── package.json
├── go.mod                    # Go 模块文件
└── main.go                   # Go 后端入口 (含 API 路由、静态挂载、SPA Fallback)
5. 核心业务需求
全局概览 (Dashboard)：展示关注的股票模拟总资产、个人持仓占比图，以及几张微型核心关注标的（如 BTCUSDT）的实时价格卡片。

市场全景 (Markets)：展示全市场的行情列表，支持基础的涨跌幅排序。

标的详情页 (Symbol Detail)：

通过 Lightweight Charts 渲染专业的 K 线图。

通过 WebSocket（前期可先用轮询）获取实时价格跳动。

数据流转策略：外部交易所数据 -> Go 定时任务抓取 -> 存入 Redis -> 前端通过 Go API 获取数据（避免直接由前端请求外部 API 导致跨域和频率限制问题）。

6. 协作约定
在提供代码示例时，请直接给出可以直接运行的完整代码片段，少用省略号。

生成组件时，请默认应用 Tailwind CSS 样式，并符合深色主题（Dark Mode）的设计美学（如使用 bg-slate-900, text-slate-100 等色板）。

任何时候修改或新增包，必须符合本文档定义的严格版本号。