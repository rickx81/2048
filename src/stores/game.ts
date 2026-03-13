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
import {
  saveHighScore,
  loadHighScore,
  saveLeaderboard,
  loadLeaderboard,
  addLeaderboardEntry,
  saveGameState,
  loadGameState
} from '@/core/storage'
import type { LeaderboardEntry } from '@/core/storage'

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

  /** 撤销次数计数 */
  const undoCount = ref<number>(0)

  /** 撤销次数限制 */
  const undoLimit = ref<number>(3)

  /** 移动得分历史（与 history 数组对应，记录每次移动的得分） */
  const scoreHistory = ref<number[]>([])

  /** 最高分 */
  const highScore = ref<number>(0)

  /** 排行榜（前 10 名） */
  const leaderboard = ref<LeaderboardEntry[]>([])

  // ===== 计算属性 =====
  /** 游戏是否结束 */
  const isGameOver = computed<boolean>(() => checkGameOver(grid.value))

  /** 游戏是否胜利 */
  const isGameWon = computed<boolean>(() => checkGameWon(grid.value))

  /** 是否可以撤销 */
  const canUndo = computed<boolean>(() =>
    status.value === GameStatus.PLAYING &&
    history.value.length > 0 &&
    undoCount.value < undoLimit.value
  )

  // ===== 操作方法 =====
  /**
   * 保存分数到排行榜
   */
  function saveScoreToLeaderboard() {
    addLeaderboardEntry(score.value)
    leaderboard.value = loadLeaderboard() // 重新加载以获取更新后的数据
  }
  /**
   * 初始化游戏
   * 创建初始网格（包含两个随机数字）并重置状态
   */
  function initialize() {
    reset()
    grid.value = createInitialGrid()
    score.value = 0
    status.value = GameStatus.PLAYING
    saveGameState({ grid: grid.value, score: score.value, status: status.value })
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

    // 调用核心移动函数先计算得分
    const result = move(grid.value, direction)

    // 如果没有发生移动，直接返回
    if (!result.moved) {
      return
    }

    // 保存当前状态到历史记录
    history.value.push([...grid.value])

    // 保存本次移动的得分
    scoreHistory.value.push(result.score)

    // 更新网格和分数
    grid.value = result.grid
    score.value += result.score

    // 更新最高分
    if (score.value > highScore.value) {
      highScore.value = score.value
      saveHighScore(highScore.value)
    }

    // 更新游戏状态
    if (checkGameWon(grid.value) && status.value !== GameStatus.WON) {
      status.value = GameStatus.WON
      saveScoreToLeaderboard()
    } else if (checkGameOver(grid.value)) {
      status.value = GameStatus.LOST
      saveScoreToLeaderboard()
    }

    // 保存游戏状态
    saveGameState({ grid: grid.value, score: score.value, status: status.value })
  }

  /**
   * 重置游戏
   * 清空游戏状态，但保留最高分和排行榜
   */
  function reset() {
    grid.value = createEmptyGrid()
    score.value = 0
    status.value = GameStatus.IDLE
    history.value = []
    undoCount.value = 0
    scoreHistory.value = []
    // 保存清空后的状态（或删除游戏状态）
    saveGameState({ grid: grid.value, score: score.value, status: status.value })
  }

  /**
   * 撤销上一步移动
   * 恢复到移动前的状态，并扣除相应的分数
   */
  function undo() {
    // 1. 检查是否可以撤销
    if (!canUndo.value) {
      return
    }

    // 2. 从历史记录中恢复网格
    const previousGrid = history.value.pop()
    if (!previousGrid) {
      return
    }

    // 3. 恢复网格状态
    grid.value = previousGrid

    // 4. 扣除该次移动的得分
    const scoreDeduction = scoreHistory.value.pop() ?? 0
    score.value = Math.max(0, score.value - scoreDeduction)

    // 5. 增加撤销计数
    undoCount.value += 1

    // 6. 更新游戏状态（可能从 LOST 变回 PLAYING）
    if (status.value === GameStatus.LOST) {
      status.value = GameStatus.PLAYING
    }
  }

  // ===== 初始化持久化数据 =====
  // 加载最高分
  highScore.value = loadHighScore()

  // 加载排行榜
  leaderboard.value = loadLeaderboard()

  // 尝试恢复游戏状态
  const savedState = loadGameState()
  if (savedState) {
    grid.value = savedState.grid
    score.value = savedState.score
    status.value = savedState.status
    // 不恢复 history 和 undoCount，避免撤销混乱
  }

  return {
    // 状态
    grid,
    score,
    status,
    history,
    undoCount,
    undoLimit,
    highScore,
    leaderboard,

    // 计算属性
    isGameOver,
    isGameWon,
    canUndo,

    // 方法
    initialize,
    moveGrid,
    reset,
    undo
  }
})
