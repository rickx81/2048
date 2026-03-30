# Phase 9: E2E 测试基础设施 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 9-E2E 测试基础设施
**Areas discussed:** 测试文件组织、测试 ID 命名、选择器策略

---

## 测试文件组织

| Option | Description | Selected |
|--------|-------------|----------|
| 按用户功能分组 | game-flow.spec.ts（核心流程）、controls.spec.ts（键盘/触摸）、theme.spec.ts（主题切换） | |
| 按组件分组 | game-header.spec.ts、game-board.spec.ts、theme-switcher.spec.ts，每个组件独立测试 | |
| 按测试类型分组 | happy-path.spec.ts（正常流程）、edge-cases.spec.ts（边界情况）、smoke.spec.ts（冒烟测试） | |
| 你决定 | 根据项目特点选择最合适的方案 | ✓ |

**User's choice:** 你决定
**Claude's decision:** 按用户功能分组 — 2048 游戏功能清晰（核心流程、控制、主题），符合用户视角的测试方式，便于后期扩展和维护。

---

## 测试 ID 命名

| Option | Description | Selected |
|--------|-------------|----------|
| 语义化扁平命名 | data-testid="game-board"、data-testid="score-2048"，简洁清晰，组件内唯一即可 | |
| 层级结构命名 | data-testid="game-board-grid"、data-testid="tile-2-3"（行-列），更精确但更长 | |
| 带前缀的命名 | data-testid="game-board"、data-testid="game-score"，全局唯一，避免冲突 | |
| 你决定 | 根据项目规模选择最佳方案 | ✓ |

**User's choice:** 你决定
**Claude's decision:** 语义化扁平命名 — 项目规模小，不需要复杂的前缀；组件内唯一就足够了；简洁易读，便于维护。

---

## 选择器策略

| Option | Description | Selected |
|--------|-------------|----------|
| data-testid 优先 | 优先 data-testid，辅以 ARIA 角色（role="button"）和文本内容（getByText） | |
| 仅 data-testid | 只用 data-testid，不用其他选择器类型，保持一致性 | |
| 混合策略 | data-testid（动态内容）+ ARIA 角色（按钮、对话框）+ 文本（静态文案）混合使用 | |
| 你决定 | 根据 Playwright 最佳实践选择 | ✓ |

**User's choice:** 你决定
**Claude's decision:** data-testid 优先 — 研究建议使用 data-testid；ARIA 角色和文本内容可以作为辅助选择器；这是 Playwright 推荐的最佳实践。

---

## Claude's Discretion

以下领域由 Claude 在规划/实现时自行决定：
- Page Object Model 的具体层级结构
- 移动端视口配置（是否启用 Pixel 5、iPhone 12）
- CI/CD 具体配置细节
- Fixture 扩展的具体实现方式

---

## Deferred Ideas

- Phase 10 — 音效系统 E2E 测试（音频 API mocking、音量控制 UI、静音功能）
- v1.3+ — 主题切换 E2E 测试、视觉回归测试、性能测试
