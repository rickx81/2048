# Technology Stack

**Analysis Date:** 2026-03-13

## Languages

**Primary:**
- TypeScript 5.9.3 - 全局语言，包括 Vue 组件、工具函数和测试
- 开启了 `noUncheckedIndexedAccess` 严格类型检查

**Secondary:**
- JavaScript (通过 Vue SFC) - 模板内联脚本

## Runtime

**Environment:**
- Node.js 20.19.0+ 或 22.12.0+

**Package Manager:**
- pnpm (从 node_modules 结构推断)
- Lockfile: pnpm-lock.yaml (存在)

## Frameworks

**Core:**
- Vue 3.5.29 - 主框架
- Vue Router 5.0.3 - 路由管理
- Pinia 3.0.4 - 状态管理

**Testing:**
- Vitest 4.0.18 - 单元测试框架
- @testing-library/vue - Vue 组件测试
- jsdom 28.1.0 - DOM 环境模拟

**Build/Dev:**
- Vite 7.3.1 - 构建工具和开发服务器
- TypeScript 5.9.3 - 类型检查
- vue-tsc 3.2.5 - Vue 特定的 TypeScript 编译器

## Key Dependencies

**Critical:**
- @vitejs/plugin-vue 6.0.4 - Vue 单文件组件支持
- @vitejs/plugin-vue-jsx 5.1.4 - JSX 支持
- vite-plugin-vue-devtools 8.0.6 - Vue 开发工具集成

**Infrastructure:**
- @vue/test-utils 2.4.6 - Vue 组件测试工具
- @playwright/test 1.58.2 - E2E 测试

## Configuration

**Environment:**
- 无环境变量文件 (.env* 不存在)
- 通过 tsconfig 进行路径映射：`@/*` 指向 `./src/*`

**Build:**
- Vite 配置：`vite.config.ts`
- 路径别名：`@` 指向 src 目录
- 多个 TypeScript 配置文件：
  - `tsconfig.app.json` - 应用配置
  - `tsconfig.node.json` - Node 工具配置
  - `tsconfig.vitest.json` - 测试配置

**Type Safety:**
- 开启 `noUncheckedIndexedAccess` - 数组和对象查找额外安全检查
- 生成 tsbuildinfo 文件到 `node_modules/.tmp/` 目录

## Platform Requirements

**Development:**
- Node.js 20.19.0+ 或 22.12.0+
- 支持 ESM 模块 (`"type": "module"`)

**Production:**
- 静态文件部署（通过 Vite build）
- 无服务器依赖（纯客户端应用）

---

*Stack analysis: 2026-03-13*