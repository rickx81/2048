import type { Page, Locator } from '@playwright/test'

/**
 * Page Object Model - 游戏页面交互封装
 * 封装所有与游戏页面相关的交互操作
 */
export class GamePage {
  readonly page: Page

  // 核心元素定位器
  readonly gameContainer: Locator
  readonly gameBoard: Locator
  readonly scoreValue: Locator
  readonly highScoreValue: Locator
  readonly undoBtn: Locator
  readonly newGameBtn: Locator
  readonly gameOverOverlay: Locator
  readonly gameWonOverlay: Locator
  readonly retryBtn: Locator
  readonly continueBtn: Locator
  readonly newGameBtnOverlay: Locator

  constructor(page: Page) {
    this.page = page
    // 使用 data-testid 定位器
    this.gameContainer = page.getByTestId('game-container')
    this.gameBoard = page.getByTestId('game-board')
    this.scoreValue = page.getByTestId('score')
    this.highScoreValue = page.getByTestId('high-score')
    this.undoBtn = page.getByTestId('undo-btn')
    this.newGameBtn = page.getByTestId('new-game-btn')
    this.gameOverOverlay = page.getByTestId('game-over-overlay')
    this.gameWonOverlay = page.getByTestId('game-won-overlay')
    this.retryBtn = page.getByTestId('retry-btn')
    this.continueBtn = page.getByTestId('continue-btn')
    this.newGameBtnOverlay = page.getByTestId('new-game-btn-overlay')
  }

  // 导航方法
  async goto() {
    await this.page.goto('/')
  }

  // 获取指定位置的 tile
  getTile(row: number, col: number): Locator {
    return this.page.getByTestId('tile').filter({ has: this.page.locator(`[data-row="${row}"][data-col="${col}"]`) })
  }

  // 获取 tile 的值
  async getTileValue(row: number, col: number): Promise<number> {
    const tile = this.page.locator(`[data-testid="tile"][data-row="${row}"][data-col="${col}"]`)
    const value = await tile.getAttribute('data-value')
    return Number(value)
  }

  // 获取当前分数
  async getScore(): Promise<number> {
    const text = await this.scoreValue.textContent()
    return Number(text)
  }

  // 获取最高分
  async getHighScore(): Promise<number> {
    const text = await this.highScoreValue.textContent()
    return Number(text)
  }

  // 键盘操作
  async pressKey(direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
    await this.page.keyboard.press(direction)
  }

  // 触摸滑动操作
  async swipe(direction: 'up' | 'down' | 'left' | 'right', distance = 100) {
    const board = this.gameBoard
    const box = await board.boundingBox()
    if (!box) throw new Error('Game board not found')

    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    const moves = {
      up: { startX: centerX, startY: centerY + distance / 2, endX: centerX, endY: centerY - distance / 2 },
      down: { startX: centerX, startY: centerY - distance / 2, endX: centerX, endY: centerY + distance / 2 },
      left: { startX: centerX + distance / 2, startY: centerY, endX: centerX - distance / 2, endY: centerY },
      right: { startX: centerX - distance / 2, startY: centerY, endX: centerX + distance / 2, endY: centerY },
    }

    const move = moves[direction]
    // 使用 mouse 模拟滑动（mouse API 更稳定）
    await this.page.mouse.move(move.startX, move.startY)
    await this.page.mouse.down()
    await this.page.mouse.move(move.endX, move.endY, { steps: 5 })
    await this.page.mouse.up()
  }

  // UI 操作
  async clickUndo() {
    await this.undoBtn.click()
  }

  async clickNewGame() {
    await this.newGameBtn.click()
  }

  async clickRetry() {
    await this.retryBtn.click()
  }

  async clickContinue() {
    await this.continueBtn.click()
  }

  // 状态检查
  async isGameOverVisible(): Promise<boolean> {
    return this.gameOverOverlay.isVisible().catch(() => false)
  }

  async isGameWonVisible(): Promise<boolean> {
    return this.gameWonOverlay.isVisible().catch(() => false)
  }

  // 获取棋盘上所有非零 tile 的数量
  async getNonZeroTileCount(): Promise<number> {
    let count = 0
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = await this.getTileValue(row, col)
        if (value > 0) count++
      }
    }
    return count
  }

  // 获取完整棋盘状态
  async getGridState(): Promise<number[][]> {
    const grid: number[][] = []
    for (let row = 0; row < 4; row++) {
      const rowData: number[] = []
      for (let col = 0; col < 4; col++) {
        rowData.push(await this.getTileValue(row, col))
      }
      grid.push(rowData)
    }
    return grid
  }
}
