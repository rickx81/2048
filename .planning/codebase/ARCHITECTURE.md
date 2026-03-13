# 架构

**分析日期：** 2025-03-13

## 模式概述

**整体：** 单页面应用（SPA）

**关键特征：**
- Vue 3 + Composition API
- 状态管理模式：Pinia
- 路由：Vue Router
- 构建工具：Vite
- 测试：单元测试（Vitest）和端到端测试（Playwright）

## 分层架构

**展示层（Presentation Layer）：**
- 位置：`src/` 目录
- 包含：Vue 组件、页面
- 依赖：Vue 3、Vue Router
- 使用：组件、模板、样式

**状态管理层：**
- 位置：`src/stores/` 目录
- 包含：Pinia store
- 依赖：Vue 3 的 `ref` 和 `computed`
- 使用：定义全局状态，管理组件间的数据共享

**路由层：**
- 位置：`src/router/` 目录
- 包含：路由配置
- 依赖：Vue Router
- 使用：管理页面导航和路由逻辑

**应用入口层：**
- 位置：`src/main.ts`
- 包含：应用初始化逻辑
- 依赖：Vue、Pinia、Vue Router
- 使用：创建 Vue 应用实例，挂载到 DOM

## 数据流

**数据流动：**

1. 用户交互 → 组件事件
2. 组件事件 → Action 调用
3. Action → State 更新
4. State 更新 → 组件重新渲染
5. 组件重新渲染 → DOM 更新

**状态管理：**
- 集中式存储使用 Pinia
- 状态变化触发响应式更新
- 组件通过 `useStore()` hook 访问状态

## 关键抽象

**状态抽象：**
- 使用 Pinia store 定义状态
- 通过 `ref` 创建响应式数据
- 通过 `computed` 创建派生状态

**组件抽象：**
- 使用 `<script setup>` 语法
- 组合式 API 编写逻辑
- 模板和样式分离

**路由抽象：**
- 使用 `createRouter` 配置路由
- 使用 `createWebHistory` 管理历史记录
- 支持动态路由和嵌套路由

## 入口点

**应用入口：**
- 位置：`src/main.ts`
- 触发：应用启动时
- 责任：创建 Vue 应用实例、注册插件、挂载到 DOM

**路由入口：**
- 位置：`src/router/index.ts`
- 触发：路由导航时
- 责任：匹配路由组件、处理路由守卫

**状态入口：**
- 位置：`src/stores/counter.ts`
- 触发：组件调用 `useCounterStore()` 时
- 责任：提供状态和方法的访问

## 错误处理

**策略：** 集中式错误处理

**模式：**
- Vue 组件中的 try-catch
- Pinia action 中的错误处理
- 测试用例中的错误场景测试

## 横切关注点

**日志：** 使用 console.log（当前）
**验证：** 前端表单验证（待实现）
**认证：** 使用 Pinia 管理认证状态（待实现）

---

*架构分析：2025-03-13*