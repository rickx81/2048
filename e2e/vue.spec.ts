import { test, expect } from './fixtures/game-fixtures'

test.describe('游戏基础功能', () => {
  test('页面加载后显示游戏界面', async ({ gamePage }) => {
    // 验证核心元素可见
    await expect(gamePage.gameContainer).toBeVisible()
    await expect(gamePage.gameBoard).toBeVisible()
    await expect(gamePage.scoreValue).toBeVisible()
    await expect(gamePage.highScoreValue).toBeVisible()
  })

  test('游戏初始化时有 2 个方块', async ({ gamePage }) => {
    const tileCount = await gamePage.getNonZeroTileCount()
    expect(tileCount).toBe(2)
  })

  test('初始分数为 0', async ({ gamePage }) => {
    const score = await gamePage.getScore()
    expect(score).toBe(0)
  })

  test('新游戏按钮可以重置游戏', async ({ gamePage }) => {
    // 先做一次移动
    await gamePage.pressKey('ArrowRight')
    // 点击新游戏
    await gamePage.clickNewGame()
    // 验证分数重置
    const score = await gamePage.getScore()
    expect(score).toBe(0)
    // 验证只有 2 个方块
    const tileCount = await gamePage.getNonZeroTileCount()
    expect(tileCount).toBe(2)
  })
})
