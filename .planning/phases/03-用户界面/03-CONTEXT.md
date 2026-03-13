# Phase 3: 用户界面 - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

实现完整、美观、响应式的用户界面，支持桌面和移动设备。这个阶段专注于视觉呈现、动画效果和用户交互。核心游戏逻辑已在 Phase 1 和 Phase 2 完成，store 已提供所有需要的状态和方法。

核心功能：
- 4x4 网格布局，显示数字和空位
- 不同数字对应不同颜色
- 平滑的移动、合并、生成动画
- 当前分数和最高分显示
- 响应式设计，适配桌面和移动设备
- 触摸滑动控制（移动端）
- 游戏结束/胜利覆盖层
- 撤销按钮

</domain>

<decisions>
## Implementation Decisions

### 视觉风格和配色
- **整体风格**：暗色/霓虹风格 — 深蓝/紫色背景，渐变色彩，玻璃态效果
- **数字配色**：光谱渐变（冷→暖）- 2=青色，4=绿色，8=黄色，16=橙色...数字越大越红/紫
- **主题支持**：明暗双主题 — 用户可切换主题
- **字体样式**：经典排版 — 无衬线字体（Inter、Roboto），数字居中，字号随数字增大而减小

### 动画系统
- **动画技术**：由 Claude 决定（使用 Vue Transition + CSS 或动画库，基于性能和开发体验）
- **移动动画**：由 Claude 决定（基于 60fps 要求和暗色风格选择时长和缓动）
- **合并动画**：脉冲放大（缩放效果）- 合并后方块快速放大再缩小，强调合并动作
- **生成动画**：弹跳出现 - 新方块从 scale(0.5) 弹跳放大到 scale(1.05) 再回到 scale(1)

### 响应式布局
- **布局方式**：CSS Grid 布局（4x4 网格，方格之间有固定间距）
- **容器尺寸**：由 Claude 决定（根据桌面和移动端的最佳体验选择尺寸策略）
- **头部布局**：由 Claude 决定（根据视觉平衡和移动端体验选择布局）
- **移动适配**：断点适配（@media）- 平板上保持桌面布局，手机上简化界面

### 触摸交互
- **滑动检测**：VueUse useSwipe - 使用 VueUse 的 useSwipe composable
- **滑动阈值**：由 Claude 决定（根据用户体验和误触风险选择阈值）
- **输入优先级**：同时生效 - 触摸和键盘同时可用，无冲突
- **斜向滑动**：只允许正交方向 - 计算滑动的主体方向，选择水平或垂直

### Claude's Discretion
- 动画库的具体选择（Vue Transition vs CSS vs 库）
- 动画时长和缓动函数的具体参数
- 容器尺寸的具体数值策略
- 头部分数显示的具体布局方式
- 滑动阈值的具体距离（px）
- 游戏结束/胜利覆盖层的设计和交互
- 撤销按钮的位置和样式
- 玻璃态效果的具体实现方式
- CSS 框架集成（Tailwind CSS v4）

</decisions>

<specifics>
## Specific Ideas

- "我想保持与经典原版 2048 一致的游戏体验"（继承自 Phase 1）
- 暗色/霓虹风格 — 类似 Tailwind CSS 的深蓝/紫色背景，渐变色彩，玻璃态效果
- 数字颜色光谱渐变 — 从青色（2）到红色/紫色（大数字）
- 合并时需要明确的视觉反馈（脉冲放大）
- 新方块出现要有活力感（弹跳效果）

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Pinia store (`src/stores/game.ts`)** - 完整实现，包含所有需要的状态：
  - `grid: Grid` - 游戏网格数据
  - `score: number` - 当前分数
  - `status: GameStatus` - 游戏状态
  - `highScore: number` - 最高分
  - `leaderboard: LeaderboardEntry[]` - 排行榜
  - `isGameOver: computed<boolean>` - 游戏是否结束
  - `isGameWon: computed<boolean>` - 游戏是否胜利
  - `canUndo: computed<boolean>` - 是否可以撤销
  - `initialize()` - 初始化游戏
  - `moveGrid(direction)` - 移动方块
  - `reset()` - 重置游戏
  - `undo()` - 撤销上一步

### Established Patterns
- Pinia Composition API 模式（defineStore + setup 函数）
- 响应式状态管理（ref, computed）
- 不可变数据结构
- TypeScript 严格模式

### Integration Points
- **App.vue** - 基本为空，需要从头构建 UI
- **组件目录** - 需要创建 `src/components/` 存放游戏组件
- **样式** - Tailwind CSS v4 尚未安装，需要集成
- **VueUse** - 需要 useSwipe composable 实现触摸滑动
- **路由** - 已配置 Vue Router，但本项目是单页应用可能不需要

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-用户界面*
*Context gathered: 2026-03-13*
