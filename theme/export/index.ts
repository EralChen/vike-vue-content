import {
  defaultAppearance
} from '../default'
import { defineTheme } from '../defineTheme'
import { themeToAppearanceCss } from '../compile'
import type { Appearance, Theme, ThemeTokens } from '../types'

function cleanModeTokens(tokens: Record<string, string>): Record<string, string> {
  const { primarySource, neutral, ...cleaned } = tokens
  return cleaned
}

function cleanTheme(theme: Theme): Theme {
  return {
    ...theme,
    light: cleanModeTokens(theme.light),
    dark: cleanModeTokens(theme.dark)
  }
}

export function exportThemeCss(theme: Theme | ThemeTokens, appearance: Appearance = defaultAppearance, selector = ':root'): string {
  return themeToAppearanceCss(defineTheme(theme), appearance, selector)
}

export function exportVikeThemeConfig(theme: Theme | ThemeTokens): string {
  return JSON.stringify(cleanTheme(defineTheme(theme)), null, 2)
}
