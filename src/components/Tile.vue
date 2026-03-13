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
      'duration-200',
      value === 0 ? 'bg-transparent' : getTileColor(value),
      value === 0 ? '' : getTextColor(value),
      value === 0 ? '' : getFontSize(value),
      isNew ? 'tile-new' : '',
      isMerged ? 'tile-merged' : ''
    ]"
  >
    {{ value || '' }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number      // 方块数字（0 表示空）
  isNew?: boolean    // 是否新生成（用于后续动画）
  isMerged?: boolean // 是否刚合并（用于后续动画）
}

withDefaults(defineProps<Props>(), {
  isNew: false,
  isMerged: false
})

// 根据数字值返回对应的颜色类名
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

// 根据背景色调整文本颜色（确保可读性）
function getTextColor(value: number): string {
  return value <= 4 ? 'text-gray-800' : 'text-white'
}

// 根据数字位数调整字体大小
function getFontSize(value: number): string {
  if (value === 0) return ''
  const digits = value.toString().length
  if (digits <= 2) return 'text-5xl'
  if (digits === 3) return 'text-4xl'
  if (digits === 4) return 'text-3xl'
  return 'text-2xl'
}
</script>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tile-new {
  /* 新方块动画占位符 - 后续计划实现 */
}

.tile-merged {
  /* 合并动画占位符 - 后续计划实现 */
}
</style>
