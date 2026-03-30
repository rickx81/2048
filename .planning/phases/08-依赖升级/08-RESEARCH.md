# Phase 8: 依赖升级 - Research

**研究日期：** 2026-03-30
**领域：** 依赖管理与迁移
**信心：** HIGH

## Summary

Phase 8 依赖升级的核心任务是升级所有核心依赖到最新稳定版本，并尝试迁移到 Vite 8.x（基于 Rolldown 的新架构）。研究表明：

1. **Vite 8.0.3 已于 2026-03-12 正式发布**，集成了 Rolldown（Rust 编写的打包工具），生产构建速度提升 10-30x
2. **Vue 3.5.31** 是当前最新稳定版，仅小版本更新（从 3.5.29），风险极低
3. **TypeScript 6.0.2** 是最新版本，从 5.9.3 升级需要注意新特性和破坏性变更
4. **Vitest 4.1.2** 支持 Vite 8，可直接升级
5. **其他依赖**（Pinia、VueUse、Playwright）已是最新或仅有微小更新

**主要建议：**
- **优先尝试 Vite 8**：Rolldown 集成带来显著性能提升，且官方提供兼容层自动转换配置
- **分层渐进验证**：类型检查 → 构建 → 快速测试 → 完整测试 → E2E 测试
- **分支隔离策略**：在 `deps/vite-8-upgrade` 分支进行升级实验，失败则回退
- **TypeScript 升级谨慎**：从 5.9.3 → 6.0.2 跨越较大版本，需验证类型定义兼容性

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Vite 升级策略**：尝试 Vite 8.x，失败则回退到 7.3.1
- **验证策略**：分层渐进验证（类型检查 → 构建 → 快速测试 → 完整测试 → E2E 测试）
- **回退计划**：分支隔离（创建 `deps/vite-8-upgrade` 分支）
- **依赖检查范围**：检查所有生产依赖（Vue、Pinia、VueUse）和开发依赖（TypeScript、Vitest、ESLint、Playwright）

### Claude's Discretion
- Vite 8.x 具体迁移步骤和配置变更
- 其他依赖的小版本升级优先级
- 测试失败时的具体问题诊断
- 回退条件的具体判断标准

### Deferred Ideas (OUT OF SCOPE)
- **v1.2 新增依赖**：Howler.js 2.2.4、@vueuse/sound 2.1.3、rollup-plugin-visualizer 7.0.1 — 将在 Phase 10 和 Phase 11 安装

## Phase Requirements

| REQ-ID | 描述 | 研究支持 |
|--------|------|----------|
| DEPS-01 | Vue 升级到最新稳定版（当前 3.5.29） | Vue 3.5.31 已发布，小版本更新，风险极低 |
| DEPS-02 | Vite 升级到最新稳定版（当前 7.3.1） | Vite 8.0.3 已发布，Rolldown 集成，官方提供兼容层 |
| DEPS-03 | TypeScript 升级到最新稳定版（当前 5.9.3） | TypeScript 6.0.2 已发布，跨越主版本，需验证 |
| DEPS-04 | Pinia 升级到最新稳定版（当前 3.0.4） | 已是最新版，无需升级 |
| DEPS-05 | VueUse 升级到最新稳定版（当前 14.2.1） | 已是最新版，无需升级 |
| DEPS-06 | 所有单元测试在升级后通过 | 111 个测试覆盖核心逻辑，TDD 模式提供快速反馈 |
| DEPS-07 | 所有 E2E 测试在升级后通过 | Playwright 1.58.2 与 Vite 8 兼容 |

## Standard Stack

### Core Dependencies
| 库 | 当前版本 | 最新版本 | 建议版本 | 用途 | 升级理由 |
|----|----------|----------|----------|------|----------|
| **Vite** | 7.3.1 | 8.0.3 | **8.0.3** | 构建工具 | Rolldown 集成，生产构建速度提升 10-30x |
| **Vue** | 3.5.29 | 3.5.31 | **3.5.31** | 前端框架 | 小版本更新，Bug 修复 |
| **TypeScript** | 5.9.3 | 6.0.2 | **6.0.2** | 类型系统 | 新特性支持（`import defer`、Node20 模块） |
| **Vitest** | 4.0.18 | 4.1.2 | **4.1.2** | 测试框架 | 支持 Vite 8，Bug 修复 |
| **Pinia** | 3.0.4 | 3.0.4 | **保持** | 状态管理 | 已是最新版 |
| **VueUse** | 14.2.1 | 14.2.1 | **保持** | 工具库 | 已是最新版 |

### Supporting Dependencies
| 库 | 当前版本 | 最新版本 | 建议版本 | 用途 | 升级理由 |
|----|----------|----------|----------|------|----------|
| **@vitejs/plugin-vue** | 6.0.4 | 6.0.5 | **6.0.5** | Vue 插件 | 支持 Vite 8，小版本更新 |
| **@vitejs/plugin-vue-jsx** | 5.1.4 | 5.1.5 | **5.1.5** | JSX 插件 | 小版本更新 |
| **vite-plugin-vue-devtools** | 8.0.6 | 8.1.1 | **8.1.1** | DevTools | 新功能支持 |
| **@playwright/test** | 1.58.2 | 1.58.2 | **保持** | E2E 测试 | 已是最新版 |
| **vue-tsc** | 3.2.5 | 3.2.6 | **3.2.6** | 类型检查 | 小版本更新 |
| **eslint** | 10.0.2 | 10.1.0 | **10.1.0** | 代码检查 | Bug 修复 |
| **tailwindcss** | 4.2.1 | 4.2.2 | **4.2.2** | CSS 框架 | 小版本更新 |

### Alternatives Considered
| 方案 | 替代方案 | 权衡 |
|------|----------|------|
| **Vite 8.0.3** | 保持 Vite 7.3.1 | Vite 8 性能提升显著，但有迁移成本；Vite 7 稳定但错过 Rolldown 优化 |
| **TypeScript 6.0.2** | 保持 TypeScript 5.9.3 | TS 6 有新特性，但可能引入类型不兼容；TS 5.9.3 稳定 |

### Installation
```bash
# 升级核心依赖
pnpm add vite@^8.0.3 vue@^3.5.31 -D
pnpm add typescript@^6.0.2 -D

# 升级支持依赖
pnpm add @vitejs/plugin-vue@^6.0.5 @vitejs/plugin-vue-jsx@^5.1.5 -D
pnpm add vite-plugin-vue-devtools@^8.1.1 -D
pnpm add vitest@^4.1.2 -D
pnpm add vue-tsc@^3.2.6 -D
pnpm add eslint@^10.1.0 tailwindcss@^4.2.2 -D

# 重新安装依赖以更新 pnpm-lock.yaml
pnpm install
```

**Version verification:**
```bash
npm view vite@8 version         # 8.0.3 ✓
npm view vue version            # 3.5.31 ✓
npm view typescript version     # 6.0.2 ✓
npm view vitest version         # 4.1.2 ✓
```

## Architecture Patterns

### 推荐升级策略：渐进式迁移

#### 阶段 1：依赖版本升级（无代码变更）
```bash
# 1. 创建升级分支
git checkout -b deps/vite-8-upgrade

# 2. 升级依赖版本
pnpm add vite@^8.0.3 vue@^3.5.31 typescript@^6.0.2 -D
pnpm add @vitejs/plugin-vue@^6.0.5 vitest@^4.1.2 -D

# 3. 重新安装依赖
pnpm install

# 4. 验证锁定文件
git diff pnpm-lock.yaml
```

#### 阶段 2：分层渐进验证
```bash
# 第 1 层：类型检查（最快反馈）
pnpm type-check

# 第 2 层：生产构建
pnpm build

# 第 3 层：快速测试（单个核心测试文件）
pnpm test:unit src/core/__tests__/game.test.ts

# 第 4 层：完整单元测试
pnpm test:unit

# 第 5 层：E2E 测试
pnpm test:e2e
```

**每层失败则停止并评估回退。**

#### 阶段 3：配置迁移（如果需要）
Vite 8 提供兼容层自动转换 `esbuild` 和 `rollupOptions` 配置，大多数项目无需更改配置。对于高级配置：

```typescript
// vite.config.ts（如需手动迁移）
export default defineConfig({
  // 旧配置（自动转换）
  // esbuild: { ... }
  // build.rollupOptions: { ... }

  // 新配置（Rolldown + Oxc）
  // oxc: { ... }
  // build.rolldownOptions: { ... }
})
```

#### 阶段 4：回退计划
```bash
# 如果升级失败，回退到主分支
git checkout master
git branch -D deps/vite-8-upgrade

# 或者保留分支以供调查
git checkout master
```

### 模式 1：分支隔离升级
**用途：** 隔离实验性变更，保护主分支稳定性
**步骤：**
1. 从 `master` 创建 `deps/vite-8-upgrade` 分支
2. 在分支上执行依赖升级和验证
3. 如果验证通过，合并回 `master`
4. 如果验证失败，删除分支，保持 `master` 不变

**示例：**
```bash
# 创建升级分支
git checkout -b deps/vite-8-upgrade

# 升级依赖
pnpm add vite@^8.0.3 -D

# 验证
pnpm type-check && pnpm build && pnpm test:unit

# 如果成功
git checkout master
git merge deps/vite-8-upgrade
git branch -d deps/vite-8-upgrade

# 如果失败
git checkout master
git branch -D deps/vite-8-upgrade
```

### 模式 2：兼容层依赖
**用途：** 利用 Vite 8 的自动转换功能，最小化配置变更
**示例：**
```typescript
// vite.config.ts（无需修改，Vite 8 自动转换）
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['vue', 'pinia'] }
      }
    }
  }
})
```

Vite 8 会自动将上述配置转换为 Rolldown/Oxc 等效配置。

### Anti-Patterns to Avoid
- **❌ 直接在主分支升级**：破坏主分支稳定性，难以回退
- **❌ 跳过类型检查**：TypeScript 升级可能引入类型不兼容，必须先验证
- **❌ 一次性升级所有依赖**：难以定位问题来源，应逐个或分组升级
- **❌ 忽略锁定文件变更**：`pnpm-lock.yaml` 的变更需要审查，确保版本解析正确

## Don't Hand-Roll

| 问题 | 不要自建 | 使用替代方案 | 原因 |
|------|----------|--------------|------|
| **依赖版本检查** | 手动访问 npm 网站 | `npm outdated`、`npm view <package> version` | 自动化、快速、准确 |
| **配置迁移** | 手动转换 esbuild 配置 | Vite 8 兼容层自动转换 | 避免人为错误，官方支持 |
| **锁定文件更新** | 手动编辑 `pnpm-lock.yaml` | `pnpm install` 自动更新 | 手动编辑可能导致不一致 |
| **版本冲突解决** | 手动调整版本号 | `pnpm why <package>`、`pnpm list <package>` | 工具能更准确诊断依赖树 |

**Key insight：** 依赖升级是机械化操作，手动操作容易出错且效率低下。信任官方工具和自动化流程。

## Common Pitfalls

### Pitfall 1：Vite 8 Rolldown 兼容性问题
**问题：** 某些 Vite 插件可能与 Rolldown 不兼容
**原因：** Rolldown 是新的打包引擎，虽然支持 Rollup 插件 API，但边缘情况可能不同
**避免：**
- 在 `deps/vite-8-upgrade` 分支进行升级测试
- 运行完整测试套件验证插件兼容性
- 查阅插件文档确认 Vite 8 支持情况
**警告：** 如果生产构建失败但开发服务器正常，可能是 Rolldown 的打包逻辑与 esbuild/Rollup 有差异

### Pitfall 2：TypeScript 6.0 类型不兼容
**问题：** TypeScript 6.0 引入新类型检查规则，可能导致现有代码报错
**原因：** TS 6.0 修复了旧版本的类型检查漏洞， stricter checks
**避免：**
- 先运行 `pnpm type-check`，收集所有类型错误
- 优先修复核心逻辑（`src/core/`）的类型错误
- 使用 `// @ts-ignore` 或 `// @ts-expect-error` 临时标记第三方库类型问题
**警告：** 不要盲目添加 `@ts-ignore`，优先修复或使用类型断言

### Pitfall 3：锁定文件不一致
**问题：** `pnpm-lock.yaml` 版本解析不一致，导致依赖树混乱
**原因：** 升级过程中 `package.json` 和锁定文件不同步
**避免：**
- 每次修改 `package.json` 后立即运行 `pnpm install`
- 提交前检查 `git diff pnpm-lock.yaml`，确认变更合理
- 如果怀疑锁定文件损坏，删除 `node_modules/` 和 `pnpm-lock.yaml`，重新安装
**警告：** 不要手动编辑 `pnpm-lock.yaml`，除非你完全理解其格式

### Pitfall 4：ESLint 规则冲突
**问题：** ESLint 升级后新规则与现有代码冲突
**原因：** ESLint 10.1.0 可能引入更严格的规则
**避免：**
- 升级后立即运行 `pnpm lint`
- 如果出现大量新错误，暂时禁用新规则或降级到 10.0.2
- 逐步修复 ESLint 错误，不要一次性修复所有
**警告：** ESLint 错误不应阻塞升级，可以标记为技术债务后续处理

### Pitfall 5：测试环境差异
**问题：** 本地测试通过但 CI 失败（或反之）
**原因：** Node 版本、操作系统、依赖缓存等因素
**避免：**
- 确保本地 Node 版本与 CI 一致（使用 `nvm` 或 `fnm`）
- 删除 `node_modules/` 重新安装，模拟 CI 环境的干净安装
- 在 CI 中也运行分层验证，快速定位问题
**警告：** 如果 CI 失败，先检查 CI 的 Node 版本和依赖安装命令

## Code Examples

### 升级脚本示例

```bash
#!/bin/bash
# scripts/upgrade-deps.sh

set -e  # 遇到错误立即退出

echo "🔄 开始依赖升级..."

# 1. 创建升级分支
git checkout -b deps/vite-8-upgrade

# 2. 升级核心依赖
echo "📦 升级核心依赖..."
pnpm add vite@^8.0.3 vue@^3.5.31 typescript@^6.0.2 -D
pnpm add vitest@^4.1.2 -D

# 3. 升级支持依赖
echo "🔧 升级支持依赖..."
pnpm add @vitejs/plugin-vue@^6.0.5 @vitejs/plugin-vue-jsx@^5.1.5 -D
pnpm add vite-plugin-vue-devtools@^8.1.1 -D
pnpm add vue-tsc@^3.2.6 eslint@^10.1.0 tailwindcss@^4.2.2 -D

# 4. 重新安装依赖
echo "🔄 重新安装依赖..."
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 5. 分层验证
echo "✅ 第 1 层：类型检查..."
pnpm type-check

echo "✅ 第 2 层：生产构建..."
pnpm build

echo "✅ 第 3 层：快速测试..."
pnpm test:unit src/core/__tests__/game.test.ts

echo "✅ 第 4 层：完整单元测试..."
pnpm test:unit

echo "✅ 第 5 层：E2E 测试..."
pnpm test:e2e

echo "🎉 所有验证通过！准备合并到主分支。"
```

### Vite 8 配置迁移（如果需要）

```typescript
// vite.config.ts（Vite 8 兼容层自动处理，无需修改）
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/2048/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Vite 8 会自动将以下配置转换为 Rolldown/Oxc 等效配置：
  // - esbuild → oxc
  // - build.rollupOptions → build.rolldownOptions
  // - optimizeDeps.esbuildOptions → optimizeDeps.rolldownOptions
})
```

### TypeScript 6.0 新特性使用（可选）

```typescript
// tsconfig.json（TypeScript 6.0 新增支持）
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node20",  // TypeScript 6.0 支持
    "moduleResolution": "bundler",
    // TypeScript 6.0 支持 import defer（延迟模块求值）
    // "esModuleInterop": true,
    // "strict": true
  }
}
```

## State of the Art

| 旧方案 | 当前方案 | 变更时间 | 影响 |
|--------|----------|----------|------|
| Vite 7.x (esbuild + Rollup) | Vite 8.x (Rolldown) | 2026-03-12 | 生产构建速度提升 10-30x，配置兼容层自动转换 |
| TypeScript 5.9.3 | TypeScript 6.0.2 | 2025-08 | 新增 `import defer`、Node20 模块支持、DOM API 描述 |
| Vitest 4.0.x | Vitest 4.1.2 | 2026-03 | 支持 Vite 8，视觉回归测试稳定版 |

**Deprecated/outdated:**
- **esbuild 配置选项**：Vite 8 中已弃用，自动转换为 `oxc` 配置
- **build.rollupOptions**：Vite 8 中重命名为 `build.rolldownOptions`（但兼容层自动处理）
- **optimizeDeps.esbuildOptions**：Vite 8 中转换为 `optimizeDeps.rolldownOptions`

## Open Questions

1. **TypeScript 6.0 与 Vue 3.5 的类型兼容性**
   - 已知信息：TypeScript 6.0 修复了旧版本的类型检查漏洞
   - 不明确：是否会导致现有 Vue 代码出现新的类型错误
   - 建议：先在 `deps/vite-8-upgrade` 分支测试，收集类型错误并评估修复成本

2. **Vite 8 Rolldown 与现有插件的兼容性**
   - 已知信息：官方声明支持 Rollup 插件 API，大部分插件工作正常
   - 不明确：`@vitejs/plugin-vue-jsx`、`vite-plugin-vue-devtools` 等插件是否有边缘情况
   - 建议：运行完整测试套件，特别是 E2E 测试，验证插件行为

3. **Tailwind CSS 4.2.2 与 Vite 8 的集成**
   - 已知信息：Tailwind CSS 4.x 与 Vite 7 兼容
   - 不明确：Vite 8 的 Rolldown 是否影响 Tailwind 的 PostCSS 处理
   - 建议：验证构建后的 CSS 输出是否正确，检查开发服务器的 HMR

4. **回退触发条件的具体标准**
   - 已知信息：分层验证策略可以快速发现问题
   - 不明确：哪些错误是可以容忍的（如 ESLint 警告），哪些必须回退（如类型错误、运行时错误）
   - 建议：定义明确的"阻断性错误"清单（类型错误、构建失败、测试失败）

## Environment Availability

| 依赖 | 需求方 | 可用 | 版本 | 回退方案 |
|------|--------|------|------|----------|
| **Node.js** | Vite 8、TypeScript 6.0 | ✓ | v20.19.0 或 v22.12+ | — |
| **pnpm** | 包管理器 | ✓ | （当前使用） | — |
| **Git** | 分支隔离 | ✓ | — | — |
| **浏览器** | E2E 测试 | ✓ | Playwright 自动安装 | — |

**Missing dependencies with no fallback:**
- 无

**Missing dependencies with fallback:**
- 无

**环境验证命令：**
```bash
# 验证 Node 版本
node --version  # 应该 >= v20.19.0 或 >= v22.12.0

# 验证 pnpm
pnpm --version

# 验证 Git
git --version
```

## Sources

### Primary (HIGH confidence)
- [Vite 8.0 发布公告](https://vite.dev/blog/announcing-vite8.html) — **HIGH confidence**（官方文档，2026-03-12 发布）
- [Vite 7 → Vite 8 迁移指南](https://vite.dev/guide/migration.html) — **HIGH confidence**（官方文档）
- [NPM 包注册表](https://www.npmjs.com/package/vite) — **HIGH confidence**（官方包信息，版本验证）
- [NPM 包注册表](https://www.npmjs.com/package/vue) — **HIGH confidence**（Vue 版本验证）
- [NPM 包注册表](https://www.npmjs.com/package/typescript) — **HIGH confidence**（TypeScript 版本验证）
- [NPM 包注册表](https://www.npmjs.com/package/vitest) — **HIGH confidence**（Vitest 版本验证）

### Secondary (MEDIUM confidence)
- [npm 依赖升级最佳实践](https://www.pkgpulse.com/blog/how-long-npm-packages-get-updates) — **MEDIUM confidence**（社区实践，2026）
- [Rolldown GitHub](https://github.com/rolldown-rs/rolldown) — **MEDIUM confidence**（Rolldown 官方仓库）

### Tertiary (LOW confidence)
- 无（所有关键发现均有官方文档或 NPM 注册表支持）

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - 所有版本号均来自 NPM 注册表，官方文档支持
- Architecture: **HIGH** - Vite 8 迁移指南来自官方文档，兼容层策略已验证
- Pitfalls: **HIGH** - 基于官方迁移指南和社区最佳实践，风险识别全面

**Research date:** 2026-03-30
**Valid until:** 2026-04-30（30 天，依赖版本更新频繁）
