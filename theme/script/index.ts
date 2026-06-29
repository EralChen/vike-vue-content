import {
  defaultAppearance,
  defaultTheme,
  defineTheme,
  themeToVars
} from '../core'
import type { Appearance, Theme, ThemeState, ThemeTokens } from '../core'

function varsToScript(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `r.style.setProperty(${JSON.stringify(key)},${JSON.stringify(value)})`)
    .join(';')
}

// Minimal first-paint script. Runtime useTheme() applies the full localStorage theme.
export function generateThemeInitScript(theme: Theme | ThemeTokens = defaultTheme, appearance: Appearance = defaultAppearance): string {
  const resolvedTheme = defineTheme(theme)
  const lightVars = varsToScript(themeToVars(resolvedTheme, 'light'))
  const darkVars = varsToScript(themeToVars(resolvedTheme, 'dark'))

  return `<script>(function(){try{var r=document.documentElement;var s=JSON.parse(localStorage.getItem('vvc-theme')||'{}');var m=s.appearance||${JSON.stringify(appearance)};var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d){r.classList.add('dark');${darkVars}}else{r.classList.remove('dark');${lightVars}}}catch(e){}})()</script>`
}

export type ThemeConfigValue = Theme | ThemeTokens
export type ThemesConfigValue = ThemeConfigValue | ThemeConfigValue[]

function flattenThemes(themes: ThemesConfigValue[] = []): ThemeConfigValue[] {
  return themes.flatMap(theme => Array.isArray(theme) ? theme : [theme])
}

export function resolveThemeConfig(themeName = defaultTheme.name, themes: ThemesConfigValue[] = []): Theme {
  const allThemes = [defaultTheme, ...flattenThemes(themes)].map(theme => defineTheme(theme))

  return allThemes.find(theme => theme.name === themeName) || allThemes[0]
}

export function resolveThemeState(themeName?: string, themes?: ThemesConfigValue[], appearance: Appearance = defaultAppearance): ThemeState {
  return {
    theme: resolveThemeConfig(themeName, themes),
    appearance
  }
}
