<template>
  <div
    :class="[
      'tile',
      isNew ? 'tile-new' : '',
      isMerged ? 'tile-merged' : '',
      isAnimating ? 'tile-animating' : ''
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
const isAnimating = ref(false) // 动态 will-change 管理

// 监听值变化，判断是否是新方块或合并
const previousValue = ref(props.value)

watch(() => props.value, (newValue, oldValue) => {
  if (oldValue === 0 && newValue !== 0) {
    // 从空位变为有数字 = 新生成的方块
    isNew.value = true
    isAnimating.value = true // 动画开始前添加 will-change
    setTimeout(() => {
      isNew.value = false
      isAnimating.value = false // 动画结束后移除 will-change
    }, 200) // 与动画时长一致
  } else if (oldValue !== 0 && newValue !== oldValue && newValue !== 0) {
    // 数字变化且不为0 = 合并的方块
    isMerged.value = true
    isAnimating.value = true // 动画开始前添加 will-change
    setTimeout(() => {
      isMerged.value = false
      isAnimating.value = false // 动画结束后移除 will-change
    }, 200) // 与动画时长一致
  }

  previousValue.value = newValue
})

// 获取方块的样式（使用 CSS 变量）
function getTileStyle() {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  if (props.value === 0) {
    return {
      ...baseStyle,
      backgroundColor: 'var(--theme-tile-empty)',
      borderRadius: '3px',
    }
  }

  return {
    ...baseStyle,
    backgroundColor: `var(--theme-tile-${props.value})`,
    borderRadius: '3px',
  }
}

// 获取文字样式
function getTextStyle() {
  if (props.value === 0) {
    return {}
  }

  const darkTextNumbers = [2, 4]
  const useDarkText = darkTextNumbers.includes(props.value)
  const fontSize = getFontSize(props.value)

  return {
    color: useDarkText ? 'var(--theme-tile-text-dark)' : 'var(--theme-tile-text-light)',
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
</script>

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
