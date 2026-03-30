<template>
  <div id="app" class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// 初始化主题系统（设置 DOM 监听和 localStorage 同步）
useTheme()

onMounted(() => {
  // 确保 DOM 已准备好
  document.documentElement.classList.add('theme-ready')
})
</script>

<style>
/* 全局样式 */
.app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--theme-bg-primary);
}

/* ===== 全局动画定义 - GPU 加速优化 ===== */

/* 新方块弹跳动画 - 使用 translate3d 强制 GPU 层 */
@keyframes pop-in {
  0% {
    transform: translate3d(0, 0, 0) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

/* 合并脉冲动画 - 使用 translate3d 强制 GPU 层 */
@keyframes pulse-merge {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, 0, 0) scale(1.2);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/* 应用动画的类 - will-change 动态管理（在 Tile.vue 中） */
.tile-new {
  animation: pop-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tile-merged {
  animation: pulse-merge 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Vue Transition 组动画 - 仅对 transform 过渡 */
.tile-move {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 优化的进入/离开动画 - 仅 transform 和 opacity */
.tile-enter-active,
.tile-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tile-enter-from {
  opacity: 0;
  transform: translate3d(0, 0, 0) scale(0.9);
}

.tile-leave-to {
  opacity: 0;
  transform: translate3d(0, 0, 0) scale(0.9);
}

/* 动画状态类 - 用于动态 will-change 管理 */
.tile-animating {
  will-change: transform, opacity;
}
</style>
