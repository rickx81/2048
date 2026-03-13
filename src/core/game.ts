/**
 * 游戏核心逻辑
 * 实现移动、合并、得分等核心游戏逻辑
 */

import type { Grid, Direction } from './types';
import {
  getEmptyCells,
  getRandomEmptyCell,
  addRandomTile,
  cloneGrid
} from './utils';

/**
 * 移动结果接口
 */
interface MoveResultInternal {
  newGrid: Grid;
  score: number;
  moved: boolean;
}

/**
 * 单行处理结果接口
 */
interface RowResult {
  newRow: number[];
  score: number;
}

/**
 * 单行向左滑动并合并
 * @param row 单行数组
 * @returns 新行和得分
 */
function slideRowLeft(row: number[]): RowResult {
  let score = 0;

  // 1. 移除所有 0
  const filtered = row.filter(val => val !== 0);

  // 2. 合并相邻相同数字（单次合并规则）
  const merged: number[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]!) {
      const mergedValue = filtered[i]! * 2;
      merged.push(mergedValue);
      score += mergedValue;
      i++; // 跳过下一个元素（已合并）
    } else {
      merged.push(filtered[i]!);
    }
  }

  // 3. 补齐 0 到长度 4
  const newRow = [...merged, ...Array(4 - merged.length).fill(0)];

  return { newRow, score };
}

/**
 * 单行向右滑动并合并
 * @param row 单行数组
 * @returns 新行和得分
 */
function slideRowRight(row: number[]): RowResult {
  // 反转行 → 向左处理 → 反转结果
  const reversed = [...row].reverse();
  const { newRow, score } = slideRowLeft(reversed);
  return { newRow: newRow.reverse(), score };
}

/**
 * 单列向上滑动并合并
 * @param col 单列数组
 * @returns 新列和得分
 */
function slideColumnUp(col: number[]): RowResult {
  // 列的向上移动与行的向左移动逻辑相同
  return slideRowLeft(col);
}

/**
 * 单列向下滑动并合并
 * @param col 单列数组
 * @returns 新列和得分
 */
function slideColumnDown(col: number[]): RowResult {
  // 反转列 → 向上处理 → 反转结果
  const reversed = [...col].reverse();
  const { newRow, score } = slideColumnUp(reversed);
  return { newRow: newRow.reverse(), score };
}

/**
 * 提取指定列
 * @param grid 游戏网格
 * @param colIndex 列索引
 * @returns 列数组
 */
function extractColumn(grid: Grid, colIndex: number): number[] {
  return grid.map(row => row[colIndex]!);
}

/**
 * 插入列到指定位置
 * @param grid 游戏网格
 * @param colIndex 列索引
 * @param column 列数组
 * @returns 新网格
 */
function insertColumn(grid: Grid, colIndex: number, column: number[]): Grid {
  const newGrid = cloneGrid(grid);
  for (let row = 0; row < 4; row++) {
    newGrid[row]![colIndex] = column[row]!;
  }
  return newGrid;
}

/**
 * 比较两个网格是否相同
 * @param grid1 第一个网格
 * @param grid2 第二个网格
 * @returns 是否相同
 */
function gridsEqual(grid1: Grid, grid2: Grid): boolean {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid1[row]![col] !== grid2[row]![col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 向左移动
 * @param grid 游戏网格
 * @returns 新网格、得分和是否移动
 */
export function moveLeft(grid: Grid): MoveResultInternal {
  const newGrid = cloneGrid(grid);
  let totalScore = 0;

  // 对每一行应用 slideRowLeft
  for (let row = 0; row < 4; row++) {
    const { newRow, score } = slideRowLeft(grid[row]!);
    newGrid[row] = newRow;
    totalScore += score;
  }

  const moved = !gridsEqual(grid, newGrid);

  return { newGrid, score: totalScore, moved };
}

/**
 * 向右移动
 * @param grid 游戏网格
 * @returns 新网格、得分和是否移动
 */
export function moveRight(grid: Grid): MoveResultInternal {
  const newGrid = cloneGrid(grid);
  let totalScore = 0;

  // 对每一行应用 slideRowRight
  for (let row = 0; row < 4; row++) {
    const { newRow, score } = slideRowRight(grid[row]!);
    newGrid[row] = newRow;
    totalScore += score;
  }

  const moved = !gridsEqual(grid, newGrid);

  return { newGrid, score: totalScore, moved };
}

/**
 * 向上移动
 * @param grid 游戏网格
 * @returns 新网格、得分和是否移动
 */
export function moveUp(grid: Grid): MoveResultInternal {
  let newGrid = cloneGrid(grid);
  let totalScore = 0;

  // 对每一列应用 slideColumnUp
  for (let col = 0; col < 4; col++) {
    const column = extractColumn(grid, col);
    const { newRow, score } = slideColumnUp(column);
    newGrid = insertColumn(newGrid, col, newRow);
    totalScore += score;
  }

  const moved = !gridsEqual(grid, newGrid);

  return { newGrid: newGrid, score: totalScore, moved };
}

/**
 * 向下移动
 * @param grid 游戏网格
 * @returns 新网格、得分和是否移动
 */
export function moveDown(grid: Grid): MoveResultInternal {
  let newGrid = cloneGrid(grid);
  let totalScore = 0;

  // 对每一列应用 slideColumnDown
  for (let col = 0; col < 4; col++) {
    const column = extractColumn(grid, col);
    const { newRow, score } = slideColumnDown(column);
    newGrid = insertColumn(newGrid, col, newRow);
    totalScore += score;
  }

  const moved = !gridsEqual(grid, newGrid);

  return { newGrid: newGrid, score: totalScore, moved };
}

/**
 * 导出移动结果接口
 */
export interface MoveResult {
  grid: Grid;
  score: number;
  moved: boolean;
}

/**
 * 根据方向执行移动
 * @param grid 游戏网格
 * @param direction 移动方向
 * @returns 移动结果
 */
export function move(grid: Grid, direction: Direction): MoveResult {
  let result: MoveResultInternal;

  // 根据方向调用对应的移动函数
  switch (direction) {
    case 'LEFT':
      result = moveLeft(grid);
      break;
    case 'RIGHT':
      result = moveRight(grid);
      break;
    case 'UP':
      result = moveUp(grid);
      break;
    case 'DOWN':
      result = moveDown(grid);
      break;
  }

  let finalGrid = result.newGrid;
  const emptyCells = getEmptyCells(finalGrid);

  // 特殊情况：空网格（初始化）
  if (emptyCells.length === 16) {
    // 空网格时生成两个数字
    const pos1 = getRandomEmptyCell(emptyCells)!;
    finalGrid = addRandomTile(finalGrid, pos1);

    const remainingCells = getEmptyCells(finalGrid);
    const pos2 = getRandomEmptyCell(remainingCells)!;
    finalGrid = addRandomTile(finalGrid, pos2);

    return {
      grid: finalGrid,
      score: 0,
      moved: false // 空网格移动不算有效移动
    };
  }

  // 如果移动有效且有空位，生成新数字
  if (result.moved && emptyCells.length > 0) {
    // 生成一个数字
    const pos = getRandomEmptyCell(emptyCells)!;
    finalGrid = addRandomTile(finalGrid, pos);
  }

  return {
    grid: finalGrid,
    score: result.score,
    moved: result.moved
  };
}

// ===== 游戏状态检测函数 =====

/**
 * 判断是否有空位
 * @param grid 游戏网格
 * @returns 是否有空位
 */
function hasEmptyCell(grid: Grid): boolean {
  // 短路求值：一旦发现空位立即返回
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row]![col] === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 判断是否可以合并（水平或垂直）
 * @param grid 游戏网格
 * @returns 是否可以合并
 */
function canMerge(grid: Grid): boolean {
  // 水平检查：遍历每一行，检查相邻元素是否相同
  // 短路求值：一旦发现可合并立即返回
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row]![col] !== 0 && grid[row]![col] === grid[row]![col + 1]) {
        return true;
      }
    }
  }

  // 垂直检查：遍历每一列，检查相邻元素是否相同
  // 短路求值：一旦发现可合并立即返回
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      if (grid[row]![col] !== 0 && grid[row]![col] === grid[row + 1]![col]) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 判断是否还有有效移动
 * @param grid 游戏网格
 * @returns 是否还有有效移动
 */
export function hasValidMoves(grid: Grid): boolean {
  // 短路求值：有空位则无需检查合并
  return hasEmptyCell(grid) || canMerge(grid);
}

/**
 * 判断游戏是否结束
 * @param grid 游戏网格
 * @returns 游戏是否结束
 */
export function isGameOver(grid: Grid): boolean {
  // 没有有效移动 = 游戏结束
  return !hasValidMoves(grid);
}

/**
 * 判断游戏是否胜利
 * @param grid 游戏网格
 * @returns 游戏是否胜利
 */
export function isGameWon(grid: Grid): boolean {
  // 使用 flat() 简化遍历，短路求值：一旦发现 2048 立即返回
  return grid.flat().some(cell => cell === 2048);
}
