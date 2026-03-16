/**
 * 本地存储工具测试
 * 测试 localStorage 封装功能，包括最高分、排行榜和游戏状态管理
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveHighScore,
  loadHighScore,
  saveLeaderboard,
  loadLeaderboard,
  addLeaderboardEntry,
  saveGameState,
  loadGameState,
  type LeaderboardEntry
} from '../storage';
import { GameStatus, type GameState } from '../types';

// 模拟 localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('storage - 本地存储工具', () => {
  // 每个测试前清空 localStorage
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveHighScore 和 loadHighScore', () => {
    it('应该能保存和加载最高分', () => {
      saveHighScore(100);
      expect(loadHighScore()).toBe(100);
    });

    it('应该能更新最高分为更高的值', () => {
      saveHighScore(100);
      saveHighScore(200);
      expect(loadHighScore()).toBe(200);
    });

    it('在没有数据时应该返回 0', () => {
      expect(loadHighScore()).toBe(0);
    });
  });

  describe('saveLeaderboard 和 loadLeaderboard', () => {
    it('应该能保存和加载排行榜数据', () => {
      const entries: LeaderboardEntry[] = [
        { score: 100, timestamp: 1234567890 },
        { score: 200, timestamp: 1234567891 }
      ];

      saveLeaderboard(entries);
      expect(loadLeaderboard()).toEqual(entries);
    });

    it('应该能覆盖之前的排行榜数据', () => {
      const entries1: LeaderboardEntry[] = [
        { score: 100, timestamp: 1234567890 }
      ];
      const entries2: LeaderboardEntry[] = [
        { score: 200, timestamp: 1234567891 }
      ];

      saveLeaderboard(entries1);
      saveLeaderboard(entries2);
      expect(loadLeaderboard()).toEqual(entries2);
    });

    it('在没有数据时应该返回空数组', () => {
      expect(loadLeaderboard()).toEqual([]);
    });
  });

  describe('addLeaderboardEntry', () => {
    it('应该能添加新分数到排行榜并保持前 10 名', () => {
      // 添加 11 个分数
      for (let i = 1; i <= 11; i++) {
        addLeaderboardEntry(i * 100);
      }

      const leaderboard = loadLeaderboard();
      expect(leaderboard).toHaveLength(10);
      // 应该只保留前 10 名（分数最高的）
      expect(leaderboard[0]?.score).toBe(1100);
      expect(leaderboard[9]?.score).toBe(200);
    });

    it('应该按分数降序排序', () => {
      addLeaderboardEntry(100);
      addLeaderboardEntry(300);
      addLeaderboardEntry(200);

      const leaderboard = loadLeaderboard();
      expect(leaderboard[0]?.score).toBe(300);
      expect(leaderboard[1]?.score).toBe(200);
      expect(leaderboard[2]?.score).toBe(100);
    });

    it('同分时新记录应该排在前面（更大的 timestamp）', () => {
      addLeaderboardEntry(100);
      // 等待至少 1 毫秒确保 timestamp 不同
      const startTime = Date.now();
      while (Date.now() === startTime) {
        // 空循环确保时间流逝
      }
      addLeaderboardEntry(100);

      const leaderboard = loadLeaderboard();
      expect(leaderboard).toHaveLength(2);

      // 获取条目并验证存在性
      const firstEntry = leaderboard[0];
      const secondEntry = leaderboard[1];

      expect(firstEntry).toBeDefined();
      expect(secondEntry).toBeDefined();

      // 验证分数
      expect(firstEntry?.score).toBe(100);
      expect(secondEntry?.score).toBe(100);

      // 获取 timestamp 值（前面已验证条目存在）
      const firstTimestamp = firstEntry?.timestamp ?? 0;
      const secondTimestamp = secondEntry?.timestamp ?? 0;

      // 验证 timestamp 已定义
      expect(firstTimestamp).toBeGreaterThan(0);
      expect(secondTimestamp).toBeGreaterThan(0);

      // 验证新记录的 timestamp 更大
      expect(firstTimestamp).toBeGreaterThan(secondTimestamp);
    });
  });

  describe('saveGameState 和 loadGameState', () => {
    const mockGameState: GameState = {
      grid: [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      score: 100,
      status: GameStatus.PLAYING
    };

    it('应该能保存和加载完整的游戏状态', () => {
      saveGameState(mockGameState);
      expect(loadGameState()).toEqual(mockGameState);
    });

    it('应该能覆盖之前的游戏状态', () => {
      const state1: GameState = {
        grid: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        score: 100,
        status: GameStatus.PLAYING
      };
      const state2: GameState = {
        grid: [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        score: 200,
        status: GameStatus.PLAYING
      };

      saveGameState(state1);
      saveGameState(state2);
      expect(loadGameState()).toEqual(state2);
    });

    it('在没有数据时应该返回 null', () => {
      expect(loadGameState()).toBeNull();
    });
  });

  describe('错误处理', () => {
    it('localStorage 不可用时，loadHighScore 应该返回 0', () => {
      // 模拟 localStorage 不可用
      const originalLocalStorage = window.localStorage;
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new Error('localStorage not available');
        },
        setItem: () => {
          throw new Error('localStorage not available');
        }
      });

      expect(loadHighScore()).toBe(0);

      // 恢复 localStorage
      vi.stubGlobal('localStorage', originalLocalStorage);
    });

    it('localStorage 不可用时，loadLeaderboard 应该返回空数组', () => {
      const originalLocalStorage = window.localStorage;
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new Error('localStorage not available');
        },
        setItem: () => {
          throw new Error('localStorage not available');
        }
      });

      expect(loadLeaderboard()).toEqual([]);

      vi.stubGlobal('localStorage', originalLocalStorage);
    });

    it('localStorage 不可用时，loadGameState 应该返回 null', () => {
      const originalLocalStorage = window.localStorage;
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new Error('localStorage not available');
        },
        setItem: () => {
          throw new Error('localStorage not available');
        }
      });

      expect(loadGameState()).toBeNull();

      vi.stubGlobal('localStorage', originalLocalStorage);
    });

    it('JSON 解析失败时应该返回默认值', () => {
      // 手动设置无效的 JSON
      localStorage.setItem('__GAME_2048_HIGHSCORE__', 'invalid json');

      expect(loadHighScore()).toBe(0);
    });

    it('localStorage 不可用时保存操作应该不抛出错误', () => {
      const originalLocalStorage = window.localStorage;
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new Error('localStorage not available');
        },
        setItem: () => {
          throw new Error('localStorage not available');
        }
      });

      // 不应该抛出错误
      expect(() => {
        saveHighScore(100);
        saveLeaderboard([]);
        saveGameState({} as GameState);
      }).not.toThrow();

      vi.stubGlobal('localStorage', originalLocalStorage);
    });
  });
});
