/**
 * 游戏核心类型测试
 * 测试 Grid、Direction、GameStatus 和 GameState 类型定义
 */

import { describe, it, expect } from 'vitest';
import type { Grid, Direction, GameState } from '../types';
import { GameStatus } from '../types';

// 注意：这些测试主要验证类型定义的存在性
// 实际的类型检查由 TypeScript 编译器完成

describe('游戏核心类型', () => {
  describe('Grid 类型', () => {
    it('应该是 4x4 的二维数组', () => {
      const grid: Grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      expect(grid).toHaveLength(4);
      expect(grid[0]).toHaveLength(4);
    });

    it('应该用 0 表示空位', () => {
      const emptyGrid: Grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      // 验证所有元素都是 0
      emptyGrid.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBe(0);
        });
      });
    });
  });

  describe('Direction 类型', () => {
    it('应该包含四个方向', () => {
      const up: Direction = 'UP';
      const down: Direction = 'DOWN';
      const left: Direction = 'LEFT';
      const right: Direction = 'RIGHT';

      expect(up).toBe('UP');
      expect(down).toBe('DOWN');
      expect(left).toBe('LEFT');
      expect(right).toBe('RIGHT');
    });

    it('只能是预定义的四个方向', () => {
      const validDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      expect(validDirections).toHaveLength(4);

      const validDirectionValues = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      validDirectionValues.forEach((direction) => {
        const typedDirection: Direction = direction as Direction;
        expect(validDirections).toContain(typedDirection);
      });
    });
  });

  describe('GameStatus 枚举', () => {
    it('应该包含 IDLE, PLAYING, WON, LOST', () => {
      expect(GameStatus.IDLE).toBeDefined();
      expect(GameStatus.PLAYING).toBeDefined();
      expect(GameStatus.WON).toBeDefined();
      expect(GameStatus.LOST).toBeDefined();
    });

    it('应该有正确的字符串值', () => {
      expect(GameStatus.IDLE).toBe('idle');
      expect(GameStatus.PLAYING).toBe('playing');
      expect(GameStatus.WON).toBe('won');
      expect(GameStatus.LOST).toBe('lost');
    });
  });

  describe('GameState 接口', () => {
    it('应该包含 grid, score, status', () => {
      const gameState: GameState = {
        grid: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        score: 0,
        status: GameStatus.IDLE
      };

      expect(gameState.grid).toBeDefined();
      expect(gameState.score).toBeDefined();
      expect(gameState.status).toBeDefined();
    });

    it('grid 应该是 Grid 类型', () => {
      const gameState: GameState = {
        grid: [
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        score: 0,
        status: GameStatus.IDLE
      };

      expect(gameState.grid).toHaveLength(4);
      expect(gameState.grid[0]).toHaveLength(4);
    });

    it('score 应该是 number 类型', () => {
      const gameState: GameState = {
        grid: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        score: 100,
        status: GameStatus.IDLE
      };

      expect(typeof gameState.score).toBe('number');
    });

    it('status 应该是 GameStatus 类型', () => {
      const gameState: GameState = {
        grid: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        score: 0,
        status: GameStatus.PLAYING
      };

      expect(gameState.status).toBe(GameStatus.PLAYING);
    });
  });
});
