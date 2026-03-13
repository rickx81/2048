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
});
