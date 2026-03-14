# Phase 4: 主题基础设施 - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

建立主题系统核心基础，实现主题配置、状态管理和切换逻辑。这个阶段专注于基础设施，不涉及 UI 集成（UI 集成在 Phase 5）。

核心功能：
- 定义主题类型系统（TypeScript 接口和类型）
- 创建 5 个预设主题配置对象
- 实现 Theme Store（Pinia）管理当前主题状态
- 实现 useTheme Composable 统一访问接口
- 建立主题激活机制（CSS 变量注入到 DOM）

</domain>

<decisions>
## Implementation Decisions

### 主题配置结构
- **基础颜色变量**：背景色、文字色、方块颜色、按钮色、边框色等基础颜色变量
- **方块颜色组织**：使用键值对象 `{2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', ...}` — Claude 决定
- **特殊效果**：包含背景渐变参数（linear-gradient 的起止颜色值）
- **元数据**：包含 `id` 和 `display_name` 两个必需属性

### CSS 变量组织
- **命名前缀**：使用 `--theme-*` 前缀（如 `--theme-bg`, `--theme-text`, `--theme-tile-2`）
- **变量作用域**：混合方式 — 基础颜色在 `:root`，主题特定颜色在 `[data-theme]` 选择器 — Claude 决定
- **变量层级**：扁平结构，语义化命名（如 `--color-bg-primary`, `--color-tile-2`）— Claude 决定
- **方块颜色变量**：每个数字一个变量 `--theme-tile-2`, `--theme-tile-4`, `--theme-tile-8`... — Claude 决定

### 主题激活机制
- **激活方式**：使用 `data-theme` 属性（如 `data-theme="neon"`）— Claude 决定
- **切换时机**：使用动画过渡（平滑过渡 0.15-0.3s，符合 THEME-04 要求）
- **默认主题**：持久化优先 — 从 localStorage 读取，没有则使用默认主题（符合 THEME-03 要求）
- **FOUC 处理**：index.html 内联脚本同步读取 localStorage 并设置 — Claude 决定

### 类型定义
- **ThemeConfig**：使用 `interface` 定义 — Claude 决定
- **ThemeColors**：使用单个 interface，通过注释分组属性 — Claude 决定
- **ThemeId**：使用字面量联合类型 `'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'` — Claude 决定
- **运行时验证**：不需要 — 编译时类型检查即可，信任配置

### Claude's Discretion
- **方块颜色组织方式**：键值对象、数组映射、或计算函数
- **CSS 变量作用域策略**：全局 vs 按主题选择器 vs 混合
- **CSS 变量层级结构**：扁平 vs 分组 vs 语义化嵌套
- **方块颜色 CSS 变量组织**：单个变量 vs 数组变量 vs 分组变量
- **主题激活方式**：data 属性 vs class vs JS 注入
- **FOUC 防止策略**：内联脚本 vs loading 遮罩 vs 接受闪烁
- **ThemeConfig 类型**：interface vs type alias vs class
- **ThemeColors 类型**：单个 interface vs 多个类型 vs 交叉类型
- **ThemeId 类型**：字面量联合 vs string vs enum
- **5 个主题的具体颜色值**：霓虹暗色、天空蓝、森林绿、日落橙、樱花粉的配色方案

</decisions>

<specifics>
## Specific Ideas

- 用户希望在 Phase 5 将 Tile.vue 的硬编码内联样式迁移到 CSS 变量系统
- 主题切换需要平滑的视觉过渡效果
- 主题选择需要持久化到 localStorage
- 参考现有 Tile.vue 的颜色映射作为经典主题的基准

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Pinia Store 模式** (`src/stores/game.ts`) — defineStore + setup 函数 + ref/computed 模式
- **Composable 模式** (`src/composables/useGameControls.ts`) — 返回响应式状态和方法的函数
- **现有样式基础** (`src/style.css`) — 已有 `.dark` 类和全局样式结构，使用 Tailwind CSS v4

### Established Patterns
- **Pinia Composition API**：defineStore + setup 函数
- **TypeScript 严格模式**：所有类型明确定义
- **TDD 开发模式**：核心逻辑 100% 测试覆盖
- **不可变数据结构**：所有操作返回新状态

### Integration Points
- **需要创建**：
  - `src/core/theme.ts` — 主题类型定义（ThemeId, ThemeColors, ThemeConfig）
  - `src/stores/theme.ts` — Theme Store（管理当前主题状态）
  - `src/composables/useTheme.ts` — useTheme Composable（统一访问接口）
- **需要修改**：
  - `src/style.css` — 添加 CSS 变量定义和主题选择器
  - `index.html` — 添加 FOUC 防止内联脚本（Phase 5）

### Known Conflicts
- **Tile.vue 使用硬编码内联样式** — 与动态主题系统冲突，需要在 Phase 5 迁移到 CSS 变量

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-主题基础设施*
*Context gathered: 2026-03-14*
