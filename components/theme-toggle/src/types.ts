export type ColorMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  colors: {
    primary: string
    neutral: string
  }
  radius: number
  font: string
  colorMode: ColorMode
}