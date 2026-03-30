# 2048 游戏

## 项目概述

基于 Vue 3 和 TypeScript 构建的经典 2048 网页游戏，专注于学习和实践 Vue 3 最佳实践。采用 TDD 开发模式和 Functional Core, Imperative Shell 架构模式。

## 核心价值

通过实际项目深入掌握 Vue 3 组合式 API、响应式系统、组件设计模式和现代前端工程化实践。

## 当前里程碑: v1.2 音效、测试与优化

**目标：** 为 2048 游戏添加音效系统、E2E 测试覆盖和构建优化

**目标功能：**
- **音效系统：** 移动音效、合并音效、游戏结束音效（胜利/失败）、音量控制
- **E2E 测试：** 核心游戏流程测试、控制测试（键盘/触摸/鼠标）、主题测试
- **构建优化：** 代码分割、包体积优化、Bundle 分析、加载性能优化

## 当前状态 (v1.2 规划中)

**已发布功能：**
- 完整的 2048 游戏核心逻辑（移动、合并、计分、胜负判定）
- 撤销功能、本地存储、最高分、排行榜
- 经典 2048 UI 风格，包含网格、方块、动画和覆盖层
- 键盘和触摸控制，响应式设计
- 5 个主题系统，支持切换和持久化
- GPU 加速动画，稳定 60fps 性能

**技术栈：**
- Vue 3.5.29 (Composition API)
- TypeScript 5.9.3 (strict mode)
- Vite 7.3.1
- Pinia (状态管理)
- Tailwind CSS v4
- VueUse (工具库)
- Vitest (测试)

**代码量：** ~5,310 行 (TypeScript/Vue)
**提交数：** 81

## 需求

### 已验证 (v1.0)

- ✓ 4x4 游戏网格，初始生成两个数字（2 或 4）— v1.0
- ✓ 支持四个方向移动（上/下/左/右）— v1.0
- ✓ 移动时数字合并规则：相同数字合并为两倍值 — v1.0
- ✓ 每次移动后随机生成一个新数字（2 或 4）— v1.0
- ✓ 实时计分系统（合并时增加分数）— v1.0
- ✓ 游戏结束检测（网格填满且无法合并）— v1.0
- ✓ 胜利检测（达到 2048）— v1.0
- ✓ 撤销功能（最多撤销一步）— v1.0
- ✓ 本地排行榜（记录最高分）— v1.0
- ✓ 新游戏按钮 — v1.0
- ✓ 响应式设计，支持桌面和移动端 — v1.0
- ✓ 触摸滑动控制（移动端）— v1.0
- ✓ 键盘方向键控制（桌面端）— v1.0
- ✓ 流畅的方块移动和合并动画 — v1.0
- ✓ 不同数字对应不同颜色 — v1.0
- ✓ 当前分数和最高分显示 — v1.0
- ✓ 游戏结束和胜利覆盖层 — v1.0
- ✓ 用户可从 5 个预设主题中选择（经典主题、天空蓝、森林绿、日落橙、樱花粉）— v1.1
- ✓ 主题切换器组件显示在游戏头部，响应式适配 — v1.1
- ✓ 主题选择持久化到 localStorage — v1.1
- ✓ 主题切换有平滑过渡效果（0.15-0.3s CSS transition）— v1.1
- ✓ 动画使用 GPU 加速（transform、opacity）— v1.1
- ✓ 游戏动画稳定在 60fps（Chrome DevTools 验证通过）— v1.1

### 活跃

**v1.2 音效系统 (AUDIO)：**
- [ ] AUDIO-01: 用户可听到方块移动时的音效
- [ ] AUDIO-02: 用户可听到数字合并时的音效
- [ ] AUDIO-03: 用户可听到游戏胜利/失败时的音效
- [ ] AUDIO-04: 用户可控制音量或静音音效
- [ ] AUDIO-05: 音效设置持久化到 localStorage

**v1.2 E2E 测试 (E2E)：**
- [ ] E2E-01: 核心游戏流程可被 Playwright 测试覆盖
- [ ] E2E-02: 键盘/触摸/鼠标控制可被 E2E 测试验证
- [ ] E2E-03: 主题切换功能可被 E2E 测试验证
- [ ] E2E-04: E2E 测试可在 CI/CD 中自动运行

**v1.2 构建优化 (BUILD)：**
- [ ] BUILD-01: 应用代码被分割为按需加载的块
- [ ] BUILD-02: 包体积经过优化和分析
- [ ] BUILD-03: Bundle 分析报告可生成
- [ ] BUILD-04: 首次加载时间经过优化

### 范围外

- 多人对战模式 — 单人学习项目
- 完全自定义主题编辑器 — v1.1 只提供预设主题
- 社交分享功能 — 超出学习目标
- 大于 4x4 的网格选项 — 经典原版规则
- 高级音效编辑器 — v1.2 只提供预设音效

## 上下文

**项目背景：**
- 这是一个学习 Vue 3 的实践项目
- v1.0 已成功发布，达成所有学习目标
- 代码库包含完整的游戏实现和测试

**技术环境：**
- Vue 3.5.29 组合式 API
- TypeScript 5.9.3（严格模式）
- Vite 7.3.1 构建工具
- Pinia 状态管理
- Tailwind CSS v4
- Vitest 测试框架

**开发模式：**
- TDD（测试驱动开发）- 核心逻辑 100% 测试覆盖
- Functional Core, Imperative Shell - 纯函数核心 + 命令式外壳
- 小步迭代，频繁提交

## 约束

- **技术栈**: Vue 3 + TypeScript + Vite + Tailwind CSS v4 — 现代标准技术栈
- **架构模式**: Functional Core, Imperative Shell — 核心逻辑纯函数
- **测试覆盖**: 核心逻辑 100% — 已达成
- **性能**: 流畅 60fps 动画 — 已达成
- **兼容性**: 现代浏览器（Chrome/Firefox/Safari/Edge 最新两版本）

## 关键决策

| 决策 | 理由 | 结果 |
|------|------|------|
| 使用 Vue 3 虚拟 DOM | Vapor 现阶段不够成熟，虚拟 DOM 稳定可靠 | ✓ 良好 |
| TDD 开发模式 | 保证代码质量，学习测试最佳实践 | ✓ 良好 |
| Functional Core 模式 | 核心逻辑纯函数，易于测试和复用 | ✓ 良好 |
| Tailwind CSS v4 | 最新版本，更好的开发体验 | ✓ 良好 |
| Pinia 状态管理 | Vue 3 官方推荐，类型友好 | ✓ 良好 |
| 经典 2048 外观 | 用户反馈更偏好经典风格 | ✓ 良好 |
| 内联样式处理颜色 | Tailwind v4 兼容性问题，改用内联样式 | ✓ 良好 |
| CSS 变量主题系统 | 与现有架构兼容，性能最优 | ✓ 良好 |
| 独立 Theme Store | 关注点分离，便于测试 | ✓ 良好 |
| useTheme Composable | 统一访问接口，代码复用 | ✓ 良好 |
| GPU 加速动画（transform/opacity） | 不触发布局重排，60fps 保证 | ✓ 良好 |
| 动态 will-change 管理 | 避免内存泄漏，仅动画期间启用 | ✓ 良好 |
| VueUse useStorage 持久化 | 自动同步、类型安全、错误处理 | ✓ 良好 |

## 下一个里程碑目标

**可能的 v1.3 功能方向：**
- PWA 支持（离线可玩、安装到桌面）
- 更多游戏模式（无尽模式、限时挑战）
- 云端排行榜（后端集成）

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*最后更新: 2026-03-30 v1.2 里程碑开始*
