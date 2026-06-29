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
  blackAsPrimary?: boolean
}

export type ThemeConfig = ThemeState
