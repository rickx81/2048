/**
 * 游戏核心逻辑测试
 * 测试移动、合并、得分等核心游戏逻辑
 */

import { describe, it, expect } from 'vitest';
import { moveLeft, moveRight, moveUp, moveDown, move } from '../game';
import type { Grid } from '../types';

describe('单行向左移动和合并', () => {
  it('应该将 [2, 0, 2, 4] 合并为 [4, 4, 0, 0]，得分 4', () => {
    const grid: Grid = [
      [2, 0, 2, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [4, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(4);
    expect(result.moved).toBe(true);
  });

  it('应该将 [2, 2, 2, 2] 合并为 [4, 4, 0, 0]，得分 8', () => {
    const grid: Grid = [
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [4, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(8);
    expect(result.moved).toBe(true);
  });

  it('不应该合并 [2, 4, 2, 4]，保持不变', () => {
    const grid: Grid = [
      [2, 4, 2, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [2, 4, 2, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(0);
    expect(result.moved).toBe(false);
  });

  it('应该将 [4, 4, 4, 4] 合并为 [8, 8, 0, 0]，得分 16', () => {
    const grid: Grid = [
      [4, 4, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [8, 8, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(16);
    expect(result.moved).toBe(true);
  });

  it('应该将 [0, 2, 0, 2] 合并为 [4, 0, 0, 0]，得分 4', () => {
    const grid: Grid = [
      [0, 2, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(4);
    expect(result.moved).toBe(true);
  });

  it('应该将 [0, 0, 2, 4] 滑动为 [2, 4, 0, 0]', () => {
    const grid: Grid = [
      [0, 0, 2, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(0);
    expect(result.moved).toBe(true);
  });

  it('全空网格应该保持不变', () => {
    const grid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(0);
    expect(result.moved).toBe(false);
  });

  it('全满且无法合并的网格应该保持不变', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(0);
    expect(result.moved).toBe(false);
  });

  it('应该遵循单次合并规则：[2, 2, 4, 4] → [4, 8, 0, 0]', () => {
    const grid: Grid = [
      [2, 2, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [4, 8, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(12);
    expect(result.moved).toBe(true);
  });
});

describe('向左移动完整网格', () => {
  it('应该正确处理多行移动', () => {
    const grid: Grid = [
      [2, 2, 0, 4],
      [0, 2, 2, 0],
      [4, 0, 4, 4],
      [2, 4, 2, 4]
    ];
    const result = moveLeft(grid);

    expect(result.newGrid).toEqual([
      [4, 4, 0, 0],
      [4, 0, 0, 0],
      [8, 4, 0, 0],
      [2, 4, 2, 4]
    ]);
    expect(result.score).toBe(16);
    expect(result.moved).toBe(true);
  });
});

describe('向右移动和合并', () => {
  it('应该将 [2, 2, 0, 4] 向右移动为 [0, 0, 4, 4]', () => {
    const grid: Grid = [
      [2, 2, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const result = moveRight(grid);

    expect(result.newGrid).toEqual([
      [0, 0, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(4);
    expect(result.moved).toBe(true);
  });

  it('应该正确处理完整网格向右移动', () => {
    const grid: Grid = [
      [2, 2, 0, 4],
      [0, 2, 2, 0],
      [4, 0, 4, 4],
      [2, 4, 2, 4]
    ];
    const result = moveRight(grid);

    expect(result.newGrid).toEqual([
      [0, 0, 4, 4],
      [0, 0, 0, 4],
      [0, 0, 4, 8],
      [2, 4, 2, 4]
    ]);
    expect(result.score).toBe(16);
    expect(result.moved).toBe(true);
  });
});

describe('向上移动和合并', () => {
  it('应该正确处理完整网格向上移动', () => {
    const grid: Grid = [
      [2, 2, 0, 4],
      [0, 2, 2, 0],
      [4, 0, 4, 4],
      [2, 4, 2, 4]
    ];
    const result = moveUp(grid);

    expect(result.newGrid).toEqual([
      [2, 4, 2, 4],
      [4, 2, 4, 8],
      [2, 4, 4, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(12);
    expect(result.moved).toBe(true);
  });

  it('应该将列向上移动和合并', () => {
    const grid: Grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0]
    ];
    const result = moveUp(grid);

    expect(result.newGrid).toEqual([
      [4, 0, 0, 0],
      [8, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.score).toBe(12);
    expect(result.moved).toBe(true);
  });
});

describe('向下移动和合并', () => {
  it('应该正确处理完整网格向下移动', () => {
    const grid: Grid = [
      [2, 2, 0, 4],
      [0, 2, 2, 0],
      [4, 0, 4, 4],
      [2, 4, 2, 4]
    ];
    const result = moveDown(grid);

    expect(result.newGrid).toEqual([
      [0, 0, 2, 0],
      [2, 4, 4, 4],
      [4, 2, 2, 8],
      [2, 0, 0, 0]
    ]);
    expect(result.score).toBe(12);
    expect(result.moved).toBe(true);
  });

  it('应该将列向下移动和合并', () => {
    const grid: Grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0]
    ];
    const result = moveDown(grid);

    expect(result.newGrid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [8, 0, 0, 0]
    ]);
    expect(result.score).toBe(12);
    expect(result.moved).toBe(true);
  });
});

describe('move 函数 - 通用移动接口', () => {
  it('应该支持所有四个方向', () => {
    const grid: Grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const left = move(grid, 'LEFT');
    const right = move(grid, 'RIGHT');
    const up = move(grid, 'UP');
    const down = move(grid, 'DOWN');

    expect(left.grid).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(left.score).toBe(4);
    expect(left.moved).toBe(true);

    expect(right.grid).toEqual([
      [0, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(right.score).toBe(4);
    expect(right.moved).toBe(true);

    expect(up.grid).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(up.score).toBe(4);
    expect(up.moved).toBe(true);

    expect(down.grid).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0]
    ]);
    expect(down.score).toBe(4);
    expect(down.moved).toBe(true);
  });

  it('有效移动后应该生成新数字', () => {
    const grid: Grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const result = move(grid, 'LEFT');

    // 验证移动后网格中至少有一个新数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBeGreaterThan(2); // 原来有 2 个数字，移动后应该有 3 个（合并后 1 个 + 新生成 1 个）
  });

  it('无效移动不应该生成新数字', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const result = move(grid, 'LEFT');

    // 验证网格没有变化
    expect(result.grid).toEqual(grid);
    expect(result.score).toBe(0);
    expect(result.moved).toBe(false);

    // 验证没有生成新数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBe(4);
  });
});

describe('边界情况', () => {
  it('空网格移动后应该生成两个数字（初始化）', () => {
    const grid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const result = move(grid, 'LEFT');

    // 验证生成了两个数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBe(2);
  });

  it('只有一个空位时，应该在该位置生成新数字', () => {
    const grid: Grid = [
      [2, 2, 2, 2],
      [4, 4, 4, 4],
      [8, 8, 8, 8],
      [16, 16, 16, 0]
    ];

    const result = move(grid, 'LEFT');

    // 验证最后一个位置被填充
    expect(result.grid[3][3]).not.toBe(0);
    expect(result.grid[3][3]).toBeGreaterThanOrEqual(2);
    expect(result.grid[3][3]).toBeLessThanOrEqual(4);
  });

  it('全满但可以合并的网格应该移动并生成新数字', () => {
    const grid: Grid = [
      [2, 2, 2, 2],
      [2, 2, 2, 2],
      [2, 2, 2, 2],
      [2, 2, 2, 2]
    ];

    const result = move(grid, 'LEFT');

    // 验证发生了移动
    expect(result.moved).toBe(true);
    expect(result.score).toBeGreaterThan(0);

    // 验证生成了新数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBeGreaterThan(0);
  });
});

describe('不可变性', () => {
  it('不应该修改原始网格', () => {
    const grid: Grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const originalGrid = JSON.parse(JSON.stringify(grid));

    moveLeft(grid);

    expect(grid).toEqual(originalGrid);
  });

  it('所有移动函数都应该返回新网格', () => {
    const grid: Grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const originalGrid = JSON.parse(JSON.stringify(grid));

    moveLeft(grid);
    moveRight(grid);
    moveUp(grid);
    moveDown(grid);

    expect(grid).toEqual(originalGrid);
  });
});
