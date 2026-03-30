import { test as base, expect } from '@playwright/test'
import { GamePage } from '../pages/game-page'

// 扩展 Playwright fixture，注入 GamePage 实例
export const test = base.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page)
    await gamePage.goto()
    await use(gamePage)
  },
})

export { expect }
