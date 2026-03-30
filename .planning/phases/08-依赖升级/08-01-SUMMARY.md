# 08-01: 升级核心依赖 - 执行摘要

**状态:** ✅ 完成
**分支:** deps/vite-8-upgrade
**提交:** c9c60d6

---

## 升级清单

### 核心生产依赖
| 依赖 | 原版本 | 新版本 | 状态 |
|------|--------|--------|------|
| vue | 3.5.29 | 3.5.31 | ✅ |
| @vueuse/core | 14.2.1 | 14.2.1 | ✓ (已是最新) |
| pinia | 3.0.4 | 3.0.4 | ✓ (已是最新) |
| tailwindcss | 4.2.1 | 4.2.2 | ✅ |
| vue-router | 5.0.3 | 5.0.4 | ✅ (自动) |

### 核心开发依赖
| 依赖 | 原版本 | 新版本 | 状态 |
|------|--------|--------|------|
| vite | 7.3.1 | 8.0.3 | ✅ (Rolldown 集成) |
| typescript | 5.9.3 | 6.0.2 | ✅ |
| vitest | 4.0.18 | 4.1.2 | ✅ |
| @vitejs/plugin-vue | 6.0.4 | 6.0.5 | ✅ |
| vue-tsc | 3.2.5 | 3.2.6 | ✅ |

### 支持性开发依赖
| 依赖 | 原版本 | 新版本 | 状态 |
|------|--------|--------|------|
| @vitejs/plugin-vue-jsx | 5.1.4 | 5.1.5 | ✅ |
| vite-plugin-vue-devtools | 8.0.6 | 8.1.1 | ✅ |
| eslint | 10.0.2 | 10.1.0 | ✅ |

---

## pnpm-lock.yaml 变更摘要

- 新增 Vite 8.0.3 及其相关依赖 (Rolldown 引擎)
- 更新 TypeScript 6.0.2 依赖树
- 更新所有相关包的版本锁定
- 重新解析 410+ 个依赖包

---

## 已知问题

### Peer Dependency 警告
以下警告是预期的，需要在验证阶段测试实际功能：

1. **@typescript-eslint/* 8.57.2**
   - 要求: `typescript@">=4.8.4 <6.0.0"`
   - 实际: `typescript@6.0.2`
   - **影响:** TypeScript ESLint 插件尚未正式支持 TS 6.0
   - **缓解措施:** 运行 `pnpm type-check` 和 `pnpm lint` 验证实际功能

2. **vite-plugin-vue-devtools 8.1.1**
   - 要求: `vite@"^6.0.0 || ^7.0.0-0"`
   - 实际: `vite@8.0.3`
   - **影响:** DevTools 插件尚未正式支持 Vite 8
   - **缓解措施:** 运行 `pnpm dev` 验证开发服务器和 DevTools 功能

---

## 验证命令输出

### 分支验证
```bash
$ git branch --show-current
deps/vite-8-upgrade
```

### 依赖版本验证
```bash
$ pnpm list vite vue typescript vitest tailwindcss eslint --depth=0
dependencies:
+ tailwindcss 4.2.2
+ vue 3.5.31
devDependencies:
+ eslint 10.1.0
+ typescript 6.0.2
+ vite 8.0.3
+ vitest 4.1.2
```

### 锁定文件验证
```bash
$ grep "vite@" pnpm-lock.yaml | head -1
version: 6.0.5(vite@8.0.3(...)(vue@3.5.31(typescript@6.0.2)))
```

---

## 下一步

进入 **08-02: 验证依赖升级** 阶段，执行分层渐进验证：
1. TypeScript 类型检查
2. 生产构建验证
3. 快速核心测试
4. 完整单元测试验证
5. E2E 测试验证
6. 开发服务器验证
