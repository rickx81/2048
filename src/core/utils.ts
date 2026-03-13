/**
 * 游戏工具函数
 * 提供网格创建、空位查找、随机生成等工具函数
 */

import type { Grid } from './types';

/**
 * 创建空的 4x4 游戏网格
 * @returns 4x4 全 0 数组，0 表示空位
 */
export function createEmptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

/**
 * 创建初始游戏网格
 * 在两个不同空位生成数字（2 或 4）
 * @returns 包含两个初始数字的网格
 */
export function createInitialGrid(): Grid {
  const grid = createEmptyGrid();
  const emptyCells = getEmptyCells(grid);

  // 在第一个空位生成数字
  if (emptyCells.length > 0) {
    const pos1 = getRandomEmptyCell(emptyCells)!;
    addRandomTileInPlace(grid, pos1);

    // 更新空位列表，在第二个空位生成数字
    const remainingCells = getEmptyCells(grid);
    if (remainingCells.length > 0) {
      const pos2 = getRandomEmptyCell(remainingCells)!;
      addRandomTileInPlace(grid, pos2);
    }
  }

  return grid;
}

/**
 * 获取网格中所有空位的坐标
 * @param grid 游戏网格
 * @returns 空位坐标数组 [row, col]
 */
export function getEmptyCells(grid: Grid): [number, number][] {
  const emptyCells: [number, number][] = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  return emptyCells;
}

/**
 * 从空位数组中随机选择一个
 * @param emptyCells 空位坐标数组
 * @returns 随机选择的空位坐标，如果数组为空则返回 null
 */
export function getRandomEmptyCell(emptyCells: [number, number][]): [number, number] | null {
  if (emptyCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

/**
 * 生成随机数字（2 或 4）
 * 90% 概率返回 2，10% 概率返回 4
 * @returns 随机数字 2 或 4
 */
export function generateRandomTile(): number {
  return Math.random() < 0.9 ? 2 : 4;
}

/**
 * 在指定位置添加随机数字（不可变操作）
 * 创建网格深拷贝，修改后返回新网格
 * @param grid 原始网格
 * @param position 位置坐标 [row, col]
 * @returns 新网格，指定位置包含随机数字
 */
export function addRandomTile(grid: Grid, position: [number, number]): Grid {
  const [row, col] = position;
  const newGrid = cloneGrid(grid);
  newGrid[row][col] = generateRandomTile();
  return newGrid;
}

/**
 * 在指定位置添加随机数字（原地修改）
 * 这是一个内部辅助函数，用于 createInitialGrid
 * @param grid 游戏网格
 * @param position 位置坐标 [row, col]
 */
function addRandomTileInPlace(grid: Grid, position: [number, number]): void {
  const [row, col] = position;
  grid[row][col] = generateRandomTile();
}

/**
 * 深拷贝游戏网格
 * @param grid 原始网格
 * @returns 网格的深拷贝
 */
function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}
