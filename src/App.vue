<template>
  <div id="app" class="app">
    <GameContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import GameContainer from '@/components/GameContainer.vue'
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

/* ===== 全局动画定义 ===== */

/* 新方块弹跳动画 */
@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 合并脉冲动画 */
@keyframes pulse-merge {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 移动动画（使用 transform，GPU 加速） */
@keyframes slide-move {
  from {
    /* 位置由 Vue Transition 动态计算 */
  }
  to {
    /* 位置由 Vue Transition 动态计算 */
  }
}

/* 应用动画的类 */
.tile-new {
  animation: pop-in 0.2s ease-out;
}

.tile-merged {
  animation: pulse-merge 0.2s ease-out;
}

/* Vue Transition 组动画 */
.tile-move {
  transition: transform 0.15s ease-in-out;
}

/* 确保移动动画流畅（60fps） */
.tile-enter-active,
.tile-leave-active {
  transition: all 0.15s ease-in-out;
}

.tile-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.tile-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
