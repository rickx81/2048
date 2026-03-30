# 领域陷阱

**领域:** Vue 3 游戏开发 - 音效、E2E 测试与构建优化
**研究日期:** 2026-03-30
**当前项目:** 2048 游戏 v1.2 里程碑
**置信度:** HIGH

## 关键陷阱

会导致重写或重大问题的错误。

### 陷阱 1: AudioContext 自动播放策略违反

**错误现象:**
- 音效在用户交互前无法播放
- 控制台错误: "The AudioContext was not allowed to start"
- 音效在某些浏览器中完全静音

**根本原因:**
现代浏览器（Chrome 66+、Firefox 71+、Safari 10+）要求 AudioContext 必须在用户手势（点击、触摸、按键）之后才能启动。这是浏览器自动播放策略的一部分，旨在防止网站未经用户同意自动播放声音。

**后果:**
- 音效系统在生产环境中完全失效
- 用户需要额外交互才能启用声音
- 跨浏览器兼容性问题（Safari 最严格）

**预防:**

```typescript
// ❌ 错误：在组件挂载时立即初始化 AudioContext
onMounted(() => {
  audioContext.value = new AudioContext()
  // 违反自动播放策略
})

// ✓ 正确：在用户交互后初始化 AudioContext
function initAudio() {
  if (!audioContext.value) {
    audioContext.value = new AudioContext()
  }
  // 恢复被挂起的 AudioContext
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume()
  }
}

// 在首次用户交互时调用
onMounted(() => {
  const handleFirstInteraction = () => {
    initAudio()
    window.removeEventListener('keydown', handleFirstInteraction)
    window.removeEventListener('click', handleFirstInteraction)
    window.removeEventListener('touchstart', handleFirstInteraction)
  }

  window.addEventListener('keydown', handleFirstInteraction, { once: true })
  window.addEventListener('click', handleFirstInteraction, { once: true })
  window.addEventListener('touchstart', handleFirstInteraction, { once: true })
})
```

**检测:**
- 在 Chrome DevTools 中查看 Console 是否有 AudioContext 警告
- 在 Safari 中测试音效是否需要额外点击
- 使用 `chrome://autoplay-policy` 验证自动播放策略

**应在哪个阶段处理:**
- **Phase AUDIO-01/AUDIO-02:** 实现移动/合并音效时必须处理
- **验证**: 在 Chrome/Firefox/Safari 中测试音效，确保无需额外点击

---

### 陷阱 2: 音频资源内存泄漏

**错误现象:**
- 长时间游戏后性能下降
- 内存占用持续增长
- 音频播放卡顿或延迟增加

**根本原因:**
- 未正确释放 AudioBuffer 和 AudioContext
- 音频事件监听器未清理
- 频繁创建新的 AudioContext 实例而非复用

**后果:**
- 游戏在移动设备上崩溃
- 60fps 性能目标无法达成
- 用户体验严重受损

**预防:**

```typescript
// ❌ 错误：每次播放都创建新 AudioContext
function playSound() {
  const ctx = new AudioContext() // 内存泄漏！
  const source = ctx.createBufferSource()
  // ...
}

// ✓ 正确：复用单一 AudioContext 实例
const audioContext = ref<AudioContext | null>(null)
const audioBuffers = ref<Map<string, AudioBuffer>>(new Map())

async function initAudio() {
  if (!audioContext.value) {
    audioContext.value = new AudioContext()
  }
}

async function preloadSound(id: string, url: string) {
  if (!audioContext.value) await initAudio()

  // 避免重复加载
  if (audioBuffers.value.has(id)) return

  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
  audioBuffers.value.set(id, audioBuffer)
}

function playSound(id: string) {
  if (!audioContext.value || audioContext.value.state === 'suspended') {
    return
  }

  const buffer = audioBuffers.value.get(id)
  if (!buffer) return

  const source = audioContext.value.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.value.destination)
  source.start(0)
  // source 会自动在播放完成后被垃圾回收
}

// 组件卸载时清理
onUnmounted(() => {
  audioContext.value?.close()
  audioBuffers.value.clear()
})
```

**检测:**
- 使用 Chrome DevTools Performance Monitor 监控内存
- 使用 Chrome DevTools Memory Profiler 进行堆快照
- 长时间游戏后检查 FPS 是否下降

**应在哪个阶段处理:**
- **Phase AUDIO-01/AUDIO-02:** 实现音效预加载和播放时
- **Phase AUDIO-04:** 实现音量控制时需确保资源正确管理
- **验证**: 连续游戏 30 分钟，内存占用稳定，FPS 保持在 60

---

### 陷阱 3: Playwright 测试中的竞态条件

**错误现象:**
- 本地测试通过，CI 中测试失败
- 测试间歇性失败（flaky tests）
- 测试超时或找不到元素

**根本原因:**
Vue 3 的响应式系统 + 异步更新导致 UI 状态存在时间差。测试代码在 DOM 更新完成前就尝试访问元素，或在动画进行中检查状态。

**后果:**
- CI/CD 流程不可靠
- 开发者对测试失去信心
- 真正的回归测试被掩盖

**预防:**

```typescript
// ❌ 错误：固定等待时间
test('移动方块', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ArrowUp')
  await page.waitForTimeout(500) // 不可靠！
  await expect(page.locator('.tile')).toHaveCount(3)
})

// ✓ 正确：使用 Playwright 自动等待和断言
test('移动方块', async ({ page }) => {
  await page.goto('/')

  // 等待游戏初始化
  await expect(page.locator('.game-board')).toBeVisible()

  // 执行移动
  await page.keyboard.press('ArrowUp')

  // Playwright 自动等待以下断言成立
  await expect(page.locator('.tile')).toHaveCount(3, {
    timeout: 2000 // 合理的超时时间
  })

  // 等待动画完成后再检查分数
  await expect(page.locator('.score')).toHaveText(/\d+/, {
    timeout: 1000
  })
})

// ✓ 正确：使用 locator 而非动态类名
test('主题切换', async ({ page }) => {
  await page.goto('/')

  // 使用稳定的 role 和 text 定位
  const themeButton = page.getByRole('button', { name: /主题/i })
  await themeButton.click()

  // 等待主题菜单出现
  await expect(page.getByRole('menu')).toBeVisible()

  // 点击具体主题（使用稳定的 text 或 data-testid）
  await page.getByRole('menuitem', { name: '森林绿' }).click()

  // 验证主题应用（使用 CSS 变量或稳定的 class）
  const gameBoard = page.locator('.game-board')
  await expect(gameBoard).toHaveCSS('--tile-color', '#4a3b32')
})
```

**检测:**
- 使用 Playwright 的 `--repeat` 标志识别 flaky tests
- 在 CI 中启用 CPU 节流模拟慢速设备
- 使用 Trunk.io 或类似工具检测 flaky tests

**应在哪个阶段处理:**
- **Phase E2E-01/E2E-02:** 编写核心游戏流程和控制测试时
- **Phase E2E-03:** 主题切换测试（涉及异步状态更新）
- **验证**: 运行 `playwright test --repeat=10` 确保测试稳定

---

### 陷阱 4: Vite 动态导入与路由懒加载的性能陷阱

**错误现象:**
- 懒加载后首次交互卡顿
- Lighthouse 性能分数下降
- 用户抱怨页面加载缓慢

**根本原因:**
- 对于小型应用（如 2048 游戏），路由代码分割的开销可能大于收益
- Vite 预加载策略可能与路由懒加载冲突
- 动态导入路径未正确配置导致 Rollup 无法静态分析

**后果:**
- 优化适得其反，性能反而下降
- 用户体验恶化
- 团队对构建优化失去信心

**预防:**

```typescript
// ❌ 错误：为小型应用过度分割代码
const router = createRouter({
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue') // 不必要的分割
    }
  ]
})

// ✓ 正确：2048 游戏使用静态导入（单页应用）
import GameContainer from './components/GameContainer.vue'

const router = createRouter({
  routes: [
    {
      path: '/',
      component: GameContainer // 静态导入，Vite 会优化
    }
  ]
})

// ✓ 正确：仅在真正需要时才使用动态导入
// 例如：延迟加载大型音频文件
async function loadAudioContext() {
  // 仅在用户首次交互时加载音频模块
  const { initializeAudio } = await import('./utils/audio')
  await initializeAudio()
}

// ✓ 正确：配置 Vite 手动分块（如果需要）
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将音频资源分离到单独的 chunk
          'audio': ['./src/utils/audio.ts'],
          // 将主题相关代码分离
          'theme': ['./src/stores/theme.ts', './src/composables/useTheme.ts']
        }
      }
    }
  }
})
```

**检测:**
- 使用 `vite-plugin-visualizer` 分析 bundle 大小
- 在 Chrome DevTools Network 面板中监控加载时间
- 使用 Lighthouse 评估性能影响
- 对比优化前后的真实用户体验指标

**应在哪个阶段处理:**
- **Phase BUILD-01:** 实现代码分割时必须评估实际收益
- **Phase BUILD-02:** 包体积优化时需权衡分割开销
- **验证**: 使用 Lighthouse 对比优化前后的性能分数

---

## 中等陷阱

会导致开发延误或复杂度增加的错误。

### 陷阱 5: 音效文件格式与加载优化

**错误现象:**
- 音效加载缓慢
- 移动设备上音效延迟明显
- 音频文件占用过多带宽

**根本原因:**
- 使用未压缩的音频格式（如 WAV）
- 音频文件体积过大（>100KB）
- 未使用音频压缩或优化工具

**预防:**

```typescript
// ✓ 推荐配置
const audioConfig = {
  format: 'mp3', // 或 'aac'，兼容性好，压缩率高
  maxFileSize: 50 * 1024, // 单个音效最大 50KB
  preloadCount: 3, // 预加载常用音效数量
  fallbackFormat: 'ogg' // Firefox 备选格式
}

// ✓ 音效最佳实践
// - 短音效（移动、合并）: <20KB，使用 MP3/AAC
// - 长音效（胜利、失败）: <50KB，使用压缩格式
// - 采样率: 44.1kHz 或 22.05kHz（无需更高）
// - 比特率: 64-128 kbps（足够游戏音效）

// ✓ 音频文件命名规范
/assets/sounds/
  ├── move.mp3       // 移动音效
  ├── merge.mp3      // 合并音效
  ├── win.mp3        // 胜利音效
  └── lose.mp3       // 失败音效
```

**应在哪个阶段处理:**
- **Phase AUDIO-01/AUDIO-02:** 准备音频资源时
- **验证**: 在 3G 网络下测试音效加载时间

---

### 陷阱 6: Playwright 测试中的选择器不稳定

**错误现象:**
- 测试在 UI 重构后频繁失败
- 需要大量维护测试代码
- 测试变成负担而非帮助

**根本原因:**
- 使用动态生成的 CSS 类名
- 依赖 DOM 结构而非语义
- 未使用稳定的测试属性

**预防:**

```typescript
// ❌ 错误：使用动态类名
await expect(page.locator('.tile.tile-2.position-1-1')).toBeVisible()

// ❌ 错误：依赖 DOM 结构
await expect(page.locator('.game-board > div:nth-child(3)')).toBeText('2')

// ✓ 正确：使用 role 和 text
await expect(page.getByRole('button', { name: '新游戏' })).toBeVisible()

// ✓ 正确：使用 data-testid
// 在组件中添加:
// <button data-testid="new-game-button">新游戏</button>
await expect(page.getByTestId('new-game-button')).toBeVisible()

// ✓ 正确：使用 ARIA 属性
await expect(page.getByLabel('分数')).toHaveText('0')
```

**应在哪个阶段处理:**
- **Phase E2E-01/E2E-02/E2E-03:** 所有 E2E 测试编写时
- **验证**: 重构 UI 组件，测试仍应通过

---

### 陷阱 7: Vite Tree Shaking 失效

**错误现象:**
- 打包体积未减小
- 未使用的代码仍然被打包
- 依赖的整个库被引入而非仅使用部分

**根本原因:**
- 使用 CommonJS 模块（如原版 lodash）
- 未正确配置 `package.json` 的 `sideEffects`
- 依赖库不支持 ES Module

**预防:**

```json
// package.json
{
  "sideEffects": [
    "*.css",
    "*.vue"
  ]
}
```

```typescript
// ❌ 错误：使用 CommonJS 库
import _ from 'lodash'

// ✓ 正确：使用 ES Module 版本
import { cloneDeep } from 'lodash-es'

// ✓ 更好：使用 VueUse（已用，支持 Tree Shaking）
import { useStorage } from '@vueuse/core'

// ✓ 正确：Vite 配置优化
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 将大型依赖分离到 vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
```

**应在哪个阶段处理:**
- **Phase BUILD-02:** 包体积优化时
- **验证**: 使用 `rollup-plugin-visualizer` 检查未使用的代码

---

## 次要陷阱

会导致小问题或技术债务的错误。

### 陷阱 8: 音效与动画不同步

**错误现象:**
- 音效早于或晚于动画播放
- 快速移动时音效堆叠

**预防:**

```typescript
// ✓ 正确：与动画时长同步
const ANIMATION_DURATION = 150 // 与 CSS transition 匹配

async function playMoveSound() {
  playSound('move')
  // 音效时长应 <= 动画时长
}

// ✓ 正确：防止音效堆叠
const isPlaying = ref(false)

function playSound(id: string) {
  if (isPlaying.value) return
  isPlaying.value = true

  const buffer = audioBuffers.value.get(id)
  if (!buffer) return

  const source = audioContext.value.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.value.destination)
  source.start(0)

  source.onended = () => {
    isPlaying.value = false
  }
}
```

**应在哪个阶段处理:**
- **Phase AUDIO-01/AUDIO-02:** 实现音效时
- **验证**: 快速连续移动，音效不应重叠或延迟

---

### 陷阱 9: E2E 测试缺乏清理

**错误现象:**
- 测试之间相互影响
- 后续测试因前置测试的状态而失败

**预防:**

```typescript
// ✓ 正确：每个测试前清理状态
test.beforeEach(async ({ page }) => {
  await page.goto('/')

  // 清空 localStorage
  await page.evaluate(() => {
    localStorage.clear()
  })

  // 或重置为已知状态
  await page.evaluate(() => {
    localStorage.setItem('game-volume', '0.5')
  })
})

test('测试音量控制', async ({ page }) => {
  // 测试逻辑...
})

test('测试静音功能', async ({ page }) => {
  // 不受上一个测试影响
})
```

**应在哪个阶段处理:**
- **Phase E2E-04:** CI/CD 集成时
- **验证**: 以随机顺序运行测试，全部通过

---

### 陷阱 10: 构建优化缺乏测量

**错误现象:**
- 优化后无法验证效果
- 不知优化是否值得

**预防:**

```bash
# ✓ 正确：优化前后对比

# 1. 基线测量
npm run build
# 记录 dist/ 大小和加载时间

# 2. 应用优化
# 修改 vite.config.ts

# 3. 对比测量
npm run build
# 对比 dist/ 大小变化

# 4. 使用 Bundle Analyzer
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

**应在哪个阶段处理:**
- **Phase BUILD-02/BUILD-03:** 包体积优化和 Bundle 分析时
- **验证**: 记录优化前后的 bundle 大小和 Lighthouse 分数

---

## 阶段特定警告

| 阶段主题 | 可能陷阱 | 缓解策略 |
|---------|---------|---------|
| **AUDIO-01/AUDIO-02** | AudioContext 自动播放策略违反 | 在首次用户交互后初始化 AudioContext |
| **AUDIO-01/AUDIO-02** | 音频资源内存泄漏 | 复用 AudioContext，正确预加载和清理资源 |
| **AUDIO-04** | 音量状态与 Pinia store 不同步 | 使用 VueUse useStorage 确保 localStorage 和响应式状态一致 |
| **E2E-01** | 测试中游戏状态未完全加载 | 使用 await expect().toBeVisible() 等待游戏就绪 |
| **E2E-02** | 触摸控制测试在 Desktop CI 失败 | 使用 Playwright 的 touchscreen 模拟或跳过触摸测试 |
| **E2E-03** | 主题切换测试不稳定（CSS 变量异步更新） | 等待 transition 动画完成后再验证样式 |
| **E2E-04** | CI 环境中浏览器权限问题（音频） | 使用 Playwright 的 context 授予权限或 mock 音频 |
| **BUILD-01** | 过度代码分割导致性能下降 | 评估应用规模，2048 可能不需要路由懒加载 |
| **BUILD-02** | Tree Shaking 失效 | 使用 ES Module 版本的库，配置 sideEffects |
| **BUILD-03** | Bundle 分析工具未集成 | 添加 rollup-plugin-visualizer 到构建流程 |
| **BUILD-04** | 优化未测量真实效果 | 使用 Lighthouse 和 Chrome DevTools 验证优化 |

---

## 集成陷阱

### 陷阱 11: 音效系统与现有 Pinia Store 的集成冲突

**错误现象:**
- 音效状态与游戏状态不同步
- 撤销功能触发多余的音效
- 音效在游戏结束后仍然播放

**预防:**

```typescript
// ✓ 正确：创建独立的 Audio Store
// src/stores/audio.ts
export const useAudioStore = defineStore('audio', () => {
  const enabled = useStorage('audio-enabled', true)
  const volume = useStorage('audio-volume', 0.5)

  function playSound(soundId: string) {
    if (!enabled.value) return
    // 播放音效逻辑...
  }

  return { enabled, volume, playSound }
})

// ✓ 正确：在 Game Store 中有条件地触发音效
function moveGrid(direction: Direction) {
  const result = move(grid.value, direction)

  if (!result.moved) return

  // 更新游戏状态
  grid.value = result.grid
  score.value += result.score

  // 仅在实际移动时播放音效
  const audioStore = useAudioStore()
  audioStore.playSound('move')

  if (result.score > 0) {
    audioStore.playSound('merge')
  }
}

// ✓ 正确：撤销时不播放音效
function undo() {
  // ... 撤销逻辑 ...
  // 不调用 audioStore.playSound()
}
```

**应在哪个阶段处理:**
- **Phase AUDIO-01/AUDIO-02:** 集成音效到游戏流程时
- **验证**: 撤销操作不应触发音效

---

### 陷阱 12: E2E 测试与音效自动播放策略冲突

**错误现象:**
- CI 环境中音效相关测试失败
- Playwright 无法触发 AudioContext

**预防:**

```typescript
// ✓ 正确：在 E2E 测试中 mock 音频
test('移动时播放音效', async ({ page }) => {
  // Mock Web Audio API
  await page.addInitScript(() => {
    window.AudioContext = class MockAudioContext {
      state = 'running'
      createBufferSource() {
        return {
          connect: () => {},
          start: () => {}
        }
      }
    }
  })

  await page.goto('/')
  await page.keyboard.press('ArrowUp')

  // 验证音效播放逻辑被调用（而非实际音频）
  const audioPlayed = await page.evaluate(() => {
    return (window as any).__audioPlayed === true
  })
  await expect(audioPlayed).toBe(true)
})
```

**应在哪个阶段处理:**
- **Phase E2E-04:** CI/CD 集成时
- **验证**: CI 环境中音效测试稳定通过

---

### 陷阱 13: 构建优化与 GitHub Pages 部署冲突

**错误现象:**
- 构建后资源路径 404
- 相对路径资源加载失败

**预防:**

```typescript
// ✓ 正确：配置 base 路径
// vite.config.ts
export default defineConfig({
  base: '/2048/', // 与 GitHub Pages 仓库名匹配
  plugins: [vue()]
})
```

```bash
# ✓ 正确：构建前验证
npm run build
# 检查 dist/index.html 中的资源路径是否为 /2048/assets/...
```

**应在哪个阶段处理:**
- **Phase BUILD-01/BUILD-04:** 代码分割和加载性能优化时
- **验证**: 本地预览构建产物，资源加载正常

---

## "看起来完成了但实际没有"检查清单

- [ ] **音效系统**: 往往缺少浏览器兼容性测试 — 验证：在 Chrome/Firefox/Safari 中测试音效
- [ ] **音频自动播放**: 往往只在开发环境测试 — 验证：在生产构建中测试音效
- [ ] **音频内存管理**: 往往缺少长时间测试 — 验证：连续游戏 30 分钟，内存稳定
- [ ] **E2E 测试稳定性**: 往往只在本地运行 — 验证：在 CI 中运行 10 次，全部通过
- [ ] **触摸控制测试**: 往往只在桌面测试 — 验证：在 Playwright 中使用 `hasTouch` 模拟
- [ ] **代码分割效果**: 往往缺少性能对比 — 验证：使用 Lighthouse 对比优化前后
- [ ] **Bundle 分析**: 往往未集成到 CI — 验证：每次构建自动生成分析报告
- [ ] **Tree Shaking**: 往往未验证实际效果 — 验证：检查 bundle 中是否包含未使用代码

---

## 恢复策略

| 陷阱 | 恢复成本 | 恢复步骤 |
|------|---------|---------|
| AudioContext 自动播放策略 | HIGH | 1. 将 AudioContext 初始化移到用户交互事件中<br>2. 添加 resume() 逻辑处理 suspended 状态<br>3. 在所有浏览器中重新测试 |
| 音频资源内存泄漏 | HIGH | 1. 重构为单例 AudioContext<br>2. 实现音频资源预加载和缓存<br>3. 添加 onUnmounted 清理逻辑<br>4. 使用 Memory Profiler 验证 |
| Playwright 竞态条件 | MEDIUM | 1. 移除所有 waitForTimeout() 调用<br>2. 使用 Playwright 自动等待断言<br>3. 添加合理的 timeout 配置<br>4. 使用 --repeat 验证稳定性 |
| Vite 动态导入性能陷阱 | LOW | 1. 移除不必要的动态导入<br>2. 改为静态导入或条件导入<br>3. 使用 Lighthouse 验证性能改善 |
| Tree Shaking 失效 | LOW | 1. 检查依赖是否支持 ES Module<br>2. 配置 package.json sideEffects<br>3. 使用 bundle analyzer 验证 |

---

## 调试技巧

### 音效系统调试

**1. AudioContext 状态检查:**
```javascript
// 在浏览器控制台运行
const ctx = new AudioContext()
console.log('State:', ctx.state) // 应该是 'running'
console.log('Sample rate:', ctx.sampleRate)
```

**2. 音频资源加载验证:**
```javascript
// 检查音频文件是否正确加载
fetch('/assets/sounds/move.mp3')
  .then(r => {
    console.log('Status:', r.status)
    console.log('Type:', r.headers.get('content-type'))
    console.log('Size:', r.headers.get('content-length'))
  })
```

**3. 内存泄漏检测:**
```javascript
// 在控制台运行，长时间游戏后观察增长
setInterval(() => {
  const refs = performance.memory
  if (refs) {
    console.log('Memory:', {
      used: (refs.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      total: (refs.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      limit: (refs.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    })
  }
}, 10000)
```

### E2E 测试调试

**1. Playwright 调试模式:**
```bash
# 调试特定测试
npx playwright test --debug

# 慢动作模式
npx playwright test --headed --slow-mo=1000

# 显示浏览器窗口
npx playwright test --headed
```

**2. 定位器验证:**
```typescript
// 在测试中使用
test('调试定位器', async ({ page }) => {
  await page.goto('/')
  await page.pause() // 暂停，打开 Playwright Inspector
})
```

**3. 网络条件模拟:**
```typescript
// 模拟慢速 3G 网络
test.use({ contextOptions: {
  offline: false,
  download: '1.5Mbps', // 下载速度
  upload: '0.7Mbps',   // 上传速度
  latency: 100         // 延迟
}})
```

### 构建优化调试

**1. Bundle 分析:**
```bash
# 安装分析工具
npm install -D rollup-plugin-visualizer

# 构建并生成报告
npm run build

# 打开报告
# dist/stats.html 会自动打开
```

**2. Vite 构建调试:**
```bash
# 详细构建日志
DEBUG=vite:* npm run build

# 强制重新构建
npm run build -- --force
```

**3. 依赖预构建检查:**
```bash
# 查看预构建的依赖
npx vite optimize --force

# 检查 node_modules/.vite 目录
ls -la node_modules/.vite
```

---

## 性能指标

### 音效系统性能目标

**基线测量（优化前）:**
- 首次音效延迟: <100ms
- 音效播放内存: <5MB
- 长时间游戏内存增长: <10MB/小时

**优化目标:**
- 首次音效延迟: <50ms
- 音效播放内存: <2MB
- 长时间游戏内存增长: <2MB/小时
- 音效不影响 FPS（保持在 60）

### E2E 测试性能目标

**测试执行时间:**
- 单个测试: <5 秒
- 全部测试套件: <60 秒
- CI 中总执行时间: <3 分钟

**测试稳定性:**
- Flaky rate: <1%
- 重复运行通过率: 100%（10 次运行）

### 构建优化目标

**打包体积:**
- 初始基线: ~500KB（预估）
- 优化目标: <300KB（减少 40%）

**加载性能:**
- 首次内容绘制 (FCP): <1.5s
- 最大内容绘制 (LCP): <2.5s
- Lighthouse 性能分数: >=90

---

## 信息来源

### 音效系统

**官方文档:**
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Autoplay Policy - Chrome](https://developer.chrome.com/blog/autoplay/)
- [AudioContext - Web Audio API](https://web.dev/audio-scheduling/)

**技术文章:**
- [vue3+howler.js实现音频播放](https://blog.csdn.net/weixin_49014702/article/details/124750315)
- [前端音频兼容解决：Howler.js 完整指南](https://juejin.cn/post/7560542615484137491)
- [游戏音频设计的陷阱与突破](https://blog.csdn.net/vscode5coder/article/details/155591122)
- [Howler.js Web音频播放终极解决方案](https://www.cnblogs.com/love314159/p/13534172.html)
- [VueUse Sound - Vue 组合式音效库](https://github.com/vueuse/sound)

### E2E 测试

**官方文档:**
- [Playwright 最佳实践](https://playwright.dev/docs/best-practices)
- [Playwright 断言](https://playwright.dev/docs/test-assertions)
- [Playwright Locators](https://playwright.dev/docs/locators)

**技术文章:**
- [Why Your Playwright Tests Are Still Flaky](https://medium.com/codetodeploy/why-your-playwright-tests-are-still-flaky-and-its-not-because-of-timing-9c005d0e83a3)
- [Playwright 断言：避免竞态条件](https://dev.to/playwright/playwright-assertions-avoid-race-conditions-with-this-simple-fix-dm1)
- [如何避免和检测 Playwright 中的 flaky tests](https://trunk.io/learn/how-to-avoid-and-detect-flaky-tests-in-playwright)
- [修复 Flaky Test 并避免使用 Sleep](https://rwoll.dev/posts/understanding-flaky-tests-and-avoiding-timeouts-with-playwright)
- [Vitest Playwright Electron Vue E2E 测试实践](https://my.oschina.net/emacs_7990386/blog/19391960)
- [Web 应用测试自动化：从痛点到解决方案](https://blog.gitcode.com/755b40e253c05b818d50e1c8775a2318c.html)

### 构建优化

**官方文档:**
- [Vite 构建优化指南](https://vite.dev/guide/build.html)
- [Vite 代码分割](https://vite.dev/guide/build.html#chunking-strategies)
- [Rollup Tree Shaking](https://rollupjs.org/plugin-development/#tree-shaking)

**技术文章:**
- [Vite 代码分割：从原理到最佳实践](https://comate.baidu.com/zh/page/x4tjfbn4gmz)
- [JavaScript 代码分割与按需加载优化实践](https://my.oschina.net/emacs_7993734/blog/19344517)
- [前端打包优化实战总结](https://www.jztheme.com/blog/framework/33852.html)
- [性能优化：删除了桶文件，打包体积减少了80%](https://juejin.cn/post/7435492245912551436)
- [Vite 打包性能优化以及填坑](https://zhuanlan.zhihu.com/p/646206520)
- [Tree Shaking 实践与踩坑（40% 体积压缩）](https://cloud.tencent.com/developer/article/2567183)
- [Vite 动态导入限制 - Stack Overflow](https://stackoverflow.com/questions/70112215/vue-router-lazy-loading-does-not-work-in-vite-error-unknown-variable-dynamic-i)
- [Vue Router 懒加载性能反直觉问题](https://github.com/vuejs/core/discussions/7091)

### 信心等级

| 领域 | 信心 | 原因 |
|------|------|------|
| 音效系统陷阱 | HIGH | 多个权威来源证实，官方文档支持 |
| E2E 测试陷阱 | HIGH | Playwright 官方文档和社区最佳实践支持 |
| 构建优化陷阱 | MEDIUM | 基于 Vite 5/6 文档，Vite 7 新特性需验证 |
| 集成陷阱 | MEDIUM | 基于项目特定架构推断，需实战验证 |

---

*领域陷阱研究：2048 游戏 v1.2 音效、E2E 测试与构建优化*
*研究日期：2026-03-30*
*置信度：HIGH*
