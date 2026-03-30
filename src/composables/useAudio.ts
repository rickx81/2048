/**
 * 音效管理 Composable
 * 封装 Howler.js 音效播放逻辑，提供音量控制和静音功能
 *
 * **职责：**
 * - 封装 Howler.js 音效播放逻辑
 * - 集成 audio store 管理音效设置
 * - 提供 initialize, play, setVolume, toggleMute, stopAll, unload 方法
 * - 使用全局单例模式避免内存泄漏
 */

import { ref, computed } from 'vue'
import { Howl } from 'howler'
import { useAudioStore } from '@/stores/audio'
import type { SoundEffect } from '@/core/types'

// 音频精灵定义（基于 sprite.mp3 文件的实际时间戳）
// 格式: [开始时间(ms), 持续时间(ms)]
const SPRITE_DATA: Record<string, [number, number]> = {
  move: [0, 150],       // 0ms-150ms
  merge: [200, 300],    // 200ms-500ms
  win: [600, 2000],     // 600ms-2600ms
  lose: [2700, 1500]    // 2700ms-4200ms
}

// 全局 Howl 实例（单例模式）
let soundInstance: Howl | null = null

/**
 * 音效管理 composable
 * 提供音效播放、音量控制、静音功能
 */
export function useAudio() {
  const audioStore = useAudioStore()

  // 音效初始化状态
  const isInitialized = ref(false)

  // 计算实际音量（静音时为 0）
  const effectiveVolume = computed(() =>
    audioStore.isMuted ? 0 : audioStore.volume
  )

  /**
   * 初始化音效系统
   * 必须在用户交互后调用（浏览器自动播放策略）
   */
  function initialize() {
    if (soundInstance) {
      return // 已初始化
    }

    soundInstance = new Howl({
      src: ['/sounds/sprite.mp3'],
      sprite: SPRITE_DATA,
      volume: effectiveVolume.value,
      preload: true, // 预加载音频
      html5: false,  // 优先使用 Web Audio API
      format: ['mp3']
    })

    // 监听加载完成
    soundInstance.once('load', () => {
      console.log('[Audio] 音效系统初始化完成')
      isInitialized.value = true
    })

    // 监听播放错误
    soundInstance.on('loaderror', (_: number, err: unknown) => {
      console.error('[Audio] 音效加载失败:', err)
      console.error('[Audio] 请确认 public/sounds/sprite.mp3 文件存在')
    })
  }

  /**
   * 播放指定音效
   * @param effect 音效类型
   */
  function play(effect: SoundEffect) {
    if (!soundInstance) {
      console.warn('[Audio] 音效系统未初始化，请在用户交互后调用 initialize()')
      return
    }

    if (audioStore.isMuted) {
      return // 静音时不播放
    }

    soundInstance.play(effect)
  }

  /**
   * 设置音量
   * @param newVolume 音量值 (0.0 - 1.0)
   */
  function setVolume(newVolume: number) {
    audioStore.setVolume(newVolume)

    if (soundInstance) {
      soundInstance.volume(effectiveVolume.value)
    }
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    audioStore.toggleMute()

    if (soundInstance) {
      soundInstance.volume(effectiveVolume.value)
    }
  }

  /**
   * 停止所有音效
   */
  function stopAll() {
    if (soundInstance) {
      soundInstance.stop()
    }
  }

  /**
   * 卸载音效系统
   * 组件卸载时调用
   */
  function unload() {
    if (soundInstance) {
      soundInstance.unload()
      soundInstance = null
      isInitialized.value = false
    }
  }

  return {
    // 状态
    volume: audioStore.volume,
    isMuted: audioStore.isMuted,
    isInitialized,

    // 方法
    initialize,
    play,
    setVolume,
    toggleMute,
    stopAll,
    unload
  }
}
