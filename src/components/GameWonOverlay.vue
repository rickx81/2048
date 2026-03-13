<template>
  <Transition name="overlay">
    <div v-if="visible" class="overlay-mask">
      <div class="overlay-content">
        <div class="overlay-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h2 class="overlay-title">恭喜胜利！</h2>

        <p class="overlay-message">
          你达到了 2048！太棒了！
        </p>

        <div class="score-display">
          <div class="score-item">
            <span class="score-label">最终分数</span>
            <span class="score-value">{{ store.score }}</span>
          </div>

          <div class="score-item">
            <span class="score-label">最高分</span>
            <span class="score-value">{{ store.highScore }}</span>
          </div>
        </div>

        <div class="overlay-actions">
          <button @click="handleClose" class="action-btn secondary-btn">
            继续游戏
          </button>
          <button @click="handleRetry" class="action-btn primary-btn">
            新游戏
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
  continue: []
}>()

const store = useGameStore()

function handleClose() {
  emit('close')
}

function handleRetry() {
  store.initialize()
  emit('retry')
}

function handleContinue() {
  emit('close')
}
</script>

<style scoped>
.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.overlay-content {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(88, 28, 135, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.overlay-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: #22c55e;
}

.overlay-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22d3ee, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.overlay-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
}

.score-display {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.score-item {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  padding: 1rem;
  min-width: 100px;
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

.overlay-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.primary-btn {
  background: linear-gradient(135deg, #22d3ee, #a855f7);
  color: white;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(34, 211, 238, 0.3);
}

.secondary-btn {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.secondary-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
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
  transition: transform 0.3s ease;
}

.overlay-enter-from .overlay-content,
.overlay-leave-to .overlay-content {
  transform: scale(0.9);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .overlay-content {
    padding: 1.5rem;
  }

  .overlay-title {
    font-size: 1.5rem;
  }

  .overlay-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
