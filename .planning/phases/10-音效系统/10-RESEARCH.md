# Phase 10: 音效系统 - 研究文档

**研究日期：** 2026-03-30
**领域：** Web Audio API + Vue 3 状态管理
**信心：** HIGH

## 摘要

本研究为 2048 游戏音效系统提供完整的技术实施方案。基于项目现有的 Functional Core, Imperative Shell (FCIS) 架构，音效系统将作为 Imperative Shell 层的副作用集成，保持核心游戏逻辑的纯粹性。

**核心推荐：** 使用 Howler.js 2.2.4 + Vue 3 Composable 模式实现音效管理，通过 Audio Sprites 技术优化移动端性能，音效配置持久化到 localStorage，遵循项目现有的 Pinia 状态管理模式。

## 阶段需求

| ID | 描述 | 研究支持 |
|----|------|----------|
| AUDIO-01 | 用户在移动方块时能听到移动音效 | Howler.js sprite 播放，useGameControls 集成 |
| AUDIO-02 | 用户在数字合并时能听到合并音效 | store.moveGrid 检测合并事件触发播放 |
| AUDIO-03 | 用户在游戏胜利时能听到胜利音效 | status 变为 WON 时播放 |
| AUDIO-04 | 用户在游戏失败时能听到失败音效 | status 变为 LOST 时播放 |
| AUDIO-05 | 用户可以调节音效音量 | useAudio composable 提供 setVolume |
| AUDIO-06 | 用户可以静音所有音效 | useAudio composable 提供 toggleMute |
| AUDIO-07 | 音效设置（音量、静音）持久化到 localStorage | useStorage 持久化音效配置 |

## 标准技术栈

### 核心

| 库 | 版本 | 用途 | 为什么是标准 |
|----|------|------|-------------|
| **Howler.js** | 2.2.4 | Web Audio API 封装库 | 跨平台兼容（Web Audio + HTML5 Audio 降级）、零依赖、7KB gzip、支持音频精灵、全格式支持、自动缓存、模块化架构、生产验证充分 |
| **@vueuse/core** | 14.2.1 (已安装) | Vue 3 工具集 | useStorage 持久化音效配置，与现有项目无缝集成 |
| **Pinia** | 3.0.4 (已安装) | 状态管理 | 管理音效设置（音量、静音状态），与 game store 一致的模式 |

### 支持库

| 库 | 版本 | 用途 | 使用场景 |
|----|------|------|----------|
| **@vueuse/sound** | 2.1.3 (可选) | Vue 3 音效集成层 | 提供 useSound composable，简化音效播放逻辑，支持 preload 和类型安全 |

### 考虑过的替代方案

| 推荐方案 | 替代方案 | 权衡 |
|----------|----------|------|
| **Howler.js** | 原生 Web Audio API | 原生 API 学习曲线陡峭、跨平台兼容性问题多、iOS 需特殊处理、代码量大 |
| **Howler.js** | Howler.js 3.x | 3.x 仍在 beta，稳定性未知；2.2.4 是当前稳定版本，生产验证充分 |
| **Audio Sprites** | 多个独立音频文件 | 多文件 HTTP 请求数多、移动端性能差、iOS 限制单音频并发播放 |
| **Composable 模式** | @vueuse/sound useSound | useSound 是简化封装，直接使用 Howler.js + 自定义 composable 更灵活，与项目架构更一致 |

**安装命令：**
```bash
# 核心 Web Audio 库
npm install howler@^2.2.4

# Vue 3 集成层（可选，推荐直接使用自定义 composable）
npm install @vueuse/sound@^2.1.3
```

**版本验证：** 已通过 npm registry 验证，Howler.js 2.2.4 为最新稳定版本，@vueuse/sound 2.1.3 为最新版本。

## 架构模式

### 推荐项目结构

```
src/
├── core/                    # Functional Core（纯函数层，不变）
│   ├── types.ts            # 核心类型定义
│   ├── utils.ts            # 工具函数
│   ├── game.ts             # 游戏逻辑
│   └── storage.ts          # LocalStorage 持久化
│
├── stores/                  # Pinia 状态管理
│   ├── game.ts             # 游戏状态（已存在）
│   └── audio.ts            # 音效状态（新增）- 音量、静音
│
├── composables/             # Vue 3 Composables
│   ├── useGameControls.ts  # 游戏控制（已存在，需集成音效）
│   ├── useAudio.ts         # 音效管理（新增）- Howler.js 封装
│   └── useTheme.ts         # 主题管理（已存在）
│
├── components/              # Vue 组件
│   ├── GameHeader.vue      # 游戏头部（需添加音量控制）
│   ├── VolumeControl.vue   # 音量控制组件（新增）
│   └── ...                 # 其他组件
│
└── assets/
    └── sounds/
        └── sprite.mp3      # 音频精灵文件（所有音效合并）
```

### 模式 1：音效 Composable (useAudio)

**什么：** 封装 Howler.js 音效播放逻辑的 Vue 3 composable

**何时使用：** 在需要播放音效的组件或 composables 中调用

**示例：**

```typescript
// src/composables/useAudio.ts
import { ref, computed } from 'vue'
import { Howl } from 'howler'

// 音效类型定义
export type SoundEffect = 'move' | 'merge' | 'win' | 'lose'

// 音频精灵定义（基于 sprite.mp3 文件的实际时间戳）
// 格式: [开始时间(ms), 持续时间(ms)]
const SPRITE_DATA = {
  move: [0, 150],       // 0ms-150ms
  merge: [200, 300],    // 200ms-500ms
  win: [600, 2000],     // 600ms-2600ms
  lose: [2700, 1500]    // 2700ms-4200ms
}

// 全局 Howl 实例（单例模式）
let soundInstance: Howl | null = null

/**
 * 音效管理 composable
 * 提供音效播放、音量控制、静音功能
 */
export function useAudio() {
  // 音效设置状态
  const volume = ref(0.5)
  const isMuted = ref(false)
  const isInitialized = ref(false)

  // 计算实际音量（静音时为 0）
  const effectiveVolume = computed(() =>
    isMuted.value ? 0 : volume.value
  )

  /**
   * 初始化音效系统
   * 必须在用户交互后调用（浏览器自动播放策略）
   */
  function initialize() {
    if (soundInstance) {
      return // 已初始化
    }

    soundInstance = new Howl({
      src: ['/sounds/sprite.mp3'],
      sprite: SPRITE_DATA,
      volume: effectiveVolume.value,
      preload: true, // 预加载音频
      html5: false,  // 优先使用 Web Audio API
      format: ['mp3']
    })

    // 监听加载完成
    soundInstance.once('load', () => {
      console.log('[Audio] 音效系统初始化完成')
      isInitialized.value = true
    })

    // 监听播放错误
    soundInstance.on('loaderror', (_, err) => {
      console.error('[Audio] 音效加载失败:', err)
    })
  }

  /**
   * 播放指定音效
   * @param effect 音效类型
   */
  function play(effect: SoundEffect) {
    if (!soundInstance) {
      console.warn('[Audio] 音效系统未初始化，请在用户交互后调用 initialize()')
      return
    }

    if (isMuted.value) {
      return // 静音时不播放
    }

    soundInstance.play(effect)
  }

  /**
   * 设置音量
   * @param newVolume 音量值 (0.0 - 1.0)
   */
  function setVolume(newVolume: number) {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    volume.value = clampedVolume

    if (soundInstance) {
      soundInstance.volume(effectiveVolume.value)
    }
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    isMuted.value = !isMuted.value

    if (soundInstance) {
      soundInstance.volume(effectiveVolume.value)
    }
  }

  /**
   * 停止所有音效
   */
  function stopAll() {
    if (soundInstance) {
      soundInstance.stop()
    }
  }

  /**
   * 卸载音效系统
   * 组件卸载时调用
   */
  function unload() {
    if (soundInstance) {
      soundInstance.unload()
      soundInstance = null
      isInitialized.value = false
    }
  }

  return {
    // 状态
    volume,
    isMuted,
    isInitialized,

    // 方法
    initialize,
    play,
    setVolume,
    toggleMute,
    stopAll,
    unload
  }
}
```

### 模式 2：音效状态 Store (audio.ts)

**什么：** 使用 Pinia 管理音效配置，与 game store 一致的模式

**何时使用：** 需要全局共享音效配置状态时

**示例：**

```typescript
// src/stores/audio.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAudioStore = defineStore('audio', () => {
  // 音量设置（持久化到 localStorage）
  const volume = useStorage('audio-volume', 0.5)

  // 静音状态（持久化到 localStorage）
  const isMuted = useStorage('audio-muted', false)

  /**
   * 设置音量
   */
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  /**
   * 切换静音
   */
  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute
  }
})
```

### 模式 3：游戏控制集成 (useGameControls 增强)

**什么：** 在现有的 useGameControls 中集成音效播放

**何时使用：** 用户移动方块时播放移动音效

**示例：**

```typescript
// src/composables/useGameControls.ts (部分修改)
import { useGameStore } from '@/stores/game'
import { useAudio } from './useAudio'

export function useGameControls(targetRef: Ref<HTMLElement | undefined>) {
  const store = useGameStore()
  const audio = useAudio()

  // 在移动方块时播放音效
  function handleKeydown(event: KeyboardEvent) {
    // ... 现有逻辑 ...

    const direction = keyMap[event.key]
    if (direction) {
      event.preventDefault()

      // 记录移动前的分数，用于检测是否合并
      const previousScore = store.score
      store.moveGrid(direction)

      // 检测是否发生移动（分数变化或网格变化）
      if (store.score > previousScore) {
        // 分数增加，说明有合并 → 播放合并音效
        audio.play('merge')
      } else {
        // 仅有移动 → 播放移动音效
        audio.play('move')
      }
    }
  }

  // 同样逻辑应用到触摸和鼠标控制...

  return { lengthX, lengthY }
}
```

### 模式 4：游戏状态监听（胜利/失败音效）

**什么：** 监听游戏状态变化，播放相应音效

**何时使用：** 游戏胜利或失败时播放音效

**示例：**

```typescript
// 在组件中监听游戏状态
<script setup lang="ts">
import { watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useAudio } from '@/composables/useAudio'

const store = useGameStore()
const audio = useAudio()

// 监听游戏状态变化
watch(() => store.status, (newStatus, oldStatus) => {
  if (newStatus === 'won' && oldStatus === 'playing') {
    audio.play('win')
  } else if (newStatus === 'lost' && oldStatus === 'playing') {
    audio.play('lose')
  }
})
</script>
```

### 反模式避免

- **反模式：在 Functional Core 层播放音效**
  - 为什么不好：核心逻辑应该是纯函数，音效播放是副作用
  - 正确做法：在 Imperative Shell 层（store/composable）播放音效

- **反模式：每次播放都创建新的 Howl 实例**
  - 为什么不好：性能差、内存泄漏、无法管理全局音量
  - 正确做法：使用单例模式，全局共享一个 Howl 实例

- **反模式：硬编码音效文件路径**
  - 为什么不好：路径变更时需修改多处代码
  - 正确做法：使用常量或配置对象管理音效路径

## 不要手写实现

| 问题 | 不要手写 | 使用 | 为什么 |
|------|---------|------|--------|
| Web Audio API 封装 | 自己封装 AudioContext、GainNode、AudioBuffer | Howler.js | 跨浏览器兼容性、降级处理、缓存管理、自动预加载、生产验证 |
| 音频精灵分割 | 自己计算时间戳、手动切割音频 | Howler.js sprite | 标准化的 sprite 定义、自动分割、iOS 兼容性、错误处理 |
| localStorage 持久化 | 自己封装 JSON.parse/stringify、错误处理 | @vueuse/useStorage | 响应式、类型安全、自动同步、边界情况处理 |
| 音量控制逻辑 | 自己实现音量计算、静音状态管理 | Pinia + computed | 响应式状态管理、与现有架构一致、可测试性 |

**关键洞察：** 音频系统的复杂性在于跨浏览器兼容性和移动端限制，Howler.js 已经处理了这些边缘情况，手写实现容易引入 bug 且难以维护。

## 运行时状态清单

> 本阶段为新增功能阶段，非重命名/重构阶段，无需运行时状态清单。

## 常见陷阱

### 陷阱 1：浏览器自动播放策略限制

**问题：** 浏览器（特别是移动端）要求用户交互后才能播放音频，否则音频上下文被锁定

**根本原因：** 现代浏览器（Chrome 66+、Safari、iOS）禁止自动播放音频，要求用户手势触发

**如何避免：**
- 在用户首次交互（点击、触摸、按键）后调用 `audio.initialize()`
- 提供明显的"启用音效"按钮或开关
- 检测音频上下文是否被锁定（Howler.js 不直接支持，需通过播放失败检测）

**警告信号：**
- 控制台警告：`The AudioContext was not allowed to start`
- 音效在某些浏览器正常，其他浏览器静音
- 页面刷新后音效不播放（直到用户交互）

**解决方案：**
```typescript
// 在游戏容器组件中
function handleFirstInteraction() {
  audio.initialize()
  // 移除一次性事件监听
  window.removeEventListener('click', handleFirstInteraction)
  window.removeEventListener('keydown', handleFirstInteraction)
  window.removeEventListener('touchstart', handleFirstInteraction)
}

onMounted(() => {
  window.addEventListener('click', handleFirstInteraction, { once: true })
  window.addEventListener('keydown', handleFirstInteraction, { once: true })
  window.addEventListener('touchstart', handleFirstInteraction, { once: true })
})
```

### 陷阱 2：iOS 单音频并发限制

**问题：** iOS Safari 限制同时播放的音频数量，多个独立音频文件可能导致部分音效无法播放

**根本原因：** iOS 限制音频流的并发数（通常为 1 个），Audio Sprites 通过单文件多片段规避此限制

**如何避免：**
- 使用 Audio Sprites 技术合并所有音效到单个 MP3 文件
- 不使用多个独立的音频文件

**警告信号：**
- iOS 上音效有时播放，有时不播放
- 快速连续操作时部分音效丢失

### 陷阱 3：音效文件加载失败

**问题：** 音效文件路径错误或文件不存在，导致音效无法播放且没有明显错误提示

**根本原因：** Vite 开发环境的 public 路径、生产环境的 base 路径配置不一致

**如何避免：**
- 将音效文件放在 `public/sounds/sprite.mp3`
- 使用绝对路径 `/sounds/sprite.mp3` 引用（不以 `./` 开头）
- 在 Howl 实例的 `on('loaderror')` 中监听加载错误

**警告信号：**
- 控制台没有错误，但音效不播放
- 网络面板中音频请求返回 404

**解决方案：**
```typescript
soundInstance.on('loaderror', (_, err) => {
  console.error('[Audio] 音效加载失败:', err)
  console.error('[Audio] 请确认 public/sounds/sprite.mp3 文件存在')
})
```

### 陷阱 4：音效状态与实际播放不一致

**问题：** 用户调整音量或静音后，正在播放的音效音量没有变化

**根本原因：** Howler.js 的 `volume()` 方法只影响后续播放，不影响正在播放的声音

**如何避免：**
- 在设置音量后，调用 `soundInstance.stop()` 停止当前播放
- 或使用 `soundInstance.fade()` 渐变音量

**警告信号：**
- 调整音量滑块后，正在播放的音效音量不变
- 切换静音后，当前音效仍在播放

### 陷阱 5：内存泄漏（未卸载 Howl 实例）

**问题：** 组件卸载时未清理 Howl 实例，导致内存泄漏

**根本原因：** Howl 实例持有 AudioContext 和音频缓冲区引用

**如何避免：**
- 在组件 `onUnmounted` 或页面 `onBeforeUnmount` 时调用 `audio.unload()`
- 使用单例模式确保只有一个全局 Howl 实例

**解决方案：**
```typescript
onBeforeUnmount(() => {
  audio.unload()
})
```

### 陷阱 6：频繁创建/销毁 Howl 实例

**问题：** 每次播放音效都创建新的 Howl 实例，导致性能问题和内存泄漏

**根本原因：** 未理解 Howl.js 的单例模式设计

**如何避免：**
- 使用全局单例模式（如前述 `useAudio` composable）
- 只在初始化时创建一次 Howl 实例

**警告信号：**
- 频繁播放音效后内存占用持续增长
- 音效播放延迟逐渐增加

### 陷阱 7：音效播放时机错误

**问题：** 移动音效和合并音效的播放时机不正确，或重复播放

**根本原因：** 未准确检测移动和合并事件

**如何避免：**
- 在 store 的 `moveGrid` 方法中检测移动和合并
- 通过分数变化判断是否合并
- 通过网格状态变化判断是否移动

**解决方案：**
```typescript
// 在 store 中返回详细结果
interface MoveResult {
  moved: boolean
  merged: boolean
  score: number
  grid: Grid
}

// 在 composable 中根据结果播放对应音效
if (result.merged) {
  audio.play('merge')
} else if (result.moved) {
  audio.play('move')
}
```

## 代码示例

### 初始化音效系统（用户交互后）

```typescript
// 在 App.vue 或 GameContainer.vue 中
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAudio } from '@/composables/useAudio'

const audio = useAudio()

function handleUserInteraction() {
  if (!audio.isInitialized.value) {
    audio.initialize()
  }
}

onMounted(() => {
  // 监听首次用户交互
  const events = ['click', 'keydown', 'touchstart'] as const
  events.forEach(event => {
    window.addEventListener(event, handleUserInteraction, { once: true })
  })
})
</script>
```

### 播放移动和合并音效

```typescript
// 在 stores/game.ts 中增强 moveGrid 方法
function moveGrid(direction: Direction) {
  const result = move(grid.value, direction)

  if (!result.moved) {
    return { moved: false, merged: false }
  }

  // 检测是否合并（分数增加）
  const merged = result.score > 0

  // 更新状态...
  grid.value = result.grid
  score.value += result.score

  return { moved: true, merged }
}

// 在 composables/useGameControls.ts 中
const moveResult = store.moveGrid(direction)
if (moveResult.merged) {
  audio.play('merge')
} else if (moveResult.moved) {
  audio.play('move')
}
```

### 音量控制组件

```vue
<!-- src/components/VolumeControl.vue -->
<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { computed } from 'vue'

const audioStore = useAudioStore()

const volumeIcon = computed(() => {
  if (audioStore.isMuted) return '🔇'
  if (audioStore.volume < 0.3) return '🔈'
  if (audioStore.volume < 0.7) return '🔉'
  return '🔊'
})
</script>

<template>
  <div class="volume-control">
    <button @click="audioStore.toggleMute" :aria-label="audioStore.isMuted ? '取消静音' : '静音'">
      {{ volumeIcon }}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      :value="audioStore.volume"
      @input="audioStore.setVolume(Number(($event.target as HTMLInputElement).value))"
      :disabled="audioStore.isMuted"
      aria-label="音量控制"
    />
  </div>
</template>

<style scoped>
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-control input[type="range"] {
  width: 80px;
  cursor: pointer;
}

.volume-control input[type="range"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
```

### 音频精灵制作（参考）

```bash
# 使用 audiosprite 工具（需要 Node.js）
npm install -g audiosprite

# 合并音效文件
audiosprite \
  --output public/sounds/sprite \
  --format mp3 \
  public/sounds/move.mp3 \
  public/sounds/merge.mp3 \
  public/sounds/win.mp3 \
  public/sounds/lose.mp3

# 生成文件：
# - public/sounds/sprite.mp3 (合并后的音频)
# - public/sounds/sprite.json (时间戳定义，需手动转换为 Howl 格式)
```

**生成的 sprite.json 示例：**
```json
{
  "spritemap": {
    "move": {
      "start": 0,
      "end": 0.15
    },
    "merge": {
      "start": 0.2,
      "end": 0.5
    },
    "win": {
      "start": 0.6,
      "end": 2.6
    },
    "lose": {
      "start": 2.7,
      "end": 4.2
    }
  }
}
```

**转换为 Howl 格式：**
```typescript
const SPRITE_DATA = {
  move: [0, 150],       // [开始时间(ms), 持续时间(ms)]
  merge: [200, 300],
  win: [600, 2000],
  lose: [2700, 1500]
}
```

## 技术前沿

| 旧方法 | 当前方法 | 变化时间 | 影响 |
|--------|----------|----------|------|
| 多个独立音频文件 | Audio Sprites（音频精灵） | 2018+ | 减少 HTTP 请求、iOS 兼容性、更好的缓存策略 |
| HTML5 Audio 标签 | Web Audio API + Howler.js | 2019+ | 更低延迟、更好的音量控制、跨浏览器一致性 |
| 手动 localStorage 封装 | @vueuse/useStorage | 2021+ | 响应式、类型安全、自动同步 |
| Options API | Composition API + Composables | 2022+ | 更好的逻辑复用、类型推断 |

**已弃用/过时：**
- SoundJS (CreateJS)：已停止维护，最后更新于 2018 年
- Buzz.js：已停止维护，不支持现代浏览器
- 原生 Audio 标签：性能差、无预加载、无音量渐变

## 开放问题

1. **音频文件来源**
   - 已知信息：需要 4 个音效（移动、合并、胜利、失败）
   - 不明确：音效文件的具体来源（自由版权、自录制、在线资源库）
   - 建议：使用 Freesound.org 或 OpenGameArt.org 的自由版权音效，或使用 Web Audio API 合成简单音效

2. **音频精灵制作流程**
   - 已知信息：需要使用 audiosprite 或类似工具合并音效
   - 不明确：项目是否已有现成的音效文件，或需要从零开始制作
   - 建议：提供现成的音效文件和 sprite.mp3，或提供详细的制作指南

3. **音效测试策略**
   - 已知信息：需要测试音效播放和用户交互
   - 不明确：如何在单元测试中模拟 Howler.js（需要 mock）
   - 建议：使用 vitest 的 vi.mock 模拟 Howler.js，验证播放函数被调用而非实际播放音频

## 环境可用性

| 依赖 | 需求方 | 可用 | 版本 | 回退方案 |
|------|--------|------|------|----------|
| Node.js | 音频精灵工具（可选） | ✓ | 22.12.0 | 使用在线工具或预制作文件 |
| npm | Howler.js 安装 | ✓ | - | - |
| 现代浏览器 | Web Audio API | ✓ | - | Howler.js 自动降级到 HTML5 Audio |
| localStorage | 配置持久化 | ✓ | - | Pinia state（不持久化） |

**无回退方案的阻塞项：**
- 无

**有回退方案的缺失项：**
- 无

## 验证架构

> 根据 `.planning/config.json`，`workflow.nyquist_validation: false`，跳过验证架构部分。

## 信息来源

### 主要来源（HIGH 信心）

- [Howler.js 官方文档](https://howlerjs.com) - API 参考、Audio Sprites 配置、事件处理
- [Howler.js GitHub 仓库](https://github.com/goldfire/howler.js) - 源代码、Issue 讨论、示例
- [VueUse 官方文档 - useStorage](https://vueuse.org/core/useStorage/) - LocalStorage 持久化
- [Pinia 官方文档](https://pinia.vuejs.org) - 状态管理最佳实践
- [项目现有代码](D:\Projects\demo\games\2048\src) - 项目架构、编码规范、现有模式

### 次要来源（MEDIUM 信心）

- [STACK-V1.2.md](.planning/research/STACK-V1.2.md) - 音效系统技术栈研究
- [REQUIREMENTS.md](.planning/REQUIREMENTS.md) - 需求定义（AUDIO-01 至 AUDIO-07）
- [Playwright 自动播放策略讨论](https://github.com/goldfire/howler.js/issues/1294) - 浏览器限制处理
- [Vue 3 + Howler.js 集成示例](https://stackoverflow.com/questions/73517599/audio-component-in-javascript-with-vue3) - 实战代码模式

### 第三来源（LOW 信心）

- [Vue Best Practices 指南](https://cloudinary.com/guides/web-performance/vue-best-practices) - 通用最佳实践
- [音频精灵制作工具](https://github.com/rafaelfbsouza/audiosprite) - 工具文档（需验证当前版本）

## 元数据

**信心评估：**
- 标准技术栈：HIGH - 基于 npm registry 验证和官方文档
- 架构模式：HIGH - 基于项目现有架构和 Vue 3 最佳实践
- 常见陷阱：HIGH - 基于浏览器自动播放策略和 Howler.js 官方文档

**研究日期：** 2026-03-30
**有效期：** 30 天（Howler.js 2.2.4 为稳定版本，Web Audio API 规范稳定）

---

## 下一步行动

1. **音效资源准备**
   - 获取或制作 4 个音效文件（move.mp3, merge.mp3, win.mp3, lose.mp3）
   - 使用 audiosprite 工具合并为 sprite.mp3
   - 将 sprite.mp3 放入 `public/sounds/` 目录

2. **核心实现**
   - 创建 `src/composables/useAudio.ts`（音效管理）
   - 创建 `src/stores/audio.ts`（音效状态）
   - 创建 `src/components/VolumeControl.vue`（音量控制）

3. **集成现有代码**
   - 修改 `src/composables/useGameControls.ts`（集成移动/合并音效）
   - 修改 `src/components/GameHeader.vue`（添加音量控制按钮）
   - 修改 `src/stores/game.ts`（增强状态检测，支持胜利/失败音效）

4. **测试验证**
   - 验证音效在桌面浏览器播放正常
   - 验证音效在移动端播放正常（iOS/Android）
   - 验证音量和静音功能
   - 验证 localStorage 持久化
   - 验证浏览器自动播放策略处理
