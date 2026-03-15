import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useGameStore } from '@/stores/game'
import type { Direction } from '@/core/types'

/**
 * 游戏控制 composable
 * 提供键盘方向键、触摸滑动和鼠标拖拽控制
 */
export function useGameControls(targetRef: Ref<HTMLElement | undefined>) {
  const store = useGameStore()

  // ===== 键盘控制 =====
  function handleKeydown(event: KeyboardEvent) {
    // 如果游戏已结束，不响应键盘输入
    if (store.status === 'lost' || store.status === 'won') {
      return
    }

    const keyMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'w': 'UP',
      's': 'DOWN',
      'a': 'LEFT',
      'd': 'RIGHT',
      'W': 'UP',
      'S': 'DOWN',
      'A': 'LEFT',
      'D': 'RIGHT',
    }

    const direction = keyMap[event.key]
    if (direction) {
      event.preventDefault() // 防止页面滚动
      store.moveGrid(direction)
    }
  }

  // ===== 鼠标拖拽控制 =====
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  // 滑动阈值（像素）
  const SWIPE_THRESHOLD = 50

  function handleMouseDown(event: MouseEvent) {
    if (store.status !== 'playing') return
    isDragging.value = true
    startX.value = event.clientX
    startY.value = event.clientY
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging.value) return
    // 防止拖拽时选中文本
    event.preventDefault()
  }

  function handleMouseUp(event: MouseEvent) {
    if (!isDragging.value) return

    const endX = event.clientX
    const endY = event.clientY
    const deltaX = endX - startX.value
    const deltaY = endY - startY.value

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // 只有滑动距离超过阈值才触发移动
    if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
      let direction: Direction | null = null

      // 判断主体方向（水平或垂直）
      if (absX > absY) {
        // 水平方向占主导
        direction = deltaX > 0 ? 'RIGHT' : 'LEFT'
      } else {
        // 垂直方向占主导
        direction = deltaY > 0 ? 'DOWN' : 'UP'
      }

      if (direction && store.status === 'playing') {
        store.moveGrid(direction)
      }
    }

    isDragging.value = false
  }

  function handleMouseLeave() {
    isDragging.value = false
  }

  // ===== 触摸控制 =====
  const { lengthX, lengthY } = useSwipe(targetRef, {
    threshold: SWIPE_THRESHOLD,
    passive: false,
    onSwipe() {
      // 计算滑动方向
      const absX = Math.abs(lengthX.value)
      const absY = Math.abs(lengthY.value)

      let direction: Direction | null = null

      // 判断主体方向（水平或垂直）
      if (absX > absY) {
        // 水平方向占主导
        if (lengthX.value > 0) {
          direction = 'RIGHT'
        } else {
          direction = 'LEFT'
        }
      } else {
        // 垂直方向占主导
        if (lengthY.value > 0) {
          direction = 'DOWN'
        } else {
          direction = 'UP'
        }
      }

      // 执行移动
      if (direction && store.status === 'playing') {
        store.moveGrid(direction)
      }
    },
  })

  // ===== 生命周期管理 =====
  onMounted(() => {
    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeydown)

    // 添加鼠标拖拽事件监听
    const target = targetRef.value
    if (target) {
      target.addEventListener('mousedown', handleMouseDown)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      target.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    // 移除键盘事件监听
    window.removeEventListener('keydown', handleKeydown)

    // 移除鼠标拖拽事件监听
    const target = targetRef.value
    if (target) {
      target.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      target.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return {
    // 导出滑动距离（用于调试或可视化）
    lengthX,
    lengthY,
  }
}
