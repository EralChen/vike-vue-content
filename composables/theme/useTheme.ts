import { computed, onMounted, ref, watch } from 'vue'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import {
  colorModes,
  defaultTheme,
  defineTheme,
  themeToVars
} from '@vike-vue-content/theme'
import { exportThemeCss, exportVikeThemeConfig as stringifyVikeThemeConfig } from '@vike-vue-content/theme'
import type { Appearance, ThemeState } from '@vike-vue-content/theme'
import { getDefaultThemeState } from './defaultState'

function cloneDefaultState(): ThemeState {
  return getDefaultThemeState()
}

function normalizeState(value: any): ThemeState {
  if (value?.theme) {
    return {
      theme: defineTheme(value.theme),
      appearance: value.appearance || 'system'
    }
  }

  return cloneDefaultState()
}

function fontCss(font: string): string {
  return font === 'system-ui' ? 'system-ui, sans-serif' : `'${font}', sans-serif`
}

function fontName(font: string): string {
  const first = font.split(',')[0]?.trim() || 'Inter'
  return first.replace(/^['"]|['"]$/g, '')
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

function _useTheme() {
  const state = useLocalStorage<ThemeState>('vvc-theme', cloneDefaultState())
  const isDark = ref(false)

  state.value = normalizeState(state.value)

  const theme = computed({
    get: () => state.value.theme,
    set: next => {
      state.value.theme = defineTheme(next)
    }
  })

  const primary = computed({
    get: () => state.value.theme.light.primarySource || state.value.theme.light.primary || 'blue',
    set: (color: string) => {
      state.value.theme = defineTheme({
        ...state.value.theme,
        light: withPrimary(state.value.theme.light, color),
        dark: withPrimary(state.value.theme.dark, color)
      })
    }
  })

  const neutral = computed({
    get: () => state.value.theme.light.neutral || 'slate',
    set: (color: string) => {
      state.value.theme = defineTheme({
        ...state.value.theme,
        light: withNeutral(state.value.theme.light, color),
        dark: withNeutral(state.value.theme.dark, color)
      })
    }
  })

  const radius = computed({
    get: () => Number.parseFloat(state.value.theme.radius || '0.25rem'),
    set: (value: number) => {
      state.value.theme = defineTheme({
        ...state.value.theme,
        radius: `${value}rem`
      })
    }
  })

  const font = computed({
    get: () => fontName(state.value.theme.fonts.sans || 'Inter'),
    set: (value: string) => {
      state.value.theme = defineTheme({
        ...state.value.theme,
        fonts: {
          ...state.value.theme.fonts,
          sans: fontCss(value)
        }
      })
    }
  })

  const mode = computed({
    get: () => state.value.appearance,
    set: (value: Appearance) => {
      setAppearance(value)
    }
  })

  const modes = colorModes

  const hasCSSChanges = computed(() => {
    return state.value.theme.radius !== defaultTheme.radius
      || state.value.theme.fonts.sans !== defaultTheme.fonts.sans
  })

  const hasConfigChanges = computed(() => {
    return primary.value !== 'blue' || neutral.value !== 'slate'
  })

  function applyColorMode() {
    const appearance = state.value.appearance

    if (appearance === 'system') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = appearance === 'dark'
    }

    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function applyThemeVariables() {
    const vars = themeToVars(state.value.theme, isDark.value ? 'dark' : 'light')
    const root = document.documentElement

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value)
    }
  }

  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (state.value.appearance === 'system') {
        applyColorMode()
        applyThemeVariables()
      }
    })
  }

  function initTheme() {
    applyColorMode()
    applyThemeVariables()
    watchSystemTheme()
  }

  function applyTheme() {
    applyColorMode()
    applyThemeVariables()
  }

  watch(state, () => {
    applyTheme()
  }, { deep: true })

  onMounted(() => {
    initTheme()
  })

  function toggleDarkMode() {
    const currentIndex = colorModes.findIndex(item => item.label === state.value.appearance)
    const nextIndex = (currentIndex + 1) % colorModes.length
    setAppearance(colorModes[nextIndex].label)
  }

  function setAppearance(value: Appearance) {
    state.value.appearance = value
  }

  function resetTheme() {
    state.value = cloneDefaultState()
  }

  function exportCSS(): string {
    return exportThemeCss(state.value.theme, state.value.appearance)
  }

  function exportConfig(): string {
    return JSON.stringify(state.value, null, 2)
  }

  function exportVikeThemeConfig(): string {
    return stringifyVikeThemeConfig(state.value.theme)
  }

  return {
    state,
    theme,
    isDark,
    primary,
    neutral,
    radius,
    font,
    mode,
    modes,
    hasCSSChanges,
    hasConfigChanges,
    toggleDarkMode,
    resetTheme,
    exportCSS,
    exportConfig,
    exportVikeThemeConfig
  }
}

export const useTheme = createSharedComposable(_useTheme)
