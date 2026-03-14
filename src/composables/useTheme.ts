import { watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeConfig } from '@/core/theme'

/**
 * 主题 Composable
 * 提供统一的主题访问接口，自动处理 DOM 副作用
 *
 * **职责：**
 * - 封装主题 Store 访问
 * - 监听主题变化并应用到 DOM（data-theme 属性）
 * - 立即初始化主题（immediate: true）
 *
 * **使用示例：**
 * ```vue
 * <script setup lang="ts">
 * import { useTheme } from '@/composables/useTheme'
 *
 * const { currentThemeId, currentTheme, setTheme } = useTheme()
 * </script>
 *
 * <template>
 *   <button @click="setTheme('sky')">{{ currentTheme.displayName }}</button>
 * </template>
 * ```
 */
export function useTheme() {
  const store = useThemeStore()

  // 监听主题变化，应用到 DOM
  watch(
    () => store.currentThemeId,
    (newThemeId) => {
      // 设置 data-theme 属性，激活对应的 CSS 变量
      document.documentElement.dataset.theme = newThemeId
    },
    { immediate: true } // 立即执行以初始化
  )

  return {
    /** 当前主题 ID（响应式） */
    currentThemeId: store.currentThemeId,
    /** 当前主题配置对象（响应式） */
    currentTheme: store.currentTheme,
    /** 设置主题方法 */
    setTheme: store.setTheme
  }
}
