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
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  user-select: none;
}

.overlay-content {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.overlay-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.25rem;
  color: #4ade80;
}

.overlay-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, rgb(34, 211, 238), rgb(139, 92, 246));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.overlay-message {
  color: rgb(203, 213, 225);
  font-size: 1rem;
  margin: 0 0 1.75rem 0;
  text-align: center;
}

.score-display {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.score-item {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1.125rem 1rem;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.score-label {
  display: block;
  color: rgb(148, 163, 184);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.score-value {
  display: block;
  color: rgb(248, 250, 252);
  font-size: 1.625rem;
  font-weight: 700;
  margin-top: 0.375rem;
  text-align: center;
}

.overlay-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  user-select: none;
}

.primary-btn {
  background: linear-gradient(135deg, rgb(34, 211, 238), rgb(139, 92, 246));
  color: rgb(248, 250, 252);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.25);
}

.secondary-btn {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgb(248, 250, 252);
}

.secondary-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
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
