# Phase 9: E2E 测试基础设施 - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

建立完整的端到端测试覆盖，保护现有功能不被破坏。

核心功能：
- 创建 E2E 测试基础设施（fixtures、helpers、Page Object Model）
- 编写核心游戏流程测试（开始、移动、合并、胜负判定）
- 编写控制测试（键盘方向键、触摸滑动）
- 在所有组件中添加 `data-testid` 属性
- 配置 CI/CD 自动运行 E2E 测试

**不包含**：音效系统 E2E 测试（Phase 10）、主题切换 E2E 测试（v1.3+）。

</domain>

<decisions>
## Implementation Decisions

### 测试文件组织
- **按用户功能分组** — `game-flow.spec.ts`（核心流程）、`controls.spec.ts`（键盘/触摸）、未来可添加 `theme.spec.ts`
- 每个测试文件覆盖完整的用户场景，而非单一组件
- 测试文件位于 `e2e/` 目录

### data-testid 命名策略
- **语义化扁平命名** — `data-testid="game-board"`、`data-testid="score-2048"`
- 简洁清晰，组件内唯一即可
- 命名规则：`[组件名]-[元素名]` 或 `[功能描述]`

### 选择器策略
- **data-testid 优先** — 所有动态元素必须有 data-testid
- 辅助选择器：ARIA 角色（`role="button"`）用于按钮/对话框，文本内容用于静态文案
- 避免使用 CSS 类名和动态属性

### 测试稳定性
- 使用 Playwright 自动等待，不使用 `waitForTimeout()`
- 配置合理的 timeout（单次操作 5s，整体测试 30s）
- 使用 `--repeat` 标志验证测试稳定性

### Claude's Discretion
- Page Object Model 的具体层级结构（单一大类 vs 多个专用类）
- 移动端视口配置（注释掉的 Pixel 5、iPhone 12 是否启用）
- CI/CD 具体配置细节
- Fixture 扩展的具体实现方式

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### v1.2 里程碑研究
- `.planning/research/STACK-V1.2.md` — v1.2 技术栈研究，包含 E2E 测试关键发现
- `.planning/research/SUMMARY.md` — v1.2 研究总结，包含 E2E 测试最佳实践

### 项目级文档
- `.planning/REQUIREMENTS.md` — v1.2 需求，E2E-01 至 E2E-06 定义 E2E 测试验收标准
- `.planning/ROADMAP.md` — Phase 9 成功标准定义
- `.planning/PROJECT.md` — 技术栈和测试策略

### 架构和规范
- `.planning/codebase/CONVENTIONS.md` — 编码规范，测试代码需遵循
- `.planning/codebase/TESTING.md` — 测试策略和模式
- `.planning/codebase/ARCHITECTURE.md` — FCIS 架构模式

### 外部参考
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) — 官方最佳实践
- [Playwright Page Object Model](https://playwright.dev/docs/pom) — POM 模式指南

</canonical_refs>

<code_context>
## Existing Code Insights

### 当前 E2E 测试状态
- Playwright 已安装（`@playwright/test ^1.58.2`）
- 配置完整（`playwright.config.ts`）：Chromium、Firefox、WebKit
- webServer 配置：开发模式（`npm run dev`）、CI 模式（`npm run preview`）
- 现有测试：`e2e/vue.spec.ts`（占位代码，测试 "You did it!" 页面）
- **缺少：** 真实游戏测试、data-testid 属性、Page Object Model

### 组件结构
```
src/components/
├── GameContainer.vue      # 主容器，覆盖层状态管理
├── GameHeader.vue         # 分数显示、撤销/新游戏按钮、主题切换器
├── GameBoard.vue          # 游戏网格、方块渲染
├── Tile.vue               # 单个方块组件
├── GameOverOverlay.vue    # 游戏结束覆盖层
├── GameWonOverlay.vue     # 游戏胜利覆盖层
└── ThemeSwitcher.vue      # 主题切换器
```

### Reusable Assets
- **Playwright 配置** — 完整的浏览器矩阵、webServer、CI/CD 友好配置
- **测试基础设施** — Vitest 配置完整，111 个单元测试作为参考模式

### Established Patterns
- **TDD 开发模式** — 先写测试，再写实现
- **TypeScript 严格模式** — 测试代码也需要类型安全
- **组件驱动测试** — 测试用户场景，而非实现细节

### Integration Points
- **所有 Vue 组件** — 需要添加 `data-testid` 属性
- **playwright.config.ts** — 可能需要启用移动端视口
- **package.json** — E2E 测试脚本已配置（`pnpm test:e2e`）

### Known Constraints
- **CI/CD 环境** — GitHub Actions，需要配置 Playwright 测试运行
- **Node 版本**：`^20.19.0 || >=22.12.0`
- **浏览器兼容性**：现代浏览器（Chrome/Firefox/Safari/Edge 最新两版本）

</code_context>

<specifics>
## Specific Ideas

- STATE.md 研究发现：使用 Page Object Model 模式、data-testid 选择器、避免 waitForTimeout()
- 现有 E2E 测试是 Vue CLI 默认模板，需要完全替换为真实游戏测试
- 移动端测试配置已存在于 playwright.config.ts 中（注释状态），按需启用

</specifics>

<deferred>
## Deferred Ideas

**Phase 10 — 音效系统 E2E 测试**：
- 音效播放测试（需要音频 API mocking）
- 音量控制 UI 测试
- 静音功能测试

**v1.3+ 未来功能**：
- 主题切换 E2E 测试（5 个主题切换验证）
- 视觉回归测试（截图对比）
- 性能测试（Lighthouse CI）

</deferred>

---

*Phase: 09-e2e*
*Context gathered: 2026-03-30*
