# Phase 7: 性能验证 - 研究文档

**研究日期：** 2026-03-16
**领域：** Web 性能测试和验证、Chrome DevTools 性能分析
**置信度：** HIGH

## 摘要

Phase 7 专注于验证 Phase 6 实施的 GPU 加速动画优化效果，通过对比优化前后的性能数据，量化性能提升，确保游戏达到稳定 60fps 的目标。研究表明，现代 Web 性能验证需要结合多种工具和方法：Chrome DevTools Performance 面板用于详细的帧率和 Long Tasks 分析，Lighthouse 用于综合性能评分，Playwright 用于自动化性能测试，以及在真实设备（特别是低端移动设备）上进行手动测试以验证实际用户体验。

**主要建议：** 建立三层验证体系：1) Chrome DevTools Performance 录制对比（优化前 vs 优化后），2) Lighthouse 评分验证（目标 ≥90），3) 低端设备真实测试（3 年前手机）。创建性能对比报告文档化优化效果。

## 标准技术栈

### 核心
| 技术 | 版本 | 用途 | 为什么标准 |
|------|------|------|-----------|
| Chrome DevTools Performance | 内置 | FPS 监控、Long Tasks 分析、火焰图 | Google 官方性能分析工具，最精确的帧率测量 |
| Lighthouse | 内置 | 综合性能评分、Core Web Vitals | Google 官方审计工具，行业标准 |
| Playwright | 1.58+ | 自动化性能测试、Chrome DevTools Protocol (CDP) | 支持 CDP tracing，可捕获性能指标 |
| Web Vitals | 2024 标准 | 用户体验指标（LCP、INP、CLS） | Google 官方核心指标，SEO 排名因素 |

### 支持工具
| 技术 | 版本 | 用途 | 使用场景 |
|------|------|------|----------|
| Chrome DevTools Protocol | 最新 | 底层性能数据捕获 | Playwright 集成，自动化测试 |
| Lighthouse CI | 最新 | CI/CD 性能回归检测 | GitHub Actions 集成，防止性能倒退 |
| Lighthouse CI Action | GitHub Action | 自动化性能评分 | 每次 PR/commit 运行 |

### 替代方案考虑
| 替代 | 可用 | 权衡 |
|------|------|------|
| WebPageTest | ✅ | 更详细的网络分析，但需要外部服务 |
| SpeedCurve | ✅ | 商业监控工具，性能趋势追踪，但付费 |
| Bundle Analyzer | ✅ | 构建产物分析，但不测运行时性能 |

**当前项目已使用：**
- ✅ Playwright 1.58.2
- ✅ Vitest 4.0.18
- ✅ Vite 7.3.1
- ✅ Vue 3.5.29

## 架构模式

### 推荐项目结构
```
.planning/phases/07-performance-validation/
├── 07-01-PLAN.md                 # 性能验证计划
├── 07-01-SUMMARY.md              # 性能对比报告
├── performance-baseline/          # 基线数据（06-01 录制）
│   ├── before-optimization.json  # 优化前性能数据
│   └── screenshots/              # 性能截图
├── performance-report/            # 验证结果（07-01 生成）
│   ├── after-optimization.json   # 优化后性能数据
│   ├── comparison.md             # 对比分析
│   └── screenshots/              # 优化后截图
└── lighthouse-reports/           # Lighthouse 报告
    ├── baseline.json             # 基线评分
    └── optimized.json            # 优化后评分
```

### 模式 1：Chrome DevTools Performance 录制对比
**内容：** 录制优化前后的性能数据，对比 FPS、Long Tasks、渲染时间
**何时使用：** 所有动画性能优化验证
**工作流程：**

```bash
# 1. 打开 Chrome DevTools (F12)
# 2. 切换到 Performance 面板
# 3. 点击 Record 按钮（圆点图标）
# 4. 执行游戏操作（移动方块 15-20 次，触发各种动画）
# 5. 停止录制（再次点击圆点图标）
# 6. 分析结果：
#    - 查看 FPS 图表（底部绿色/黄色/红色柱状图）
#    - 查看 Frames 部分（每帧的详细分解）
#    - 查看 Main 线程（寻找 Long Tasks）
#    - 查看 Layout/Paint/Composite 时间
```

**验证标准：**
- ✅ FPS 稳定在 60fps（绿色柱状图，无明显黄色/红色）
- ✅ 每帧渲染时间 < 16.67ms
- ✅ 无 Long Tasks (> 50ms)
- ✅ Layout 和 Paint 时间占比小（主要是 Composite）

**来源：** [web.dev - Long Tasks DevTools](https://web.dev/articles/long-tasks-devtools)

### 模式 2：Lighthouse 性能评分验证
**内容：** 使用 Lighthouse 审计游戏性能，确保综合评分 ≥ 90
**何时使用：** 每次性能优化后，发布前
**工作流程：**

```bash
# 1. 打开 Chrome DevTools (F12)
# 2. 切换到 Lighthouse 面板
# 3. 选择 "Performance" 和 "Progressive Web App" 类别
# 4. 点击 "Analyze page load"
# 5. 查看评分（目标 ≥ 90）
```

**关键指标（2024 Web Vitals 标准）：**
- ✅ Performance: ≥ 90
- ✅ Largest Contentful Paint (LCP): < 2.5s
- ✅ Interaction to Next Paint (INP): < 200ms（2024 年替代 FID）
- ✅ Cumulative Layout Shift (CLS): < 0.1
- ✅ Total Blocking Time (TBT): < 200ms

**来源：** [web.dev - Web Vitals](https://web.dev/articles/vitals), [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### 模式 3：Playwright 自动化性能测试
**内容：** 使用 Playwright + Chrome DevTools Protocol (CDP) 捕获性能指标
**何时使用：** CI/CD 自动化测试，性能回归检测
**示例代码：**

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test('性能验证：游戏动画应稳定在 60fps', async ({ page, context }) => {
  // 启用 Chrome DevTools Protocol
  const cdpSession = await context.newCDPSession(page)

  // 启用性能指标收集
  await cdpSession.send('Performance.enable')

  // 导航到游戏页面
  await page.goto('/')

  // 开始性能跟踪
  await cdpSession.send('Performance.start')

  // 执行游戏操作（触发动画）
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowUp')

  // 等待动画完成
  await page.waitForTimeout(1000)

  // 获取性能指标
  const metrics = await cdpSession.send('Performance.getMetrics')

  // 验证 FPS（通过 metrics 计算）
  // 注意：CDP 不直接提供 FPS，需要通过 timestamps 计算

  // 停止性能跟踪
  await cdpSession.send('Performance.disable')
})

test('性能验证：无 Long Tasks (> 50ms)', async ({ page }) => {
  // 使用 Playwright tracing 捕获性能数据
  await page.goto('/')

  // 执行游戏操作
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(100)
  }

  // 检查性能（通过 trace 查看）
  // 在 CI 中保存 trace 用于分析
})
```

**更高级的 FPS 测量：**

```typescript
// 使用 Chrome trace 事件测量 FPS
test('FPS 测量使用 Chrome Trace', async ({ page, context }) => {
  const cdpSession = await context.newCDPSession(page)

  // 启用 tracing
  await cdpSession.send('Tracing.start', {
    transferMode: 'ReturnAsStream'
  })

  await page.goto('/')

  // 执行动画操作
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(500)

  // 停止 tracing 并获取数据
  const tracingComplete = await cdpSession.send('Tracing.end')
  // 分析 trace 中的帧事件，计算 FPS
})
```

**来源：** [Playwright Performance Testing](https://checklyhq.com/docs/learn/playwright/performance), [Automating Animation Testing with Playwright](https://www.thegreenreport.blog/articles/automating-animation-testing-with-playwright-a-practical-guide/automating-animation-testing-with-playwright-a-practical-guide.html)

### 模式 4：性能对比报告
**内容：** 文档化优化前后的性能数据对比
**何时使用：** Phase 7 完成时，创建 SUMMARY.md
**报告模板：**

```markdown
# 性能验证报告

## 优化前基线（Phase 6-01）
- FPS: 45-55fps（波动）
- Long Tasks: 2-3 个 (> 50ms)
- Lighthouse Performance: 78
- 每帧渲染时间: 18-22ms

## 优化后结果（Phase 7-01）
- FPS: 稳定 60fps
- Long Tasks: 0 个
- Lighthouse Performance: 92
- 每帧渲染时间: 12-15ms

## 性能提升
- FPS 提升: 9-15fps (18-33%)
- Long Tasks 减少: 100%
- Lighthouse 评分提升: +14 分
- 渲染时间减少: 6-7ms (33-39%)

## 结论
✅ 性能优化成功，达到 60fps 目标
```

**来源：** [BlazeMeter - Baseline Comparison](https://help.blazemeter.com/docs/guide/performance-baseline-comparison.html)

### 反模式避免
- **❌ 仅依赖主观感受：** "感觉流畅了"不够客观
  - **正确做法：** 使用 Chrome DevTools 录制数据，量化 FPS
- **❌ 忽略低端设备：** 桌面流畅不代表移动端流畅
  - **正确做法：** 在 3 年前的手机上测试
- **❌ 只看平均 FPS：** 平均 60fps 可能有卡顿
  - **正确做法：** 查看 FPS 图表，确保稳定（无掉帧）
- **❌ 忽略 Long Tasks：** FPS 60 但有 100ms 任务会导致卡顿
  - **正确做法：** 确保 Long Tasks < 50ms
- **❌ 一次性测试：** 单次测试可能偶然
  - **正确做法：** 多次录制，取平均值

## 不要手写实现

| 问题 | 不要自己实现 | 使用替代方案 | 原因 |
|------|-------------|-------------|------|
| FPS 计算 | 手动计算帧时间差 | Chrome DevTools Performance 面板 | 官方工具，精确可视化 |
| 性能评分 | 自己定义指标 | Lighthouse | 行业标准，全面审计 |
| Long Tasks 检测 | 手动计时 | Chrome DevTools Main 线程分析 | 自动识别 >50ms 任务 |
| 性能回归检测 | 手动对比 | Lighthouse CI + GitHub Actions | 自动化，PR 阻断 |
| 移动端测试 | 模拟器 | 真实设备（3 年前手机） | 真实性能，模拟器不准确 |
| 报告生成 | 手动编写 | Lighthouse CI HTML 报告 | 专业格式，趋势追踪 |

**关键洞察：** 现代浏览器提供了强大的性能分析工具，手动实现既不准确也不必要。

## 常见陷阱

### 陷阱 1：FPS 仪表显示 60fps 但实际卡顿
**问题：** Chrome DevTools FPS 仪表显示接近 60fps，但动画明显卡顿
**原因：** FPS 仪表是平均值，可能隐藏掉帧。帧时间不均匀也会导致卡顿。
**如何避免：**
  1. 查看 FPS 图表（不只是数字）
  2. 检查帧时间是否均匀（不应该有突兀的峰值）
  3. 查看 Long Tasks（即使平均 FPS 60，长任务会导致卡顿）

**来源：** [Stack Overflow - FPS always showing 60fps with dropped frames](https://stackoverflow.com/questions/71637468/in-chrome-devtools-performance-why-is-the-fps-always-showing-60fps-with-dropped)

### 陷阱 2：忽略 Long Tasks
**问题：** FPS 稳定 60，但交互响应慢
**原因：** Long Tasks (> 50ms) 阻塞主线程，影响输入响应
**如何避免：**
  1. 在 Performance 面板查看 Main 线程
  2. 寻找红色标记的任务（Long Tasks）
  3. 确保所有任务 < 50ms

**来源：** [web.dev - Long Tasks DevTools](https://web.dev/articles/long-tasks-devtools)

### 陷阱 3：仅在高性能设备上测试
**问题：** 开发机（M1/M2/M3 MacBook）上流畅，低端设备卡顿
**原因：** 开发设备性能远超用户设备
**如何避免：**
  1. 使用 Chrome DevTools CPU 限制（4x slowdown）
  2. 在 3 年前的手机上测试
  3. 使用 Playwright 移动设备模拟

**CPU 限制方法：**
```bash
# Chrome DevTools
1. 打开 Performance 面板
2. 点击齿轮图标（设置）
3. 选择 "CPU 4x slowdown"
4. 重新录制
```

### 陷阱 4：Lighthouse 评分误解
**问题：** Lighthouse Performance 95 但实际卡顿
**原因：** Lighthouse 主要测加载性能，不测运行时动画
**如何避免：**
  1. Lighthouse 用于加载性能验证
  2. Chrome DevTools Performance 用于动画性能验证
  3. 两者结合才能全面评估

### 陷阱 5：优化后未对比基线
**问题：** 优化后 FPS 60，但不知道提升了多少
**原因：** 没有录制优化前基线数据
**如何避免：**
  1. Phase 6-01：录制优化前基线（已完成）
  2. Phase 7-01：录制优化后数据
  3. 创建对比报告（提升幅度）

### 陷阱 6：Web Vitals 指标过时
**问题：** 使用 FID 而非 INP
**原因：** 2024 年 3 月 Google 用 INP 替代了 FID
**如何避免：**
  1. 使用最新 Web Vitals：LCP、INP、CLS
  2. INP (Interaction to Next Paint): < 200ms
  3. FID 已废弃，不再使用

**来源：** [web.dev - Web Vitals](https://web.dev/articles/vitals)

## 代码示例

### 示例 1：Chrome DevTools Performance 录制工作流

```bash
# 步骤 1：启动开发服务器
npm run dev

# 步骤 2：打开 Chrome 并访问 http://localhost:5173

# 步骤 3：打开 DevTools (F12) → Performance 面板

# 步骤 4：清理之前的数据（点击垃圾桶图标）

# 步骤 5：点击 Record（圆点图标）

# 步骤 6：执行游戏操作
# - 移动方块 15-20 次（上下左右）
# - 触发新方块生成
# - 触发方块合并
# - 持续 10-15 秒

# 步骤 7：停止录制（再次点击圆点图标）

# 步骤 8：分析结果
# - FPS 图表（底部）：查看是否稳定在 60fps（绿色）
# - Frames 部分：查看每帧的渲染时间
# - Main 线程：查找 Long Tasks（红色标记）
# - Layout/Paint/Composite：查看各阶段时间

# 步骤 9：保存截图（用于对比报告）
# - FPS 图表截图
# - Frames 部分截图
# - Main 线程截图
```

**验证清单：**
- [ ] FPS 稳定在 60fps（绿色柱状图）
- [ ] 每帧渲染时间 < 16.67ms
- [ ] 无 Long Tasks (> 50ms)
- [ ] Layout 和 Paint 时间占比小
- [ ] 保存截图用于对比

**来源：** [Chrome DevTools Performance Guide](https://namastedev.com/blog/performance-profiling-with-chrome-devtools-from-reflow-to-paint/)

### 示例 2：Lighthouse 性能审计工作流

```bash
# 步骤 1：在 Chrome 中打开游戏页面
# http://localhost:5173

# 步骤 2：打开 DevTools (F12) → Lighthouse 面板

# 步骤 3：配置审计选项
# - Categories: Performance, Progressive Web App
# - Device: Desktop（或 Mobile）
# - Throttling: Simulated fast 4G（或 No throttling）

# 步骤 4：点击 "Analyze page load"
# - 等待 30-60 秒完成审计

# 步骤 5：查看评分
# - Performance: 目标 ≥ 90
# - LCP: 目标 < 2.5s
# - INP: 目标 < 200ms
# - CLS: 目标 < 0.1
# - TBT: 目标 < 200ms

# 步骤 6：保存报告
# - 点击 "Save report" 下载 HTML
# - 保存到 .planning/phases/07-performance-validation/lighthouse-reports/
```

**目标指标（2024 Web Vitals）：**
- Performance: ≥ 90
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1
- TBT: < 200ms

**来源：** [web.dev - Web Vitals](https://web.dev/articles/vitals), [Google Lighthouse](https://github.com/GoogleChrome/lighthouse-ci)

### 示例 3：Playwright 性能测试（E2E）

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('性能验证', () => {
  test('应该稳定在 60fps（手动验证）', async ({ page }) => {
    await page.goto('/')

    // 执行游戏操作
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(100) // 等待动画
    }

    // 注意：Playwright 无法直接测量 FPS
    // 此测试仅确保应用不崩溃
    // 真实 FPS 测量需要 Chrome DevTools 手动验证

    // 验证游戏状态正常
    const grid = page.locator('.game-board')
    await expect(grid).toBeVisible()
  })

  test('Lighthouse 性能评分 ≥ 90（手动验证）', async ({ page }) => {
    await page.goto('/')

    // 等待页面完全加载
    await page.waitForLoadState('networkidle')

    // 注意：Lighthouse 需要手动运行
    // 此测试仅确保页面可访问
    // 真实 Lighthouse 评分需要手动在 DevTools 中运行

    // 验证关键元素存在
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.game-board')).toBeVisible()
  })

  test('无 JavaScript 错误', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.toString())
    })

    await page.goto('/')

    // 执行游戏操作
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowUp')

    // 验证无错误
    expect(errors).toHaveLength(0)
  })
})
```

**运行测试：**
```bash
npm run test:e2e
```

**来源：** [Playwright Performance Testing](https://checklyhq.com/docs/learn/playwright/performance)

### 示例 4：性能对比报告模板

```markdown
# 性能验证报告

**优化日期：** 2026-03-16
**验证人：** [用户名]
**设备：** [开发机型号 / 测试设备]

## 测试环境

- **浏览器：** Chrome [版本号]
- **设备：** [设备信息]
- **测试时长：** [录制时长]
- **操作次数：** [移动方块次数]

## 优化前基线（Phase 6-01）

### Chrome DevTools Performance
- **FPS:** 45-55fps（波动，黄色/红色区域）
- **每帧渲染时间:** 18-22ms
- **Long Tasks:** 2-3 个（80-120ms）
- **Layout/Paint 时间:** 占比 30-40%

### Lighthouse
- **Performance:** 78
- **LCP:** 3.2s
- **INP:** 350ms
- **CLS:** 0.05
- **TBT:** 450ms

### 主观体验
- 方块移动时有明显卡顿
- 合并动画不流畅
- 长时间游戏后变慢

## 优化后结果（Phase 7-01）

### Chrome DevTools Performance
- **FPS:** 稳定 60fps（绿色柱状图）
- **每帧渲染时间:** 12-15ms
- **Long Tasks:** 0 个（无 >50ms 任务）
- **Layout/Paint 时间:** 占比 <10%

### Lighthouse
- **Performance:** 92 (+14)
- **LCP:** 2.1s (-1.1s)
- **INP:** 150ms (-200ms)
- **CLS:** 0.02 (-0.03)
- **TBT:** 180ms (-270ms)

### 主观体验
- ✅ 方块移动流畅
- ✅ 合并动画顺滑
- ✅ 长时间游戏无性能下降

## 性能提升

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| FPS | 45-55 | 稳定 60 | 9-15fps (18-33%) |
| 渲染时间 | 18-22ms | 12-15ms | 6-7ms (33-39%) |
| Long Tasks | 2-3 个 | 0 个 | -100% |
| Lighthouse | 78 | 92 | +14 分 |
| LCP | 3.2s | 2.1s | -1.1s (34%) |
| INP | 350ms | 150ms | -200ms (57%) |
| TBT | 450ms | 180ms | -270ms (60%) |

## 截图对比

### FPS 图表
- [优化前截图](./screenshots/before-fps.png)
- [优化后截图](./screenshots/after-fps.png)

### Main 线程
- [优化前截图](./screenshots/before-main.png)
- [优化后截图](./screenshots/after-main.png)

### Lighthouse 报告
- [优化前报告](./lighthouse-reports/baseline.html)
- [优化后报告](./lighthouse-reports/optimized.html)

## 结论

✅ **性能优化成功，达到所有目标：**

1. ✅ FPS 稳定在 60fps（Chrome DevTools 验证）
2. ✅ Long Tasks < 50ms（无主线程阻塞）
3. ✅ Lighthouse Performance ≥ 90（得分为 92）
4. ✅ 低端设备测试流畅（在 [设备型号] 上测试）
5. ✅ 主观体验显著提升

**关键优化点：**
- 使用 translate3d() 强制 GPU 层
- 动态管理 will-change（动画前添加，结束后移除）
- 优化缓动函数为 cubic-bezier()
- 移除过渡动画中的 'all' 属性

**下一步建议：**
- 在更多真实设备上测试
- 考虑添加 CSS contain 限制重排范围
- 监控生产环境性能（Lighthouse CI）

---

**验证日期：** 2026-03-16
**签名：** [用户名]
```

**来源：** [BlazeMeter - Baseline Comparison](https://help.blazemeter.com/docs/guide/performance-baseline-comparison.html)

## 技术前沿状态

| 旧方法 | 当前方法 | 变更时间 | 影响 |
|--------|----------|----------|------|
| 手动 FPS 计算 | Chrome DevTools Performance | 2013+ | 精确可视化，自动化分析 |
| FID 指标 | INP 指标 | 2024-03 | 更准确衡量交互性能 |
| 单点测试 | 基线对比 + 回归检测 | 2018+ | 量化提升，防止倒退 |
| 手动 Lighthouse | Lighthouse CI | 2019+ | 自动化，集成 CI/CD |
| 仅桌面测试 | 多设备 + CPU 限制 | 2020+ | 真实用户体验 |

**已弃用/过时：**
- ❌ **First Input Delay (FID)：** 2024 年 3 月被 INP 替代
- ❌ **手动 FPS 计算（Date.now()）：** 使用 requestAnimationFrame + Chrome DevTools
- ❌ **仅依赖主观感受：** 必须有量化数据支持
- ❌ **单点测试：** 必须有基线对比

**来源：** [web.dev - Web Vitals](https://web.dev/articles/vitals), [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 开放问题

1. **低端移动设备的具体测试方法**
   - 已知信息：需要在 3 年前的手机上测试
   - 不明确：如何获取或模拟低端设备
   - 建议：
     1. 使用真实设备（如有）
     2. 使用 Chrome DevTools CPU 限制（4x slowdown）
     3. 使用 Playwright 移动设备模拟（Pixel 5, iPhone 12）

2. **FPS 测量的自动化方案**
   - 已知信息：Chrome DevTools 需要手动录制
   - 不明确：是否有自动化 API 可用
   - 建议：
     1. 使用 Playwright + CDP tracing（部分自动化）
     2. 考虑 Lighthouse CI（间接验证）
     3. Phase 7 主要是手动验证，自动化可作为未来增强

3. **性能基线的持久化存储**
   - 已知信息：Phase 6-01 已录制基线数据
   - 不明确：如何结构化存储这些数据
   - 建议：
     1. 保存 Chrome DevTools 录制文件（.json）
     2. 保存 Lighthouse 报告（.html）
     3. 在 SUMMARY.md 中记录关键指标

4. **Lighthouse CI 是否需要集成**
   - 已知信息：Lighthouse CI 可用于自动化性能测试
   - 不明确：是否在 Phase 7 集成
   - 建议：
     1. Phase 7 聚焦手动验证（根据成功标准）
     2. Lighthouse CI 可作为 v1.2 功能（PERF-11）
     3. 当前阶段先验证优化效果，CI 集成延后

## 信息来源

### 主要来源（HIGH 置信度）
- [web.dev - Long Tasks DevTools](https://web.dev/articles/long-tasks-devtools) - Google 官方 Long Tasks 文档
- [web.dev - Web Vitals](https://web.dev/articles/vitals) - Google 官方 Core Web Vitals 指标（2024 更新）
- [Lighthouse CI GitHub](https://github.com/GoogleChrome/lighthouse-ci) - 官方 Lighthouse CI 仓库
- [Playwright Performance Testing](https://checklyhq.com/docs/learn/playwright/performance) - Playwright 官方性能测试文档
- [Chrome DevTools Performance Guide](https://namastedev.com/blog/performance-profiling-with-chrome-devtools-from-reflow-to-paint/) - 性能分析教程
- [Phase 6 研究文档](D:/Projects/demo/games/2048/.planning/phases/06-性能优化/06-RESEARCH.md) - 已完成的性能优化研究
- [Phase 6-02 SUMMARY](D:/Projects/demo/games/2048/.planning/phases/06-性能优化/06-02-SUMMARY.md) - 已实施的优化详情

### 次要来源（MEDIUM 置信度）
- [treosh/lighthouse-ci-action](https://github.com/treosh/lighthouse-ci-action) - GitHub Actions 集成
- [Automating Animation Testing with Playwright](https://www.thegreenreport.blog/articles/automating-animation-testing-with-playwright-a-practical-guide/automating-animation-testing-with-playwright-a-practical-guide.html) - 动画测试指南
- [BlazeMeter - Baseline Comparison](https://help.blazemeter.com/docs/guide/performance-baseline-comparison.html) - 基线对比方法
- [让您的长任务在50毫秒内结束](https://godbasin.github.io/2024/04/03/front-end-performance-long-task/) - Long Tasks 优化指南
- [如何用Chrome DevTools定位Long Task](https://juejin.cn/post/7586684925106159659) - DevTools Long Tasks 实战

### 第三级来源（LOW 置信度）
- [Stack Overflow - FPS always showing 60fps](https://stackoverflow.com/questions/71637468/in-chrome-devtools-performance-why-is-the-fps-always-showing-60fps-with-dropped) - FPS 仪表准确性问题
- [LinkedIn ABM Performance Benchmarks 2026](https://zenabm.com/blog/linkedin-abm-performance-benchmarks-report-2026) - 非相关性能基准
- [智能回归测试2026年五大趋势](https://cloud.tencent.com/developer/article/2634111) - AI 驱动测试趋势

## 元数据

**置信度分解：**
- 标准技术栈：**HIGH** - Chrome DevTools 和 Lighthouse 是行业标准，官方文档完备
- 架构模式：**HIGH** - 性能测试工作流经过广泛验证
- 常见陷阱：**HIGH** - Google 官方文档和社区最佳实践
- Playwright 性能测试：**MEDIUM** - 文档存在但需要实测验证
- 移动端测试：**MEDIUM** - 一般性指南，设备依赖性强
- 自动化 FPS 测量：**LOW** - 搜索结果显示自动化方案有限，主要依赖手动验证

**研究日期：** 2026-03-16
**有效期至：** 2026-04-16（Web 性能测试工具稳定，30 天有效）

**下一步行动：**
1. Phase 7-01：执行性能验证（Chrome DevTools + Lighthouse）
2. 创建性能对比报告（优化前 vs 优化后）
3. 在低端设备测试（3 年前手机或 CPU 限制）
4. 完成 v1.1 里程碑（Phase 7 是最后阶段）
