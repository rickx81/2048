---
phase: 03-用户界面
plan: 04
subsystem: 用户界面-游戏控制
tags: [ui, controls, keyboard, touch, vueuse]
dependency_graph:
  requires:
    - "03-01: UI 基础设施"
    - "03-02: 游戏网格组件"
    - "01-01: 核心游戏逻辑"
    - "01-04: Pinia store"
  provides:
    - "游戏控制系统（键盘 + 触摸）"
  affects:
    - "03-05: 游戏状态覆盖层（需要控制集成）"
tech_stack:
  added:
    - "@vueuse/core: useSwipe composable（已安装）"
  patterns:
    - "Vue Composition API: composable 模式"
    - "事件委托: window keydown 监听"
    - "触摸手势: 滑动检测和方向判断"
key_files:
  created:
    - "src/composables/useGameControls.ts: 游戏控制 composable（105 行）"
  modified:
    - "src/components/GameBoard.vue: 集成游戏控制（+9 行）"
decisions:
  - "滑动阈值: 50px（平衡灵敏度和误触风险）"
  - "主体方向判断: 比较 abs(lengthX) 和 abs(lengthY)"
  - "键盘映射: 支持方向键和 WASD"
  - "输入优先级: 键盘和触摸同时生效，无冲突"
metrics:
  duration: 36 秒
  tasks_completed: 2
  completed_date: "2026-03-13"
  commits:
    - "68d6edd: feat(03-04): 创建游戏控制 composable"
    - "a14e729: feat(03-04): 集成游戏控制到 GameBoard"
---

# Phase 3 Plan 04: 游戏控制（键盘和触摸）总结

实现键盘方向键和触摸滑动控制，支持桌面端键盘操作和移动端触摸滑动，为玩家提供完整的游戏交互体验。

## 完成任务

### 任务 1：创建游戏控制 composable（useGameControls.ts）

**文件：** `src/composables/useGameControls.ts`（105 行）

**关键特性：**

1. **键盘控制：**
   - 支持方向键（ArrowUp, ArrowDown, ArrowLeft, ArrowRight）
   - 支持 WASD 键（游戏玩家习惯）
   - 阻止默认行为（防止页面滚动）
   - 游戏结束时不响应输入（status === 'lost' 或 'won'）

2. **触摸控制：**
   - 使用 VueUse 的 `useSwipe` composable
   - 滑动阈值：50px（平衡灵敏度和误触风险）
     - 太小（<30px）：容易误触，普通点击也会触发
     - 太大（>80px）：需要滑动很长距离，体验差
     - 50px 在两者之间平衡
   - 自动判断主体方向（比较水平/垂直距离）
   - 只允许正交方向（4个方向）
   - 游戏结束时不响应输入（status !== 'playing'）

3. **输入优先级：**
   - 键盘和触摸同时可用
   - 无冲突，独立处理
   - 在组件挂载/卸载时管理事件监听器

4. **技术实现：**
   - 键盘事件：window 监听 keydown
   - 触摸事件：VueUse useSwipe，targetRef 绑定到游戏板元素
   - 生命周期：onMounted 添加监听器，onUnmounted 移除监听器

**提交：** `68d6edd`

---

### 任务 2：集成游戏控制到 GameBoard

**文件：** `src/components/GameBoard.vue`（+9 行）

**关键变更：**

1. **导入 composable：**
   ```typescript
   import { useGameControls } from '@/composables/useGameControls'
   ```

2. **创建 boardRef：**
   ```typescript
   const boardRef = ref<HTMLElement>()
   ```

3. **启用控制：**
   ```typescript
   useGameControls(boardRef)
   ```

4. **绑定 ref 到模板：**
   ```vue
   <div class="game-board" ref="boardRef">
   ```

**控制说明：**
- 键盘控制全局生效（window 监听）
- 触摸控制在 boardRef 元素上生效
- 两种输入方式互不冲突，可以同时使用

**提交：** `a14e729`

---

## 验证结果

### 代码验证

- ✅ useGameControls.ts composable 存在且格式正确（105 行）
- ✅ GameBoard.vue 正确导入和使用 composable
- ✅ TypeScript 类型检查通过（vue-tsc --noEmit）
- ✅ 所有导出和导入正确

### 键盘控制验证（设计验证）

- ✅ 方向键映射正确（ArrowUp/Down/Left/Right → UP/DOWN/LEFT/RIGHT）
- ✅ WASD 键映射正确（w/a/s/d → UP/LEFT/DOWN/RIGHT）
- ✅ preventDefault 阻止页面滚动
- ✅ 游戏结束时不响应键盘输入（status === 'lost' 或 'won'）

### 触摸控制验证（设计验证）

- ✅ 滑动阈值合理（50px）
- ✅ 主体方向判断正确（比较 abs(lengthX) 和 abs(lengthY)）
- ✅ 只允许正交方向（水平/垂直）
- ✅ 游戏结束时不响应触摸输入（status !== 'playing'）

### 输入优先级验证（设计验证）

- ✅ 键盘和触摸可以同时使用
- ✅ 两种输入方式互不冲突
- ✅ 事件监听器正确管理（mount/unmount）

---

## 偏离计划的情况

**无偏离 - 计划完全按照预期执行。**

所有任务都按照计划文件中的规格完成，没有需要自动修复的问题或额外的技术债务。

---

## 技术决策

### 1. 滑动阈值选择：50px

**原因：**
- 太小（<30px）：误触风险高，普通点击也会触发
- 太大（>80px）：用户体验差，需要滑动很长距离
- 50px 是最佳平衡点，既避免误触又保持灵敏度

### 2. 主体方向判断：比较 abs(lengthX) 和 abs(lengthY)

**实现：**
```typescript
if (absX > absY) {
  // 水平方向占主导
  direction = lengthX > 0 ? 'RIGHT' : 'LEFT'
} else {
  // 垂直方向占主导
  direction = lengthY > 0 ? 'DOWN' : 'UP'
}
```

**原因：**
- 确保斜向滑动也能正确识别
- 简单、可靠、性能好
- 只允许正交方向（4个方向），符合 2048 游戏规则

### 3. 键盘映射：方向键 + WASD

**支持组合：**
- 方向键：ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- WASD 键：w, a, s, d（大写和小写都支持）

**原因：**
- 方向键是标准导航方式
- WASD 是游戏玩家的习惯
- 阻止默认行为，防止页面滚动

### 4. 输入优先级：同时生效

**设计：**
- 键盘和触摸同时可用
- 无冲突，独立处理
- 在组件挂载/卸载时管理事件监听器

**原因：**
- 桌面端用户使用键盘
- 移动端用户使用触摸
- 平板/混合设备用户可以自由切换

---

## 与其他计划的集成

### 前置依赖
- **03-01:** UI 基础设施（VueUse 已安装）
- **03-02:** 游戏网格组件（GameBoard.vue 已创建）
- **01-04:** Pinia store（useGameStore 提供状态和方法）

### 后续影响
- **03-05:** 游戏状态覆盖层（控制已集成，可以直接显示游戏状态）

---

## 可测试性

### 手动测试建议

1. **键盘控制测试：**
   - 打开游戏，按方向键，验证方块移动
   - 按 WASD 键，验证方块移动
   - 验证页面不滚动（preventDefault 生效）
   - 游戏结束后按方向键，验证无响应

2. **触摸控制测试（移动设备）：**
   - 在游戏板上滑动，验证方块移动
   - 斜向滑动，验证主体方向判断正确
   - 轻微触摸（<50px），验证不触发滑动
   - 游戏结束后滑动，验证无响应

3. **输入优先级测试：**
   - 桌面端：使用键盘控制，验证正常工作
   - 移动端：使用触摸滑动，验证正常工作
   - 混合设备：键盘和触摸交替使用，验证无冲突

---

## 性能考虑

### 事件监听器管理
- ✅ onMounted 添加监听器，避免内存泄漏
- ✅ onUnmounted 移除监听器，清理资源
- ✅ 使用 window 监听键盘（全局控制）

### 触摸性能
- ✅ VueUse useSwipe 使用被动监听（passive: false）
- ✅ 阈值触发（50px），避免频繁计算
- ✅ 方向判断简单（比较 absX 和 absY），性能好

---

## 未来改进

### 可选增强（不在本计划范围内）
1. **键盘快捷键：**
   - 添加撤销快捷键（Ctrl+Z）
   - 添加新游戏快捷键（Ctrl+R）
   - 添加暂停快捷键（Space）

2. **触摸手势：**
   - 添加双击加速移动
   - 添加长按撤销
   - 添加捏合缩放（调整游戏板大小）

3. **自定义配置：**
   - 允许用户自定义键盘映射
   - 允许用户调整滑动阈值
   - 允许用户禁用触摸或键盘控制

---

## 总结

计划 03-04 成功实现了完整的游戏控制系统，支持键盘方向键、WASD 和触摸滑动控制。所有任务都按照计划完成，代码质量高，TypeScript 类型安全，事件监听器管理正确。

**关键成就：**
- ✅ 创建了可复用的 useGameControls composable（105 行）
- ✅ 集成到 GameBoard 组件（+9 行）
- ✅ 支持键盘和触摸输入，无冲突
- ✅ 滑动阈值和方向判断合理
- ✅ 游戏结束时不响应输入
- ✅ 为后续计划（游戏状态覆盖层）提供了基础

**下一步：** 计划 03-05 - 创建游戏状态覆盖层（胜利/失败提示）

---

*Summary created: 2026-03-13*
*Plan duration: 36 seconds*
*Tasks completed: 2/2*
