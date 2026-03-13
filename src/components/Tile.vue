<template>
  <div
    :class="[
      'tile',
      'flex',
      'items-center',
      'justify-center',
      'font-bold',
      'transition-all',
      'duration-150',
      isNew ? 'tile-new' : '',
      isMerged ? 'tile-merged' : '',
      value !== 0 ? 'will-change-transform' : ''
    ]"
    :style="getTileStyle()"
  >
    {{ value || '' }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  value: number
  row: number
  col: number
}

const props = defineProps<Props>()

// 动画状态
const isNew = ref(false)
const isMerged = ref(false)

// 监听值变化，判断是否是新方块或合并
const previousValue = ref(props.value)

watch(() => props.value, (newValue, oldValue) => {
  if (oldValue === 0 && newValue !== 0) {
    // 从空位变为有数字 = 新生成的方块
    isNew.value = true
    setTimeout(() => { isNew.value = false }, 200) // 动画时长后重置
  } else if (oldValue !== 0 && newValue !== oldValue && newValue !== 0) {
    // 数字变化且不为0 = 合并的方块
    isMerged.value = true
    setTimeout(() => { isMerged.value = false }, 200) // 动画时长后重置
  }

  previousValue.value = newValue
})

// 获取方块的样式（内联样式）
function getTileStyle() {
  if (props.value === 0) {
    return {
      backgroundColor: 'transparent',
      color: 'transparent',
      transform: 'none'
    }
  }

  // 背景颜色映射 - 更柔和的配色
  const backgroundColors: Record<number, string> = {
    2: '#67e8f9',      // cyan-300 (更柔和)
    4: '#86efac',      // green-300
    8: '#fde047',      // yellow-300
    16: '#fdba74',     // orange-300
    32: '#fca5a5',     // red-300
    64: '#d8b4fe',     // purple-300
    128: '#f9a8d4',    // pink-300
    256: '#fda4af',    // rose-300
    512: '#f87171',    // red-400
    1024: '#c084fc',   // purple-400
    2048: '#fbbf24',   // amber-400
  }

  // 文本颜色映射
  const textColors: Record<number, string> = {
    2: '#374151',      // gray-700 (浅色背景用深色文字)
    4: '#374151',      // gray-700
    8: '#374151',      // gray-700
    16: '#374151',     // gray-700
  }

  // 字体大小映射
  const fontSize = getFontSize(props.value)

  return {
    backgroundColor: backgroundColors[props.value] || '#a855f7',
    color: textColors[props.value] || 'white',
    fontSize,
    transform: 'translateZ(0)',
    borderRadius: '0.5rem',
    boxShadow: props.value >= 2048
      ? '0 0 30px rgba(251, 191, 36, 0.4)'
      : undefined
  }
}

// 字体大小函数（保留用于内联样式）
function getFontSize(value: number): string {
  if (value === 0) return ''
  const digits = value.toString().length
  if (digits <= 2) return '3rem'
  if (digits === 3) return '2.25rem'
  if (digits === 4) return '1.875rem'
  return '1.5rem'
}
</script setup>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
}

/* 动画类在 App.vue 中全局定义 */
</style>
