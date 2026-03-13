<template>
  <div class="game-container">
    <!-- 头部区域：分数和控制按钮 -->
    <header class="game-header">
      <GameHeader />
    </header>

    <!-- 游戏网格区域 -->
    <main class="game-board-wrapper">
      <GameBoard />
    </main>

    <!-- 控制按钮区域（保留用于其他功能） -->
    <footer class="game-controls">
      <!-- 未来可能添加：排行榜按钮、设置按钮等 -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import GameHeader from './GameHeader.vue'
import GameBoard from './GameBoard.vue'

const store = useGameStore()

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
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 1.5rem;
}

.game-header,
.game-board-wrapper,
.game-controls {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.game-controls {
  min-height: 2rem; /* 占位，保持布局稳定 */
}

/* 移动端适配 */
@media (max-width: 640px) {
  .game-container {
    padding: 0.75rem;
    gap: 1rem;
  }

  .game-header,
  .game-board-wrapper {
    max-width: 100%;
  }
}
</style>
