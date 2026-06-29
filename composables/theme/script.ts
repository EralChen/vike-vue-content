import { defaultThemeState, themeToVars } from './constants'

function varsToScript(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `r.style.setProperty(${JSON.stringify(key)},${JSON.stringify(value)})`)
    .join(';')
}

// Minimal first-paint script. Runtime useTheme() applies the full localStorage theme.
export function generateThemeInitScript(): string {
  const lightVars = varsToScript(themeToVars(defaultThemeState.theme, 'light'))
  const darkVars = varsToScript(themeToVars(defaultThemeState.theme, 'dark'))

  return `<script>(function(){try{var s=JSON.parse(localStorage.getItem('vvc-theme')||'{}');var r=document.documentElement;var m=s.appearance||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d){r.classList.add('dark');${darkVars}}else{r.classList.remove('dark');${lightVars}}}catch(e){}})()</script>`
}
