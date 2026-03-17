# 性能验证指南

本文档提供详细的性能验证步骤，用于验证 Phase 6 实施的 GPU 加速动画优化效果。

## 验证目标

验证游戏动画在 Chrome DevTools 中显示稳定 60fps，Lighthouse Performance 评分 ≥ 90。

---

## Chrome DevTools Performance 录制步骤

### 1. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 2. 打开 Chrome DevTools Performance 面板

1. 按 F12 打开 Chrome DevTools
2. 切换到 **Performance** 面板
3. 清除之前的录制记录（如有）

### 3. 开始录制

1. 点击 **Record** 按钮（圆点图标）
2. 录制指示器变为红色

### 4. 执行游戏操作

在录制期间执行以下操作（10-15 秒）：

1. **移动方块**：使用键盘方向键或触摸滑动 15-20 次
2. **触发各种动画**：
   - 新方块生成动画
   - 方块移动动画
   - 方块合并动画
3. **覆盖不同方向**：上下左右都操作几次
4. **持续操作**：确保动画连续触发

### 5. 停止录制

1. 再次点击 **Record** 按钮（停止图标）
2. 等待 DevTools 处理录制数据（1-2 秒）

---

## 关键验证指标

录制停止后，分析以下关键指标：

### FPS 图表

**位置：** Performance 面板顶部，FPS 区域

**验证标准：**
- ✅ 稳定在 **60fps**（绿色柱状图占 95% 以上）
- ❌ 无黄色/红色柱状图（掉帧）

**每帧渲染时间：**
- ✅ **< 16.67ms**（确保 60fps）
- 查看 **Frames** 部分，选择任意帧查看详细时间

### Long Tasks

**位置：** Main 线程，红色任务条

**验证标准：**
- ✅ **0 个 > 50ms 的任务**
- ❌ 无红色标记的长任务

### Layout/Paint 时间

**位置：** Main 线程，查看 Layout 和 Paint 事件

**验证标准：**
- ✅ Layout/Paint 时间占比 **< 10%**
- ✅ 主要应该是 **Composite** 操作（GPU 加速）

---

## 截图保存清单

录制完成后，保存以下截图到指定位置：

### 1. FPS 图表截图

**保存路径：** `.planning/phases/07-performance-validation/screenshots/fps-after-optimization.png`

**截图内容：**
- FPS 图表区域
- 显示稳定 60fps 的绿色柱状图
- 包含时间轴（10-15 秒录制时长）

### 2. Main 线程火焰图

**保存路径：** `.planning/phases/07-performance-validation/screenshots/main-thread-after.png`

**截图内容：**
- Main 线程完整火焰图
- 显示任务分布（主要是 Composite）
- 无红色 Long Tasks

### 3. Frames 详细视图

**保存路径：** `.planning/phases/07-performance-validation/screenshots/frames-detail-after.png`

**截图内容：**
- 选择任意帧的详细视图
- 显示帧渲染时间 < 16.67ms
- 显示 Layout/Paint/Composite 时间分布

---

## Lighthouse 审计步骤

### 1. 打开 Lighthouse 面板

1. 在 Chrome DevTools 中，切换到 **Lighthouse** 面板
2. 或通过快捷键：`Ctrl + Shift + L`（在某些 Chrome 版本）

### 2. 配置审计选项

1. **Categories**：选择 **Performance**
2. **Device**：选择 **Desktop**（或 Mobile 进行移动设备测试）
3. **Throttling**：保持默认（模拟 4G 网络）

### 3. 运行审计

1. 点击 **Analyze page load** 按钮
2. 等待审计完成（30-60 秒）
3. 审计完成后显示结果

### 4. 保存报告

1. 点击报告右上角的 **导出** 按钮
2. 选择 **HTML** 格式
3. 保存到：`.planning/phases/07-performance-validation/lighthouse-reports/optimized.html`

### 验证 Lighthouse 评分

**关键指标：**
- ✅ **Performance ≥ 90**
- ✅ **LCP (Largest Contentful Paint) < 2.5s**
- ✅ **INP (Interaction to Next Paint) < 200ms**
- ✅ **CLS (Cumulative Layout Shift) < 0.1**
- ✅ **TBT (Total Blocking Time) < 200ms**

---

## 低端设备测试（CPU 限制）

### 1. 启用 CPU 限制

1. 在 Performance 面板，点击 **齿轮图标**（设置）
2. 选择 **CPU** → **4x slowdown**
3. 这将模拟 4 倍 CPU 降速（相当于 3-4 年前的设备）

### 2. 重新录制

1. 启用 CPU 限制后，重新录制 10-15 秒
2. 执行相同的游戏操作
3. 停止录制并分析结果

### 验证标准

即使在 CPU 4x 限制下：
- ✅ FPS 仍稳定在 **60fps**
- ✅ 无明显卡顿或掉帧
- ✅ 游戏仍流畅可玩

---

## 常见问题排查

### FPS 不稳定

**可能原因：**
1. Chrome 标签页过多 → 关闭其他标签页
2. 系统资源占用高 → 关闭其他应用
3. 开发服务器未优化 → 确保运行 `npm run dev`（非 `npm run build`）

### Long Tasks 出现

**可能原因：**
1. 热重载触发 → 等待 HMR 完成
2. 大量 DOM 操作 → 检查是否有内存泄漏
3. 控制台日志 → 清除 console.log

### Lighthouse 评分低

**可能原因：**
1. 首次加载 → 多次运行取平均值
2. 网络波动 → 检查网络连接
3. 扩展程序干扰 → 使用无痕模式测试

---

## 性能对比

### 优化前（理论基线）

从 Phase 6-01 研究中识别的问题：
- ❌ 硬编码 `will-change`（永久内存占用）
- ❌ 缺少 GPU 层强制提示
- ❌ 使用命名缓动函数（未优化）

### 优化后（预期结果）

Phase 6-02 实施的优化：
- ✅ `translate3d(0, 0, 0)` 强制 GPU 层创建
- ✅ 动态 `will-change` 管理（动画前添加，结束后移除）
- ✅ `cubic-bezier` 缓动函数优化
- ✅ 移除过渡动画中的 `all` 属性

**预期性能提升：**
- FPS：从理论 60fps 提升到稳定 60fps
- 内存占用：减少 20-30%（动态 will-change）
- 渲染时间：< 16.67ms/帧

---

## 验证完成检查表

完成所有验证后，确认以下项目：

### Chrome DevTools Performance
- [ ] FPS 稳定在 60fps（绿色柱状图）
- [ ] 每帧渲染时间 < 16.67ms
- [ ] 无 Long Tasks > 50ms
- [ ] Layout/Paint 时间占比 < 10%

### 截图保存
- [ ] FPS 图表截图已保存
- [ ] Main 线程截图已保存
- [ ] Frames 详细视图截图已保存

### Lighthouse 审计
- [ ] Performance ≥ 90
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] TBT < 200ms
- [ ] Lighthouse 报告已保存

### 低端设备测试
- [ ] CPU 4x 限制下 FPS 稳定在 60fps
- [ ] 无明显卡顿或掉帧
- [ ] 游戏仍流畅可玩

---

**验证完成后，请将所有结果反馈给 AI，以便更新性能对比报告（07-01-SUMMARY.md）。**
