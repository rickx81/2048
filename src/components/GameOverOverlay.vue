<template>
  <Transition name="overlay">
    <div v-if="visible" class="overlay-mask" data-testid="game-over-overlay">
      <div class="overlay-content">
        <h2 class="overlay-title" data-testid="game-over-title">游戏结束!</h2>

        <div class="score-display">
          <div class="final-score">
            <span class="score-label">最终分数</span>
            <span class="score-value" data-testid="game-over-score">{{ store.score }}</span>
          </div>
        </div>

        <div class="overlay-actions">
          <button @click="handleRetry" class="retry-btn" data-testid="retry-btn">
            再试一次
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  retry: []
}>()

const store = useGameStore()

function handleClose() {
  emit('close')
}

function handleRetry() {
  store.initialize()
  emit('retry')
}
</script>

<style scoped>
.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(238, 228, 218, 0.73);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  user-select: none;
}

.overlay-content {
  background-color: #faf8ef;
  border-radius: 6px;
  padding: 3rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: pop-in 0.3s ease-out;
}

.overlay-title {
  font-size: 3rem;
  font-weight: 700;
  color: #776e65;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
}

.score-display {
  margin-bottom: 2rem;
}

.final-score {
  background-color: #bbada0;
  border-radius: 6px;
  padding: 1rem 2rem;
  display: inline-block;
  min-width: 140px;
}

.final-score .score-label {
  display: block;
  color: #eee4da;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.final-score .score-value {
  display: block;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
}

.overlay-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.retry-btn {
  background-color: #8f7a66;
  border: none;
  border-radius: 3px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.retry-btn:hover {
  background-color: #9f8b77;
}

.retry-btn:active {
  background-color: #7f6a56;
}

/* Vue Transition 动画 */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .overlay-content,
.overlay-leave-active .overlay-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.overlay-enter-from .overlay-content,
.overlay-leave-to .overlay-content {
  transform: scale(0.8);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .overlay-content {
    padding: 2rem 1.5rem;
  }

  .overlay-title {
    font-size: 2rem;
  }

  .final-score .score-value {
    font-size: 2rem;
  }

  .retry-btn {
    width: 100%;
  }
}
</style>
