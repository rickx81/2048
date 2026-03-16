/**
 * 游戏状态管理 Store 测试
 * 测试 Pinia store 的游戏状态管理和操作方法
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '../game';
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
    beforeEach(() => {
      // 清除 localStorage 以避免持久化数据影响测试
      localStorage.clear();
    });

    it('moveGrid 应该调用核心 move 函数', () => {
      const store = useGameStore();
      // 使用确定的网格
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

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
      // 创建一个有 1 个空位的网格，移动后会填满且无法继续
      store.grid = [
        [2, 4, 8, 4],
        [4, 8, 2, 8],
        [8, 2, 4, 16],
        [0, 4, 32, 8]
      ];
      store.status = GameStatus.PLAYING;

      // 先验证移动前游戏未结束（因为有空位）
      expect(store.isGameOver).toBe(false);

      // 向左移动：最后一行 [0,4,32,8] → [4,32,8,0] → 生成新数字填入 → 网格填满且无法合并
      store.moveGrid('LEFT');

      // 验证状态变为 LOST
      expect(store.status).toBe(GameStatus.LOST);
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

  describe('撤销功能', () => {
    it('撤销后应该恢复到移动前的网格状态', () => {
      const store = useGameStore();
      store.reset(); // 重置以确保干净的状态
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      // 记录初始网格（深拷贝）
      const initialGrid = JSON.parse(JSON.stringify(store.grid));

      // 进行一次移动
      store.moveGrid('LEFT');
      const movedGrid = JSON.parse(JSON.stringify(store.grid));

      // 撤销移动
      store.undo();

      // 应该恢复到初始状态
      expect(store.grid).toEqual(initialGrid);
      expect(store.grid).not.toEqual(movedGrid);
    });

    it('撤销时应该扣除该次移动获得的分数', () => {
      const store = useGameStore();
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      const initialScore = store.score;

      // 进行一次移动（会合并 2+2=4，得分 4）
      store.moveGrid('LEFT');
      const scoreAfterMove = store.score;

      // 撤销移动
      store.undo();

      // 分数应该恢复到初始值
      expect(store.score).toBe(initialScore);
      expect(scoreAfterMove).toBe(initialScore + 4);
    });

    it('撤销后 undoCount 应该增加', () => {
      const store = useGameStore();
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      const initialUndoCount = store.undoCount;

      // 进行一次移动并撤销
      store.moveGrid('LEFT');
      store.undo();

      // undoCount 应该增加 1
      expect(store.undoCount).toBe(initialUndoCount + 1);
    });

    it('撤销次数达到限制后不能继续撤销', () => {
      const store = useGameStore();
      store.initialize();

      // 进行 4 次移动和撤销（超过限制 3 次）
      for (let i = 0; i < 4; i++) {
        store.moveGrid('LEFT');
        store.undo();
      }

      // undoCount 应该不超过限制
      expect(store.undoCount).toBe(3);

      // 最后一次撤销不应该生效
      expect(store.canUndo).toBe(false);
    });

    it('游戏结束后不能撤销（status = LOST）', () => {
      const store = useGameStore();
      store.reset(); // 重置以确保干净的状态
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      // 进行一次移动
      store.moveGrid('LEFT');
      const movedGrid = JSON.parse(JSON.stringify(store.grid));

      // 设置游戏结束状态
      store.status = GameStatus.LOST;

      // 尝试撤销
      store.undo();

      // 网格不应该恢复（应该保持移动后的状态）
      expect(store.grid).toEqual(movedGrid);
    });

    it('没有历史记录时不能撤销', () => {
      const store = useGameStore();
      store.initialize();

      // 清空历史记录
      store.history = [];

      // 尝试撤销
      store.undo();

      // 不应该抛出错误，状态应该保持不变
      expect(store.grid).toBeDefined();
    });

    it('canUndo 计算属性应该正确反映是否可撤销', () => {
      const store = useGameStore();
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      // 初始状态有历史但可能还没移动
      // 让我们先移动一次
      store.moveGrid('LEFT');

      // 应该可以撤销
      expect(store.canUndo).toBe(true);

      // 撤销 3 次，达到限制
      for (let i = 0; i < 3; i++) {
        store.moveGrid('LEFT');
        store.undo();
      }

      // 达到限制后不能撤销
      expect(store.canUndo).toBe(false);

      // 重置游戏后应该可以撤销
      store.reset(); // 使用 reset 而不是 initialize 以避免加载持久化数据
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;
      store.moveGrid('LEFT');
      expect(store.canUndo).toBe(true);
    });

    it('新游戏时应该重置撤销次数', () => {
      const store = useGameStore();
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      // 进行一次移动和撤销
      store.moveGrid('RIGHT'); // 向右移动会有有效移动
      store.undo();

      // undoCount 应该大于 0
      expect(store.undoCount).toBe(1);

      // 重新初始化游戏
      store.initialize();

      // undoCount 应该重置为 0
      expect(store.undoCount).toBe(0);
      expect(store.history).toEqual([]);
    });
  });

  describe('持久化功能', () => {
    beforeEach(() => {
      // 每个测试前清除 localStorage
      localStorage.clear();
    });

    it('store 创建时应该自动加载最高分', () => {
      // 先保存一个最高分
      localStorage.setItem('__GAME_2048_HIGHSCORE__', '1000');

      // 创建 store
      const store = useGameStore();

      // 应该加载最高分
      expect(store.highScore).toBe(1000);
    });

    it('store 创建时应该自动加载排行榜', () => {
      // 先保存一个排行榜
      const leaderboard = [
        { score: 1000, timestamp: 1000 },
        { score: 500, timestamp: 2000 }
      ];
      localStorage.setItem('__GAME_2048_LEADERBOARD__', JSON.stringify(leaderboard));

      // 创建 store
      const store = useGameStore();

      // 应该加载排行榜
      expect(store.leaderboard).toEqual(leaderboard);
    });

    it('store 创建时应该尝试恢复游戏状态（如果有）', () => {
      // 先保存游戏状态
      const savedState = {
        grid: [
          [2, 4, 8, 16],
          [32, 64, 128, 256],
          [512, 1024, 2048, 4096],
          [8192, 16384, 32768, 65536]
        ],
        score: 12345,
        status: GameStatus.PLAYING
      };
      localStorage.setItem('__GAME_2048_GAME_STATE__', JSON.stringify(savedState));

      // 创建 store
      const store = useGameStore();

      // 应该恢复游戏状态
      expect(store.grid).toEqual(savedState.grid);
      expect(store.score).toBe(savedState.score);
      expect(store.status).toBe(savedState.status);
    });

    it('游戏结束时应该自动保存分数到排行榜', () => {
      const store = useGameStore();
      store.reset(); // 重置以确保干净的状态
      store.score = 1000;

      // 使用我们确定的游戏结束场景
      store.grid = [
        [2, 4, 8, 4],
        [4, 8, 2, 8],
        [8, 2, 4, 16],
        [0, 4, 32, 8]
      ];
      store.status = GameStatus.PLAYING;

      // 进行移动，会触发游戏结束并保存分数
      store.moveGrid('LEFT');

      // 验证游戏结束状态
      expect(store.status).toBe(GameStatus.LOST);

      // 验证分数已保存到排行榜
      const leaderboardData = localStorage.getItem('__GAME_2048_LEADERBOARD__');
      expect(leaderboardData).not.toBeNull();
      const leaderboard = JSON.parse(leaderboardData!);
      expect(leaderboard.length).toBeGreaterThan(0);
      // 验证包含当前的分数
      const savedScore = leaderboard.some((entry: { score: number }) => entry.score === 1000);
      expect(savedScore).toBe(true);
    });

    it('游戏胜利时应该自动保存分数到排行榜', () => {
      const store = useGameStore();
      store.reset(); // 重置以确保干净的状态
      store.score = 500;

      // 创建一个即将胜利的网格
      store.grid = [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      // 进行移动（会导致胜利）
      store.moveGrid('LEFT');

      // 应该保存到排行榜
      expect(store.status).toBe(GameStatus.WON);
      const leaderboardData = localStorage.getItem('__GAME_2048_LEADERBOARD__');
      expect(leaderboardData).not.toBeNull();
      const leaderboard = JSON.parse(leaderboardData!);
      expect(leaderboard).toHaveLength(1);
      // 500 (初始分数) + 2048 (合并得分) = 2548
      expect(leaderboard[0].score).toBe(2548);
    });

    it('每次移动后应该自动保存游戏状态', () => {
      const store = useGameStore();
      // 使用确定的网格而不是随机初始化
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.score = 0;
      store.status = GameStatus.PLAYING;

      // 进行移动
      store.moveGrid('LEFT');

      // 应该保存游戏状态
      const gameStateData = localStorage.getItem('__GAME_2048_GAME_STATE__');
      expect(gameStateData).not.toBeNull();
      const gameState = JSON.parse(gameStateData!);
      expect(gameState.grid).toBeDefined();
      expect(gameState.score).toBeDefined();
      expect(gameState.status).toBeDefined();
    });

    it('分数超过最高分时应该自动更新最高分', () => {
      // 清除所有持久化数据
      localStorage.clear();

      // 设置一个初始最高分
      localStorage.setItem('__GAME_2048_HIGHSCORE__', '1000');

      // 创建新的 Pinia 实例以获取新的 store
      setActivePinia(createPinia());

      // 创建 store 会自动加载最高分
      const store = useGameStore();

      expect(store.highScore).toBe(1000);

      // 设置一个更高的分数
      store.score = 2000;
      store.grid = [
        [512, 512, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      // 进行移动（会合并并得分）
      store.moveGrid('LEFT');

      // 最高分应该更新
      // 2000 (初始分数) + 1024 (合并 512+512 的得分) = 3024
      expect(store.highScore).toBe(3024);
      const highScoreData = localStorage.getItem('__GAME_2048_HIGHSCORE__');
      expect(highScoreData).toBe('3024');
    });

    it('新游戏按钮应该重置游戏状态但保留最高分和排行榜', () => {
      // 清除所有持久化数据
      localStorage.clear();

      // 先设置最高分和排行榜
      localStorage.setItem('__GAME_2048_HIGHSCORE__', '2000');
      const leaderboard = [
        { score: 1000, timestamp: 1000 },
        { score: 500, timestamp: 2000 }
      ];
      localStorage.setItem('__GAME_2048_LEADERBOARD__', JSON.stringify(leaderboard));

      const store = useGameStore();
      store.reset(); // 先重置以确保干净的状态
      store.initialize();

      // 验证加载了最高分和排行榜
      expect(store.highScore).toBe(2000);
      expect(store.leaderboard).toEqual(leaderboard);

      // 设置一个有可合并方块的网格
      store.grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      store.status = GameStatus.PLAYING;

      // 进行一些移动
      const initialScore = store.score;
      store.moveGrid('LEFT');
      expect(store.score).toBeGreaterThan(initialScore);
      expect(store.status).toBe(GameStatus.PLAYING);

      // 调用 reset
      store.reset();

      // 游戏状态应该重置
      expect(store.score).toBe(0);
      expect(store.status).toBe(GameStatus.IDLE);
      expect(store.grid).toEqual(createEmptyGrid());
      expect(store.history).toEqual([]);
      expect(store.undoCount).toBe(0);

      // 但最高分和排行榜应该保留
      expect(store.highScore).toBe(2000);
      expect(store.leaderboard).toEqual(leaderboard);
    });

    it('排行榜应该自动保持前 10 名', () => {
      const store = useGameStore();
      store.initialize();

      // 添加 15 个分数
      for (let i = 0; i < 15; i++) {
        store.score = i * 100;
        // 手动触发保存到排行榜
        store.grid = [
          [1024, 1024, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        store.status = GameStatus.PLAYING;
        store.moveGrid('LEFT');
        store.reset(); // 重置以便下次添加
        store.initialize();
      }

      // 排行榜应该只有前 10 名
      expect(store.leaderboard.length).toBeLessThanOrEqual(10);
    });
  });
});
