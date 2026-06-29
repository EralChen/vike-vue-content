import { useLocalStorage } from '@vueuse/core'
import { defineTheme } from '@vike-vue-content/theme'
import type { Appearance, ThemeState } from '@vike-vue-content/theme'
import { getDefaultThemeState } from './defaultState'

function defaultState(): ThemeState {
  return getDefaultThemeState()
}

function normalizeState(value: any): ThemeState {
  if (value?.theme) {
    return {
      theme: defineTheme(value.theme),
      appearance: value.appearance || 'system'
    }
  }

  return defaultState()
}

function fontCss(font: string): string {
  return font === 'system-ui' ? 'system-ui, sans-serif' : `'${font}', sans-serif`
}

function withPrimary(tokens: Record<string, string>, color: string): Record<string, string> {
  const { primary, primarySource, 'primary-light': primaryLight, 'primary-dark': primaryDark, ...rest } = tokens
  return {
    ...rest,
    primary: color
  }
}

function withNeutral(tokens: Record<string, string>, color: string): Record<string, string> {
  const {
    neutral,
    muted,
    'muted-light': mutedLight,
    'muted-dark': mutedDark,
    bg,
    surface,
    'surface-elevated': surfaceElevated,
    text,
    'text-muted': textMuted,
    'text-dimmed': textDimmed,
    border,
    'border-muted': borderMuted,
    ...rest
  } = tokens

  return {
    ...rest,
    neutral: color
  }
}

export function useThemeStorage() {
  const state = useLocalStorage<any>('vvc-theme', defaultState())
  state.value = normalizeState(state.value)

  function updateTheme(updates: Partial<ThemeState>) {
    state.value = {
      ...state.value,
      ...updates,
      theme: defineTheme(updates.theme || state.value.theme)
    }
  }

  function resetTheme() {
    state.value = defaultState()
  }

  function setPrimaryColor(color: string) {
    state.value.theme = defineTheme({
      ...state.value.theme,
      light: withPrimary(state.value.theme.light, color),
      dark: withPrimary(state.value.theme.dark, color)
    })
  }

  function setNeutralColor(color: string) {
    state.value.theme = defineTheme({
      ...state.value.theme,
      light: withNeutral(state.value.theme.light, color),
      dark: withNeutral(state.value.theme.dark, color)
    })
  }

  function setRadius(radius: number) {
    state.value.theme = defineTheme({
      ...state.value.theme,
      radius: `${radius}rem`
    })
  }

  function setFont(font: string) {
    state.value.theme = defineTheme({
      ...state.value.theme,
      fonts: {
        ...state.value.theme.fonts,
        sans: fontCss(font)
      }
    })
  }

  function setColorMode(mode: Appearance) {
    state.value.appearance = mode
  }

  return {
    state,
    theme: state,
    updateTheme,
    resetTheme,
    setPrimaryColor,
    setNeutralColor,
    setRadius,
    setFont,
    setColorMode
  }
}
