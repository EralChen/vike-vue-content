// 类型导出
export type { Appearance, Theme, ThemeConfig, ThemeState, ThemeTokens, ColorMode, ColorValue } from './types'

// 常量导出
export {
  defaultTheme,
  primaryColors,
  neutralColors,
  radiusPresets,
  fontPresets,
  colorModes,
  colorMap,
  neutralColorMap,
  defineTheme,
  themeToVars,
  themeToCss,
  themeToAppearanceCss,
  isHexColor,
  normalizeHexColor,
  createColorRamp,
  resolveColorRamp,
  resolveNeutralVars,
  getColorValue,
  getNeutralColorValue
} from './constants'

export type { NeutralThemeVars } from './constants'

// 组合式函数导出
export { useTheme } from './useTheme'
export { useThemeStorage } from './useThemeStorage'

// 脚本生成导出
export { generateThemeInitScript } from './script'

// 互通导出
export { exportThemeCss, exportVikeThemeConfig } from './export'
