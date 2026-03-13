/**
 * 游戏状态管理 Store
 * 集成核心游戏逻辑，提供响应式的状态管理和操作接口
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Grid, Direction } from '@/core/types'
import { GameStatus } from '@/core/types'
import { createEmptyGrid, createInitialGrid } from '@/core/utils'
import { move, isGameOver as checkGameOver, isGameWon as checkGameWon } from '@/core/game'

export const useGameStore = defineStore('game', () => {
  // ===== 状态 =====
  /** 游戏网格 */
  const grid = ref<Grid>(createEmptyGrid())

  /** 当前分数 */
  const score = ref<number>(0)

  /** 游戏状态 */
  const status = ref<GameStatus>(GameStatus.IDLE)

  /** 历史记录（用于 Phase 2 撤销功能） */
  const history = ref<Grid[]>([])

  // ===== 计算属性 =====
  /** 游戏是否结束 */
  const isGameOver = computed<boolean>(() => checkGameOver(grid.value))

  /** 游戏是否胜利 */
  const isGameWon = computed<boolean>(() => checkGameWon(grid.value))

  // ===== 操作方法 =====
  /**
   * 初始化游戏
   * 创建初始网格（包含两个随机数字）并重置状态
   */
  function initialize() {
    grid.value = createInitialGrid()
    score.value = 0
    status.value = GameStatus.PLAYING
    history.value = []
  }

  /**
   * 移动方块
   * @param direction 移动方向
   */
  function moveGrid(direction: Direction) {
    // 如果游戏已结束，不允许移动
    if (status.value === GameStatus.LOST) {
      return
    }

    // 保存当前状态到历史记录（为 Phase 2 撤销功能预留）
    history.value.push([...grid.value])

    // 调用核心移动函数
    const result = move(grid.value, direction)

    // 如果没有发生移动，移除历史记录并返回
    if (!result.moved) {
      history.value.pop()
      return
    }

    // 更新网格和分数
    grid.value = result.grid
    score.value += result.score

    // 更新游戏状态
    if (checkGameWon(grid.value) && status.value !== GameStatus.WON) {
      status.value = GameStatus.WON
    } else if (checkGameOver(grid.value)) {
      status.value = GameStatus.LOST
    }
  }

  /**
   * 重置游戏
   * 清空所有状态
   */
  function reset() {
    grid.value = createEmptyGrid()
    score.value = 0
    status.value = GameStatus.IDLE
    history.value = []
  }

  return {
    // 状态
    grid,
    score,
    status,
    history,

    // 计算属性
    isGameOver,
    isGameWon,

    // 方法
    initialize,
    moveGrid,
    reset
  }
})
