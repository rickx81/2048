/**
 * 游戏核心类型测试
 * 测试 Grid、Direction、GameStatus 和 GameState 类型定义
 */

import { describe, it, expect } from 'vitest';

// 注意：这些测试主要验证类型定义的存在性
// 实际的类型检查由 TypeScript 编译器完成

describe('游戏核心类型', () => {
  describe('Grid 类型', () => {
    it('应该是 4x4 的二维数组', async () => {
      // 动态导入类型定义以验证其存在
      const typesModule = await import('../types');
      const grid: number[][] = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      // 验证 Grid 类型可以赋值给 number[][]
      const gridAsGrid: typesModule.Grid = grid;
      expect(gridAsGrid).toHaveLength(4);
      expect(gridAsGrid[0]).toHaveLength(4);
    });

    it('应该用 0 表示空位', async () => {
      const { Grid } = await import('../types');
      const emptyGrid: Grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      // 验证所有元素都是 0
      emptyGrid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(0);
        });
      });
    });
  });

  describe('Direction 类型', () => {
    it('应该包含四个方向', async () => {
      const { Direction } = await import('../types');

      // 验证 Direction 类型包含所有必需的方向
      const up: Direction = 'UP';
      const down: Direction = 'DOWN';
      const left: Direction = 'LEFT';
      const right: Direction = 'RIGHT';

      expect(up).toBe('UP');
      expect(down).toBe('DOWN');
      expect(left).toBe('LEFT');
      expect(right).toBe('RIGHT');
    });

    it('只能是预定义的四个方向', async () => {
      const { Direction } = await import('../types');

      // 验证 Direction 类型的约束
      const validDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      expect(validDirections).toHaveLength(4);

      // 这将在 TypeScript 编译时捕获类型错误
      // @ts-expect-error - 测试无效方向
      const invalidDirection: Direction = 'DIAGONAL';
      expect(invalidDirection).toBeUndefined();
    });
  });

  describe('GameStatus 枚举', () => {
    it('应该包含 IDLE, PLAYING, WON, LOST', async () => {
      const { GameStatus } = await import('../types');

      // 验证 GameStatus 包含所有必需的状态
      expect(GameStatus.IDLE).toBeDefined();
      expect(GameStatus.PLAYING).toBeDefined();
      expect(GameStatus.WON).toBeDefined();
      expect(GameStatus.LOST).toBeDefined();
    });

    it('应该有正确的字符串值', async () => {
      const { GameStatus } = await import('../types');

      expect(GameStatus.IDLE).toBe('idle');
      expect(GameStatus.PLAYING).toBe('playing');
      expect(GameStatus.WON).toBe('won');
      expect(GameStatus.LOST).toBe('lost');
    });
  });

  describe('GameState 接口', () => {
    it('应该包含 grid, score, status', async () => {
      const { GameState, GameStatus, Grid } = await import('../types');

      // 创建一个符合 GameState 接口的对象
      const gameState: GameState = {
        grid: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ] as Grid,
        score: 0,
        status: GameStatus.IDLE
      };

      // 验证所有必需属性都存在
      expect(gameState.grid).toBeDefined();
      expect(gameState.score).toBeDefined();
      expect(gameState.status).toBeDefined();
    });

    it('grid 应该是 Grid 类型', async () => {
      const { GameState, Grid } = await import('../types');

      const gameState: GameState = {
        grid: [
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ] as Grid,
        score: 0,
        status: 'idle' as any
      };

      expect(gameState.grid).toHaveLength(4);
      expect(gameState.grid[0]).toHaveLength(4);
    });

    it('score 应该是 number 类型', async () => {
      const { GameState } = await import('../types');

      const gameState: GameState = {
        grid: [] as any,
        score: 100,
        status: 'idle' as any
      };

      expect(typeof gameState.score).toBe('number');
    });

    it('status 应该是 GameStatus 类型', async () => {
      const { GameState, GameStatus } = await import('../types');

      const gameState: GameState = {
        grid: [] as any,
        score: 0,
        status: GameStatus.PLAYING
      };

      expect(gameState.status).toBe(GameStatus.PLAYING);
    });
  });
});
