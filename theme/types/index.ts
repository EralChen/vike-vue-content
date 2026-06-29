export type Appearance = 'light' | 'dark' | 'system'
export type ColorMode = Appearance

export interface ThemeTokens {
  name?: string
  fonts?: Record<string, string>
  radius?: string
  spacing?: Record<string, string>
  colors?: Record<string, string>
  light?: Record<string, string>
  dark?: Record<string, string>
}

export interface ColorValue {
  500: string
  400: string
  600: string
}

export interface Theme {
  name: string
  fonts: Record<string, string>
  radius?: string
  spacing: Record<string, string>
  light: Record<string, string>
  dark: Record<string, string>
}

export interface ThemeState {
  theme: Theme
  appearance: Appearance
}

export type ThemeConfig = ThemeState

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
