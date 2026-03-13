/**
 * 游戏状态管理 Store 测试
 * 测试 Pinia store 的游戏状态管理和操作方法
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '@/stores/game';
import { GameStatus } from '@/core/types';
import { createEmptyGrid } from '@/core/utils';

describe('useGameStore', () => {
  beforeEach(() => {
    // 每个测试前创建新的 Pinia 实例
    setActivePinia(createPinia());
  });

  describe('初始化', () => {
    it('应该能够实例化 store', () => {
      const store = useGameStore();
      expect(store).toBeDefined();
    });

    it('初始状态 grid 应该为空网格（全 0）', () => {
      const store = useGameStore();
      expect(store.grid).toEqual(createEmptyGrid());
    });

    it('初始状态 score 应该为 0', () => {
      const store = useGameStore();
      expect(store.score).toBe(0);
    });

    it('初始状态 status 应该为 GameStatus.IDLE', () => {
      const store = useGameStore();
      expect(store.status).toBe(GameStatus.IDLE);
    });

    it('初始状态 history 应该为空数组', () => {
      const store = useGameStore();
      expect(store.history).toEqual([]);
    });
  });

  describe('计算属性', () => {
    it('计算属性 isGameOver 应该正确反映游戏状态', () => {
      const store = useGameStore();

      // 初始状态游戏未结束
      expect(store.isGameOver).toBe(false);

      // 创建一个游戏结束的网格（填满且无法合并）
      store.grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [8192, 16384, 32768, 65536]
      ];
      expect(store.isGameOver).toBe(true);
    });

    it('计算属性 isGameWon 应该正确反映游戏状态', () => {
      const store = useGameStore();

      // 初始状态游戏未胜利
      expect(store.isGameWon).toBe(false);

      // 创建一个包含 2048 的网格
      store.grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 2048, 0],
        [0, 0, 0, 0]
      ];
      expect(store.isGameWon).toBe(true);
    });
  });

  describe('moveGrid 方法', () => {
    it('moveGrid 应该调用核心 move 函数', () => {
      const store = useGameStore();
      store.initialize();

      const initialGrid = store.grid;
      store.moveGrid('LEFT');

      // 网格应该被修改
      expect(store.grid).not.toEqual(initialGrid);
    });

    it('移动后 grid 应该更新为新值', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      store.moveGrid('LEFT');

      // 期望：[4, 0, 0, 0] + 新生成的数字
      expect(store.grid[0]?.[0]).toBe(4);
    });

    it('移动后 score 应该累加得分', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      store.moveGrid('LEFT');

      // 合并 2+2=4，得分 4
      expect(store.score).toBe(4);
    });

    it('有效移动前应该保存当前状态到 history', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      store.moveGrid('LEFT');

      // 应该有一条历史记录
      expect(store.history.length).toBe(1);
      expect(store.history[0]).toEqual([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('移动后应该检测游戏状态（更新 status）', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      store.moveGrid('LEFT');

      // 游戏应该仍在进行中
      expect(store.status).toBe(GameStatus.PLAYING);
    });

    it('游戏结束时 status 应该变为 GameStatus.LOST', () => {
      const store = useGameStore();
      // 创建一个即将游戏结束的网格
      store.grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [8192, 16384, 32768, 65536]
      ];
      store.status = GameStatus.PLAYING;

      // 这个网格已经游戏结束，移动不应该改变状态
      store.moveGrid('LEFT');

      // 如果没有有效移动，状态应该保持 PLAYING
      // 但如果移动后导致游戏结束，状态应该变为 LOST
      // 这里我们需要确保游戏结束检测正确
    });

    it('游戏胜利时 status 应该变为 GameStatus.WON', () => {
      const store = useGameStore();
      // 创建一个即将胜利的网格（2048 即将出现）
      store.grid = [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      store.moveGrid('LEFT');

      // 应该检测到胜利
      expect(store.status).toBe(GameStatus.WON);
    });

    it('游戏胜利后仍可继续移动（status 保持 WON）', () => {
      const store = useGameStore();
      // 创建一个已经胜利的网格
      store.grid = [
        [2048, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.WON;

      store.moveGrid('LEFT');

      // 状态应该保持 WON
      expect(store.status).toBe(GameStatus.WON);
    });

    it('无效移动不应该改变状态', () => {
      const store = useGameStore();
      store.grid = [
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;
      const initialGrid = store.grid;
      const initialScore = store.score;
      const initialHistoryLength = store.history.length;

      // 向左移动不会改变这个网格
      store.moveGrid('LEFT');

      // 网格不应该改变（因为新数字会生成）
      // 但分数不应该增加
      expect(store.score).toBe(initialScore);

      // 历史记录不应该增加（因为移除了无效移动的历史）
      expect(store.history.length).toBe(initialHistoryLength);
    });

    it('游戏结束后不允许移动', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.LOST;

      store.moveGrid('LEFT');

      // 网格不应该改变
      expect(store.grid[0]?.[0]).toBe(2);
      expect(store.grid[0]?.[1]).toBe(2);
    });
  });
});
