<template>
  <div class="game-container">
    <!-- 头部区域（分数等）- 后续计划填充 -->
    <header class="game-header">
      <!-- 占位符 -->
    </header>

    <!-- 游戏网格区域 - 后续计划填充 -->
    <main class="game-board">
      <!-- 占位符 -->
    </main>

    <!-- 控制按钮区域 - 后续计划填充 -->
    <footer class="game-controls">
      <!-- 占位符 -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const store = useGameStore()
// 可以在后续计划中添加更多逻辑
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
.game-board,
.game-controls {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}

/* 垂直间距 */
.game-header {
  margin-bottom: 1rem;
  padding: 1rem;
}

.game-board {
  margin-bottom: 1rem;
  padding: 1rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-controls {
  padding: 1rem;
}
</style>
