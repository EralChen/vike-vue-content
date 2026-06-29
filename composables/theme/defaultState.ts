import { usePageContext } from 'vike-vue/usePageContext'
import {
  defaultAppearance,
  defaultTheme,
  defineTheme,
  resolveThemeConfig
} from '@vike-vue-content/theme'
import type { Appearance, ThemeState, ThemesConfigValue } from '@vike-vue-content/theme'

interface VikeThemeConfig {
  theme?: string
  themes?: ThemesConfigValue[]
  appearance?: Appearance
}

function fallbackDefaultState(): ThemeState {
  return {
    theme: defineTheme(defaultTheme),
    appearance: defaultAppearance
  }
}

export function getDefaultThemeState(): ThemeState {
  try {
    const pageContext = usePageContext()
    const config = (pageContext?.config || {}) as VikeThemeConfig

    return {
      theme: resolveThemeConfig(config.theme, config.themes),
      appearance: config.appearance || defaultAppearance
    }
  } catch {
    return fallbackDefaultState()
  }
}
