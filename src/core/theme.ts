/**
 * 主题系统核心定义
 * 提供类型安全的主题配置和预设主题
 */

/**
 * 主题 ID 字面量类型
 * 所有可用主题的联合类型
 */
export type ThemeId = 'classic' | 'sky' | 'forest' | 'sunset' | 'sakura'

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
  /** 方块浅色文字（用于深色背景方块，如 8+） */
  tileTextLight: string
  /** 方块深色文字（用于浅色背景方块，如 2, 4） */
  tileTextDark: string

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
    2: '#7dd3fc',
    4: '#38bdf8',
    8: '#0ea5e9',
    16: '#0284c7',
    32: '#0369a1',
    64: '#075985',
    128: '#0c4a6e',
    256: '#082f49',
    512: '#0c4a6e',
    1024: '#0e7490',
    2048: '#0284c7'
  }
}

/**
 * 生成绿色系方块颜色（用于森林主题）
 */
function createGreenTileColors(): Record<number, string> {
  return {
    2: '#86efac',
    4: '#4ade80',
    8: '#22c55e',
    16: '#16a34a',
    32: '#15803d',
    64: '#166534',
    128: '#14532d',
    256: '#14532d',
    512: '#166534',
    1024: '#15803d',
    2048: '#166534'
  }
}

/**
 * 生成橙色系方块颜色（用于日落主题）
 */
function createOrangeTileColors(): Record<number, string> {
  return {
    2: '#fdba74',
    4: '#fb923c',
    8: '#f97316',
    16: '#ea580c',
    32: '#c2410c',
    64: '#9a3412',
    128: '#7c2d12',
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
    2: '#f9a8d4',
    4: '#f472b6',
    8: '#ec4899',
    16: '#db2777',
    32: '#be185d',
    64: '#9d174d',
    128: '#831843',
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
  classic: {
    id: 'classic',
    displayName: '经典主题',
    colors: {
      bgPrimary: '#faf8ef',
      bgSecondary: '#bbada0',
      textPrimary: '#776e65',
      textSecondary: '#776e65',
      border: '#bbada0',
      tileEmpty: '#cdc1b4',
      tileColors: CLASSIC_TILE_COLORS,
      tileTextLight: '#f9f6f2',
      tileTextDark: '#776e65',
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
      tileEmpty: '#e0f2fe',
      tileColors: createBlueTileColors(),
      tileTextLight: '#f0f9ff',
      tileTextDark: '#0c4a6e',
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
      tileEmpty: '#dcfce7',
      tileColors: createGreenTileColors(),
      tileTextLight: '#f0fdf4',
      tileTextDark: '#14532d',
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
      tileEmpty: '#ffedd5',
      tileColors: createOrangeTileColors(),
      tileTextLight: '#fff7ed',
      tileTextDark: '#7c2d12',
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
      tileEmpty: '#fce7f3',
      tileColors: createPinkTileColors(),
      tileTextLight: '#fdf2f8',
      tileTextDark: '#831843',
      gradientStart: '#db2777',
      gradientEnd: '#831843'
    }
  }
}
