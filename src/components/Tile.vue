<template>
  <div
    :class="[
      'tile',
      'rounded-lg',
      'flex',
      'items-center',
      'justify-center',
      'font-bold',
      'transition-all',
      'duration-150',
      value === 0 ? 'bg-transparent' : getTileColor(value),
      value === 0 ? '' : getTextColor(value),
      value === 0 ? '' : getFontSize(value),
      value !== 0 ? 'will-change-transform' : ''
    ]"
    :style="{
      transform: value !== 0 ? 'translateZ(0)' : 'none'
    }"
  >
    {{ value || '' }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  row: number
  col: number
}

const props = defineProps<Props>()

// 颜色映射函数
function getTileColor(value: number): string {
  const colors: Record<number, string> = {
    2: 'bg-cyan-400',
    4: 'bg-green-400',
    8: 'bg-yellow-400',
    16: 'bg-orange-400',
    32: 'bg-red-400',
    64: 'bg-purple-400',
    128: 'bg-pink-400',
    256: 'bg-rose-400',
    512: 'bg-red-500',
    1024: 'bg-purple-500',
    2048: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  }
  return colors[value] || 'bg-purple-600'
}

// 文本颜色函数
function getTextColor(value: number): string {
  return value <= 4 ? 'text-gray-800' : 'text-white'
}

// 字体大小函数
function getFontSize(value: number): string {
  if (value === 0) return ''
  const digits = value.toString().length
  if (digits <= 2) return 'text-5xl'
  if (digits === 3) return 'text-4xl'
  if (digits === 4) return 'text-3xl'
  return 'text-2xl'
}
</script setup>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 动画类在 App.vue 中全局定义 */
</style>
