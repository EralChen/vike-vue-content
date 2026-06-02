export type ColorMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  colors: {
    primary: string
    neutral: string
  }
  radius: number
  font: string
  colorMode: ColorMode
  blackAsPrimary?: boolean
}

export interface ColorValue {
  500: string
  400: string
  600: string
}