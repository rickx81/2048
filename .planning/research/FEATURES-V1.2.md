# 功能特性 - v1.2 音效、测试与优化

**领域:** Web 游戏（2048）- 音效、测试与优化
**研究时间:** 2026-03-30
**置信度:** HIGH

## 标配功能

用户期望的功能。缺少这些功能会让产品感觉不完整。

### 音效系统

| 功能 | 为什么预期 | 复杂度 | 备注 |
|------|----------|--------|------|
| **移动音效** | 即时反馈，确认用户操作 | Low | 短暂、轻柔的滑动音效（约 220Hz） |
| **合并音效** | 奖励反馈，增强成就感 | Low | 满意、柔和但不花哨（约 440Hz） |
| **生成音效** | 新方块出现的视觉确认 | Low | 中等音调（约 330Hz） |
| **游戏胜利音效** | 成就感、里程碑反馈 | Med | 上升旋律或和弦 |
| **游戏失败音效** | 游戏结束提示 | Med | 下降旋律或和弦 |
| **音量控制/静音** | 用户自主控制，避免干扰 | Low | 必需功能，移动端尤其重要 |
| **设置持久化** | 保存用户偏好 | Low | localStorage 存储音量和静音状态 |

**预期行为：**
- **触发时机：** 移动时立即播放音效，与视觉动画同步
- **多个合并：** 每次合并都应触发独立音效，避免过度重叠
- **音量变化：** 根据合并的数字值调整音调/音量（可选）
- **移动端限制：** 需要用户交互才能播放音效（autoplay 策略）
- **预加载：** 在用户首次交互时预加载/预启动音频

### E2E 测试

| 功能 | 为什么预期 | 复杂度 | 备注 |
|------|----------|--------|------|
| **核心游戏流程测试** | 验证游戏基本逻辑正确性 | Med | 新游戏、移动、合并、计分、胜负判定 |
| **键盘控制测试** | 验证桌面端交互 | Low | 方向键控制、正确响应 |
| **触摸控制测试** | 验证移动端交互 | Med | 滑动手势模拟（Playwright mouse API） |
| **鼠标控制测试** | 验证鼠标交互 | Low | 点击、拖拽 |
| **主题切换测试** | 验证主题功能 | Low | 切换、持久化、视觉正确性 |
| **CI/CD 集成** | 自动化测试保障质量 | Med | GitHub Actions 中运行 Playwright |

**预期行为：**
- **测试隔离：** 每个测试独立运行，不依赖状态
- **快速反馈：** 测试应在合理时间内完成（<5 分钟）
- **覆盖关键流程：** 专注于用户核心路径，不追求 100% 覆盖
- **稳定可靠：** 避免脆弱的测试，使用稳定的定位器
- **调试友好：** 失败时提供清晰的错误信息和截图

### 构建优化

| 功能 | 为什么预期 | 复杂度 | 备注 |
|------|----------|--------|------|
| **代码分割** | 按需加载，提升首屏性能 | Low | Vite 自动处理 + 手动配置 |
| **包体积分析** | 识别优化机会 | Low | 使用 rollup-plugin-visualizer |
| **Bundle 分析报告** | 可视化依赖关系 | Low | 生成 treemap 或 sunburst 图 |
| **首屏加载优化** | 减少首次交互时间 | Med | 延迟加载非关键资源 |
| **Tree-shaking** | 移除未使用代码 | Low | Vite 自动处理 |
| **压缩优化** | 减小传输体积 | Low | Vite 默认 gzip 压缩 |

**预期行为：**
- **懒加载组件：** 非首屏组件使用动态导入
- **依赖分离：** vendor chunk 与应用代码分离
- **缓存策略：** 利用浏览器缓存，hash 文件名
- **构建时间：** 优化不应显著增加构建时间
- **运行时性能：** 代码分割不影响运行时性能

## 差异化功能

让产品脱颖而出。不是必需的，但被用户重视。

### 高级音效

| 功能 | 价值主张 | 复杂度 | 备注 |
|------|----------|--------|------|
| **动态音效** | 随分数/连击变化音调 | High | 增强沉浸感 |
| **环境音效** | 背景音乐/氛围音 | Med | 需要循环播放、音量平衡 |
| **音效主题** | 不同主题对应不同音效 | High | 符合主题风格的音效包 |
| **3D 音效** | 空间音频定位 | High | Web Audio API PannerNode |

### 高级测试

| 功能 | 价值主张 | 复杂度 | 备注 |
|------|----------|--------|------|
| **视觉回归测试** | 检测 UI 意外变化 | Med | Percy/Chromatic 工具 |
| **性能测试** | Lighthouse CI 集成 | Med | 自动化性能指标 |
| **可访问性测试** | axe-core 集成 | Low | 自动化 a11y 检查 |

### 高级优化

| 功能 | 价值主张 | 复杂度 | 备注 |
|------|----------|--------|------|
| **预加载策略** | 智能资源预加载 | Med | `<link rel="preload">` |
| **Service Worker** | 离线支持、缓存优化 | High | PWA 基础 |
| **CDN 集成** | 全球加速 | Low | 静态资源 CDN |
| **HTTP/2 推送** | 主动推送资源 | Low | 服务器配置 |

## 反功能（Anti-Features）

明确不构建的功能。

| 反功能 | 避免原因 | 替代方案 |
|--------|----------|----------|
| **自动播放音效** | 违反浏览器策略，用户体验差 | 首次交互时预启动 |
| **大型音频文件** | 加载慢，浪费带宽 | Audio sprites 或压缩音频 |
| **过度音效** | 分散注意力，影响性能 | 仅关键操作使用音效 |
| **测试 100% 覆盖** | 维护成本高，收益递减 | 聚焦核心路径 |
| **过度分割代码** | 增加复杂度，HTTP/2 下收益有限 | 合理分割，避免碎片化 |
| **复杂的构建优化** | 增加维护负担 | 优先 Vite 默认优化 |

## 功能依赖关系

```
音效系统：
音频资源准备 → 音频管理器 → 音量控制 → 设置持久化
                ↓
          UI 组件集成

E2E 测试：
Playwright 设置 → 测试基础设施 → 游戏流程测试 → 控制测试 → 主题测试
                                         ↓
                                   CI/CD 集成

构建优化：
Vite 配置 → 代码分割 → Bundle 分析 → 性能监控
```

**跨领域依赖：**
- E2E 测试依赖音效系统完成（测试音效功能）
- 构建优化独立于其他功能，可并行开发
- 音效系统需要音频资源（外部依赖）

## MVP 推荐

**优先实现：**
1. **音效系统基础**（移动、合并、音量控制）
2. **核心流程 E2E 测试**（游戏基本逻辑）
3. **基础构建优化**（代码分割、Bundle 分析）

**延后实现：**
- 高级音效（动态音效、环境音效）：v1.2 后续迭代
- 视觉回归测试：v1.3 或更高版本
- Service Worker/预加载：PWA 里程碑考虑

**理由：**
- 音效基础是 v1.2 核心需求，用户期待度高
- 核心 E2E 测试保障回归风险，覆盖关键路径
- 基础优化成本低、收益高，Vite 开箱即用

## 复杂度说明

### 音效系统复杂度

**低复杂度部分：**
- 音量控制/静音：Web Audio API GainNode 或 HTMLAudioElement.volume
- 设置持久化：VueUse useStorage 或 localStorage
- 基础音效播放：Howler.js 或原生 Audio API

**中等复杂度部分：**
- 移动端 autoplay 兼容：需要用户交互预启动
- 音效同步：与动画精确同步
- 音频 sprites：时间管理、事件监听

**高复杂度部分：**
- 动态音效：根据游戏状态变化
- 环境音效：循环播放、音量平衡
- 音效主题：多套音效资源管理

### E2E 测试复杂度

**低复杂度部分：**
- 键盘控制测试：page.keyboard.down/up
- 主题切换测试：点击按钮、验证样式
- Playwright 基础设置：安装、配置

**中等复杂度部分：**
- 触摸滑动测试：模拟触摸事件、计算方向
- 游戏流程测试：多步骤交互、状态验证
- CI/CD 集成：GitHub Actions 配置

**高复杂度部分：**
- 复杂手势：多指触控、长按
- 视觉回归：工具集成、基线管理
- 性能测试：Lighthouse CI、阈值设定

### 构建优化复杂度

**低复杂度部分：**
- Tree-shaking：Vite 自动处理
- 代码分割：Vite 默认分割策略
- 压缩：Vite 默认 gzip

**中等复杂度部分：**
- 手动分割：配置 build.rollupOptions.output.manualChunks
- Bundle 分析：rollup-plugin-visualizer 配置
- 懒加载：动态导入语法

**高复杂度部分：**
- 高级分割策略：依赖图分析
- Service Worker：Workbox 配置
- 性能监控：持续集成、趋势分析

## 对现有功能的依赖

### 音效系统依赖
- **游戏核心逻辑**：需要知道何时触发移动、合并、生成、胜利、失败事件
- **状态管理**：可能需要扩展 store 管理音效状态
- **UI 组件**：需要在游戏界面添加音量控制 UI

### E2E 测试依赖
- **完整游戏功能**：需要测试所有已实现的功能
- **主题系统**：需要验证主题切换
- **控制方式**：需要测试键盘、触摸、鼠标三种输入

### 构建优化依赖
- **无硬依赖**：构建优化是独立的技术改进
- **潜在影响**：代码分割可能需要调整组件结构

## 技术选型建议

### 音效系统
- **推荐：** Howler.js（跨浏览器兼容性好）
- **备选：** 原生 Web Audio API（更灵活，但代码量更多）
- **音频格式：** MP3（兼容性）+ OGG（开源方案）或仅 MP3

### E2E 测试
- **工具：** Playwright（官方推荐，现代浏览器支持）
- **断言库：** Playwright 内置 expect
- **辅助工具：** @axe-core/playwright（可访问性测试）

### 构建优化
- **分析工具：** rollup-plugin-visualizer（Bundle 分析）
- **代码分割：** Vite 内置 + 手动配置
- **性能监控：** Lighthouse CI（可选）

## 信息来源

### 音效系统
- [MDN - Audio for Web Games](https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games) - HIGH confidence
- [How to play sound effects in Vue 3 app with Composition API](https://stackoverflow.com/questions/70780969/how-to-play-sound-effects-in-vue-3-app-with-composition-api) - MEDIUM confidence
- [Game dev: Best method to add UI sounds to components?](https://www.reddit.com/r/vuejs/comments/c4jhka/game_dev_best_method_to_add_ui_sounds_to/) - MEDIUM confidence
- [Rethinking game audio: from sound effects to player experience](https://uxdesign.cc/rethinking-game-audio-from-sound-effects-to-player-experience-413f40442a32) - MEDIUM confidence
- [Process2048 - 2048 Game for ProcessWire](https://github.com/mxmsmnv/Process2048) - LOW confidence（实现参考）

### E2E 测试
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing) - HIGH confidence
- [How to Use Playwright for Testing Vue Applications in 2026](https://www.browserstack.com/guide/playwright-vue) - MEDIUM confidence
- [E2E Testing Best Practices with Playwright in 2026](https://elionavarrete.com/blog/e2e-best-practices-playwright.html) - MEDIUM confidence
- [Mocking Swipe in Playwright Testing](https://dpnkr.in/blog/swipe-playwright-testing) - MEDIUM confidence

### 构建优化
- [Vite Build Guide](https://vite.dev/guide/build.html) - HIGH confidence
- [Vite Performance Guide](https://vite.dev/guide/performance) - HIGH confidence
- [Optimize Vite Build Time](https://dev.to/perisicnikola37/optimize-vite-build-time-a-comprehensive-guide-4c99) - MEDIUM confidence
- [Use Manual Chunks with Vite](https://soledadpenades.com/posts/2025/use-manual-chunks-with-vite-to-facilitate-dependency-caching/) - MEDIUM confidence
