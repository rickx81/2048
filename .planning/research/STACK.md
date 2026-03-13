# 技术栈研究 - v1.1 主题与性能优化

**项目：** 2048 游戏 v1.1
**研究日期：** 2026-03-14
**研究范围：** 主题系统与动画性能优化
**置信度：** HIGH

---

## 执行摘要

v1.1 里程碑需要的技术栈变更很少，主要基于现有技术栈的扩展。主题系统最佳实践是 **CSS 变量 + Vue Composable + Pinia Store**，而动画性能优化应专注于 **GPU 加速属性**（transform、opacity）和避免触发布局重排的属性。

**核心建议：**
- 主题系统：CSS 变量定义颜色，Pinia store 管理状态，Vue composable 封装逻辑
- 性能优化：使用 transform 和 opacity（GPU 加速），避免 width/height/top/left（触发布局）
- 无需额外库：现有 Vue 3 + Tailwind CSS v4 完全满足需求

---

## 推荐技术栈

### 核心技术（无变更）

| 技术 | 版本 | 用途 | 状态 |
|------|------|------|------|
| Vue 3 | 3.5.29 | 响应式 UI | ✓ 已验证 |
| TypeScript | 5.9.3 | 类型安全 | ✓ 已验证 |
| Pinia | 最新 | 状态管理 | ✓ 已验证 |
| Tailwind CSS | v4 | 样式框架 | ✓ 已验证 |

### 新增/扩展技术

| 技术 | 用途 | 版本要求 | 理由 |
|------|------|----------|------|
| **CSS 自定义属性** | 主题颜色定义 | 原生支持 | 性能最优，浏览器原生支持，无需额外依赖 |
| **Vue Composable** | 主题切换逻辑 | Vue 3 内置 | 代码复用，测试友好，符合 Vue 3 最佳实践 |
| **Pinia Store** | 主题状态管理 | 现有 Pinia | 与现有架构一致，类型安全，持久化简单 |

---

## 主题系统架构

### 方案选择：CSS 变量 vs 类切换 vs 内联样式

基于现有代码分析（Tile.vue 使用内联样式处理颜色），推荐 **CSS 变量方案**：

| 方案 | 优点 | 缺点 | 适用场景 | 选择 |
|------|------|------|----------|------|
| **CSS 变量** | 动态切换无需重渲染，性能最优，浏览器原生支持 | 需要预先定义变量 | 多主题切换 | ✓ 推荐 |
| 类切换 | Tailwind 友好，开发体验好 | 切换时需重渲染，性能较差 | 简单暗色模式 | ✗ 不推荐 |
| 内联样式 | 灵活，无需预定义 | 维护困难，性能差，代码冗余 | 动态计算值 | ✗ 现有方案需重构 |

**为什么选择 CSS 变量？**

1. **性能优势**：切换主题时只需修改 `:root` 上的变量值，浏览器自动更新所有引用，无需 Vue 重渲染
2. **代码简洁**：单个 CSS 变量定义即可影响所有组件，无需修改组件逻辑
3. **Tailwind v4 兼容**：Tailwind v4 原生支持 CSS 变量，可以使用 `var(--color-tile-2)` 语法
4. **渐进增强**：无需破坏现有内联样式，可以逐步迁移

### 推荐架构

```
┌─────────────────────────────────────────────────────────────┐
│                    主题系统架构                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CSS 层 - 定义主题变量                                     │
│     ├── :root { --theme-* }          # 默认主题              │
│     ├── [data-theme="neon"] { ... }  # 霓虹暗色              │
│     ├── [data-theme="sky"] { ... }   # 天空蓝                │
│     └── [data-theme="forest"] { ... } # 森林绿               │
│                                                              │
│  2. Pinia Store - 管理主题状态                                │
│     ├── state: currentTheme         # 当前主题               │
│     ├── actions: setTheme()          # 切换主题               │
│     └── persist: true                # localStorage 持久化   │
│                                                              │
│  3. Vue Composable - 封装主题逻辑                             │
│     ├── useTheme()                   # 主题 hook             │
│     ├── currentTheme (ref)           # 响应式主题值           │
│     └── setTheme(theme)              # 切换函数               │
│                                                              │
│  4. 组件层 - 应用主题                                          │
│     ├── Tile.vue: style="--bg-color: var(--tile-2-bg)"      │
│     └── 所有组件通过 CSS 变量引用颜色                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 实现细节

#### 1. CSS 变量定义

```css
/* src/style.css */
@import "tailwindcss";

/* 默认主题（经典 2048） */
:root {
  --tile-empty-bg: #cdc1b4;
  --tile-2-bg: #eee4da;
  --tile-2-text: #776e65;
  --tile-4-bg: #ede0c8;
  --tile-4-text: #776e65;
  /* ... 其他方块颜色 ... */
  --grid-bg: #bbada0;
  --bg-color: #faf8ef;
}

/* 霓虹暗色主题 */
[data-theme="neon"] {
  --tile-empty-bg: #1a1a2e;
  --tile-2-bg: #0f3460;
  --tile-2-text: #e94560;
  --tile-4-bg: #16213e;
  --tile-4-text: #e94560;
  --grid-bg: #0f0f1a;
  --bg-color: #0a0a12;
}

/* 天空蓝主题 */
[data-theme="sky"] {
  --tile-empty-bg: #e0f7fa;
  --tile-2-bg: #4fc3f7;
  --tile-2-text: #01579b;
  --tile-4-bg: #29b6f6;
  --tile-4-text: #ffffff;
  /* ... */
}
```

#### 2. Pinia Store

```typescript
// src/stores/theme.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'classic' | 'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>('classic')

  // 从 localStorage 恢复
  const stored = localStorage.getItem('theme')
  if (stored) {
    currentTheme.value = stored as Theme
  }

  // 切换主题
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  // 初始化时应用主题
  setTheme(currentTheme.value)

  return { currentTheme, setTheme }
})
```

#### 3. Vue Composable

```typescript
// src/composables/useTheme.ts
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()
  const { currentTheme } = storeToRefs(themeStore)
  const { setTheme } = themeStore

  return {
    currentTheme,
    setTheme,
    isDark: currentTheme.value === 'neon'
  }
}
```

#### 4. 组件应用（迁移现有内联样式）

```vue
<!-- Tile.vue - 迁移方案 -->
<template>
  <div
    :class="['tile', isNew ? 'tile-new' : '', isMerged ? 'tile-merged' : '']"
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

// 迁移：使用 CSS 变量替代硬编码颜色
const tileStyle = computed(() => {
  const base = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3px',
  }

  if (props.value === 0) {
    return {
      ...base,
      '--bg-color': 'var(--tile-empty-bg)',
      backgroundColor: 'var(--tile-empty-bg)',
    }
  }

  return {
    ...base,
    backgroundColor: `var(--tile-${props.value}-bg, #3c3a32)`,
  }
})

const textStyle = computed(() => {
  if (props.value === 0) return {}

  const darkTextNumbers = [2, 4]
  const useDarkText = darkTextNumbers.includes(props.value)
  const fontSize = getFontSize(props.value)

  return {
    color: `var(--tile-${props.value}-text, ${useDarkText ? '#776e65' : '#f9f6f2'})`,
    fontSize,
    fontWeight: '700',
  }
})
</script>
```

### 数据存储结构

```typescript
// 主题定义
interface ThemeDefinition {
  id: string
  name: string
  colors: {
    background: string
    grid: string
    emptyTile: string
    tiles: Record<number, { bg: string; text: string }>
  }
}

// 5 个预设主题
const themes: Record<string, ThemeDefinition> = {
  classic: {
    id: 'classic',
    name: '经典 2048',
    colors: {
      background: '#faf8ef',
      grid: '#bbada0',
      emptyTile: '#cdc1b4',
      tiles: {
        2: { bg: '#eee4da', text: '#776e65' },
        4: { bg: '#ede0c8', text: '#776e65' },
        // ...
      }
    }
  },
  neon: {
    id: 'neon',
    name: '霓虹暗色',
    colors: {
      background: '#0a0a12',
      grid: '#0f0f1a',
      emptyTile: '#1a1a2e',
      tiles: {
        2: { bg: '#0f3460', text: '#e94560' },
        4: { bg: '#16213e', text: '#e94560' },
        // ...
      }
    }
  },
  // ... 其他主题
}
```

---

## 动画性能优化

### GPU 加速属性

根据 MDN 和性能优化指南，**只使用以下属性进行动画**：

| 属性 | 性能 | 原因 | 使用场景 |
|------|------|------|----------|
| **transform** | ✓ GPU 加速 | 不触发布局，不触发重绘 | 移动、缩放、旋转 |
| **opacity** | ✓ GPU 加速 | 不触发布局，合成层操作 | 淡入淡出 |
| **filter** | △ 部分加速 | 部分浏览器 GPU 加速 | 模糊、阴影（谨慎使用） |
| width/height | ✗ 触发布局 | 需重新计算布局 | 禁止用于动画 |
| top/left | ✗ 触发布局 | 需重新计算布局 | 禁止用于动画 |
| margin/padding | ✗ 触发布局 | 需重新计算布局 | 禁止用于动画 |

### 性能优化清单

#### ✓ 当前已实现的优化

```vue
<!-- Tile.vue - 已有优化 -->
<div
  :class="[
    'will-change-transform'  // ✓ 提示浏览器优化 transform
  ]"
  :style="getTileStyle()"
>
```

#### ✓ 需要添加的优化

**1. 使用 `transform` 替代位置变化**

```css
/* 现有代码可能使用 left/top */
/* ❌ 差的做法 */
.tile {
  position: absolute;
  left: 0;
  top: 0;
  transition: left 0.15s, top 0.15s; /* 触发布局 */
}

/* ✓ 好的做法 */
.tile {
  position: absolute;
  transform: translate(0, 0);
  transition: transform 0.15s; /* GPU 加速 */
}
```

**2. 添加 `will-change` 提示**

```css
/* ✓ 提示浏览器优化即将变化的属性 */
.tile {
  will-change: transform, opacity;
}

/* 动画结束后移除 */
.tile.idle {
  will-change: auto;
}
```

**3. 使用 `translate3d` 强制 GPU 加速**

```css
/* ✓ 强制创建合成层（如需要） */
.gpu-accelerated {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

**4. 避免动画时触发布局**

```css
/* ❌ 避免：同时动画多个属性 */
.bad {
  transition: all 0.3s; /* width 会触发布局 */
}

/* ✓ 推荐：只动画 GPU 属性 */
.good {
  transition: transform 0.3s, opacity 0.3s;
}
```

### 性能测试建议

使用 Chrome DevTools 验证优化效果：

1. **打开 Performance 面板**：F12 → Performance → Record
2. **执行动画**：移动方块多次
3. **检查指标**：
   - FPS 应保持在 55-60+
   - Frames 中不应有长条红色（长任务）
   -Rendering 中 Layout 应尽量少

---

## 安装与配置

### 无需额外安装

所有需要的技术都已包含在现有技术栈中：

```bash
# 现有依赖已包含所有需要的内容
# Vue 3 - 内置 composable API
# Pinia - 状态管理
# Tailwind CSS v4 - CSS 变量支持
```

### 配置调整

#### 1. Tailwind 配置（无变更）

现有 `tailwind.config.js` 已配置 `darkMode: 'class'`，无需修改。

#### 2. TypeScript 类型定义

添加主题类型：

```typescript
// src/types/theme.ts
export type ThemeId = 'classic' | 'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'

export interface ThemeColors {
  background: string
  grid: string
  emptyTile: string
  tiles: Record<number, TileColor>
}

export interface TileColor {
  bg: string
  text: string
}
```

---

## 技术决策记录

### 决策 1：使用 CSS 变量而非 Tailwind 类

**选项对比：**

| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| CSS 变量 | 性能最优，动态切换无需重渲染 | 需要手动定义变量 | ✓ 选择 |
| Tailwind 类 | 开发体验好，类型安全 | 切换时需重渲染所有组件 | ✗ 拒绝 |
| 内联样式（现有） | 灵活 | 代码冗长，维护困难，性能差 | ✗ 需重构 |

**理由：**
- 主题切换频率低（用户偶尔切换），但需要即时生效
- CSS 变量切换只需修改 DOM 属性，无需 Vue 重新渲染
- 与现有内联样式兼容：可以逐步迁移，一次性替换
- Tailwind v4 原生支持 CSS 变量

### 决策 2：使用 Pinia Store 而非 localStorage 直接访问

**选项对比：**

| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| Pinia Store | 类型安全，响应式，可测试 | 引入额外抽象 | ✓ 选择 |
| 直接 localStorage | 简单直接 | 无类型，无响应式 | ✗ 拒绝 |
| VueUse useStorage | 简洁 | 与现有 Pinia 架构不一致 | ✗ 拒绝 |

**理由：**
- 项目已使用 Pinia 管理游戏状态，主题状态应该统一管理
- 需要类型安全（ThemeId 类型）
- 便于测试（可以 mock store）

### 决策 3：不需要额外主题库

**评估的库：**

| 库 | 评估 | 拒绝理由 |
|------|------|----------|
| `vue-theme-switcher` | ❌ 不必要 | 功能简单，自己实现更好 |
| `next-themes` | ❌ Next.js 专用 | Vue 3 不兼容 |
| `colord` | ❌ 过度设计 | 不需要颜色操作 |

**理由：**
- 主题系统功能简单（5 个预设主题，无需运行时生成）
- 避免引入额外依赖增加打包体积
- 自己实现可以完全控制与现有代码的集成

---

## 迁移策略

### 阶段 1：CSS 变量基础设施（不破坏现有功能）

```css
/* 1. 在 style.css 中添加 CSS 变量定义 */
:root {
  --tile-2-bg: #eee4da;
  --tile-2-text: #776e65;
  /* ... */
}

/* 2. 现有内联样式保持不变，逐步迁移 */
```

### 阶段 2：添加主题切换逻辑

```typescript
// 1. 创建 Pinia store
// 2. 创建 useTheme composable
// 3. 添加主题切换器组件
```

### 阶段 3：迁移 Tile.vue 使用 CSS 变量

```vue
<!-- 保留 computed 返回对象结构，只替换颜色值 -->
const tileStyle = computed(() => ({
  backgroundColor: `var(--tile-${props.value}-bg)`,
  // ... 其他样式保持不变
}))
```

### 阶段 4：添加其他主题

```css
/* 1. 定义其他 4 个主题的 CSS 变量 */
/* 2. 测试所有主题的视觉效果 */
```

---

## 来源

### 高置信度来源（官方文档）

- [MDN - CSS and JavaScript animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) - 权威的动画性能指南
- [Tailwind CSS - Theme variables](https://tailwindcss.com/docs/theme) - Tailwind v4 官方主题变量文档

### 中等置信度来源（技术博客）

- [CSS GPU Acceleration Guide (Lexo, 2025)](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/) - GPU 加速技术详解
- [CSS动画性能优化详解 (CSDN, 2025)](https://blog.csdn.net/Chen7Chan/article/details/144607758) - 中文性能优化实践

### 项目内部分析

- `.planning/PROJECT.md` - 项目上下文和约束
- `src/components/Tile.vue` - 现有内联样式实现
- `tailwind.config.js` - 现有 Tailwind 配置

---

## 待验证项

以下主题颜色值需要设计/视觉确认：

- [ ] 霓虹暗色主题的具体颜色值（是否符合"霓虹"视觉特征）
- [ ] 天空蓝主题的具体颜色值
- [ ] 森林绿主题的具体颜色值
- [ ] 日落橙主题的具体颜色值
- [ ] 樱花粉主题的具体颜色值

**建议：** 可以使用 Tailwind v4 的默认色板作为参考，或使用在线工具（如 Coolors.co）生成协调的色板。

---

## 总结

v1.1 里程碑需要的技术栈添加非常有限：

1. **主题系统**：CSS 变量 + Vue Composable + Pinia Store
2. **性能优化**：使用 GPU 加速属性（transform、opacity），避免触发布局的属性
3. **无需额外库**：所有功能基于现有技术栈实现

**关键成功因素：**
- CSS 变量的正确定义和组织
- Pinia store 与 localStorage 的正确集成
- 动画只使用 transform 和 opacity 属性
- 渐进式迁移现有内联样式到 CSS 变量
