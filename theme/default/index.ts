import { defineTheme } from '../defineTheme'
import type { Appearance } from '../types'

export const defaultTheme = defineTheme({
  name: 'default',
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif"
  },
  radius: '0.25rem',
  light: {
    primary: 'blue',
    neutral: 'slate'
  },
  dark: {
    primary: 'blue',
    neutral: 'slate'
  }
})

export const defaultAppearance: Appearance = 'system'
