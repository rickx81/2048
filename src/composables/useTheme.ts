import { watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useThemeStore } from '@/stores/theme'
import type { ThemeConfig } from '@/core/theme'
import type { ThemeId } from '@/core/theme'

/**
 * 主题 Composable
 * 提供统一的主题访问接口，自动处理 DOM 副作用和 localStorage 持久化
 *
 * **职责：**
 * - 封装主题 Store 访问
 * - 监听主题变化并应用到 DOM（data-theme 属性）
 * - 立即初始化主题（immediate: true）
 * - 集成 localStorage 持久化（使用 VueUse useStorage）
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

  // 使用 useStorage 自动同步主题 ID 到 localStorage
  const storedThemeId = useStorage<ThemeId>(
    '2048-game-theme',
    'neon',
    localStorage,
    {
      onError: (error) => {
        // localStorage 失败时静默回退到默认主题
        if (error instanceof Error) {
          console.warn('主题持久化失败，回退到默认主题:', error.message)
        } else {
          console.warn('主题持久化失败，回退到默认主题')
        }
      }
    }
  )

  // 初始化时从 localStorage 读取并设置到 store
  try {
    if (storedThemeId.value) {
      store.setTheme(storedThemeId.value)
    }
  } catch (error) {
    console.warn('读取主题失败，使用默认主题:', error)
    // 静默回退，不显示错误给用户
  }

  // 监听 store 主题变化，同步到 localStorage 和 DOM
  watch(
    () => store.currentThemeId,
    (newThemeId) => {
      // 同步到 localStorage
      storedThemeId.value = newThemeId

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
