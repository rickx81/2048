# 测试模式

**分析日期:** 2026-03-13

## 测试框架

**运行器:**
- Vitest 4.0.18
- 配置文件: `vitest.config.ts`

**断言库:**
- Vitest 内置 `expect`
- 扩展的断言匹配器

**运行命令:**
```bash
# 运行所有单元测试
npm run test:unit

# 观察模式
npm run test:unit -- --watch

# 生成覆盖率报告
npm run test:unit -- --coverage
```

## 测试文件组织

**位置:**
- 单元测试：`src/__tests__/` 目录
- E2E 测试：`e2e/` 目录
- 与源文件同级目录

**命名:**
- 单元测试：`*.spec.ts`
- E2E 测试：`*.test.ts`
- 测试文件与被测文件同名

**结构:**
```
src/
├── components/
│   ├── game-board.vue
│   └── __tests__/
│       └── game-board.spec.ts
├── stores/
│   ├── counter.ts
│   └── __tests__/
│       └── counter.spec.ts
└── __tests__/
    ├── App.spec.ts
    └── utils.spec.ts
```

## 测试结构

**套件组织:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useCounterStore } from '../stores/counter'

describe('Counter Store', () => {
  it('should initialize with zero', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('should increment count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
})
```

**模式:**
- 使用 `describe` 组织测试套件
- 使用 `it` 定义测试用例
- 使用 `expect` 进行断言
- 测试前准备（setup）和清理（teardown）

## 模拟和 Mock

**框架:**
- Vitest 内置 mock 功能
- 使用 `vi.fn()`, `vi.spyOn()`

**模拟模式:**
```typescript
// 模拟函数
const mockFunction = vi.fn()
mockFunction.mockReturnValue(42)

// 模拟依赖
vi.mock('../utils', () => ({
  calculateScore: vi.fn(() => 100)
}))

// 间谍模拟
const store = useCounterStore()
const incrementSpy = vi.spyOn(store, 'increment')
```

**要模拟的内容:**
- API 调用
- 外部依赖
- 时间相关函数
- 随机数生成

**不要模拟的内容:**
- 核心框架功能（Vue, React）
- 编译器函数
- 标准库（除非必要）

## Fixtures 和工厂函数

**测试数据:**
```typescript
// 工厂函数
function createTile(value: number, x: number, y: number) {
  return { value, x, y, merged: false }
}

// 创建测试状态
function createGameState(board: number[][]) {
  return {
    board,
    score: 0,
    gameOver: false,
    moves: 0
  }
}
```

**位置:**
- 测试工具函数：`src/__tests__/utils/`
- 共享 fixtures：`src/__tests__/fixtures/`

## 覆盖率

**要求:**
- 未明确设置目标覆盖率
- 可以通过 `--coverage` 生成报告

**查看覆盖率:**
```bash
npm run test:unit -- --coverage
```

## 测试类型

**单元测试:**
- 范围：单个函数或组件
- 方法：隔离测试，依赖模拟
- 重点：逻辑正确性

**集成测试:**
- 范围：多个组件或模块交互
- 方法：使用真实组件
- 重点：数据流和状态管理

**E2E 测试:**
- 框架：Playwright
- 范围：用户完整流程
- 方法：浏览器自动化
- 重点：端到端功能验证

## 常见模式

**异步测试:**
```typescript
// Promise 测试
it('should fetch game state', async () => {
  const result = await fetchGameState()
  expect(result).toBeDefined()
})

// 异步组件测试
it('displays loading state', async () => {
  const wrapper = mount(GameBoard, {
    props: { loading: true }
  })
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toContain('Loading...')
})
```

**错误测试:**
```typescript
it('should handle errors gracefully', async () => {
  // 模拟错误
  vi.mocked(fetchGameState).mockRejectedValueOnce(new Error('Network error'))

  // 测试错误处理
  await expect(handleError()).rejects.toThrow('Network error')
})
```

## 组件测试最佳实践

**组件挂载:**
```typescript
import { mount } from '@vue/test-utils'
import GameBoard from '../components/game-board.vue'

describe('GameBoard', () => {
  it('renders the board', () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.board').exists()).toBe(true)
  })
})
```

**事件测试:**
```typescript
it('emits move event', async () => {
  const wrapper = mount(GameBoard)
  await wrapper.find('.tile-up').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('move')
})
```

**状态测试:**
```typescript
it('updates state on prop change', async () => {
  const wrapper = mount(GameBoard, {
    props: { score: 0 }
  })

  await wrapper.setProps({ score: 100 })
  expect(wrapper.text()).toContain('100')
})
```

## 测试数据管理

**测试文件示例:**
```typescript
// src/__tests__/App.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('You did it!')
  })
})
```

**模拟数据:**
```typescript
// src/__tests__/fixtures/game-states.ts
export const WINNING_STATE = {
  board: [[2, 4, 8, 16], [32, 64, 128, 256]],
  score: 1024,
  gameOver: true
}

export const EMPTY_BOARD = Array(4).fill(null).map(() => Array(4).fill(null))
```

## 测试命名约定

**文件命名:**
- 组件测试：`组件名.spec.ts`
- 工具函数：`工具名.spec.ts`
- 页面测试：`页面名.spec.ts`

**测试描述:**
```typescript
// 清晰的测试命名
describe('useCounterStore', () => {
  it('increments count when increment is called', () => {
    // 测试代码
  })

  it('doubles the count value', () => {
    // 测试代码
  })
})
```

*测试分析: 2026-03-13*