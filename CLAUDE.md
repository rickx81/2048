# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言偏好

- 对话、文档和代码注释使用**中文**
- 项目使用 TypeScript 严格模式

## 常用命令

### 开发
```bash
pnpm dev              # 启动开发服务器
pnpm build            # 类型检查 + 构建
pnpm type-check       # 仅类型检查
pnpm preview          # 预览生产构建
```

### 测试
```bash
pnpm test:unit        # 运行单元测试 (Vitest)
pnpm test:e2e         # 运行 E2E 测试 (Playwright)
```

### 代码质量
```bash
pnpm lint             # 运行 oxlint + eslint (自动修复)
```

## 项目架构

### Functional Core, Imperative Shell

项目采用 **FCIS** 架构模式：

- **Functional Core (src/core/)**: 纯函数核心逻辑，无副作用，TDD 驱动
  - `types.ts` - Grid、Direction、GameStatus 等核心类型
  - `utils.ts` - 网格创建、空位查找、随机生成等工具函数
  - `game.ts` - 移动/合并算法、游戏状态检测
  - `storage.ts` - LocalStorage 持久化（最高分、排行榜、游戏状态）

- **Imperative Shell (src/stores/, src/components/)**: 响应式 UI 层
  - `stores/game.ts` - Pinia store，集成核心逻辑，管理游戏状态、历史记录、撤销
  - `components/` - Vue 组件，纯展示层

### 关键设计点

1. **网格表示**: `Grid = number[][]`，0 表示空位
2. **移动算法**: 先处理行/列，再判断是否移动，有效移动后生成新方块
3. **撤销机制**: history 数组存储历史 Grid，scoreHistory 存储对应得分
4. **状态持久化**: 每次移动后保存状态到 LocalStorage
5. **游戏结束**: 无空位且无法合并时触发

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建**: Vite (base 路径配置为 `/2048/` 用于 GitHub Pages)
- **状态**: Pinia
- **测试**: Vitest + jsdom (单元), Playwright (E2E)
- **样式**: TailwindCSS 4.x
- **工具**: oxlint + eslint, TypeScript strict mode

## 测试策略

- 核心逻辑 (`src/core/__tests__/`) - 纯函数测试，覆盖所有边界情况
- Store 测试 (`src/stores/__tests__/`) - 集成测试，验证状态流转
- 组件测试 (`src/__tests__/`) - UI 交互测试
- E2E 测试 (`e2e/`) - 完整用户流程测试

## Node 版本要求

```json
"node": "^20.19.0 || >=22.12.0"
```
