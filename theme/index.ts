import './init.css'

export {
  type Appearance,
  type Theme,
  type ThemeConfig,
  type ThemeState,
  type ThemeTokens,
  type ColorMode,
  type ColorValue,
} from './types'

export type {
  NeutralThemeVars
} from './types'

export {
  defaultAppearance,
  defaultTheme
} from './default'

export {
  defineTheme,
} from './defineTheme'

export {
  isHexColor,
  normalizeHexColor,
  createColorRamp,
  resolveColorRamp,
  resolveNeutralVars,
  getColorValue,
  getNeutralColorValue
} from './utils'

export {
  themeToVars,
  themeToCss,
  themeToAppearanceCss,
} from './compile'

export {
  primaryColors,
  neutralColors,
  radiusPresets,
  fontPresets,
  colorModes,
  colorMap,
  neutralColorMap
} from './presets'

export {
  generateThemeInitScript,
  resolveThemeConfig,
  resolveThemeState
} from './script'

export type { ThemeConfigValue, ThemesConfigValue } from './script'
export { exportThemeCss, exportVikeThemeConfig } from './export'
