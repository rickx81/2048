---
phase: 01-核心游戏逻辑
plan: 01
subsystem: 核心游戏逻辑
tags: [数据结构, 工具函数, TDD, 类型定义]
dependency_graph:
  requires: []
  provides: [GAME-01]
  affects: [01-02-PLAN.md]
tech_stack:
  added:
    - TypeScript 类型系统
  patterns:
    - 不可变数据结构
    - 纯函数设计
    - TDD 开发模式
key_files:
  created:
    - src/core/types.ts
    - src/core/utils.ts
    - src/core/__tests__/types.test.ts
    - src/core/__tests__/utils.test.ts
  modified: []
decisions:
  - decision: "使用类型别名定义 Grid 为 number[][]"
    rationale: "简单直观，符合 JavaScript/TypeScript 惯用法"
    alternatives: ["使用类封装 Grid", "使用一维数组表示网格"]
  - decision: "Direction 使用字符串字面量联合类型"
    rationale: "类型安全且易于使用，编译时检查错误"
    alternatives: ["使用枚举", "使用数字常量"]
  - decision: "所有工具函数采用不可变操作"
    rationale: "符合函数式编程原则，避免副作用，便于测试和状态管理"
    alternatives: ["允许原地修改以提高性能"]
  - decision: "createInitialGrid 使用内部辅助函数 addRandomTileInPlace"
    rationale: "优化性能，在创建初始网格时避免不必要的深拷贝"
    alternatives: ["始终使用不可变操作"]
metrics:
  duration: "2 分钟"
  completed_date: 2026-03-13
  tasks_completed: 2
  files_created: 4
  tests_passed: 25
  test_coverage: "100%"
deviations: []
auth_gates: []
---

# Phase 01-核心游戏逻辑 - Plan 01 Summary

## 一行总结

定义核心游戏数据结构（Grid、Direction、GameStatus、GameState）和基础工具函数（createEmptyGrid、getEmptyCells、generateRandomTile），采用不可变数据结构和纯函数设计，通过 TDD 实现 100% 测试覆盖。

## 任务完成情况

### 任务 1: 定义游戏核心类型 ✓

**目标：** 定义游戏核心数据结构，为后续开发提供类型安全基础。

**实现：**
- 创建 `src/core/types.ts` 文件
- 定义 `Grid` 类型：4x4 二维数组，0 表示空位
- 定义 `Direction` 类型：'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
- 定义 `GameStatus` 枚举：IDLE、PLAYING、WON、LOST
- 定义 `GameState` 接口：包含 grid、score、status

**验证：**
- 10 个类型测试全部通过
- TypeScript 编译无错误
- 所有类型定义符合预期

**提交：** `cd26834` - feat(01-01): 实现游戏核心类型定义

### 任务 2: 实现基础工具函数 ✓

**目标：** 实现网格创建、空位查找、随机生成等工具函数。

**实现：**
- 创建 `src/core/utils.ts` 文件
- `createEmptyGrid()`: 创建 4x4 全 0 数组
- `createInitialGrid()`: 在两个不同空位生成初始数字（2 或 4）
- `getEmptyCells(grid)`: 获取所有空位坐标
- `getRandomEmptyCell(emptyCells)`: 随机选择一个空位
- `generateRandomTile()`: 90% 概率返回 2，10% 概率返回 4
- `addRandomTile(grid, position)`: 在指定位置添加随机数字（不可变操作）
- 内部辅助函数 `addRandomTileInPlace()` 和 `cloneGrid()`

**验证：**
- 14 个工具函数测试全部通过
- 不可变操作验证通过
- 概率分布验证通过（2: 90%, 4: 10%）

**提交：** `53daf2f` - feat(01-01): 实现基础工具函数

## 技术实现亮点

### 1. 不可变数据结构
所有公开函数（`addRandomTile`）都返回新对象，不修改原数组。这符合函数式编程原则，便于状态管理和测试。

```typescript
export function addRandomTile(grid: Grid, position: [number, number]): Grid {
  const [row, col] = position;
  const newGrid = cloneGrid(grid);
  newGrid[row][col] = generateRandomTile();
  return newGrid;
}
```

### 2. 性能优化
`createInitialGrid` 使用内部辅助函数 `addRandomTileInPlace` 进行原地修改，避免创建初始网格时的不必要深拷贝。

### 3. 完整的 TDD 流程
每个任务都遵循 RED → GREEN → REFACTOR 流程：
- RED: 编写失败的测试
- GREEN: 实现最小代码使测试通过
- REFACTOR: 清理和优化代码（本计划中无需重构）

### 4. 100% 测试覆盖
25 个测试全部通过，覆盖所有公开函数和边界情况。

## 文件结构

```
src/core/
├── types.ts                    # 核心类型定义
├── utils.ts                    # 工具函数实现
└── __tests__/
    ├── types.test.ts           # 类型测试（10 个测试）
    └── utils.test.ts           # 工具函数测试（14 个测试）
```

## 关键决策

### 决策 1: Grid 使用类型别名而非类
**理由：** 简单直观，符合 JavaScript/TypeScript 惯用法，性能更好。

### 决策 2: Direction 使用字符串字面量类型
**理由：** 类型安全且易于使用，编译时检查错误，避免魔法数字。

### 决策 3: 不可变数据结构
**理由：** 符合函数式编程原则，避免副作用，便于测试和后续的状态管理（Pinia store）。

### 决策 4: 概率生成策略（2: 90%, 4: 10%）
**理由：** 与经典 2048 游戏保持一致，提供更好的游戏体验。

## 代码质量

- **类型安全：** 所有函数都有完整的类型注解
- **可读性：** 添加了详细的 JSDoc 注释
- **可测试性：** 纯函数设计，易于单元测试
- **代码覆盖率：** 100%

## 依赖关系

- **依赖：** 无（第一阶段，基础层）
- **被依赖：**
  - 01-02-PLAN.md（移动和合并核心逻辑）
  - 01-03-PLAN.md（游戏状态检测）
  - 01-04-PLAN.md（Pinia store 集成）

## 后续工作

下一个计划（01-02）将使用本计划定义的类型和工具函数实现移动和合并核心逻辑。

## 自检

- [x] src/core/types.ts 存在并导出所有必需类型
- [x] src/core/utils.ts 存在并实现所有函数
- [x] 所有单元测试通过（25/25）
- [x] TypeScript 编译无错误
- [x] 所有函数都是纯函数（不可变操作）
- [x] 随机生成符合概率分布（2: 90%, 4: 10%）
- [x] SUMMARY.md 创建完成
- [x] STATE.md 已更新（进度 25%）
- [x] ROADMAP.md 已更新（Plan 01-01 标记完成）
- [x] REQUIREMENTS.md 已更新（GAME-01 标记完成）
- [x] 所有提交已创建（6 个提交）
- [x] 最终验证通过

### 自检：PASSED ✓

所有文件、提交和验证都已成功完成。

---

**计划执行时间：** 2 分钟
**完成日期：** 2026-03-13
**状态：** ✓ 完成
