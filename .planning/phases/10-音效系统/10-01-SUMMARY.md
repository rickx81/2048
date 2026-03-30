---
phase: 10-音效系统
plan: 01
subsystem: audio
tags: [howler, web-audio-api, audio-sprites, pinia, vueuse]

# Dependency graph
requires: []
provides:
  - Howler.js 2.2.4 依赖安装
  - SoundEffect 类型定义
  - 音效状态管理 Store（audio.ts）
  - 音效播放逻辑 Composable（useAudio.ts）
affects: [游戏控制集成, UI 音量控制]

# Tech tracking
tech-stack:
  added: [howler@2.2.4, @types/howler]
  patterns: [audio-sprites, singleton-pattern, pinia-store, vueuse-storage]

key-files:
  created: [src/stores/audio.ts, src/composables/useAudio.ts]
  modified: [src/core/types.ts, package.json, package-lock.json]

key-decisions:
  - "Howler.js 作为 Web Audio API 封装层"
  - "Audio Sprites 优化移动端性能"
  - "Pinia Store + useStorage 持久化音效配置"
  - "全局单例模式管理 Howl 实例"

patterns-established:
  - "音效状态通过 Pinia store 管理（音量、静音）"
  - "音效播放逻辑封装在 useAudio composable 中"
  - "音效设置持久化到 localStorage（@vueuse/core useStorage）"
  - "全局单例模式避免内存泄漏"

requirements-completed: [AUDIO-05, AUDIO-06, AUDIO-07]

# Metrics
duration: 5min
completed: 2026-03-30
---

# Phase 10: Plan 01 Summary

**Howler.js 音效系统核心基础设施，包含 Audio Sprites 配置、Pinia 状态管理和 localStorage 持久化**

## Performance

- **Duration:** 5 分钟
- **Started:** 2026-03-30T09:42:50Z
- **Completed:** 2026-03-30T09:47:30Z
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments

- Howler.js 2.2.4 依赖已安装并配置类型定义
- SoundEffect 类型定义已添加到核心类型系统
- 音效状态管理 Store 已创建（音量、静音状态 + localStorage 持久化）
- 音效播放逻辑 Composable 已封装（Audio Sprites 配置 + 全局单例模式）

## Task Commits

Each task was committed atomically:

1. **Task 1: 安装 Howler.js 2.2.4 依赖** - `1291d53` (feat)
2. **Task 2: 添加 SoundEffect 类型定义** - `d87d191` (feat)
3. **Task 3: 创建音效状态管理 Store** - `9c05a7b` (feat)
4. **Task 4: 创建音效播放逻辑 Composable** - `5d32a57` (feat)
5. **修复类型错误** - `97e884a` (fix)

**Plan metadata:** 未生成（将在最终状态更新时提交）

## Files Created/Modified

- `package.json` - 添加 howler@^2.2.4 和 @types/howler 依赖
- `package-lock.json` - 更新依赖锁定文件
- `src/core/types.ts` - 添加 SoundEffect 类型定义（move, merge, win, lose）
- `src/stores/audio.ts` - 创建音效状态管理 Store，使用 useStorage 持久化音量和静音状态
- `src/composables/useAudio.ts` - 创建音效播放逻辑 Composable，封装 Howler.js 播放逻辑

## Decisions Made

- **Howler.js 选择：** 基于 RESEARCH.md 的研究，Howler.js 2.2.4 是当前稳定版本，跨平台兼容性好，支持 Audio Sprites 优化移动端性能
- **Audio Sprites 配置：** 预定义了 move (0-150ms)、merge (200-500ms)、win (600-2600ms)、lose (2700-4200ms) 四个音效的时间戳配置
- **持久化键名：** 使用 `__GAME_2048_AUDIO_VOLUME__` 和 `__GAME_2048_AUDIO_MUTED__` 作为 localStorage 存储键，避免与其他应用冲突
- **全局单例模式：** 使用 `let soundInstance: Howl | null = null` 确保全局只有一个 Howl 实例，避免内存泄漏和性能问题

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] 修复 TypeScript 类型错误**
- **Found during:** 任务 4 完成后运行类型检查
- **Issue:** Howler.js 缺少类型定义，loaderror 事件处理器参数类型不明确，SPRITE_DATA 类型不匹配 SoundSpriteDefinitions
- **Fix:**
  - 安装 `@types/howler` 类型定义包
  - 修复 loaderror 事件处理器参数类型：`(_: number, err: unknown)`
  - 修复 SPRITE_DATA 类型定义为 `Record<string, [number, number]>` 以匹配 Howler.js 的 SoundSpriteDefinitions 接口
- **Files modified:** package.json, package-lock.json, src/composables/useAudio.ts
- **Verification:** `pnpm type-check` 通过，所有类型错误已解决
- **Committed in:** `97e884a` (单独的修复提交)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** 类型修复是必要的，确保代码符合 TypeScript 严格模式要求。无范围蔓延。

## Issues Encountered

- **@types/howler 安装依赖冲突：** 初始安装时遇到 TypeScript 版本冲突，使用 `--legacy-peer-deps` 选项解决
- **SPRITE_DATA 类型定义：** 初始使用 `as const` 导致类型为 `readonly`，与 Howler.js 的可变类型不兼容，改为显式类型定义 `Record<string, [number, number]>` 解决

## User Setup Required

None - 无需外部服务配置。

**注意：** 音效文件 `public/sounds/sprite.mp3` 尚未创建，这是预期行为（将在后续计划中处理）。当前计划仅提供核心基础设施。

## Next Phase Readiness

- ✅ Howler.js 依赖已安装并配置
- ✅ 音效状态管理 Store 已创建并持久化到 localStorage
- ✅ 音效播放逻辑 Composable 已封装，提供完整的播放接口
- ⏳ 音效文件 `sprite.mp3` 需要在下一计划中准备
- ⏳ 游戏控制集成（useGameControls）需要在下一计划中实现
- ⏳ UI 音量控制组件需要在后续计划中创建

**阻塞问题：** 无

**关注点：**
- 音效文件格式和时长需符合 SPRITE_DATA 中定义的时间戳配置
- 浏览器自动播放策略要求在用户交互后初始化 AudioContext（已在 useAudio.initialize() 中处理）

---
*Phase: 10-音效系统*
*Plan: 01*
*Completed: 2026-03-30*
