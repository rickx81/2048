<template>
  <div class="game-container">
    <!-- 头部区域（分数等）- 后续计划填充 -->
    <header class="game-header">
      <!-- 占位符 -->
    </header>

    <!-- 游戏网格区域 -->
    <main class="game-board-wrapper">
      <GameBoard />
    </main>

    <!-- 控制按钮区域 - 后续计划填充 -->
    <footer class="game-controls">
      <!-- 占位符 -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import GameBoard from './GameBoard.vue'

const store = useGameStore()

// 组件挂载时初始化游戏
onMounted(() => {
  if (store.status === 'idle') {
    store.initialize()
  }
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 响应式布局容器 */
@media (min-width: 640px) {
  .game-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 1.5rem;
  }
}

@media (max-width: 639px) {
  .game-container {
    width: 100%;
    padding: 1rem;
  }
}

/* 暗色/霓虹风格背景 */
.game-container {
  background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
}

/* 玻璃态效果 */
.game-header,
.game-board-wrapper,
.game-controls {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.game-board-wrapper {
  margin-bottom: 1rem;
}

.game-controls {
  padding: 1rem;
  min-height: 2rem; /* 占位，保持布局稳定 */
}
</style>
