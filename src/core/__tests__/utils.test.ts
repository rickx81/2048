/**
 * 游戏工具函数测试
 * 测试网格创建、空位查找、随机生成等工具函数
 */

import { describe, it, expect } from 'vitest';

describe('游戏工具函数', () => {
  describe('createEmptyGrid', () => {
    it('应该返回 4x4 全 0 数组', async () => {
      const { createEmptyGrid } = await import('../utils');

      const grid = createEmptyGrid();

      // 验证网格大小
      expect(grid).toHaveLength(4);
      grid.forEach(row => {
        expect(row).toHaveLength(4);
      });

      // 验证所有元素都是 0
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(0);
        });
      });
    });

    it('每次调用应该返回新的数组实例', async () => {
      const { createEmptyGrid } = await import('../utils');

      const grid1 = createEmptyGrid();
      const grid2 = createEmptyGrid();

      // 验证不是同一个引用
      expect(grid1).not.toBe(grid2);

      // 修改一个网格不应该影响另一个
      grid1[0][0] = 2;
      expect(grid2[0][0]).toBe(0);
    });
  });

  describe('createInitialGrid', () => {
    it('应该在两个不同位置生成 2 或 4', async () => {
      const { createInitialGrid } = await import('../utils');

      const grid = createInitialGrid();

      // 验证网格大小
      expect(grid).toHaveLength(4);
      grid.forEach(row => {
        expect(row).toHaveLength(4);
      });

      // 统计非零元素的数量
      let nonZeroCount = 0;
      const nonZeroPositions: [number, number][] = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (grid[row][col] !== 0) {
            nonZeroCount++;
            nonZeroPositions.push([row, col]);
          }
        }
      }

      // 应该恰好有两个非零元素
      expect(nonZeroCount).toBe(2);

      // 验证位置不同
      const [pos1, pos2] = nonZeroPositions;
      const positionsDifferent = pos1[0] !== pos2[0] || pos1[1] !== pos2[1];
      expect(positionsDifferent).toBe(true);

      // 验证值是 2 或 4
      expect([2, 4]).toContain(grid[pos1[0]][pos1[1]]);
      expect([2, 4]).toContain(grid[pos2[0]][pos2[1]]);
    });
  });

  describe('getEmptyCells', () => {
    it('应该返回所有值为 0 的坐标', async () => {
      const { getEmptyCells } = await import('../utils');

      const grid = [
        [0, 2, 0, 4],
        [2, 0, 0, 0],
        [0, 0, 2, 0],
        [4, 0, 0, 2]
      ];

      const emptyCells = getEmptyCells(grid);

      // 验证返回的空位数量
      expect(emptyCells).toHaveLength(10);

      // 验证一些已知空位
      expect(emptyCells).toContainEqual([0, 0]);
      expect(emptyCells).toContainEqual([0, 2]);
      expect(emptyCells).toContainEqual([1, 1]);
    });

    it('空网格应该返回所有位置', async () => {
      const { getEmptyCells } = await import('../utils');

      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const emptyCells = getEmptyCells(grid);

      // 应该返回所有 16 个位置
      expect(emptyCells).toHaveLength(16);
    });

    it('满网格应该返回空数组', async () => {
      const { getEmptyCells } = await import('../utils');

      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [8192, 16384, 32768, 65536]
      ];

      const emptyCells = getEmptyCells(grid);

      // 应该返回空数组
      expect(emptyCells).toHaveLength(0);
    });
  });

  describe('getRandomEmptyCell', () => {
    it('应该从空位数组中随机选择一个', async () => {
      const { getRandomEmptyCell } = await import('../utils');

      const emptyCells: [number, number][] = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1]
      ];

      const selected = getRandomEmptyCell(emptyCells);

      // 验证返回的位置在空位数组中
      expect(emptyCells).toContainEqual(selected!);
    });

    it('空数组应该返回 null', async () => {
      const { getRandomEmptyCell } = await import('../utils');

      const emptyCells: [number, number][] = [];

      const selected = getRandomEmptyCell(emptyCells);

      // 应该返回 null
      expect(selected).toBeNull();
    });

    it('单个元素数组应该返回该元素', async () => {
      const { getRandomEmptyCell } = await import('../utils');

      const emptyCells: [number, number][] = [[2, 3]];

      const selected = getRandomEmptyCell(emptyCells);

      // 应该返回唯一的位置
      expect(selected).toEqual([2, 3]);
    });
  });

  describe('generateRandomTile', () => {
    it('应该返回 2 或 4', async () => {
      const { generateRandomTile } = await import('../utils');

      const results = new Set();

      // 多次调用以覆盖两种情况
      for (let i = 0; i < 100; i++) {
        const tile = generateRandomTile();
        expect([2, 4]).toContain(tile);
        results.add(tile);
      }

      // 验证至少看到了 2（几乎确定）
      expect(results.has(2)).toBe(true);
    });

    it('2 的概率应该约为 90%，4 的概率约为 10%', async () => {
      const { generateRandomTile } = await import('../utils');

      const iterations = 1000;
      let count2 = 0;
      let count4 = 0;

      for (let i = 0; i < iterations; i++) {
        const tile = generateRandomTile();
        if (tile === 2) count2++;
        else if (tile === 4) count4++;
      }

      const ratio2 = count2 / iterations;
      const ratio4 = count4 / iterations;

      // 验证概率大致正确（允许 5% 的误差）
      expect(ratio2).toBeGreaterThan(0.85);
      expect(ratio2).toBeLessThan(0.95);
      expect(ratio4).toBeGreaterThan(0.05);
      expect(ratio4).toBeLessThan(0.15);
    });
  });

  describe('addRandomTile', () => {
    it('应该在指定位置设置随机值，返回新网格', async () => {
      const { addRandomTile } = await import('../utils');

      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const newGrid = addRandomTile(grid, [1, 2]);

      // 验证返回的是新网格
      expect(newGrid).not.toBe(grid);

      // 验证指定位置被修改
      expect([2, 4]).toContain(newGrid[1][2]);

      // 验证原网格未被修改
      expect(grid[1][2]).toBe(0);
    });

    it('应该只修改指定位置', async () => {
      const { addRandomTile } = await import('../utils');

      const grid = [
        [2, 4, 0, 8],
        [16, 0, 32, 64],
        [0, 128, 0, 256],
        [512, 0, 1024, 0]
      ];

      const newGrid = addRandomTile(grid, [0, 2]);

      // 验证其他位置未被修改
      expect(newGrid[0][0]).toBe(2);
      expect(newGrid[0][1]).toBe(4);
      expect(newGrid[0][3]).toBe(8);
      expect(newGrid[1][0]).toBe(16);
      expect(newGrid[1][2]).toBe(32);
      expect(newGrid[1][3]).toBe(64);
    });

    it('应该保持原网格不变', async () => {
      const { addRandomTile } = await import('../utils');

      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const originalGrid = JSON.stringify(grid);
      addRandomTile(grid, [1, 2]);

      // 验证原网格未被修改
      expect(JSON.stringify(grid)).toBe(originalGrid);
    });
  });
});
