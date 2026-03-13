/**
 * 本地存储工具模块
 * 提供 localStorage 的封装，实现最高分、排行榜和游戏进度的持久化存储
 */

import type { GameState } from './types';

// ==================== 常量定义 ====================

/** 存储键名前缀 */
const STORAGE_KEY_PREFIX = '__GAME_2048_';

/** 最高分存储键 */
const HIGHSCORE_KEY = `${STORAGE_KEY_PREFIX}HIGHSCORE__`;

/** 排行榜存储键 */
const LEADERBOARD_KEY = `${STORAGE_KEY_PREFIX}LEADERBOARD__`;

/** 游戏状态存储键 */
const GAME_STATE_KEY = `${STORAGE_KEY_PREFIX}GAME_STATE__`;

// ==================== 类型定义 ====================

/**
 * 排行榜条目接口
 */
export interface LeaderboardEntry {
  /** 分数 */
  score: number;
  /** 时间戳（Unix 时间） */
  timestamp: number;
}

// ==================== 辅助函数 ====================

/**
 * 从 localStorage 读取数据并解析 JSON
 * @param key 存储键
 * @param defaultValue 默认值（读取失败时返回）
 * @returns 解析后的数据或默认值
 */
function loadData<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    // localStorage 不可用或 JSON 解析失败，返回默认值
    return defaultValue;
  }
}

/**
 * 将数据序列化为 JSON 并保存到 localStorage
 * @param key 存储键
 * @param value 要保存的数据
 */
function saveData<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 不可用，静默失败
  }
}

// ==================== 最高分管理 ====================

/**
 * 保存最高分到 localStorage
 * @param score 最高分
 */
export function saveHighScore(score: number): void {
  saveData(HIGHSCORE_KEY, score);
}

/**
 * 从 localStorage 加载最高分
 * @returns 最高分，无数据时返回 0
 */
export function loadHighScore(): number {
  return loadData(HIGHSCORE_KEY, 0);
}

// ==================== 排行榜管理 ====================

/**
 * 保存排行榜到 localStorage
 * @param entries 排行榜条目数组
 */
export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  saveData(LEADERBOARD_KEY, entries);
}

/**
 * 从 localStorage 加载排行榜
 * @returns 排行榜条目数组，无数据时返回空数组
 */
export function loadLeaderboard(): LeaderboardEntry[] {
  return loadData(LEADERBOARD_KEY, []);
}

/**
 * 添加新分数到排行榜并保持前 10 名
 * @param score 新分数
 */
export function addLeaderboardEntry(score: number): void {
  // 获取当前排行榜
  const leaderboard = loadLeaderboard();

  // 添加新条目
  const newEntry: LeaderboardEntry = {
    score,
    timestamp: Date.now()
  };

  leaderboard.push(newEntry);

  // 排序：按分数降序，同分时新记录排在前面（更大的 timestamp）
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // 分数降序
    }
    return b.timestamp - a.timestamp; // 同分时按时间戳降序
  });

  // 只保留前 10 名
  const topEntries = leaderboard.slice(0, 10);

  // 保存更新后的排行榜
  saveLeaderboard(topEntries);
}

// ==================== 游戏状态管理 ====================

/**
 * 保存游戏进度到 localStorage
 * @param state 游戏状态
 */
export function saveGameState(state: GameState): void {
  saveData(GAME_STATE_KEY, state);
}

/**
 * 从 localStorage 加载游戏进度
 * @returns 游戏状态，无数据时返回 null
 */
export function loadGameState(): GameState | null {
  return loadData<GameState | null>(GAME_STATE_KEY, null);
}
