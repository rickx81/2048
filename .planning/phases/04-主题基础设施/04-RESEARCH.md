# Phase 4: 主题基础设施 - Research

**研究日期：** 2026-03-14
**领域：** Vue 3 + Pinia + CSS 变量主题系统
**信心：** HIGH

## Summary

本阶段研究聚焦于建立可扩展的主题系统基础设施，使用 CSS 变量作为主题存储机制，Pinia Store 作为状态管理层，Vue 3 Composable 作为统一访问接口。这种架构与项目现有模式完美契合（类似 `useGameStore` + `useGameControls`），并且已被 Vue 3 生态系统广泛验证。

研究显示，CSS 变量是现代主题系统的最佳选择：性能优异（GPU 加速过渡）、开发者友好（无需重新编译）、易于调试（浏览器 DevTools 实时查看）。结合 Tailwind CSS v4 的 `@theme` 指令，可以创建既灵活又一致的设计系统。

**主要建议：** 使用 `data-theme` 属性激活主题 + Pinia Store 管理状态 + CSS 变量存储颜色值 + useTheme Composable 统一访问。

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**主题配置结构：**
- 基础颜色变量：背景色、文字色、方块颜色、按钮色、边框色等基础颜色变量
- 方块颜色组织：使用键值对象 `{2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', ...}`
- 特殊效果：包含背景渐变参数（linear-gradient 的起止颜色值）
- 元数据：包含 `id` 和 `display_name` 两个必需属性

**CSS 变量组织：**
- 命名前缀：使用 `--theme-*` 前缀（如 `--theme-bg`, `--theme-text`, `--theme-tile-2`）
- 变量作用域：混合方式 — 基础颜色在 `:root`，主题特定颜色在 `[data-theme]` 选择器
- 方块颜色变量：每个数字一个变量 `--theme-tile-2`, `--theme-tile-4`, `--theme-tile-8`...

**主题激活机制：**
- 切换时机：使用动画过渡（平滑过渡 0.15-0.3s，符合 THEME-04 要求）
- 默认主题：持久化优先 — 从 localStorage 读取，没有则使用默认主题（符合 THEME-03 要求）
- FOUC 处理：index.html 内联脚本同步读取 localStorage 并设置

**类型定义：**
- ThemeConfig：使用 `interface` 定义
- ThemeColors：使用单个 interface，通过注释分组属性
- ThemeId：使用字面量联合类型 `'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'`
- 运行时验证：不需要 — 编译时类型检查即可，信任配置

### Claude's Discretion

**待决策事项：**
- 方块颜色组织方式：键值对象、数组映射、或计算函数
- CSS 变量作用域策略：全局 vs 按主题选择器 vs 混合
- CSS 变量层级结构：扁平 vs 分组 vs 语义化嵌套
- 方块颜色 CSS 变量组织：单个变量 vs 数组变量 vs 分组变量
- 主题激活方式：data 属性 vs class vs JS 注入
- FOUC 防止策略：内联脚本 vs loading 遮罩 vs 接受闪烁
- ThemeConfig 类型：interface vs type alias vs class
- ThemeColors 类型：单个 interface vs 多个类型 vs 交叉类型
- ThemeId 类型：字面量联合 vs string vs enum
- **5 个主题的具体颜色值**：霓虹暗色、天空蓝、森林绿、日落橙、樱花粉的配色方案

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| THEME-01 | 用户可通过主题切换器组件选择主题 | Pinia Store + useTheme Composable 提供状态管理和访问接口 |
| THEME-02 | 系统提供 5 个预设主题（霓虹暗色、天空蓝、森林绿、日落橙、樱花粉） | ThemeConfig 类型定义 + 5 个主题配置对象 |
| THEME-04 | 主题切换时有平滑过渡效果（0.15-0.3s CSS transition） | CSS 变量 + transition 属性实现 GPU 加速过渡 |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | ^3.5.29 | 响应式框架和组件系统 | 项目已使用，提供组合式 API 和 ref/computed |
| Pinia | ^3.0.4 | 状态管理 | 项目已使用，defineStore + setup 函数模式已验证 |
| TypeScript | ~5.9.3 | 类型安全 | 项目已使用，严格模式确保类型正确性 |
| Tailwind CSS | ^4.2.1 | 实用工具优先框架 | 项目已使用，v4 的 @theme 指令完美支持主题变量 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vueuse/core | ^14.2.1 | Vue 组合式工具库 | 项目已使用，可用于 localStorage 管理和 DOM 操作 |
| CSS Custom Properties | Native | 主题变量存储 | 所有主题颜色值都存储为 CSS 变量 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS 变量 | CSS-in-JS (styled-components) | CSS-in-JS 增加运行时开销，需要额外库，与 Tailwind 冲突 |
| data 属性 | class 切换 | class 切换语义不如 data 属性清晰，且可能与 Tailwind 冲突 |
| Pinia Store | Vuex | Pinia 是 Vue 3 官方推荐，API 更简洁，TypeScript 支持更好 |
| interface 类型 | type alias | interface 更可扩展，type alias 适合联合类型 |

**Installation:**
```bash
# 无需安装新依赖，项目已包含所有必需库
# npm install vue pinia tailwindcss @vueuse/core typescript
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── core/
│   ├── theme.ts          # 主题类型定义（ThemeId, ThemeColors, ThemeConfig, THEMES）
│   ├── types.ts          # 现有游戏类型
│   ├── game.ts           # 现有游戏逻辑
│   └── storage.ts        # 现有存储工具
├── stores/
│   ├── game.ts           # 现有游戏 Store
│   └── theme.ts          # [新建] 主题 Store（管理当前主题状态）
├── composables/
│   ├── useGameControls.ts  # 现有游戏控制
│   └── useTheme.ts          # [新建] 主题 Composable（统一访问接口）
├── components/
│   └── Tile.vue          # [Phase 5 修改] 迁移到 CSS 变量
└── style.css             # [修改] 添加 CSS 变量定义和主题选择器
```

### Pattern 1: Pinia Store with Setup Function

**What:** 使用 Pinia 的 defineStore + setup 函数模式创建主题 Store，与项目现有 `useGameStore` 保持一致。

**When to use:** 需要全局响应式状态管理时，所有组件共享当前主题状态。

**Example:**
```typescript
// src/stores/theme.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeId, ThemeConfig } from '@/core/theme'
import { THEMES } from '@/core/theme'

export const useThemeStore = defineStore('theme', () => {
  // ===== 状态 =====
  /** 当前激活的主题 ID */
  const currentThemeId = ref<ThemeId>('neon')

  // ===== 计算属性 =====
  /** 当前主题配置对象 */
  const currentTheme = computed<ThemeConfig>(() => THEMES[currentThemeId.value])

  // ===== 操作方法 =====
  /**
   * 设置主题
   * @param themeId 主题 ID
   */
  function setTheme(themeId: ThemeId) {
    if (!THEMES[themeId]) {
      throw new Error(`Unknown theme: ${themeId}`)
    }
    currentThemeId.value = themeId
    // 应用主题到 DOM（在 Composable 中实现）
  }

  return {
    currentThemeId,
    currentTheme,
    setTheme
  }
})
```

### Pattern 2: Theme Composable with Side Effects

**What:** 创建 useTheme Composable，封装 DOM 操作和副作用（设置 data 属性、CSS 变量注入），保持 Store 纯粹。

**When to use:** 需要在组件中访问主题状态并触发副作用时，提供统一的 API。

**Example:**
```typescript
// src/composables/useTheme.ts
import { watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeConfig } from '@/core/theme'

export function useTheme() {
  const store = useThemeStore()

  // 监听主题变化，应用到 DOM
  watch(
    () => store.currentThemeId,
    (newThemeId) => {
      // 方法 1: 设置 data 属性（推荐）
      document.documentElement.dataset.theme = newThemeId

      // 方法 2: 直接注入 CSS 变量（备选）
      // injectThemeVariables(store.currentTheme)
    },
    { immediate: true } // 立即执行以初始化
  )

  return {
    currentThemeId: store.currentThemeId,
    currentTheme: store.currentTheme,
    setTheme: store.setTheme
  }
}
```

### Pattern 3: CSS Variables with Semantic Naming

**What:** 使用语义化命名的 CSS 变量存储主题颜色，按功能分组（背景、文字、方块、按钮）。

**When to use:** 需要动态切换颜色且保持代码可维护性时。

**Example:**
```css
/* src/style.css */
/* 基础变量（默认值） */
:root {
  --theme-bg-primary: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text-primary: #f9f6f2;
  --theme-text-secondary: #cbd5e1;
  --theme-border: #334155;
}

/* 主题特定变量 */
[data-theme='neon'] {
  --theme-bg-primary: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text-primary: #f9f6f2;
  --theme-text-secondary: #cbd5e1;
  --theme-tile-2: #eee4da;
  --theme-tile-4: #ede0c8;
  /* ... 其他方块颜色 */
}

/* 平滑过渡 */
* {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

### Anti-Patterns to Avoid

- **在 Store 中直接操作 DOM**：Store 应该是纯粹的状态管理，DOM 操作应该在 Composable 或组件中
- **使用 class 切换主题**：可能与 Tailwind 类名冲突，使用 data 属性更语义化
- **硬编码颜色值**：避免在组件中直接写颜色值，全部使用 CSS 变量
- **嵌套的 CSS 变量**：不要使用 `var(--theme-tile-2)` 作为其他变量的值，保持扁平结构
- **滥用 will-change**：只在动画期间添加 will-change，动画后立即移除，避免内存泄漏

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 主题状态管理 | 自建全局状态对象 | Pinia Store | Pinia 提供响应式、持久化、DevTools 集成 |
| CSS 变量注入 | 手动遍历设置 style.setProperty | Tailwind v4 @theme 指令 | @theme 自动生成 CSS 变量，编译时优化 |
| localStorage 管理 | 原生 localStorage API | @vueuse/core (useStorage) | 自动序列化、响应式、类型安全 |
| 类型定义 | 手动维护类型映射 | TypeScript 字面量联合类型 | 编译时类型检查、自动补全 |

**Key insight:** 自建主题系统容易陷入"看起来简单"的陷阱。CSS 变量虽然简单，但要处理好 FOUC、持久化、响应式、性能等多个问题。使用成熟工具可以避免踩坑，专注于业务逻辑。

## Common Pitfalls

### Pitfall 1: FOUC (Flash of Unstyled Content)

**What goes wrong:** 页面加载时先显示默认主题，然后突然切换到存储的主题，造成视觉闪烁。

**Why it happens:** Vue 应用初始化是异步的，localStorage 读取在组件挂载后执行，此时 DOM 已经渲染。

**How to avoid:**
```html
<!-- index.html -->
<head>
  <script>
    // 同步读取并应用主题，在任何内容渲染之前
    const theme = localStorage.getItem('theme') || 'neon';
    document.documentElement.dataset.theme = theme;
  </script>
  <link rel="stylesheet" href="/src/style.css">
</head>
```

**Warning signs:** 刷新页面时看到颜色闪烁，DevTools Network 面板显示 CSS 在主题脚本之后加载。

### Pitfall 2: CSS 变量作用域混乱

**What goes wrong:** 主题变量在 `:root` 定义，但切换时使用了 `[data-theme]` 选择器，导致变量优先级错误。

**Why it happens:** 没有理清 CSS 变量的继承和覆盖规则，`:root` 的优先级低于 `[data-theme]`。

**How to avoid:**
- **基础变量**：在 `:root` 定义默认值（如通用的 spacing、z-index）
- **主题变量**：在 `[data-theme]` 选择器中覆盖（如颜色、字体）
- **组件变量**：在组件 scoped CSS 中定义（如特定组件的颜色）

**Warning signs:** 主题切换后某些颜色不变化，需要使用 `!important` 才能生效。

### Pitfall 3: Tailwind v4 @theme 指令误用

**What goes wrong:** 使用 `@theme` 定义主题变量，但运行时无法通过 CSS 变量切换。

**Why it happens:** `@theme` 是编译时指令，生成的是静态 Tailwind 工具类，不是动态 CSS 变量。

**How to avoid:**
```css
/* ❌ 错误：@theme 只用于编译时的 Tailwind 配置 */
@theme {
  --color-bg: #0f172a;
}

/* ✅ 正确：使用标准 CSS 变量定义主题颜色 */
[data-theme='neon'] {
  --theme-bg-primary: #0f172a;
}
```

**Warning signs:** Tailwind 类名（如 `bg-bg-primary`）可以工作，但动态切换不生效。

### Pitfall 4: 过度使用 will-change

**What goes wrong:** 给所有元素添加 `will-change: transform`，导致内存占用飙升，性能反而下降。

**Why it happens:** `will-change` 会告诉浏览器提前创建合成层，滥用会导致内存爆炸。

**How to avoid:**
```css
/* ❌ 错误：全局添加 will-change */
* {
  will-change: transform;
}

/* ✅ 正确：只在动画期间添加 */
.tile.is-animating {
  will-change: transform, opacity;
}

/* 动画结束后立即移除 */
.tile:not(.is-animating) {
  will-change: auto;
}
```

**Warning signs:** Chrome DevTools Memory 面板显示合成层数量过多，页面卡顿。

### Pitfall 5: 内联样式与主题系统冲突

**What goes wrong:** Tile.vue 使用内联样式（`style="background-color: #eee4da"`），主题切换后这些硬编码颜色不会更新。

**Why it happens:** 内联样式的优先级高于 CSS 变量，且无法被主题选择器覆盖。

**How to avoid:**
```vue
<!-- ❌ 错误：硬编码内联样式 -->
<div :style="{ backgroundColor: '#eee4da' }">

<!-- ✅ 正确：使用 CSS 变量 -->
<div :style="{ backgroundColor: 'var(--theme-tile-2)' }">

<!-- ✅ 更好：使用 Tailwind 类 + CSS 变量 -->
<div class="bg-tile-2">
```

**Warning signs:** 主题切换后，某些元素颜色不变，检查元素发现内联样式。

## Code Examples

Verified patterns from official sources:

### Theme Type Definitions

```typescript
// src/core/theme.ts
/**
 * 主题 ID 类型
 * 使用字面量联合类型，编译时类型检查
 */
export type ThemeId = 'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'

/**
 * 主题颜色接口
 * 使用单个 interface，通过注释分组属性
 */
export interface ThemeColors {
  // ===== 基础颜色 =====
  /** 主背景色 */
  bgPrimary: string
  /** 次背景色 */
  bgSecondary: string
  /** 主文字色 */
  textPrimary: string
  /** 次文字色 */
  textSecondary: string
  /** 边框色 */
  border: string

  // ===== 方块颜色 =====
  /** 空格子颜色 */
  tileEmpty: string
  /** 方块颜色映射（数字 -> 颜色） */
  tileColors: Record<number, string>

  // ===== 特殊效果 =====
  /** 背景渐变起止颜色 */
  gradientStart: string
  gradientEnd: string
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  /** 主题 ID */
  id: ThemeId
  /** 显示名称 */
  displayName: string
  /** 颜色配置 */
  colors: ThemeColors
}

/**
 * 主题配置映射
 * 所有预设主题的配置对象
 */
export const THEMES: Record<ThemeId, ThemeConfig> = {
  neon: {
    id: 'neon',
    displayName: '霓虹暗色',
    colors: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      textPrimary: '#f9f6f2',
      textSecondary: '#cbd5e1',
      border: '#334155',
      tileEmpty: '#cdc1b4',
      tileColors: {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        // ... 其他方块颜色
      },
      gradientStart: '#0f172a',
      gradientEnd: '#581c87'
    }
  },
  // ... 其他主题
}
```

**Source:** Based on project's existing TypeScript patterns in `src/core/types.ts`

### Theme Store with Persistence

```typescript
// src/stores/theme.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { ThemeId, ThemeConfig } from '@/core/theme'
import { THEMES } from '@/core/theme'

export const useThemeStore = defineStore('theme', () => {
  // ===== 状态（持久化到 localStorage） =====
  const currentThemeId = useStorage<ThemeId>('theme', 'neon')

  // ===== 计算属性 =====
  const currentTheme = computed<ThemeConfig>(() => THEMES[currentThemeId.value])

  // ===== 操作方法 =====
  function setTheme(themeId: ThemeId) {
    if (!THEMES[themeId]) {
      throw new Error(`Unknown theme: ${themeId}`)
    }
    currentThemeId.value = themeId
  }

  return {
    currentThemeId,
    currentTheme,
    setTheme
  }
})
```

**Source:** Based on project's existing `useGameStore` pattern in `src/stores/game.ts` + @vueuse/core useStorage documentation

### Theme Composable with DOM Integration

```typescript
// src/composables/useTheme.ts
import { watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeConfig } from '@/core/theme'

export function useTheme() {
  const store = useThemeStore()

  // 监听主题变化，应用到 DOM
  watch(
    () => store.currentThemeId,
    (newThemeId) => {
      document.documentElement.dataset.theme = newThemeId
    },
    { immediate: true }
  )

  return {
    currentThemeId: store.currentThemeId,
    currentTheme: store.currentTheme,
    setTheme: store.setTheme
  }
}
```

**Source:** Based on project's existing `useGameControls` pattern in `src/composables/useGameControls.ts`

### CSS Variables with Theme Selectors

```css
/* src/style.css */

/* ===== 基础变量（默认值） ===== */
:root {
  --theme-bg-primary: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text-primary: #f9f6f2;
  --theme-text-secondary: #cbd5e1;
  --theme-border: #334155;
  --theme-tile-empty: #cdc1b4;
}

/* ===== 霓虹暗色主题 ===== */
[data-theme='neon'] {
  --theme-bg-primary: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text-primary: #f9f6f2;
  --theme-text-secondary: #cbd5e1;
  --theme-border: #334155;
  --theme-tile-empty: #1e293b;
  --theme-tile-2: #eee4da;
  --theme-tile-4: #ede0c8;
  --theme-tile-8: #f2b179;
  /* ... 其他方块颜色 */
}

/* ===== 平滑过渡 ===== */
* {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* ===== 使用示例 ===== */
.game-board {
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-border);
}
```

**Source:** Based on MDN CSS Custom Properties documentation + project's existing `src/style.css`

### FOUC Prevention Script

```html
<!-- index.html -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2048 Game</title>

  <!-- 同步主题初始化脚本（防止 FOUC） -->
  <script>
    (function() {
      try {
        const theme = localStorage.getItem('theme') || 'neon';
        document.documentElement.dataset.theme = theme;
      } catch (e) {
        // localStorage 不可用（隐私模式），使用默认主题
        document.documentElement.dataset.theme = 'neon';
      }
    })();
  </script>

  <!-- 在主题脚本之后加载样式 -->
  <link rel="stylesheet" href="/src/style.css">
</head>
```

**Source:** Based on [How to Prevent Theme Flash in React](https://dev.to/gaisdav/how-to-prevent-theme-flash-in-a-react-instant-dark-mode-switching-o20) + [My under-engineered way to avoid a Flash of inAccurate coloR](https://chriskirknielsen.com/blog/my-under-engineered-way-to-avoid-a-flash-of-inaccurate-color-theme/)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sass/Less 变量 | CSS Custom Properties | 2015+ | CSS 变量可运行时修改，无需重新编译 |
| class 切换主题 | data 属性切换主题 | 2018+ | data 属性语义更强，不与 class 冲突 |
| 手动 localStorage | @vueuse/core useStorage | 2021+ | 自动序列化、响应式、类型安全 |
| 硬编码颜色 | 语义化 CSS 变量 | 2022+ | 可维护性提升，支持动态主题 |

**Deprecated/outdated:**
- **CSS-in-JS for theming**: 运行时开销大，与 Tailwind 冲突，已被 CSS 变量取代
- **Preprocessor variables**: Sass/Less 变量无法运行时修改，不适合动态主题
- **!important 覆盖**: 滥用 !important 导致样式难以维护，应使用 CSS 变量优先级

## Open Questions

1. **5 个主题的具体配色方案**
   - What we know: 需要霓虹暗色、天空蓝、森林绿、日落橙、樱花粉 5 个主题
   - What's unclear: 每个主题的具体颜色值（方块颜色、背景色、文字色等）
   - Recommendation: 基于研究收集的配色灵感 + 现有 Tile.vue 的经典颜色作为基准，在设计阶段确定具体颜色值

2. **CSS 变量命名规范**
   - What we know: 使用 `--theme-*` 前缀，语义化命名
   - What's unclear: 是否使用更细粒度的分组（如 `--theme-color-bg-primary` vs `--theme-bg-primary`）
   - Recommendation: 使用扁平结构 + 语义化命名（如 `--theme-bg-primary`），避免过度嵌套

3. **背景渐变的实现方式**
   - What we know: 需要支持背景渐变效果
   - What's unclear: 渐变是否作为 CSS 变量（如 `--theme-gradient`）还是直接在 CSS 中定义
   - Recommendation: 将渐变起止颜色作为变量（如 `--theme-gradient-start`），在 CSS 中使用 `linear-gradient(var(--theme-gradient-start), var(--theme-gradient-end))`

## Sources

### Primary (HIGH confidence)

- **[Tailwind CSS v4 - Theme variables](https://tailwindcss.com/docs/theme)** - Official documentation on @theme directive and CSS variables
- **[MDN - Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)** - Official guide on CSS custom properties (variables)
- **[Vue 3 Official Docs - Composables](https://vuejs.org/guide/reusability/composables.html)** - Official guide on Vue composables pattern
- **[Pinia Official Docs - Defining a Store](https://pinia.vuejs.org/core-concepts/#defining-a-store)** - Official guide on Pinia setup stores
- **[@vueuse/core - useStorage](https://vueuse.org/core/usestorage/)** - Official documentation on useStorage composable

### Secondary (MEDIUM confidence)

- **[Creating a Dynamic Theme Switcher in Vue 3 with CSS Variables](https://medium.com/@sj.anyway/creating-a-dynamic-theme-switcher-in-vue-3-with-css-variables-ac06219e860d)** - Verified implementation pattern
- **[Thinking Deeply About Theming and Color Naming](https://css-tricks.com/thinking-deeply-about-theming-and-color-naming/)** - Best practices on semantic naming
- **[Best Practices For Naming Design Tokens](https://www.smashingmagazine.com/2024/05/naming-best-practices/)** - Current (2024) naming conventions
- **[How to Prevent Theme Flash in React](https://dev.to/gaisdav/how-to-prevent-theme-flash-in-a-react-instant-dark-mode-switching-o20)** - FOUC prevention pattern
- **[A Scalable Naming Convention for Style Variables](https://medium.com/digio-australia/a-scalable-naming-convention-for-style-variables-6363b916432a)** - Verified naming strategy

### Tertiary (LOW confidence - marked for validation)

- **[Color-Hex - Neon Cyberpunk Palette](https://www.color-hex.com/color-palette/1048095)** - Color inspiration for neon theme (needs validation for accessibility)
- **[Media.io - Forest Green Color Palette](https://www.media.io/color-palette/forest-green-color-palette.html)** - Color inspiration for forest theme (needs validation for contrast ratios)
- **[Build a Flawless Multi-Theme UI using Tailwind CSS v4](https://medium.com/render-beyond/build-a-flawless-multi-theme-ui-using-new-tailwind-css-v4-react-dca2b3c95510)** - Tutorial implementation (needs verification for Vue 3)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, verified in package.json
- Architecture: HIGH - Patterns match existing project structure (useGameStore + useGameControls)
- Pitfalls: HIGH - All pitfalls verified with official documentation and community best practices
- Color schemes: MEDIUM - Color inspiration sources need validation for accessibility (contrast ratios, color blindness)

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (30 days - CSS variables and Tailwind v4 are stable, but Vue 3 ecosystem evolves)
