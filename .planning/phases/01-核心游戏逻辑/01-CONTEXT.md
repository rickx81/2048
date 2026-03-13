# Phase 1: 核心游戏逻辑 - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

实现可玩的 2048 游戏核心逻辑，所有游戏规则和机制都能正确工作。这个阶段专注于纯函数实现，不涉及 UI（UI 在 Phase 3）。

核心功能：
- 4x4 游戏网格初始化
- 四个方向移动逻辑（上/下/左/右）
- 数字合并规则（相同数字合并为两倍值）
- 新方块随机生成（2 或 4）
- 计分系统（合并时增加分数）
- 游戏结束检测（网格填满且无法合并）
- 胜利检测（达到 2048）

</domain>

<decisions>
## Implementation Decisions

### 数据结构
- 使用二维数组 `number[][]` 表示 4x4 游戏网格
- `0` 表示空位，非空位为 `2`、`4`、`8` 等数字
- 移动方向使用字符串字面量类型：`'UP' | 'DOWN' | 'LEFT' | 'RIGHT'`
- 核心数据结构采用不可变设计 — 每次操作返回新状态，不修改原数组

### 核心函数
- 移动逻辑拆分为多个小函数（单一职责原则）
- 采用经典 2048 规则：单次移动每个方块最多合并一次（如 `[2,2,4,4]` → `[4,8,0,0]`）
- 新方块生成采用加权随机策略：优先选择远离现有方块的空位（角落策略）
- 所有核心函数组织在单文件 `src/core/game.ts` 中

### 状态管理
- 使用单一 Pinia store (`game`) 集中管理所有游戏状态
- 核心函数返回得分增量，由 store action 累加到总分
- 历史状态用数组存储（`history: GameState[]`），为 Phase 2 撤销功能做准备
- store 文件位置：`src/stores/game.ts`

### Claude's Discretion
- 核心函数的具体命名约定（遵循 TypeScript/Vue 社区惯例）
- 测试文件的组织结构和命名
- Vitest 配置的具体参数设置

</decisions>

<specifics>
## Specific Ideas

- "我想保持与经典原版 2048 一致的游戏体验"
- "代码优先考虑可读性和可维护性"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Pinia Composition API 模式已建立（`src/stores/counter.ts`）
- TypeScript 严格模式已配置
- Vitest + happy-dom 测试框架已配置

### Established Patterns
- Pinia store 使用 `defineStore` + setup 函数模式
- 使用 `ref` 和 `computed` 进行响应式状态管理

### Integration Points
- 核心函数将在 `src/core/` 目录下创建
- Pinia store 将导入核心函数进行状态管理
- 测试文件将放在 `src/core/__tests__/` 目录下

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-核心游戏逻辑*
*Context gathered: 2026-03-13*
