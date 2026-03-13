<template>
  <header class="game-header">
    <div class="header-title">
      <h1 class="title">2048</h1>
      <p class="subtitle">合并方块，达到 2048！</p>
    </div>

    <div class="scores-container">
      <div class="score-box">
        <span class="score-label">分数</span>
        <span class="score-value">{{ store.score }}</span>
      </div>

      <div class="score-box">
        <span class="score-label">最高分</span>
        <span class="score-value">{{ store.highScore }}</span>
      </div>
    </div>

    <div class="controls-container">
      <button
        @click="handleUndo"
        :disabled="!store.canUndo"
        class="control-btn undo-btn"
        :class="{ 'disabled': !store.canUndo }"
        title="撤销"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7v6h6"/>
          <path d="M21 17a9 9 0 00-9-9 9.75 9.75 0 00-6 2.3L3 13"/>
        </svg>
        <span>撤销</span>
      </button>

      <button
        @click="handleNewGame"
        class="control-btn new-game-btn"
        title="新游戏"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16"/>
          <path d="M16 21h5v-5"/>
        </svg>
        <span>新游戏</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const store = useGameStore()

// 新游戏按钮处理
function handleNewGame() {
  store.initialize()
}

// 撤销按钮处理
function handleUndo() {
  store.undo()
}
</script setup>

<style scoped>
.game-header {
  width: 100%;
  margin-bottom: 1.5rem;
}

.header-title {
  text-align: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

.scores-container {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.score-box {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.score-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-value {
  display: block;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.controls-container {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.control-btn:hover:not(.disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.control-btn:active:not(.disabled) {
  transform: translateY(0);
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .title {
    font-size: 2.5rem;
  }

  .scores-container {
    gap: 0.5rem;
  }

  .score-box {
    min-width: 80px;
    padding: 0.5rem 0.75rem;
  }

  .score-value {
    font-size: 1.25rem;
  }

  .control-btn span {
    display: none; /* 移动端隐藏文字，只显示图标 */
  }
}
</style>
