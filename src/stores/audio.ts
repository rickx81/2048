/**
 * 音效状态管理 Store
 * 管理音效设置（音量、静音状态），使用 localStorage 持久化
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAudioStore = defineStore('audio', () => {
  // 音量设置（持久化到 localStorage，默认值 0.5，范围 0-1）
  const volume = useStorage('__GAME_2048_AUDIO_VOLUME__', 0.5, localStorage, {
    onError: (error) => {
      // localStorage 失败时静默回退到默认音量
      if (error instanceof Error) {
        console.warn('音量持久化失败，回退到默认音量:', error.message)
      } else {
        console.warn('音量持久化失败，回退到默认音量')
      }
    }
  })

  // 静音状态（持久化到 localStorage，默认值 false）
  const isMuted = useStorage('__GAME_2048_AUDIO_MUTED__', false, localStorage, {
    onError: (error) => {
      // localStorage 失败时静默回退到默认状态
      if (error instanceof Error) {
        console.warn('静音状态持久化失败，回退到默认状态:', error.message)
      } else {
        console.warn('静音状态持久化失败，回退到默认状态')
      }
    }
  })

  /**
   * 设置音量
   * @param newVolume 音量值 (0.0 - 1.0)
   */
  function setVolume(newVolume: number) {
    // 限制音量范围在 0-1 之间
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute
  }
})
