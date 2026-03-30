# Phase 8: 依赖升级 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 08-依赖升级
**Areas discussed:** 升级范围, 验证策略, 回退计划, 新增依赖时机, 依赖检查范围

---

## 讨论模式选择

| 选项 | 描述 | 选择 |
|------|------|------|
| 快速模式 | 跳过详细讨论，直接由 Claude 完成升级并验证测试 | |
| 查看研究后决定 | 先展示 v1.2 研究文档中关于依赖升级的建议，再决定是否讨论 | ✓ |

**用户选择：** 查看研究后决定

**Notes：** 用户希望在查看研究文档的建议后再决定如何处理这个阶段。

---

## 升级范围

| 选项 | 描述 | 选择 |
|------|------|------|
| 仅安装新增依赖 | 仅安装 v1.2 新增依赖（Howler.js、VueUse Sound、rollup-plugin-visualizer），不升级现有依赖 | |
| 尝试 Vite 8.x | 先尝试升级 Vite 到 8.0.3，运行测试验证，失败则回退到 7.3.1 | ✓ |
| 全面检查升级 | 检查所有依赖的最新版本，选择性升级有明确收益的依赖 | |

**用户选择：** 尝试 Vite 8.x

**Notes：** 研究文档建议保持 Vite 7.3.1（稳定），但用户仍希望探索 Vite 8.x。

---

## 验证策略

| 选项 | 描述 | 选择 |
|------|------|------|
| 完整测试验证 | 升级后立即运行完整的测试套件（111 个单元测试 + E2E 测试），全部通过才算成功 | |
| 分层渐进验证 | 先运行类型检查和构建，再运行快速测试（单测试文件），最后完整测试 | ✓ |
| 手动验证即可 | 升级 Vite，启动开发服务器验证，手动测试核心功能，不依赖自动化测试 | |

**用户选择：** 分层渐进验证

**Notes：** 用户选择渐进式验证策略，可以快速发现问题并避免浪费时间。

---

## 回退计划

| 选项 | 描述 | 选择 |
|------|------|------|
| Git stash 回退 | 使用 Git stash 暂存 package.json 和 package-lock.json，失败时 git stash pop 恢复 | |
| 分支隔离 | 创建专门的分支 'deps/vite-8-upgrade'，失败时直接删除分支 | ✓ |
| 指定版本回退 | 使用 pnpm (或 npm) 的版本回退命令，直接指定版本号重新安装 | |

**用户选择：** 分支隔离

**Notes：** 使用分支进行隔离实验，失败时直接删除分支，保持主分支干净。

---

## 新增依赖时机

| 选项 | 描述 | 选择 |
|------|------|------|
| 分阶段安装 | Phase 8 只升级 Vite，Howler.js 等依赖在各自 Phase 安装 | ✓ |
| 提前全部安装 | Phase 8 同时安装所有 v1.2 新增依赖，减少后续阶段的安装步骤 | |

**用户选择：** 分阶段安装

**Notes：** 依赖将在各自需要的 Phase 安装（Howler.js 在 Phase 10，rollup-plugin-visualizer 在 Phase 11）。

---

## 依赖检查范围

| 选项 | 描述 | 选择 |
|------|------|------|
| 检查所有生产依赖 | 除了 Vite，检查其他生产依赖（Vue、Pinia、VueUse）是否有小版本更新 | ✓ |
| 检查开发依赖 | 同时检查开发依赖（TypeScript、Vitest、ESLint 等）的更新 | ✓ |
| Vite 8 迁移指南 | Vite 8.x 的任何特定配置变更需要了解和处理 | ✓ |

**用户选择：** 全选（检查所有生产依赖、检查开发依赖、Vite 8 迁移指南）

**Notes：** Phase 8 需要全面检查依赖更新，不仅仅是 Vite。

---

## Claude's Discretion

None - 用户对所有关键决策都做出了明确选择。

---

## Deferred Ideas

**v1.2 新增依赖** — 将在后续阶段安装：
- Howler.js 2.2.4 — Phase 10 音效系统
- @vueuse/sound 2.1.3 — Phase 10 音效系统
- rollup-plugin-visualizer 7.0.1 — Phase 11 构建优化
