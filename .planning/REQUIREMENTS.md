# 需求 - v1.2 依赖升级、音效、测试与优化

**里程碑：** v1.2 依赖升级、音效、测试与优化
**创建日期：** 2026-03-30
**状态：** 活跃

---

## 音效系统 (AUDIO)

### 基础音效

- [ ] **AUDIO-01**: 用户在移动方块时能听到移动音效
- [ ] **AUDIO-02**: 用户在数字合并时能听到合并音效
- [ ] **AUDIO-03**: 用户在游戏胜利时能听到胜利音效
- [ ] **AUDIO-04**: 用户在游戏失败时能听到失败音效

### 音量控制

- [ ] **AUDIO-05**: 用户可以调节音效音量
- [ ] **AUDIO-06**: 用户可以静音所有音效
- [ ] **AUDIO-07**: 音效设置（音量、静音）持久化到 localStorage

---

## E2E 测试 (E2E)

### 核心游戏流程

- [ ] **E2E-01**: E2E 测试能验证游戏核心流程（开始、移动、合并、胜负判定）
- [ ] **E2E-02**: E2E 测试能验证键盘控制功能（方向键）
- [ ] **E2E-03**: E2E 测试能验证触摸控制功能（滑动）

### 测试基础设施

- [ ] **E2E-04**: E2E 测试使用 Page Object Model 模式封装页面交互
- [ ] **E2E-05**: E2E 测试使用稳定的 data-testid 选择器
- [ ] **E2E-06**: E2E 测试可在 CI/CD 中自动运行

---

## 依赖升级 (DEPS)

- [ ] **DEPS-01**: Vue 升级到最新稳定版（当前 3.5.29）
- [ ] **DEPS-02**: Vite 升级到最新稳定版（当前 7.3.1）
- [ ] **DEPS-03**: TypeScript 升级到最新稳定版（当前 5.9.3）
- [ ] **DEPS-04**: Pinia 升级到最新稳定版（当前 3.0.4）
- [ ] **DEPS-05**: VueUse 升级到最新稳定版（当前 14.2.1）
- [ ] **DEPS-06**: 所有单元测试在升级后通过
- [ ] **DEPS-07**: 所有 E2E 测试在升级后通过

---

## 构建优化 (BUILD)

### 代码分割

- [ ] **BUILD-01**: 应用代码被分割为按需加载的块（vendor 分离）
- [ ] **BUILD-02**: 音效库（Howler.js）独立打包为单独的 chunk

### Bundle 分析

- [ ] **BUILD-03**: Bundle 分析报告可生成（rollup-plugin-visualizer）
- [ ] **BUILD-04**: Bundle 分析报告识别大模块和优化机会

### 加载性能

- [ ] **BUILD-05**: 静态资源使用 Gzip/Brotli 压缩
- [ ] **BUILD-06**: 首屏加载时间经过优化（Lighthouse 验证 ≥ 90 分）

---

## 已完成需求 (v1.1)

以下需求已在 v1.1 里程碑中完成：

### 主题系统

- [x] **THEME-01**: 用户可通过主题切换器组件选择主题
- [x] **THEME-02**: 系统提供 5 个预设主题（经典主题、天空蓝、森林绿、日落橙、樱花粉）
- [x] **THEME-03**: 主题选择持久化到 localStorage，刷新页面后保持
- [x] **THEME-04**: 主题切换时有平滑过渡效果（0.15-0.3s CSS transition）
- [x] **THEME-05**: 主题切换器显示在游戏头部，移动端响应式适配

### 性能优化

- [x] **PERF-01**: 所有动画使用 GPU 加速属性（transform、opacity）
- [x] **PERF-02**: 优化动画性能，动态管理 will-change
- [x] **PERF-03**: 游戏动画稳定在 60fps（Chrome DevTools 验证）

---

## 未来需求 (v1.3+)

以下需求推迟到后续里程碑：

### 音效系统增强
- [ ] 动态音效（随分数/连击变化音调）
- [ ] 多套音效主题
- [ ] 背景音乐

### E2E 测试扩展
- [ ] 主题切换 E2E 测试
- [ ] 音效 UI E2E 测试
- [ ] 视觉回归测试
- [ ] 性能测试（Lighthouse CI）

---

## 范围外

以下功能明确不在项目范围内：

- 多人对战模式 — 单人学习项目
- 完全自定义主题编辑器 — v1.1 只提供预设主题
- 社交分享功能 — 超出学习目标
- 大于 4x4 的网格选项 — 经典原版规则
- 高级音效编辑器 — v1.2 只提供预设音效
- 3D 空间音频 — 2D 游戏不需要
- 实时音频合成 — 使用预录制音效文件

---

## 需求追溯

| REQ-ID | 阶段 | 状态 |
|--------|------|------|
| DEPS-01 | Phase 8 | Pending |
| DEPS-02 | Phase 8 | Pending |
| DEPS-03 | Phase 8 | Pending |
| DEPS-04 | Phase 8 | Pending |
| DEPS-05 | Phase 8 | Pending |
| DEPS-06 | Phase 8 | Pending |
| DEPS-07 | Phase 8 | Pending |
| E2E-01 | Phase 9 | Pending |
| E2E-02 | Phase 9 | Pending |
| E2E-03 | Phase 9 | Pending |
| E2E-04 | Phase 9 | Pending |
| E2E-05 | Phase 9 | Pending |
| E2E-06 | Phase 9 | Pending |
| AUDIO-01 | Phase 10 | Pending |
| AUDIO-02 | Phase 10 | Pending |
| AUDIO-03 | Phase 10 | Pending |
| AUDIO-04 | Phase 10 | Pending |
| AUDIO-05 | Phase 10 | Pending |
| AUDIO-06 | Phase 10 | Pending |
| AUDIO-07 | Phase 10 | Pending |
| BUILD-01 | Phase 11 | Pending |
| BUILD-02 | Phase 11 | Pending |
| BUILD-03 | Phase 11 | Pending |
| BUILD-04 | Phase 11 | Pending |
| BUILD-05 | Phase 11 | Pending |
| BUILD-06 | Phase 11 | Pending |

---

*最后更新：2026-03-30*
