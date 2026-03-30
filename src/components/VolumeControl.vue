<template>
  <div class="volume-control" :class="{ 'expanded': isExpanded }">
    <button
      @click="toggleExpanded"
      @click.right="handleRightClick"
      class="volume-btn"
      :class="{ 'muted': isMuted }"
      :title="isMuted ? '已静音' : '音量控制'"
      :aria-pressed="isMuted"
      aria-label="音量控制"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- 静音图标 -->
        <template v-if="isMuted">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </template>
        <!-- 低音量图标 -->
        <template v-else-if="volume < 0.3">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        </template>
        <!-- 中音量图标 -->
        <template v-else-if="volume < 0.7">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </template>
        <!-- 高音量图标 -->
        <template v-else>
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </template>
      </svg>
    </button>

    <div class="volume-slider-container" v-show="isExpanded">
      <input
        type="range"
        min="0"
        max="100"
        :value="Math.round(volume * 100)"
        @input="handleVolumeChange"
        @mousedown.stop
        :disabled="isMuted"
        class="volume-slider"
        aria-label="音量控制"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(volume * 100)"
      >
      <span class="volume-text">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()
const isExpanded = ref(false)

const volume = computed(() => audioStore.volume)
const isMuted = computed(() => audioStore.isMuted)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function handleVolumeChange(event: Event) {
  const target = event.target as HTMLInputElement
  const newVolume = Number(target.value) / 100
  audioStore.setVolume(newVolume)
}

function handleRightClick(event: MouseEvent) {
  event.preventDefault()
  audioStore.toggleMute()
}
</script>

<style scoped>
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-bg-secondary);
  border: none;
  border-radius: 3px;
  padding: 0.625rem 1rem;
  color: var(--theme-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
  min-width: 44px;
  min-height: 44px;
}

.volume-btn:hover {
  background-color: var(--theme-bg-secondary);
  opacity: 0.9;
}

.volume-btn:active {
  background-color: var(--theme-bg-secondary);
  opacity: 0.8;
}

.volume-btn.muted {
  color: var(--theme-text-secondary);
}

.volume-slider-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: var(--theme-bg-primary);
  border-radius: 3px;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 4px;
  background: var(--theme-bg-secondary);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--theme-text-primary);
  cursor: pointer;
  transition: transform 0.05s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--theme-text-primary);
  border: none;
  cursor: pointer;
  transition: transform 0.05s ease;
}

.volume-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.volume-slider:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.volume-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.volume-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.volume-text {
  font-size: 0.875rem;
  color: var(--theme-text-secondary);
  min-width: 3rem;
  text-align: right;
  user-select: none;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .volume-slider {
    width: 100px;
    min-width: 100px;
  }

  .volume-text {
    display: none;
  }

  .volume-slider-container {
    padding: 0.25rem 0.5rem;
  }
}
</style>
