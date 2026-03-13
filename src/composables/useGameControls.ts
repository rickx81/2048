import { onMounted, onUnmounted, type Ref } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useGameStore } from '@/stores/game'
import type { Direction } from '@/core/types'

/**
 * 游戏控制 composable
 * 提供键盘方向键和触摸滑动控制
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

  // ===== 触摸控制 =====
  // 滑动阈值（Claude's Discretion）
  // 50px 是一个合理的阈值：
  // - 太小（<30px）：容易误触，普通点击也会触发
  // - 太大（>80px）：需要滑动很长距离，体验差
  // 50px 在两者之间平衡，既避免误触又保持灵敏度
  const SWIPE_THRESHOLD = 50

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
  })

  onUnmounted(() => {
    // 移除键盘事件监听
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    // 导出滑动距离（用于调试或可视化）
    lengthX,
    lengthY,
  }
}
