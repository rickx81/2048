/**
 * 主题状态管理 Store
 * 提供响应式的主题状态管理和切换接口
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeId, ThemeConfig } from '@/core/theme'
import { THEMES } from '@/core/theme'

export const useThemeStore = defineStore('theme', () => {
  // ===== 状态 =====
  /** 当前激活的主题 ID（默认为 'neon'） */
  const currentThemeId = ref<ThemeId>('neon')

  // ===== 计算属性 =====
  /** 当前主题配置对象 */
  const currentTheme = computed<ThemeConfig>(() => THEMES[currentThemeId.value])

  // ===== 操作方法 =====
  /**
   * 设置主题
   * @param themeId 主题 ID
   * @throws {Error} 如果主题 ID 不存在
   */
  function setTheme(themeId: ThemeId) {
    if (!THEMES[themeId]) {
      throw new Error(`Unknown theme: ${themeId}`)
    }
    currentThemeId.value = themeId
    // DOM 更新在 useTheme Composable 中处理
  }

  return {
    currentThemeId,
    currentTheme,
    setTheme
  }
})
