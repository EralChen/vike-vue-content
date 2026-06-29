import './init.css'

export {
  type Appearance,
  type Theme,
  type ThemeConfig,
  type ThemeState,
  type ThemeTokens,
  type ColorMode,
  type ColorValue,
  type NeutralThemeVars,
  defaultAppearance,
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
} from './core'

export {
  generateThemeInitScript,
  resolveThemeConfig,
  resolveThemeState
} from './script'

export type { ThemeConfigValue, ThemesConfigValue } from './script'
export { exportThemeCss, exportVikeThemeConfig } from './export'
