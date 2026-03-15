<template>
  <div class="theme-switcher" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="control-btn theme-btn"
      title="切换主题"
    >
      <!-- 太阳 SVG 图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      </svg>
    </button>

    <div v-if="isOpen" class="theme-dropdown">
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="handleSelectTheme(theme.id)"
        class="theme-option"
        :class="{ 'active': theme.id === currentThemeId }"
      >
        {{ theme.displayName }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useThemeStore } from '@/stores/theme'
import { THEMES } from '@/core/theme'
import type { ThemeId } from '@/core/theme'

// 使用 theme store 直接访问响应式状态
const themeStore = useThemeStore()

// 主题列表
const themes = Object.values(THEMES)

// 当前主题 ID（使用 computed 确保响应性）
const currentThemeId = computed(() => themeStore.currentThemeId)

// 下拉菜单状态
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// 切换下拉菜单
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 选择主题
function handleSelectTheme(themeId: ThemeId) {
  themeStore.setTheme(themeId)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<style scoped>
.theme-switcher {
  position: relative;
  display: inline-block;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-bg-secondary);
  border: none;
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
  color: var(--theme-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease;
}

.theme-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.theme-btn:active {
  opacity: 0.8;
  transform: scale(0.95);
}

.theme-btn svg {
  transition: transform 0.3s ease;
}

.theme-btn:hover svg {
  transform: rotate(15deg);
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 140px;
  overflow: hidden;
}

.theme-option {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--theme-text-primary);
  transition: background-color 0.15s ease;
}

.theme-option:hover {
  background-color: var(--theme-bg-primary);
}

.theme-option.active {
  font-weight: 700;
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .theme-btn {
    padding: 0.625rem;
  }

  .theme-option {
    padding: 1rem;
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
