import { defaultAppearance } from '../default'
import type { Appearance, Theme } from '../types'

const VAR_GROUPS = {
  colors: 'color',
  fonts: 'font',
  radius: 'radius',
  spacing: 'space'
}

function flatten(groups: { colors?: Record<string, string>, fonts?: Record<string, string>, radius?: string, spacing?: Record<string, string> }): Record<string, string> {
  const vars: Record<string, string> = {}

  for (const [group, prefix] of Object.entries(VAR_GROUPS)) {
    const value = groups[group as keyof typeof groups]
    if (value == null) continue

    if (typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        vars[`--${prefix}-${key}`] = String(item)
      }
    } else {
      vars[`--${prefix}`] = String(value)
    }
  }

  return vars
}

// Core data flow:
// defineTheme(tokens) -> normalized Theme -> compile Theme -> CSS variables / CSS text.
export function themeToVars(theme: Theme, mode: 'light' | 'dark' = 'light'): Record<string, string> {
  const { neutral, primarySource, ...colors } = theme[mode]

  return flatten({
    colors,
    fonts: theme.fonts,
    radius: theme.radius,
    spacing: theme.spacing
  })
}

export function themeToCss(theme: Theme, mode: 'light' | 'dark' = 'light', selector = ':root'): string {
  const body = Object.entries(themeToVars(theme, mode))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `${selector} {\n${body}\n}`
}

export function themeToAppearanceCss(theme: Theme, appearance: Appearance = defaultAppearance, selector = ':root'): string {
  if (appearance === 'light' || appearance === 'dark') {
    return `${themeToCss(theme, appearance, selector)}\n${selector} { color-scheme: ${appearance}; }`
  }

  return [
    themeToCss(theme, 'light', selector),
    `${selector} { color-scheme: light dark; }`,
    `@media (prefers-color-scheme: dark) {\n${themeToCss(theme, 'dark', selector)}\n}`
  ].join('\n')
}
