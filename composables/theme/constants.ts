import chroma from 'chroma-js'
import type { Appearance, ColorValue, Theme, ThemeConfig, ThemeTokens } from './types'

export interface NeutralThemeVars {
  muted: string
  mutedLight: string
  mutedDark: string
  bg: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  textDimmed: string
  border: string
  borderMuted: string
}

// 主色调预设
export const primaryColors = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
]

// 中性色预设
export const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']

// 圆角预设
export const radiusPresets = [0, 0.125, 0.25, 0.375, 0.5]

// 字体预设
export const fontPresets = [
  'Inter',
  'system-ui',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Outfit',
  'Raleway'
]

// 颜色模式预设
export const colorModes = [
  { label: 'light' as const, icon: '☀️' },
  { label: 'dark' as const, icon: '🌙' },
  { label: 'system' as const, icon: '💻' }
]

// 主色调映射表
export const colorMap: Record<string, ColorValue> = {
  red:     { 500: '#ef4444', 400: '#f87171', 600: '#dc2626' },
  orange:  { 500: '#f97316', 400: '#fb923c', 600: '#ea580c' },
  amber:   { 500: '#f59e0b', 400: '#fbbf24', 600: '#d97706' },
  yellow:  { 500: '#eab308', 400: '#facc15', 600: '#ca8a04' },
  lime:    { 500: '#84cc16', 400: '#a3e635', 600: '#65a30d' },
  green:   { 500: '#22c55e', 400: '#4ade80', 600: '#16a34a' },
  emerald: { 500: '#10b981', 400: '#34d399', 600: '#059669' },
  teal:    { 500: '#14b8a6', 400: '#2dd4bf', 600: '#0d9488' },
  cyan:    { 500: '#06b6d4', 400: '#22d3ee', 600: '#0891b2' },
  sky:     { 500: '#0ea5e9', 400: '#38bdf8', 600: '#0284c7' },
  blue:    { 500: '#3b82f6', 400: '#60a5fa', 600: '#2563eb' },
  indigo:  { 500: '#6366f1', 400: '#818cf8', 600: '#4f46e5' },
  violet:  { 500: '#8b5cf6', 400: '#a78bfa', 600: '#7c3aed' },
  purple:  { 500: '#a855f7', 400: '#c084fc', 600: '#9333ea' },
  fuchsia: { 500: '#d946ef', 400: '#e879f9', 600: '#c026d3' },
  pink:    { 500: '#ec4899', 400: '#f472b6', 600: '#db2777' },
  rose:    { 500: '#f43f5e', 400: '#fb7185', 600: '#e11d48' },
}

// 中性色映射表
export const neutralColorMap: Record<string, ColorValue> = {
  slate:   { 500: '#64748b', 400: '#94a3b8', 600: '#475569' },
  gray:    { 500: '#6b7280', 400: '#9ca3af', 600: '#4b5563' },
  zinc:    { 500: '#71717a', 400: '#a1a1aa', 600: '#52525b' },
  neutral: { 500: '#737373', 400: '#a3a3a3', 600: '#525252' },
  stone:   { 500: '#78716c', 400: '#a8a29e', 600: '#57534e' },
}

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(color: string): boolean {
  return HEX_COLOR_RE.test(color.trim())
}

export function normalizeHexColor(color: string): string {
  const value = color.trim().toLowerCase()

  return isHexColor(value) ? chroma(value).hex() : value
}

export function createColorRamp(color: string): ColorValue {
  const base = normalizeHexColor(color)

  return {
    500: base,
    400: chroma.mix(base, '#ffffff', 0.22, 'rgb').hex(),
    600: chroma.mix(base, '#000000', 0.14, 'rgb').hex()
  }
}

export function resolveColorRamp(color: string, fallback: ColorValue = colorMap.blue): ColorValue {
  if (colorMap[color]) {
    return colorMap[color]
  }

  if (isHexColor(color)) {
    return createColorRamp(color)
  }

  return fallback
}

function mixNeutral(base: string, target: string, weight: number): string {
  return chroma.mix(base, target, weight, 'rgb').hex()
}

export function resolveNeutralVars(color: string, isDark = false): NeutralThemeVars {
  const ramp = neutralColorMap[color] || neutralColorMap.slate
  const base = ramp[500]

  if (isDark) {
    return {
      muted: ramp[400],
      mutedLight: mixNeutral(base, '#ffffff', 0.7),
      mutedDark: ramp[500],
      bg: mixNeutral(base, '#000000', 0.82),
      surface: mixNeutral(base, '#000000', 0.68),
      surfaceElevated: mixNeutral(base, '#000000', 0.52),
      text: mixNeutral(base, '#ffffff', 0.9),
      textMuted: ramp[400],
      textDimmed: ramp[500],
      border: mixNeutral(base, '#000000', 0.52),
      borderMuted: mixNeutral(base, '#000000', 0.68)
    }
  }

  return {
    muted: ramp[500],
    mutedLight: ramp[400],
    mutedDark: ramp[600],
    bg: '#ffffff',
    surface: mixNeutral(base, '#ffffff', 0.94),
    surfaceElevated: mixNeutral(base, '#ffffff', 0.88),
    text: mixNeutral(base, '#000000', 0.78),
    textMuted: ramp[500],
    textDimmed: ramp[400],
    border: mixNeutral(base, '#ffffff', 0.78),
    borderMuted: mixNeutral(base, '#ffffff', 0.9)
  }
}

export function getColorValue(color: string): string {
  return resolveColorRamp(color, colorMap.blue)[500]
}

export function getNeutralColorValue(color: string): string {
  return neutralColorMap[color]?.[500] || '#6b7280'
}

function expandModeTokens(tokens: Record<string, string> = {}, isDark = false): Record<string, string> {
  const expanded = { ...tokens }

  if (tokens.primary || tokens.primarySource) {
    const primarySource = tokens.primarySource || tokens.primary
    const primary = resolveColorRamp(primarySource)
    expanded.primarySource = primarySource
    expanded.primary = primary[500]
    expanded['primary-light'] = primary[400]
    expanded['primary-dark'] = primary[600]
  }

  if (tokens.neutral) {
    const neutral = resolveNeutralVars(tokens.neutral, isDark)
    expanded.muted ??= neutral.muted
    expanded['muted-light'] ??= neutral.mutedLight
    expanded['muted-dark'] ??= neutral.mutedDark
    expanded.bg ??= neutral.bg
    expanded.surface ??= neutral.surface
    expanded['surface-elevated'] ??= neutral.surfaceElevated
    expanded.text ??= neutral.text
    expanded['text-muted'] ??= neutral.textMuted
    expanded['text-dimmed'] ??= neutral.textDimmed
    expanded.border ??= neutral.border
    expanded['border-muted'] ??= neutral.borderMuted
  }

  return expanded
}

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

export const defaultTheme = defineTheme({
  name: 'default',
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif"
  },
  radius: '0.25rem',
  light: {
    primary: 'blue',
    neutral: 'slate'
  },
  dark: {
    primary: 'blue',
    neutral: 'slate'
  }
})

export const defaultThemeState: ThemeConfig = {
  theme: defaultTheme,
  appearance: 'system',
  blackAsPrimary: false
}

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

export function themeToAppearanceCss(theme: Theme, appearance: Appearance = 'system', selector = ':root'): string {
  if (appearance === 'light' || appearance === 'dark') {
    return `${themeToCss(theme, appearance, selector)}\n${selector} { color-scheme: ${appearance}; }`
  }

  return [
    themeToCss(theme, 'light', selector),
    `${selector} { color-scheme: light dark; }`,
    `@media (prefers-color-scheme: dark) {\n${themeToCss(theme, 'dark', selector)}\n}`
  ].join('\n')
}
