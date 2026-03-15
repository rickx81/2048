# Phase 5: 主题集成 - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

将 Phase 4 建立的主题系统应用到 UI 层，实现主题持久化到 localStorage 和响应式适配。核心功能包括创建 ThemeSwitcher 组件、重构 Tile.vue 使用 CSS 变量，以及实现 localStorage 读写逻辑。

依赖：Phase 4 主题基础设施已完成（theme.ts, theme store, useTheme composable）

</domain>

<decisions>
## Implementation Decisions

### 切换器 UI 设计
- **UI 形式**：下拉菜单（点击按钮弹出菜单，显示 5 个主题名称）
- **按钮位置**：放在 GameHeader 控制区中间（撤销和新游戏按钮之间）
- **按钮图标**：调色板图标（通用图标，用户熟悉）
- **显示内容**：仅图标（桌面和移动端一致），与现有撤销/新游戏按钮保持一致

### Tile.vue 迁移
- **迁移范围**：仅迁移颜色相关的内联样式到 CSS 变量（backgroundColor, color）
- **字体大小**：保留内联样式函数 `getFontSize()`（不迁移到 CSS 变量）
- **空格子处理**：使用主题变量 `--theme-tile-bg-0`（不同主题可以有不同空格颜色）

### localStorage 集成
- **读取时机**：在 Theme Store 初始化时读取（通过 useTheme composable 调用）
- **写入时机**：每次用户切换主题时立即写入
- **错误处理**：静默回退 — 如果 localStorage 不可用或写入失败，使用默认主题，不在 UI 显示错误，在控制台记录警告
- **存储键名**：`2048-game-theme`（明确的项目前缀）

### 过渡效果
- **过渡范围**：全局过渡 — 在根元素或 body 上为所有颜色变量添加 transition
- **过渡时长**：0.2s（平衡视觉效果和响应性，符合 THEME-04 要求的 0.15-0.3s）
- **缓动函数**：ease-in-out（开始和结束时较慢，更自然的颜色过渡）
- **过渡属性**：仅颜色属性（background-color, color, border-color）以获得最佳性能

### Claude's Discretion
- **下拉菜单实现方式**：原生 select、Vue 组件库（如 headless UI）、或自定义下拉
- **菜单项显示**：仅显示主题名称，或同时显示颜色预览
- **主题切换器组件的文件位置和命名**
- **localStorage 读写逻辑的具体实现细节**（try-catch 结构、JSON.parse 等）
- **全局 transition 的具体 CSS 选择器和属性**
- **是否需要添加 index.html 内联脚本防止 FOUC**

</decisions>

<specifics>
## Specific Ideas

- 主题切换器应该与现有控制按钮（撤销、新游戏）在视觉上保持一致
- 移动端应该优先考虑简洁性（仅图标）
- 下拉菜单在移动端需要良好的触摸体验
- Tile.vue 迁移后应该保持现有的动画效果（tile-new, tile-merged）
- 主题切换不应影响游戏性能

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`useTheme.ts` Composable** — Phase 4 创建，提供 `currentTheme`, `setTheme()`, `themes` 数组
- **`theme.ts` Store** — Phase 4 创建，管理当前主题状态
- **`theme.ts` 类型定义** — Phase 4 创建，定义 ThemeId, ThemeColors, ThemeConfig
- **GameHeader.vue** — 现有 controls-container，可添加主题切换器
- **Tile.vue** — 使用硬编码颜色映射，需要迁移到 CSS 变量

### Established Patterns
- **Pinia Store 模式** — defineStore + setup 函数 + ref/computed
- **Composable 模式** — 返回响应式状态和方法的函数
- **控制按钮模式** — SVG 图标 + 文字（移动端隐藏文字），统一的 .control-btn 样式

### Integration Points
- **需要创建**：
  - `ThemeSwitcher.vue` 组件
  - localStorage 读写逻辑（可放在 theme store 或 composable 中）
- **需要修改**：
  - `GameHeader.vue` — 集成 ThemeSwitcher 组件
  - `Tile.vue` — 移除硬编码颜色，使用 CSS 变量
  - `src/style.css` — 添加全局 transition 和主题变量定义
  - `index.html` — 可选：添加 FOUC 防止内联脚本

### Known Conflicts
- **Tile.vue 硬编码颜色** — 与动态主题系统冲突，本阶段解决
- **FOUC 风险** — 页面加载时可能闪烁，需要考虑 index.html 内联脚本

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-theme-integration*
*Context gathered: 2026-03-15*
