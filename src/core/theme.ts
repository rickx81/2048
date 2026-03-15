/**
 * 主题系统核心定义
 * 提供类型安全的主题配置和预设主题
 */

/**
 * 主题 ID 字面量类型
 * 所有可用主题的联合类型
 */
export type ThemeId = 'neon' | 'sky' | 'forest' | 'sunset' | 'sakura'

/**
 * 主题颜色配置接口
 * 定义主题的所有颜色属性
 */
export interface ThemeColors {
  // 基础颜色
  /** 主背景色 */
  bgPrimary: string
  /** 次背景色 */
  bgSecondary: string
  /** 主文字颜色 */
  textPrimary: string
  /** 次文字颜色 */
  textSecondary: string
  /** 边框颜色 */
  border: string
  /** 空格子颜色 */
  tileEmpty: string

  // 方块颜色（2-2048 的所有可能值）
  /** 方块颜色映射表 */
  tileColors: Record<number, string>

  // 特殊效果
  /** 渐变起始色（用于背景装饰） */
  gradientStart: string
  /** 渐变结束色（用于背景装饰） */
  gradientEnd: string
}

/**
 * 主题配置接口
 * 完整的主题定义
 */
export interface ThemeConfig {
  /** 主题 ID */
  id: ThemeId
  /** 主题显示名称 */
  displayName: string
  /** 主题颜色配置 */
  colors: ThemeColors
}

/**
 * 经典 2048 方块颜色（从 Tile.vue 提取）
 * 作为霓虹主题的方块颜色基准
 */
const CLASSIC_TILE_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
}

/**
 * 生成蓝色系方块颜色（用于天空主题）
 */
function createBlueTileColors(): Record<number, string> {
  return {
    2: '#bae6fd',
    4: '#7dd3fc',
    8: '#38bdf8',
    16: '#0ea5e9',
    32: '#0284c7',
    64: '#0369a1',
    128: '#075985',
    256: '#0c4a6e',
    512: '#082f49',
    1024: '#0c4a6e',
    2048: '#0e7490'
  }
}

/**
 * 生成绿色系方块颜色（用于森林主题）
 */
function createGreenTileColors(): Record<number, string> {
  return {
    2: '#dcfce7',
    4: '#bbf7d0',
    8: '#86efac',
    16: '#4ade80',
    32: '#22c55e',
    64: '#16a34a',
    128: '#15803d',
    256: '#166534',
    512: '#14532d',
    1024: '#166534',
    2048: '#15803d'
  }
}

/**
 * 生成橙色系方块颜色（用于日落主题）
 */
function createOrangeTileColors(): Record<number, string> {
  return {
    2: '#ffedd5',
    4: '#fed7aa',
    8: '#fdba74',
    16: '#fb923c',
    32: '#f97316',
    64: '#ea580c',
    128: '#c2410c',
    256: '#9a3412',
    512: '#7c2d12',
    1024: '#9a3412',
    2048: '#c2410c'
  }
}

/**
 * 生成粉色系方块颜色（用于樱花主题）
 */
function createPinkTileColors(): Record<number, string> {
  return {
    2: '#fce7f3',
    4: '#fbcfe8',
    8: '#f9a8d4',
    16: '#f472b6',
    32: '#ec4899',
    64: '#db2777',
    128: '#be185d',
    256: '#9d174d',
    512: '#831843',
    1024: '#9d174d',
    2048: '#be185d'
  }
}

/**
 * 所有主题配置对象
 * 使用 Record 类型确保类型安全
 */
export const THEMES: Record<ThemeId, ThemeConfig> = {
  /**
   * 经典主题
   * 经典 2048 配色：米黄色背景 + 深色文字 + 经典方块颜色
   */
  neon: {
    id: 'neon',
    displayName: '经典主题',
    colors: {
      bgPrimary: '#faf8ef',
      bgSecondary: '#bbada0',
      textPrimary: '#776e65',
      textSecondary: '#776e65',
      border: '#bbada0',
      tileEmpty: '#cdc1b4',
      tileColors: CLASSIC_TILE_COLORS,
      gradientStart: '#faf8ef',
      gradientEnd: '#eee4da'
    }
  },

  /**
   * 天空蓝主题
   * 清新的蓝色系主题，明亮的天空背景
   */
  sky: {
    id: 'sky',
    displayName: '天空蓝',
    colors: {
      bgPrimary: '#e0f2fe',
      bgSecondary: '#bae6fd',
      textPrimary: '#0c4a6e',
      textSecondary: '#075985',
      border: '#7dd3fc',
      tileEmpty: '#bae6fd',
      tileColors: createBlueTileColors(),
      gradientStart: '#0284c7',
      gradientEnd: '#0c4a6e'
    }
  },

  /**
   * 森林绿主题
   * 自然的绿色系主题，清新的森林氛围
   */
  forest: {
    id: 'forest',
    displayName: '森林绿',
    colors: {
      bgPrimary: '#dcfce7',
      bgSecondary: '#bbf7d0',
      textPrimary: '#14532d',
      textSecondary: '#166534',
      border: '#86efac',
      tileEmpty: '#bbf7d0',
      tileColors: createGreenTileColors(),
      gradientStart: '#16a34a',
      gradientEnd: '#14532d'
    }
  },

  /**
   * 日落橙主题
   * 温暖的橙色系主题，绚丽的日落氛围
   */
  sunset: {
    id: 'sunset',
    displayName: '日落橙',
    colors: {
      bgPrimary: '#ffedd5',
      bgSecondary: '#fed7aa',
      textPrimary: '#7c2d12',
      textSecondary: '#9a3412',
      border: '#fdba74',
      tileEmpty: '#fed7aa',
      tileColors: createOrangeTileColors(),
      gradientStart: '#ea580c',
      gradientEnd: '#7c2d12'
    }
  },

  /**
   * 樱花粉主题
   * 优雅的粉色系主题，浪漫的樱花氛围
   */
  sakura: {
    id: 'sakura',
    displayName: '樱花粉',
    colors: {
      bgPrimary: '#fce7f3',
      bgSecondary: '#fbcfe8',
      textPrimary: '#831843',
      textSecondary: '#9d174d',
      border: '#f9a8d4',
      tileEmpty: '#fbcfe8',
      tileColors: createPinkTileColors(),
      gradientStart: '#db2777',
      gradientEnd: '#831843'
    }
  }
}
