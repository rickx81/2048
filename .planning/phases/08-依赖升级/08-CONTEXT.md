# Phase 8: 依赖升级 - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

升级所有核心依赖到最新稳定版本，确保现有功能和测试全部通过。

核心功能：
- 尝试升级 Vite 到 8.x（如失败则回退到 7.3.1）
- 检查所有生产依赖的小版本更新（Vue、Pinia、VueUse）
- 检查所有开发依赖的更新（TypeScript、Vitest、ESLint、Playwright 等）
- 研究 Vite 8 迁移指南，处理配置变更
- 验证所有单元测试（111 个）在升级后通过
- 验证所有 E2E 测试在升级后通过
- 验证开发服务器和生产构建正常工作

**不包含**：v1.2 新增依赖（Howler.js、VueUse Sound、rollup-plugin-visualizer）将分别在 Phase 10 和 Phase 11 安装。

</domain>

<decisions>
## Implementation Decisions

### 升级范围
- **Vite 升级策略**：尝试 Vite 8.x，失败则回退到 7.3.1
- **生产依赖检查**：检查 Vue、Pinia、VueUse 的小版本更新，选择性升级有明确收益的依赖
- **开发依赖检查**：检查 TypeScript、Vitest、ESLint、Playwright 等开发依赖的更新
- **新增依赖**：分阶段安装，Phase 8 不安装 v1.2 新增依赖（Howler.js 等在各自 Phase 安装）

### Vite 8 迁移
- **迁移指南研究**：阅读 Vite 8 发布说明和迁移指南，识别破坏性变更
- **配置处理**：根据 Vite 8 迁移指南更新 vite.config.ts 配置
- **插件兼容性**：验证 @vitejs/plugin-vue、vite-plugin-vue-devtools 等插件与 Vite 8 兼容

### 验证策略
- **分层渐进验证**：
  1. 类型检查（`pnpm type-check`）
  2. 生产构建（`pnpm build`）
  3. 快速测试（单个核心测试文件）
  4. 完整单元测试（`pnpm test:unit`）
  5. E2E 测试（`pnpm test:e2e`）
- 每层验证失败则停止并评估回退

### 回退计划
- **分支隔离**：创建 `deps/vite-8-upgrade` 分支进行升级实验
- **回退触发条件**：类型检查失败、构建失败、测试失败、运行时错误
- **回退方式**：失败时删除 `deps/vite-8-upgrade` 分支，保持原有版本不变

### Claude's Discretion
- Vite 8.x 具体迁移步骤和配置变更
- 其他依赖的小版本升级优先级
- 测试失败时的具体问题诊断
- 回退条件的具体判断标准

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### v1.2 里程碑研究
- `.planning/research/STACK-V1.2.md` — v1.2 技术栈研究，包含依赖升级建议和版本兼容性矩阵
- `.planning/research/SUMMARY.md` — v1.2 研究总结，包含依赖升级关键发现

### 项目级文档
- `.planning/REQUIREMENTS.md` — v1.2 需求，DEPS-01 至 DEPS-07 定义依赖升级的验收标准
- `.planning/ROADMAP.md` — Phase 8 成功标准定义
- `.planning/PROJECT.md` — 技术栈和约束条件

### 架构和规范
- `.planning/codebase/CONVENTIONS.md` — 编码规范，包含 TypeScript 严格模式要求
- `.planning/codebase/ARCHITECTURE.md` — FCIS 架构模式，升级不应破坏核心纯函数

### 外部参考（待研究时确认）
- Vite 8.x 发布说明和迁移指南 — 待在研究阶段确认具体 URL
- Vite 生态插件兼容性说明 — 待确认

</canonical_refs>

<code_context>
## Existing Code Insights

### 当前依赖版本
```json
{
  "vue": "^3.5.29",
  "vite": "^7.3.1",
  "typescript": "~5.9.3",
  "pinia": "^3.0.4",
  "@vueuse/core": "^14.2.1",
  "@playwright/test": "^1.58.2",
  "vitest": "^4.0.18"
}
```

### Reusable Assets
- **测试基础设施** — Vitest 配置完整，111 个单元测试覆盖核心逻辑
- **类型检查** — vue-tsc 配置完整，严格模式已启用
- **构建配置** — vite.config.ts 配置完整，Tailwind CSS v4 集成

### Established Patterns
- **TDD 开发模式** — 所有核心逻辑有测试保护，升级后可快速验证
- **TypeScript 严格模式** — 升级破坏性变更会在编译时暴露
- **分支隔离** — 使用特性分支进行实验性变更

### Integration Points
- **vite.config.ts** — 可能需要根据 Vite 8 迁移指南更新
- **package.json** — 版本号更新
- **vitest.config.ts** — 如 Vitest 有小版本更新，可能需要配置调整
- **playwright.config.ts** — 如 Playwright 有小版本更新，可能需要配置调整

### Known Constraints
- **Node 版本要求**：`^20.19.0 || >=22.12.0`（engines 字段约束）
- **TypeScript 严格模式**：所有代码必须通过类型检查
- **测试覆盖要求**：111 个单元测试必须全部通过

</code_context>

<specifics>
## Specific Ideas

- 用户希望尝试 Vite 8.x，但接受失败后回退到 7.3.1
- 研究文档建议保持 Vite 7.3.1（稳定），但用户仍希望探索 8.x
- 分层渐进验证可以快速发现问题，避免浪费时间
- 分支隔离确保升级实验不影响主分支稳定性

</specifics>

<deferred>
## Deferred Ideas

**v1.2 新增依赖** — 将在后续阶段安装：
- Howler.js 2.2.4 — Phase 10 音效系统
- @vueuse/sound 2.1.3 — Phase 10 音效系统
- rollup-plugin-visualizer 7.0.1 — Phase 11 构建优化

</deferred>

---

*Phase: 08-依赖升级*
*Context gathered: 2026-03-30*
