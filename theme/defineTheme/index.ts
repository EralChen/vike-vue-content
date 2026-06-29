
import type { Theme, ThemeTokens } from '../types'
import { expandModeTokens } from '../utils'

// Theme definition flow:
// raw tokens -> resolve named/hex ramps -> expand mode tokens -> normalized Theme object.
export function defineTheme(tokens: ThemeTokens = {}): Theme {
  const { name = 'theme', fonts = {}, radius, spacing = {}, light, dark, colors } = tokens
  const lightTokens = light || colors || {}
  const darkTokens = dark || colors || lightTokens

  return {
    name,
    fonts,
    radius,
    spacing,
    light: expandModeTokens(lightTokens),
    dark: expandModeTokens(darkTokens, true)
  }
}
