# 代码库结构

**分析日期：** 2025-03-13

## 目录布局

```
/
├── src/                      # 源代码目录
│   ├── App.vue              # 根组件
│   ├── main.ts              # 应用入口文件
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由配置文件
│   ├── stores/              # 状态管理
│   │   └── counter.ts       # 计数器状态
│   └── __tests__/           # 单元测试
│       └── App.spec.ts      # App 组件测试
├── e2e/                     # 端到端测试
│   ├── vue.spec.ts          # E2E 测试
│   └── tsconfig.json        # E2E 测试 TypeScript 配置
├── .planning/               # 项目规划
│   └── codebase/            # 代码库分析
│       ├── ARCHITECTURE.md  # 架构分析
│       └── STRUCTURE.md     # 目录结构分析
├── .claude/                 # Claude 编辑器配置
├── .vscode/                # VS Code 配置
├── eslint.config.ts         # ESLint 配置
├── playwright.config.ts     # Playwright 配置
├── tsconfig.json            # TypeScript 配置
├── tsconfig.app.json        # 应用 TypeScript 配置
├── tsconfig.node.json       # Node.js TypeScript 配置
├── tsconfig.vitest.json     # Vitest TypeScript 配置
├── vite.config.ts           # Vite 构建配置
├── vitest.config.ts         # Vitest 测试配置
├── env.d.ts                # TypeScript 环境声明
├── eslint.config.ts        # ESLint 配置
└── package.json             # 项目依赖配置
```

## 目录用途

**src/ - 源代码：**
- 用途：存放应用的核心代码
- 包含：组件、状态管理、路由、工具函数
- 关键文件：`App.vue`（主组件）、`main.ts`（入口）

**src/router/ - 路由管理：**
- 用途：管理页面路由和导航
- 包含：路由配置、路由守卫
- 关键文件：`index.ts`（路由配置）

**src/stores/ - 状态管理：**
- 用途：管理应用的全局状态
- 包含：Pinia store 定义
- 关键文件：`counter.ts`（计数器状态）

**src/__tests__/ - 单元测试：**
- 用途：存放单元测试文件
- 包含：组件测试、工具函数测试
- 关键文件：`App.spec.ts`（App 组件测试）

**e2e/ - 端到端测试：**
- 用途：进行端到端测试
- 包含：用户交互测试、功能测试
- 关键文件：`vue.spec.ts`（主页面测试）

## 关键文件位置

**入口点：**
- `src/main.ts`: 应用启动入口
- `src/App.vue`: 根组件
- `index.html`: HTML 入口（Vite 自动生成）

**配置：**
- `vite.config.ts`: 构建和开发服务器配置
- `tsconfig.json`: TypeScript 全局配置
- `vitest.config.ts`: 测试配置
- `eslint.config.ts`: 代码规范配置

**测试：**
- `src/__tests__/App.spec.ts`: 单元测试
- `e2e/vue.spec.ts`: E2E 测试

## 命名约定

**文件：**
- 组件：`.vue` 扩展名（如 `App.vue`）
- TypeScript：`.ts` 扩展名（如 `counter.ts`）
- 测试：`.spec.ts` 扩展名（如 `App.spec.ts`）

**目录：**
- 组件：直接文件名（如 `App.vue`）
- 工具函数：`utils/` 前缀
- 类型：`types/` 目录

**变量/函数：**
- 组件：PascalCase（如 `useCounterStore`）
- 函数：camelCase（如 `increment`）
- 状态：camelCase（如 `count`）

## 添加新代码指南

**新功能组件：**
- 主要代码：`src/components/FeatureName/FeatureName.vue`
- 测试：`src/components/__tests__/FeatureName.spec.ts`
- 类型：`src/types/feature.ts`（如有需要）

**新页面：**
- 组件：`src/views/PageName.vue`
- 路由：`src/router/index.ts` 添加路由配置
- 测试：`src/views/__tests__/PageName.spec.ts`

**新状态管理：**
- Store：`src/stores/storeName.ts`
- 使用：组件中通过 `useStoreName()` 访问

**新工具函数：**
- 工具：`src/utils/functionName.ts`
- 测试：`src/utils/__tests__/functionName.spec.ts`

## 特殊目录

**node_modules/：**
- 用途：存放第三方依赖
- 生成：自动生成
- 提交：不提交到版本控制

**dist/：**
- 用途：存放构建产物
- 生成：Vite 构建时生成
- 提交：不提交到版本控制

**.planning/：**
- 用途：项目规划文档
- 生成：手动创建
- 提交：提交到版本控制

---

*结构分析：2025-03-13*