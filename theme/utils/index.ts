import chroma from 'chroma-js'
import { colorMap, darkColorMap, neutralColorMap } from '../presets'
import type {
  ColorValue,
  NeutralThemeVars
} from '../types'

export function isHexColor(color: string): boolean {
  return chroma.valid(color.trim()) && color.trim().startsWith('#')
}

export function normalizeHexColor(color: string): string {
  return chroma(color.trim()).hex()
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

function resolvePrimaryRamp(
  color: string,
  isDark = false,
  fallback: ColorValue = colorMap.blue
): ColorValue {
  if (isDark && darkColorMap[color]) {
    return darkColorMap[color]
  }

  return resolveColorRamp(color, fallback)
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

export function expandModeTokens(
  tokens: Record<string, string> = {},
  isDark = false
): Record<string, string> {
  const expanded = { ...tokens }

  if (tokens.primary || tokens.primarySource) {
    const primarySource = tokens.primarySource || tokens.primary
    const primary = resolvePrimaryRamp(primarySource, isDark)
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
