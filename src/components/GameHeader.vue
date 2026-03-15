<template>
  <header class="game-header">
    <div class="header-title">
      <div class="title-wrapper">
        <h1 class="title">2048</h1>
      </div>
      <ThemeSwitcher />
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
import ThemeSwitcher from './ThemeSwitcher.vue'

const store = useGameStore()

// 新游戏按钮处理
function handleNewGame() {
  store.initialize()
}

// 撤销按钮处理
function handleUndo() {
  store.undo()
}
</script>

<style scoped>
.game-header {
  width: 100%;
  margin-bottom: 1.5rem;
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0;
  line-height: 1;
}

.subtitle {
  color: var(--theme-text-secondary);
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  display: none; /* 经典版本不显示副标题 */
}

.scores-container {
  display: flex;
  gap: 0.375rem;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.score-box {
  background-color: var(--theme-bg-secondary);
  border-radius: 3px;
  padding: 0.25rem 0.75rem;
  min-width: 70px;
  text-align: center;
  position: relative;
}

.score-label {
  display: block;
  color: var(--theme-text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-value {
  display: block;
  color: var(--theme-text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

/* 分数增加动画 */
.score-add {
  position: absolute;
  right: 0;
  top: 0.25rem;
  color: rgba(119, 110, 101, 0.9);
  font-size: 1.5rem;
  font-weight: 700;
  animation: score-float 0.6s ease-in-out forwards;
  pointer-events: none;
}

@keyframes score-float {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

.controls-container {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--theme-bg-secondary);
  border: none;
  border-radius: 3px;
  padding: 0.625rem 1rem;
  color: var(--theme-text-primary);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.control-btn:hover:not(.disabled) {
  background-color: var(--theme-bg-secondary);
  opacity: 0.9;
}

.control-btn:active:not(.disabled) {
  background-color: var(--theme-bg-secondary);
  opacity: 0.8;
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .header-title {
    flex-wrap: wrap; /* 允许换行，但标题和主题切换器尽量保持在一行 */
    gap: 0.5rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    display: none; /* 移动端隐藏副标题 */
  }

  .scores-container {
    justify-content: space-between;
  }

  .score-box {
    min-width: 60px;
    padding: 0.25rem 0.5rem;
  }

  .score-value {
    font-size: 1.25rem;
  }

  .control-btn span {
    display: none; /* 移动端隐藏文字，只显示图标 */
  }

  .control-btn {
    padding: 0.625rem;
  }
}
</style>
