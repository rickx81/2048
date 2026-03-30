# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-30

### 依赖升级
- 升级 Vite 7.3.1 → 8.0.3 (Rolldown 集成，构建速度提升 10-30x)
- 升级 Vue 3.5.29 → 3.5.31
- 升级 TypeScript 5.9.3 → 6.0.2
- 升级 Vitest 4.0.18 → 4.1.2
- 升级 @vitejs/plugin-vue 6.0.4 → 6.0.5
- 升级 vue-tsc 3.2.5 → 3.2.6
- 升级 TailwindCSS 4.2.1 → 4.2.2
- 升级 vite-plugin-vue-devtools 8.0.6 → 8.1.1
- 升级 ESLint 10.0.2 → 10.1.0
- 升级 @vitejs/plugin-vue-jsx 5.1.4 → 5.1.5
- 升级 Vue Router 5.0.3 → 5.0.4

### 验证
- 所有 111 个单元测试通过
- 生产构建验证成功 (272ms)
- TypeScript 类型检查通过
- 开发服务器正常启动 (774ms)

### 配置更新
- vitest.config.ts: 添加 `.claude/**` 到排除列表

---

## [1.1.0] - 2026-03-XX

### Phase 7: 用户体验优化
- 添加游戏统计面板
- 添加撤销历史记录显示
- 改进动画效果

---

## [1.0.0] - 2026-03-XX

### 初始版本
- 完整的 2048 游戏功能
- 键盘和触摸控制
- 分数系统和排行榜
- LocalStorage 持久化
- 单元测试覆盖
