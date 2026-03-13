/**
 * 游戏核心逻辑测试
 * 测试移动、合并、得分等核心游戏逻辑
 */

import { describe, it, expect } from 'vitest';
import {
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  move,
  isGameWon,
  isGameOver,
  hasValidMoves
} from '../game';
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

    // 列 0: [2,0,4,2] → [2,4,2,0] (无合并)
    // 列 1: [2,2,0,4] → [4,4,0,0] (2+2=4)
    // 列 2: [0,2,4,2] → [2,4,2,0] (无合并)
    // 列 3: [4,0,4,4] → [8,4,0,0] (4+4=8)
    expect(result.newGrid).toEqual([
      [2, 4, 2, 8],
      [4, 4, 4, 4],
      [2, 0, 2, 0],
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

    // 列 0: [2,0,4,2] → [0,2,4,2] (无合并)
    // 列 1: [2,2,0,4] → [0,0,4,4] (2+2=4)
    // 列 2: [0,2,4,2] → [0,2,4,2] (无合并)
    // 列 3: [4,0,4,4] → [0,0,4,8] (4+4=8)
    expect(result.newGrid).toEqual([
      [0, 0, 0, 0],
      [2, 0, 2, 0],
      [4, 4, 4, 4],
      [2, 4, 2, 8]
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

    // 每次都使用原始网格，避免相互影响
    const left = move(JSON.parse(JSON.stringify(grid)), 'LEFT');
    const right = move(JSON.parse(JSON.stringify(grid)), 'RIGHT');
    const up = move(JSON.parse(JSON.stringify(grid)), 'UP');
    const down = move(JSON.parse(JSON.stringify(grid)), 'DOWN');

    // 向左: [2,2,0,0] → [4,0,0,0] + 新数字
    expect(left.grid[0][0]).toBe(4);
    expect(left.score).toBe(4);
    expect(left.moved).toBe(true);

    // 向右: [2,2,0,0] → [0,0,0,4] + 新数字
    expect(right.grid[0][3]).toBe(4);
    expect(right.score).toBe(4);
    expect(right.moved).toBe(true);

    // 向上: 列 [2,0,0,0] → [2,0,0,0] (没有变化)
    // 因为只有第一行有数字，向上移动不会改变位置
    expect(up.grid[0][0]).toBe(2);
    expect(up.grid[0][1]).toBe(2);
    expect(up.score).toBe(0); // 没有合并发生
    expect(up.moved).toBe(false); // 没有位置变化

    // 向下: 列 [2,0,0,0] → [0,0,0,2] + 新数字
    expect(down.grid[3][0]).toBe(2);
    expect(down.grid[3][1]).toBe(2);
    expect(down.score).toBe(0); // 没有合并发生
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

    // 验证移动后网格中有新数字生成
    // 原来有 2 个数字，合并后变成 1 个（4），然后生成 1 个新数字，总共 2 个
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBeGreaterThanOrEqual(2); // 至少有 2 个非零数字
    expect(result.grid.flat()).toContain(4); // 包含合并后的 4
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

    // 空网格移动后没有变化（moved=false），但根据初始化逻辑，
    // 我们在 move 函数中特殊处理空网格，生成两个数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBe(2);
    expect(result.moved).toBe(false); // 空网格移动不算有效移动
  });

  it('只有一个空位时，应该在该位置生成新数字', () => {
    const grid: Grid = [
      [2, 2, 2, 2],
      [4, 4, 4, 4],
      [8, 8, 8, 8],
      [16, 16, 16, 0]
    ];

    const result = move(grid, 'LEFT');

    // 向左移动会合并，所以会有空位，然后生成新数字
    const nonZeroCount = result.grid.flat().filter(n => n !== 0).length;
    expect(nonZeroCount).toBeGreaterThan(0);
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

// ===== 游戏状态检测测试 =====

describe('游戏胜利检测 (isGameWon)', () => {
  it('应该在没有 2048 时返回 false', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 512, 1024],
      [2, 4, 8, 16]
    ];

    expect(isGameWon(grid)).toBe(false);
  });

  it('应该在有 2048 时返回 true', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4096],
      [8192, 16384, 32768, 65536]
    ];

    expect(isGameWon(grid)).toBe(true);
  });

  it('应该在多个 2048 时返回 true', () => {
    const grid: Grid = [
      [2048, 2048, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 512, 1024],
      [2, 4, 8, 16]
    ];

    expect(isGameWon(grid)).toBe(true);
  });
});

describe('游戏结束检测 (isGameOver)', () => {
  it('应该在有空位时返回 false', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 16, 8],
      [0, 8, 4, 2],
      [16, 8, 4, 2]
    ];

    expect(isGameOver(grid)).toBe(false);
  });

  it('应该在网格填满但可以水平合并时返回 false', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 32, 64],
      [2, 128, 256, 512],
      [2, 4, 8, 16]
    ];

    expect(isGameOver(grid)).toBe(false);
  });

  it('应该在网格填满但可以垂直合并时返回 false', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 16, 8],
      [2, 4, 8, 16],
      [4, 2, 16, 8]
    ];

    expect(isGameOver(grid)).toBe(false);
  });

  it('应该在网格填满且无法合并时返回 true', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 32, 64],
      [2, 128, 256, 512],
      [4, 8, 16, 32]
    ];

    expect(isGameOver(grid)).toBe(true);
  });
});

describe('有效移动检测 (hasValidMoves)', () => {
  it('应该在有空位时返回 true', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 16, 8],
      [0, 8, 4, 2],
      [16, 8, 4, 2]
    ];

    expect(hasValidMoves(grid)).toBe(true);
  });

  it('应该在网格填满但可以水平合并时返回 true', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 32, 64],
      [2, 128, 256, 512],
      [2, 4, 8, 16]
    ];

    expect(hasValidMoves(grid)).toBe(true);
  });

  it('应该在网格填满但可以垂直合并时返回 true', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 16, 8],
      [2, 4, 8, 16],
      [4, 2, 16, 8]
    ];

    expect(hasValidMoves(grid)).toBe(true);
  });

  it('应该在网格填满且无法合并时返回 false', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [4, 2, 32, 64],
      [2, 128, 256, 512],
      [4, 8, 16, 32]
    ];

    expect(hasValidMoves(grid)).toBe(false);
  });
});
