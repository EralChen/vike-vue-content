import { computed, onMounted, ref, watch } from 'vue'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import {
  colorModes,
  defaultThemeState,
  defineTheme,
  themeToVars
} from './constants'
import { exportThemeCss, exportVikeThemeConfig as stringifyVikeThemeConfig } from './export'
import type { Appearance, ThemeState } from './types'

function cloneDefaultState(): ThemeState {
  return {
    theme: defineTheme(defaultThemeState.theme),
    appearance: defaultThemeState.appearance,
    blackAsPrimary: false
  }
}

function fontCss(font: string): string {
  return font === 'system-ui' ? 'system-ui, sans-serif' : `'${font}', sans-serif`
}

function normalizeState(value: any): ThemeState {
  if (value?.theme) {
    return {
      theme: defineTheme(value.theme),
      appearance: value.appearance || 'system',
      blackAsPrimary: value.blackAsPrimary ?? false
    }
  }

  return cloneDefaultState()
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
      state.value.blackAsPrimary = false
      applyTheme()
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
      applyTheme()
    }
  })

  const radius = computed({
    get: () => Number.parseFloat(state.value.theme.radius || '0.25rem'),
    set: (value: number) => {
      state.value.theme = defineTheme({
        ...state.value.theme,
        radius: `${value}rem`
      })
      applyTheme()
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
      applyTheme()
    }
  })

  const mode = computed({
    get: () => state.value.appearance,
    set: (value: Appearance) => {
      setAppearance(value)
    }
  })

  const blackAsPrimary = computed(() => state.value.blackAsPrimary ?? false)
  const modes = colorModes

  const hasCSSChanges = computed(() => {
    return state.value.theme.radius !== defaultThemeState.theme.radius
      || state.value.blackAsPrimary
      || state.value.theme.fonts.sans !== defaultThemeState.theme.fonts.sans
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

  function activeTheme() {
    if (!state.value.blackAsPrimary) {
      return state.value.theme
    }

    return defineTheme({
      ...state.value.theme,
      light: {
        ...withPrimary(state.value.theme.light, isDark.value ? '#ffffff' : '#000000'),
        'primary-light': isDark.value ? '#e2e8f0' : '#334155',
        'primary-dark': isDark.value ? '#cbd5e1' : '#1e293b'
      },
      dark: {
        ...withPrimary(state.value.theme.dark, '#ffffff'),
        'primary-light': '#e2e8f0',
        'primary-dark': '#cbd5e1'
      }
    })
  }

  function applyThemeVariables() {
    const vars = themeToVars(activeTheme(), isDark.value ? 'dark' : 'light')
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
    state.value.theme = defineTheme(state.value.theme)
    initTheme()
  })

  function toggleDarkMode() {
    const currentIndex = colorModes.findIndex(item => item.label === state.value.appearance)
    const nextIndex = (currentIndex + 1) % colorModes.length
    setAppearance(colorModes[nextIndex].label)
  }

  function setAppearance(value: Appearance) {
    state.value.appearance = value
    applyTheme()
  }

  function setBlackAsPrimary(value: boolean) {
    state.value.blackAsPrimary = value
    applyTheme()
  }

  function resetTheme() {
    state.value = cloneDefaultState()
    applyTheme()
  }

  function exportCSS(): string {
    return exportThemeCss(activeTheme(), state.value.appearance)
  }

  function exportConfig(): string {
    return JSON.stringify(state.value, null, 2)
  }

  function exportVikeThemeConfig(): string {
    return stringifyVikeThemeConfig(activeTheme())
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
    blackAsPrimary,
    modes,
    hasCSSChanges,
    hasConfigChanges,
    toggleDarkMode,
    setBlackAsPrimary,
    resetTheme,
    exportCSS,
    exportConfig,
    exportVikeThemeConfig
  }
}

export const useTheme = createSharedComposable(_useTheme)
