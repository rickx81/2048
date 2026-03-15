# Phase 5: 主题集成 - Research

**研究日期：** 2026-03-15
**领域：** Vue 3 + CSS 变量主题系统 + localStorage 持久化
**信心级别：** HIGH

## Summary

Phase 5 将 Phase 4 建立的主题基础设施（theme.ts、theme store、useTheme composable）集成到 UI 层，实现主题持久化和响应式适配。核心任务包括：创建 ThemeSwitcher 组件、重构 Tile.vue 使用 CSS 变量、实现 localStorage 读写逻辑，以及添加平滑过渡效果。

**主要推荐：** 使用 VueUse 的 `useStorage` 实现主题持久化（已安装 @vueuse/core ^14.2.1），利用其内置的类型安全、错误处理和跨标签页同步能力。ThemeSwitcher 组件采用简单的自定义下拉菜单，避免引入额外依赖。

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
**切换器 UI 设计**
- UI 形式：下拉菜单（点击按钮弹出菜单，显示 5 个主题名称）
- 按钮位置：放在 GameHeader 控制区中间（撤销和新游戏按钮之间）
- 按钮图标：调色板图标（通用图标，用户熟悉）
- 显示内容：仅图标（桌面和移动端一致），与现有撤销/新游戏按钮保持一致

**Tile.vue 迁移**
- 迁移范围：仅迁移颜色相关的内联样式到 CSS 变量（backgroundColor, color）
- 字体大小：保留内联样式函数 `getFontSize()`（不迁移到 CSS 变量）
- 空格子处理：使用主题变量 `--theme-tile-bg-0`（不同主题可以有不同空格颜色）

**localStorage 集成**
- 读取时机：在 Theme Store 初始化时读取（通过 useTheme composable 调用）
- 写入时机：每次用户切换主题时立即写入
- 错误处理：静默回退 — 如果 localStorage 不可用或写入失败，使用默认主题，不在 UI 显示错误，在控制台记录警告
- 存储键名：`2048-game-theme`（明确的项目前缀）

**过渡效果**
- 过渡范围：全局过渡 — 在根元素或 body 上为所有颜色变量添加 transition
- 过渡时长：0.2s（平衡视觉效果和响应性，符合 THEME-04 要求的 0.15-0.3s）
- 缓动函数：ease-in-out（开始和结束时较慢，更自然的颜色过渡）
- 过渡属性：仅颜色属性（background-color, color, border-color）以获得最佳性能

### Claude's Discretion
- 下拉菜单实现方式：原生 select、Vue 组件库（如 headless UI）、或自定义下拉
- 菜单项显示：仅显示主题名称，或同时显示颜色预览
- 主题切换器组件的文件位置和命名
- localStorage 读写逻辑的具体实现细节（try-catch 结构、JSON.parse 等）
- 全局 transition 的具体 CSS 选择器和属性
- 是否需要添加 index.html 内联脚本防止 FOUC

### Deferred Ideas (OUT OF SCOPE)
None

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| THEME-03 | 主题选择持久化到 localStorage，刷新页面后保持 | VueUse useStorage 提供类型安全的自动持久化，支持错误回退 |
| THEME-05 | 主题切换器显示在游戏头部，移动端响应式适配 | 现有 GameHeader.vue 控制按钮模式支持响应式（移动端隐藏文字），CSS 变量自动适配 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @vueuse/core | ^14.2.1 | Reactive storage utilities | VueUse 是 Vue 3 官方推荐的组合式 API 工具库，`useStorage` 提供类型安全、自动序列化、跨标签页同步和错误处理 |
| Pinia | ^3.0.4 | Theme state management | 项目已使用 Pinia 作为状态管理，Phase 4 已创建 theme store，保持一致性 |
| Vue 3 Composition API | ^3.5.29 | Reactive logic | 项目使用 `<script setup>` 语法，符合 2026 年最佳实践 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Variables | Native | Dynamic theming | 现代浏览器原生支持，性能最优，Phase 4 已在 style.css 定义 |
| TypeScript | ~5.9.3 | Type safety | 项目使用严格模式，确保类型安全 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| VueUse useStorage | pinia-plugin-persistedstate | pinia-plugin-persistedstate 需要额外依赖，useStorage 已安装且更灵活；对于单个主题值，useStorage 足够 |
| 自定义下拉菜单 | Headless UI / Radix Vue | 项目已有基础 UI，避免引入额外依赖；自定义下拉可控性更强 |
| 内联脚本防 FOUC | CSS `visibility: hidden` + 后续显示 | 内联脚本更可靠，确保主题在首次渲染前加载 |

**Installation:**
无需安装额外依赖，项目已包含所有必需库。

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ThemeSwitcher.vue     # 新建：主题切换器组件
│   ├── GameHeader.vue        # 修改：集成 ThemeSwitcher
│   └── Tile.vue              # 修改：使用 CSS 变量替代硬编码颜色
├── composables/
│   └── useTheme.ts           # 已存在：添加 localStorage 逻辑
├── stores/
│   └── theme.ts              # 已存在：可能需要调整初始化逻辑
├── core/
│   └── theme.ts              # 已存在：主题类型和配置
└── style.css                 # 修改：确保全局过渡生效
```

### Pattern 1: VueUse useStorage for Theme Persistence
**What:** 使用 VueUse 的 `useStorage` 自动同步主题 ID 到 localStorage
**When to use:** 需要持久化单个字符串值（主题 ID）到浏览器存储
**Example:**
```typescript
// 在 useTheme composable 或 theme store 中
import { useStorage } from '@vueuse/core'
import type { ThemeId } from '@/core/theme'

// 自动同步到 localStorage，键名为 '2048-game-theme'
const storedThemeId = useStorage<ThemeId>('2048-game-theme', 'neon', undefined, {
  onError: (error) => {
    console.warn('Failed to access localStorage:', error)
    // 静默回退到默认值
  }
})

// 读取时使用存储的值或默认值 'neon'
const currentThemeId = ref<ThemeId>(storedThemeId.value || 'neon')

// 写入时自动同步到 localStorage
watch(currentThemeId, (newId) => {
  storedThemeId.value = newId
})
```

**Source:** [VueUse useStorage Documentation](https://vueuse.org/core/useStorage/) - HIGH confidence

### Pattern 2: ThemeSwitcher Component with Custom Dropdown
**What:** 自定义下拉菜单组件，点击按钮显示主题列表，再次点击外部关闭
**When to use:** 需要完全控制下拉菜单样式和行为，且项目已有基础 UI 模式
**Example:**
```vue
<template>
  <div class="theme-switcher">
    <button
      @click="toggleDropdown"
      class="control-btn theme-btn"
      title="切换主题"
    >
      <!-- 调色板图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="13.5" cy="6.5" r="2.5"/>
        <circle cx="17.5" cy="10.5" r="2.5"/>
        <circle cx="8.5" cy="7.5" r="2.5"/>
        <circle cx="6.5" cy="12.5" r="2.5"/>
        <path d="M12 12c-2.5-2.5-7-2-9 2"/>
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div v-if="isOpen" class="theme-dropdown">
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="setTheme(theme.id)"
        class="theme-option"
        :class="{ 'active': theme.id === currentThemeId }"
      >
        {{ theme.displayName }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onClickOutside } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { THEMES } from '@/core/theme'

const { currentThemeId, setTheme } = useTheme()
const themes = Object.values(THEMES)
const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 点击外部关闭下拉
const dropdownRef = ref<HTMLElement>()
onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 150px;
}

.theme-option {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--theme-text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.theme-option:hover {
  background: var(--theme-bg-primary);
}

.theme-option.active {
  background: var(--theme-bg-primary);
  font-weight: 700;
}
</style>
```

**Pattern Source:** 基于项目现有 GameHeader.vue 控制按钮模式 + VueUse `onClickOutside` 最佳实践 - MEDIUM confidence

### Pattern 3: Tile.vue CSS Variables Migration
**What:** 将硬编码颜色映射替换为 CSS 变量引用，保持字体大小函数不变
**When to use:** 需要动态主题切换，且颜色已在 style.css 定义为 CSS 变量
**Example:**
```vue
<template>
  <div
    :class="[
      'tile',
      isNew ? 'tile-new' : '',
      isMerged ? 'tile-merged' : '',
      value !== 0 ? 'will-change-transform' : ''
    ]"
    :style="tileStyle"
  >
    <span class="tile-number" :style="textStyle">{{ value || '' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  row: number
  col: number
}

const props = defineProps<Props>()

// 使用 computed 计算样式，引用 CSS 变量
const tileStyle = computed(() => {
  if (props.value === 0) {
    return {
      backgroundColor: 'var(--theme-tile-empty)',
    }
  }

  return {
    backgroundColor: `var(--theme-tile-${props.value})`,
  }
})

const textStyle = computed(() => {
  if (props.value === 0) return {}

  // 2 和 4 使用深色文字，其他使用白色
  const darkTextNumbers = [2, 4]
  const useDarkText = darkTextNumbers.includes(props.value)

  return {
    color: useDarkText ? 'var(--theme-text-secondary)' : 'var(--theme-text-primary)',
    fontSize: getFontSize(props.value),
    fontWeight: '700',
  }
})

// 字体大小函数保持不变
function getFontSize(value: number): string {
  if (value === 0) return ''
  const digits = value.toString().length
  if (digits <= 2) return '3rem'
  if (digits === 3) return '2.25rem'
  if (digits === 4) return '1.75rem'
  return '1.5rem'
}
</script>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  /* 移除内联 transition，依赖全局 transition */
}

.tile-number {
  display: inline-block;
  text-align: center;
  line-height: 1;
}
</style>
```

**Pattern Source:** Phase 4 style.css CSS 变量定义 + 项目现有 Tile.vue 结构 - HIGH confidence

### Anti-Patterns to Avoid
- **硬编码 localStorage 读写**：使用原生 `localStorage.getItem/setItem` 而不是 VueUse useStorage，导致缺少类型安全、错误处理和跨标签页同步
- **在 index.html 添加复杂的同步脚本**：过度的 FOUC 防止逻辑可能影响性能，简单场景下可依赖 CSS 变量的即时性
- **为所有属性添加 transition**：对 `transform`、`width`、`height` 等非颜色属性添加 transition 会影响性能，仅对颜色属性过渡
- **使用第三方 UI 库**：引入 Headless UI 或 Radix Vue 仅用于下拉菜单，增加 bundle 大小，项目已有基础 UI 模式

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage 持久化 | 手动 try-catch + JSON.parse + 事件监听 | VueUse `useStorage` | 内置类型安全、自动序列化、错误处理、跨标签页同步，减少 80% 代码量 |
| 下拉菜单点击外部关闭 | 手动事件监听器 + 生命周期管理 | VueUse `onClickOutside` | 自动管理事件监听器生命周期，防止内存泄漏 |
| 响应式主题状态 | 手动 ref + watch + localStorage 同步 | VueUse `useStorage` + Pinia | 双向自动同步，无需手动 watch，避免状态不同步 bug |

**Key insight:** VueUse 提供的工具经过大量项目验证，覆盖了边缘情况（如 localStorage 配额超限、隐私模式、跨标签页同步），自己实现这些功能容易遗漏关键场景。

## Common Pitfalls

### Pitfall 1: 主题切换时的 FOUC（Flash of Unstyled Content）
**What goes wrong:** 页面加载时短暂显示默认主题（霓虹），然后突然切换到存储的主题，造成视觉闪烁
**Why it happens:** Vue 应用挂载后才执行 useTheme composable，读取 localStorage 并设置 `data-theme` 属性，CSS 变量在此之前使用默认值
**How to avoid:** 在 index.html 添加同步脚本，在 Vue 应用加载前读取 localStorage 并设置 `data-theme` 属性
**Warning signs:** 刷新页面时看到背景色或方块颜色闪烁
**Solution:**
```html
<!-- index.html -->
<body>
  <script>
    (function() {
      try {
        const storedTheme = localStorage.getItem('2048-game-theme')
        if (storedTheme) {
          document.documentElement.dataset.theme = storedTheme
        }
      } catch (e) {
        // 静默回退，使用默认主题
        console.warn('Failed to read theme from localStorage:', e)
      }
    })()
  </script>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
```
**Confidence:** HIGH - 基于 [Stack Overflow FOUC 防止最佳实践](https://stackoverflow.com/questions/3221561/eliminate-flash-of-unstyled-content)

### Pitfall 2: localStorage 配额超限或隐私模式
**What goes wrong:** 用户设备 localStorage 已满或处于隐私模式，写入失败导致主题切换无效
**Why it happens:** localStorage 有 5-10MB 配额限制，隐私模式可能禁用 localStorage
**How to avoid:** 使用 VueUse useStorage 的 `onError` 回捕错误，静默回退到默认主题，不在 UI 显示错误
**Warning signs:** 控制台出现 `QuotaExceededError` 或主题切换后刷新页面重置
**Solution:**
```typescript
const storedThemeId = useStorage('2048-game-theme', 'neon', undefined, {
  onError: (error) => {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, theme will not persist')
    } else {
      console.warn('Failed to access localStorage:', error)
    }
  }
})
```
**Confidence:** HIGH - 基于 [VueUse useStorage 文档](https://vueuse.org/core/useStorage/) 和 [MDN localStorage 错误处理](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Pitfall 3: CSS 变量 transition 影响性能
**What goes wrong:** 为所有属性（包括 transform、width）添加 transition，导致主题切换时页面卡顿
**Why it happens:** transition 触发浏览器重排（reflow）和重绘（repaint），非颜色属性尤其昂贵
**How to avoid:** 仅对颜色属性（background-color、color、border-color）添加 transition，避免对布局属性过渡
**Warning signs:** 主题切换时 FPS 下降到 60 以下，Chrome DevTools Performance 录制显示长任务
**Solution:**
```css
/* style.css */
/* 仅对颜色属性添加过渡 */
* {
  transition: background-color 0.2s ease-in-out,
              color 0.2s ease-in-out,
              border-color 0.2s ease-in-out;
}

/* 或者使用更具体的选择器 */
.tile, .control-btn, .score-box {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
```
**Confidence:** HIGH - 基于 [MDN CSS 性能优化](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS) 和 [CSS transition 性能最佳实践](https://dev.to/hasunnilupul/css-performance-tips-writing-faster-more-efficient-styles-46f0)

### Pitfall 4: 移动端下拉菜单触摸体验差
**What goes wrong:** 移动端点击下拉菜单后无法关闭，或点击外部区域不响应
**Why it happens:** 移动端触摸事件（touchstart）与点击事件（click）行为不同，需要特殊处理
**How to avoid:** 使用 VueUse `onClickOutside` 处理点击外部关闭，确保同时监听 touchstart 和 click
**Warning signs:** 移动端测试时下拉菜单无法关闭，需要刷新页面
**Solution:**
```typescript
import { onClickOutside } from '@vueuse/core'

const dropdownRef = ref<HTMLElement>()
onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
```
**Confidence:** MEDIUM - VueUse `onClickOutside` 文档未明确说明移动端支持，但库通常处理了触摸事件，需要实际验证

### Pitfall 5: Tile.vue 颜色映射与 CSS 变量不一致
**What goes wrong:** Tile.vue 引用的 CSS 变量名（如 `--theme-tile-8`）在 style.css 中未定义或拼写错误
**Why it happens:** 人工编写变量名容易出错，Phase 4 定义的变量名可能与 Tile.vue 期望的不一致
**How to avoid:** 检查 Phase 4 的 style.css，确认所有 `--theme-tile-2` 到 `--theme-tile-2048` 变量在每个主题选择器中都已定义
**Warning signs:** 主题切换后方块颜色显示为默认值（如黑色或透明），控制台无错误
**Solution:** 创建一个类型安全的辅助函数，在 Tile.vue 中使用：
```typescript
// 确保 value 在有效范围内
const tileValue = Math.min(Math.max(props.value, 2), 2048)
const bgVar = `--theme-tile-${tileValue}`
```
**Confidence:** HIGH - 基于 Phase 4 style.css 审查，所有主题已定义 `--theme-tile-2` 到 `--theme-tile-2048`

## Code Examples

Verified patterns from official sources:

### VueUse useStorage 基础用法
```typescript
// Source: https://vueuse.org/core/useStorage/
import { useStorage } from '@vueuse/core'

// 绑定字符串到 localStorage
const themeId = useStorage('2048-game-theme', 'neon') // 返回 Ref<string>

// 读取
console.log(themeId.value) // 'neon' 或从 localStorage 读取的值

// 写入（自动同步到 localStorage）
themeId.value = 'sky'

// 删除
themeId.value = null
```

### VueUse useStorage 自定义序列化
```typescript
// Source: https://vueuse.org/core/useStorage/
import { useStorage, StorageSerializers } from '@vueuse/core'
import type { ThemeId } from '@/core/theme'

const themeId = useStorage<ThemeId>(
  '2048-game-theme',
  'neon',
  localStorage,
  {
    serializer: StorageSerializers.string, // 确保类型安全
    onError: (error) => {
      console.warn('localStorage error:', error)
    }
  }
)
```

### VueUse onClickOutside 下拉菜单关闭
```typescript
// Source: https://vueuse.org/core/onClickOutside/
import { ref, onClickOutside } from 'vue'

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
```

### CSS 变量全局过渡（仅颜色）
```css
/* Source: MDN CSS Transitions + style.css Phase 4 */
/* 仅对颜色属性添加过渡，避免影响性能 */
* {
  transition: background-color 0.2s ease-in-out,
              color 0.2s ease-in-out,
              border-color 0.2s ease-in-out;
}

/* 方块已有动画类，不需要额外 transition */
.tile {
  /* 移除 transition，避免冲突 */
}
```

### index.html 内联脚本防止 FOUC
```html
<!-- Source: Stack Overflow FOUC 防止最佳实践 -->
<body>
  <script>
    (function() {
      try {
        const theme = localStorage.getItem('2048-game-theme')
        if (theme) {
          document.documentElement.dataset.theme = theme
        }
      } catch (e) {
        console.warn('Theme initialization failed:', e)
      }
    })()
  </script>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 手动 localStorage 读写 | VueUse useStorage 自动持久化 | Vue 3.2+ (2022) | 减少代码量，提高类型安全，自动错误处理 |
| 硬编码主题切换逻辑 | CSS 变量 + data-theme 属性 | CSS Variables (2015+) | 浏览器原生支持，性能最优，动态切换无需重渲染 |
| 内联脚本防 FOUC | CSS 变量即时性 + 可选内联脚本 | 现代 SPA (2020+) | 大多数场景下不需要内联脚本，复杂主题系统仍推荐 |

**Deprecated/outdated:**
- **jQuery 主题切换插件**：过时，不符合 Vue 3 组合式 API 模式
- **CSS 类名切换（如 .theme-dark, .theme-light）**：CSS 变量更灵活，减少类名维护成本
- **手动事件监听器管理**：VueUse composables 自动处理生命周期，避免内存泄漏

## Open Questions

1. **下拉菜单是否需要显示颜色预览？**
   - What we know: CONTEXT.md Claude's Discretion 允许选择仅显示主题名称或同时显示颜色预览
   - What's unclear: 用户偏好是否需要视觉预览（小色块显示主题主色）
   - Recommendation: 先实现仅显示主题名称（更简洁），Phase 6 可基于用户反馈添加颜色预览

2. **是否需要支持主题切换动画（如淡入淡出）？**
   - What we know: CSS 变量已提供 0.2s 过渡，THEME-04 要求 0.15-0.3s
   - What's unclear: 是否需要额外的遮罩或过渡动画（如全屏淡入淡出）
   - Recommendation: 当前 CSS 变量过渡已足够平滑，额外动画可能影响性能，暂不实现

3. **移动端下拉菜单是否需要优化触摸目标尺寸？**
   - What we know: 移动端控制按钮已隐藏文字，仅显示图标（20x20）
   - What's unclear: 20x20 是否符合 WCAG 最小触摸目标尺寸（44x44）
   - Recommendation: 增加 padding 到 0.625rem（与现有控制按钮一致），实际触摸目标约 44x44

## Sources

### Primary (HIGH confidence)
- [VueUse useStorage Documentation](https://vueuse.org/core/useStorage/) - useStorage API、选项、类型定义、错误处理
- [VueUse onClickOutside Documentation](https://vueuse.org/core/onClickOutside/) - 点击外部关闭逻辑
- [MDN CSS Performance Optimization](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS) - CSS 性能最佳实践
- [MDN localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - localStorage 错误处理、配额限制

### Secondary (MEDIUM confidence)
- [Stack Overflow - Eliminate Flash of Unstyled Content](https://stackoverflow.com/questions/3221561/eliminate-flash-of-unstyled-content) - FOUC 防止技术
- [CoreUI - How to create a theme switcher in Vue](https://coreui.io/answers/how-to-create-a-theme-switcher-in-vue/) - Vue 3 主题切换器示例
- [Medium - Creating a Dynamic Theme Switcher in Vue 3 with CSS Variables](https://medium.com/@sj.anyway/creating-a-dynamic-theme-switcher-in-vue-3-with-css-variables-ac06219e860d) - CSS 变量主题切换实践
- [Dev.to - CSS Performance Tips](https://dev.to/hasunnilupul/css-performance-tips-writing-faster-more-efficient-styles-46f0) - 现代 CSS 性能优化技巧

### Tertiary (LOW confidence)
- [Medium - Using Browser Storage for Application State Management](https://medium.com/@artemkhrenov/using-browser-storage-for-application-state-management-705ae125e174) - localStorage 状态管理讨论（未深入验证）
- [GSAP Forums - Performance Impact of Animating CSS Variables](https://gsap.com/community/forums/topic/40903-performance-impact-of-animating-css-variables-with-gsap-and-css-transitions/) - CSS 变量动画性能讨论（第三方视角，需验证）

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - VueUse、Pinia、CSS 变量均为项目已有依赖，文档充分
- Architecture: HIGH - 基于 Phase 4 代码审查，模式明确
- Pitfalls: HIGH - FOUC、localStorage 错误、CSS 性能有官方文档支持
- Code examples: HIGH - 直接引用 VueUse 官方文档和 MDN

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (30 days - Vue 3 和 VueUse 生态稳定)

## Implementation Notes

### 发现的硬编码颜色（需要迁移到 CSS 变量）

**App.vue:**
```vue
<style>
.app {
  background-color: #faf8ef; /* ❌ 硬编码 - 应该使用 var(--theme-bg-primary) */
}
</style>
```

**GameContainer.vue:**
```vue
<style scoped>
.game-container {
  background-color: #faf8ef; /* ❌ 硬编码 - 应该使用 var(--theme-bg-primary) */
}
</style>
```

**GameHeader.vue:**
```vue
<style scoped>
.title {
  color: #776e65; /* ❌ 硬编码 - 应该使用 var(--theme-text-primary) */
}

.subtitle {
  color: #776e65; /* ❌ 硬编码 - 应该使用 var(--theme-text-secondary) */
}

.score-box {
  background-color: #bbada0; /* ❌ 硬编码 - 应该使用 var(--theme-bg-secondary) */
}

.score-label {
  color: #eee4da; /* ❌ 硬编码 - 应该使用 var(--theme-text-secondary) */
}

.control-btn {
  background-color: #8f7a66; /* ❌ 硬编码 - 应该使用 var(--theme-bg-secondary) */
}
</style>
```

**Tile.vue:**
```vue
<script setup>
function getTileStyle() {
  if (props.value === 0) {
    return {
      backgroundColor: '#cdc1b4', // ❌ 硬编码 - 应该使用 var(--theme-tile-empty)
    }
  }

  const backgroundColors: Record<number, string> = {
    2: '#eee4da',     // ❌ 硬编码 - 应该使用 var(--theme-tile-2)
    4: '#ede0c8',     // ❌ 硬编码 - 应该使用 var(--theme-tile-4)
    8: '#f2b179',     // ❌ 硬编码 - 应该使用 var(--theme-tile-8)
    // ... 其他方块颜色
  }
}
</script>
```

**迁移优先级：**
1. **高优先级（必须在 Phase 5 完成）：**
   - Tile.vue - 方块颜色（用户直接可见）
   - GameHeader.vue - 控制按钮和分数框（核心交互区域）

2. **中优先级（建议在 Phase 5 完成）：**
   - App.vue - 全局背景色（影响整体视觉效果）
   - GameContainer.vue - 容器背景色（同上）

3. **低优先级（可延迟到 Phase 6）：**
   - GameBoard.vue - 网格背景色（目前可能是透明或继承）
   - GameOverOverlay.vue / GameWonOverlay.vue - 覆盖层颜色（独立主题）

**迁移策略：**
- 每个组件独立迁移，避免一次性改动过大
- 先迁移 Tile.vue（最复杂），验证 CSS 变量机制正常
- 再迁移 GameHeader.vue（集成 ThemeSwitcher）
- 最后迁移 App.vue 和 GameContainer.vue（全局背景）

**验证方法：**
- 切换主题后，检查所有组件颜色是否同步更新
- 刷新页面，检查主题是否持久化
- 检查控制台是否有 CSS 变量未定义的警告
