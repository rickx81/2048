/**
 * 游戏核心类型定义
 * 定义 2048 游戏所需的所有类型和接口
 */

/**
 * 游戏网格类型
 * 4x4 二维数组，0 表示空位，非零值表示方块数字
 * 使用元组类型提供编译时大小保证
 */
export type Grid = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

/**
 * 移动方向类型
 * 定义四个可能的移动方向
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * 游戏状态枚举
 * 定义游戏可能的状态
 */
export enum GameStatus {
  /** 游戏未开始 */
  IDLE = 'idle',
  /** 游戏进行中 */
  PLAYING = 'playing',
  /** 游戏胜利 */
  WON = 'won',
  /** 游戏结束 */
  LOST = 'lost'
}

/**
 * 游戏状态接口
 * 定义完整的游戏状态
 */
export interface GameState {
  /** 游戏网格 */
  grid: Grid;
  /** 当前分数 */
  score: number;
  /** 游戏状态 */
  status: GameStatus;
}
