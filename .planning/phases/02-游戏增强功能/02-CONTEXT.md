# Phase 2: 游戏增强功能 - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

为游戏添加增强功能，提升可玩性和用户体验。这个阶段不涉及 UI 视觉效果（UI 在 Phase 3），专注于功能逻辑和持久化存储。

核心功能：
- 撤销功能（允许玩家撤销上一步操作）
- 本地存储（最高分、排行榜、游戏进度持久化）
- 排行榜系统（前 10 名高分记录）
- 游戏结束状态处理（分数显示和保存）
- 新游戏按钮逻辑

</domain>

<decisions>
## Implementation Decisions

### 撤销行为
- 仅撤销一步（不是多步撤销）
- 撤销时扣除合并获得的分数（保持公平性）
- 仅游戏中可撤销，游戏结束后不能撤销
- 限制 3 次撤销机会（默认值）
- history 数组已在 Phase 1 实现，只需添加 undo 方法和撤销计数

### 本地存储策略
- 使用 localStorage（同步 API，足够简单）
- 持久化内容：最高分、排行榜数据、游戏进度
- 存储键名命名：使用 `__GAME_2048_*__` 常量样式
  - `__GAME_2048_HIGHSCORE__` — 最高分
  - `__GAME_2048_LEADERBOARD__` — 排行榜
  - `__GAME_2048_GAME_STATE__` — 当前游戏进度

### 游戏结束状态
- 使用模态框显示最终分数（Phase 3 实现 UI，Phase 2 准备逻辑）
- 游戏结束时自动保存分数到排行榜
- 新游戏按钮保留最高分和排行榜数据，只重置游戏状态
- 刷新页面自动恢复上次游戏状态（无缝体验）

### 排行榜设计
- 保留前 10 名高分记录
- 每条记录包含：分数（number）+ 日期时间（timestamp）
- 降序排序（最高分在前）
- 同分时新的记录排前面（鼓励持续挑战）

### Claude's Discretion
- localStorage 具体实现细节（JSON 序列化/反序列化）
- 排行榜数据结构具体类型定义
- 错误处理（localStorage 不可用、空间不足等）
- 撤销计数的具体实现方式（store 状态还是独立管理）

</decisions>

<specifics>
## Specific Ideas

- "我想保持与经典原版 2048 一致的游戏体验"
- "撤销功能应该有次数限制，防止过度依赖"
- "排行榜应该能看到记录是何时创造的"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Pinia store (`src/stores/game.ts`)** — 已有 history 数组和 moveGrid 方法
  - `history: Grid[]` — 已在移动时保存历史状态
  - `moveGrid()` — 已实现历史记录保存逻辑
  - `reset()` — 已实现重置方法，可直接用于新游戏按钮
- **核心游戏逻辑 (`src/core/game.ts`)** — 所有游戏规则已实现
  - `move()`, `isGameOver()`, `isGameWon()` 等纯函数
- **类型定义 (`src/core/types.ts`)** — GameStatus, Direction, Grid 等类型

### Established Patterns
- Pinia Composition API 模式（defineStore + setup 函数）
- 不可变数据结构（所有操作返回新状态）
- TDD 开发模式（100% 测试覆盖）

### Integration Points
- 在 `src/stores/game.ts` 中添加：
  - `undo()` 方法 — 撤销功能
  - `undoCount` 状态 — 撤销计数
  - `highScore` 状态 — 最高分
  - `leaderboard` 状态 — 排行榜
- 创建 `src/core/storage.ts` — localStorage 封装工具
- 测试文件放在 `src/core/__tests__/storage.test.ts`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-游戏增强功能*
*Context gathered: 2026-03-13*
