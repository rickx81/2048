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

    <!-- 游戏结束覆盖层 -->
    <GameOverOverlay
      :visible="showGameOver"
      @close="handleOverlayClose"
      @retry="handleOverlayRetry"
    />

    <!-- 游戏胜利覆盖层 -->
    <GameWonOverlay
      :visible="showGameWon"
      @close="handleOverlayClose"
      @retry="handleOverlayRetry"
      @continue="handleOverlayClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import GameHeader from './GameHeader.vue'
import GameBoard from './GameBoard.vue'
import GameOverOverlay from './GameOverOverlay.vue'
import GameWonOverlay from './GameWonOverlay.vue'

const store = useGameStore()

// 覆盖层显示状态
const showGameOver = ref(false)
const showGameWon = ref(false)

// 监听游戏状态变化
const isGameOver = computed(() => store.isGameOver)
const isGameWon = computed(() => store.isGameWon)

// 监听游戏结束状态
function checkGameOver() {
  if (isGameOver.value && store.status === 'lost') {
    showGameOver.value = true
  }
}

// 监听游戏胜利状态
function checkGameWon() {
  if (isGameWon.value && store.status === 'won' && !showGameWon.value) {
    // 只在第一次胜利时显示，避免重复显示
    showGameWon.value = true
  }
}

// 使用 watch 监听状态变化
watch(isGameOver, () => {
  checkGameOver()
})

watch(isGameWon, () => {
  checkGameWon()
})

// 覆盖层事件处理
function handleOverlayClose() {
  showGameOver.value = false
  showGameWon.value = false
}

function handleOverlayRetry() {
  showGameOver.value = false
  showGameWon.value = false
  // initialize() 已在覆盖层组件中调用
}

// 初始化游戏
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
