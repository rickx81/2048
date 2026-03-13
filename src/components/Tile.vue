<template>
  <div
    :class="[
      'tile',
      isNew ? 'tile-new' : '',
      isMerged ? 'tile-merged' : '',
      value !== 0 ? 'will-change-transform' : ''
    ]"
    :style="getTileStyle()"
  >
    <span class="tile-number" :style="getTextStyle()">{{ value || '' }}</span>
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
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  if (props.value === 0) {
    return {
      ...baseStyle,
      backgroundColor: '#cdc1b4', // 经典空格子颜色
      borderRadius: '3px',
    }
  }

  // 经典 2048 背景颜色映射
  const backgroundColors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  }

  return {
    ...baseStyle,
    backgroundColor: backgroundColors[props.value] || '#3c3a32',
    borderRadius: '3px',
  }
}

// 获取文字样式
function getTextStyle() {
  if (props.value === 0) {
    return {}
  }

  // 经典 2048 文本颜色映射（2 和 4 用深色文字，其他用白色）
  const darkTextNumbers = [2, 4]
  const useDarkText = darkTextNumbers.includes(props.value)

  const fontSize = getFontSize(props.value)

  return {
    color: useDarkText ? '#776e65' : '#f9f6f2',
    fontSize,
    fontWeight: '700',
  }
}

// 字体大小函数
function getFontSize(value: number): string {
  if (value === 0) return ''
  const digits = value.toString().length
  if (digits <= 2) return '3rem'
  if (digits === 3) return '2.25rem'
  if (digits === 4) return '1.75rem'
  return '1.5rem'
}
</script setup>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  user-select: none;
  transition: background-color 0.15s ease;
}

.tile-number {
  display: inline-block;
  text-align: center;
  line-height: 1;
}

/* 动画类在 App.vue 中全局定义 */
</style>
