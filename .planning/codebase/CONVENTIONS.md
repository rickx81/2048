# 编码规范

**分析日期:** 2026-03-13

## 命名模式

**文件:**
- 小写命名：`src/stores/counter.ts`
- 短横线分隔：`src/components/game-board.vue`
- 测试文件：`src/__tests__/App.spec.ts`

**函数:**
- 驼峰命名：`increment()`, `doubleCount()`
- store 名称：`useCounterStore`
- 函数名使用动词：`getScore()`, `setTile()`, `resetGame()`

**变量:**
- 驼峰命名：`count`, `doubleCount`
- 常量：全大写短横线分隔：`MAX_TILES = 4`
- 响应式引用：`const count = ref(0)`

**类型:**
- 接口：`IConfig` 或 `GameConfig`
- 类型别名：`type TileValue = number | null`
- 泛型：`Store<T>`, `GameBoard<4, 4>`

## 代码风格

**格式化:**
- 使用 ESLint + Oxlint 双重检查
- 使用 Prettier 格式化代码
- 遵循 Vue TypeScript 规范

**代码检查:**
- ESLint: 语法错误、最佳实践
- Oxlint: 严格的代码质量检查
- TypeScript: 类型检查

导入顺序：
```typescript
// 1. 内置库
import { ref, computed } from 'vue'

// 2. 第三方库
import { defineStore } from 'pinia'
import { mount } from '@vue/test-utils'

// 3. 本地模块
import { useCounterStore } from './stores/counter'
import App from '../App.vue'

// 4. 相对路径导入
import { GameBoard } from './components/game-board'
```

## 导入组织

**顺序:**
1. 内置 Node.js / JavaScript 模块
2. 第三方库
3. 本地模块和相对导入
4. 内部模块别名

**路径别名:**
- `@/` - 项目根目录（vite 配置）

## 错误处理

**模式:**
- 使用 try-catch 包装可能失败的异步操作
- 使用可选链操作符：`game?.tiles`
- 使用空值合并：`const value = data ?? defaultValue`
- 错误边界组件：Vue ErrorBoundary

**日志记录:**
- 使用 console.log 进行调试
- 使用 console.error 记录错误
- 生产环境：集成错误追踪服务

## 注释

**何时注释:**
- 复杂的业务逻辑
- 算法实现
- 外部 API 集成
- 临时代码的 TODO

**JSDoc/TSDoc:**
```typescript
/**
 * 计算游戏得分的函数
 * @param tiles - 游戏方块数组
 * @param weight - 计算权重
 * @returns 总得分
 */
function calculateScore(tiles: TileValue[], weight: number): number
```

## 函数设计

**大小:**
- 单一职责：每个函数只做一件事
- 建议长度：20-50 行
- 避免嵌套过深（不超过 3 层）

**参数:**
- 参数不超过 4 个
- 使用对象参数：`function moveTile(direction: Direction)`
- 默认参数：`function createGame(config = DEFAULT_CONFIG)`

**返回值:**
- 明确返回类型
- 不返回 undefined：使用 null 或空数组
- 异步函数返回 Promise

## 模块设计

**导出:**
- 默认导出：组件和主要功能
- 命名导出：工具函数和类型
- 明确的导出列表，避免 `export *`

**模块组织:**
- 按功能组织，而不是按类型
- 每个模块有明确的职责
- 相关功能放在同一目录

## Vue 组件规范

**结构:**
```typescript
<script setup lang="ts">
// 组件逻辑
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 样式 */
</style>
```

**命名:**
- 组件文件：PascalCase
- 组件内部：kebab-case
- Props：驼峰命名

**Props 定义:**
```typescript
interface Props {
  size: number
  theme?: 'light' | 'dark'
  disabled?: boolean
}
```

## 类型规范

**严格模式:**
- 启用 TypeScript 严格模式
- 不使用 `any`，使用具体类型
- 可选参数和属性明确标记

**类型定义:**
```typescript
type Direction = 'up' | 'down' | 'left' | 'right'
interface GameState {
  board: number[][]
  score: number
  gameOver: boolean
}
```

## 代码审查清单

- [ ] 代码符合 ESLint 规则
- [ ] 类型定义完整
- [ ] 函数参数和返回值明确
- [ ] 错误处理完善
- [ ] 注释清晰明了
- [ ] 性能考虑优化

*规范分析: 2026-03-13*