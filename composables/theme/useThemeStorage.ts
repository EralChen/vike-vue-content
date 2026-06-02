import { useLocalStorage } from '@vueuse/core'
import { defaultTheme } from './constants'
import type { ThemeConfig } from './types'

export function useThemeStorage() {
  const theme = useLocalStorage<ThemeConfig>('vvc-theme', { ...defaultTheme })

  function updateTheme(updates: Partial<ThemeConfig>) {
    theme.value = { ...theme.value, ...updates }
  }

  function resetTheme() {
    theme.value = { ...defaultTheme, blackAsPrimary: false }
  }

  function setPrimaryColor(color: string) {
    theme.value.colors.primary = color
    theme.value.blackAsPrimary = false
  }

  function setNeutralColor(color: string) {
    theme.value.colors.neutral = color
  }

  function setRadius(radius: number) {
    theme.value.radius = radius
  }

  function setFont(font: string) {
    theme.value.font = font
  }

  function setColorMode(mode: 'light' | 'dark' | 'system') {
    theme.value.colorMode = mode
  }

  function setBlackAsPrimary(value: boolean) {
    theme.value.blackAsPrimary = value
  }

  return {
    theme,
    updateTheme,
    resetTheme,
    setPrimaryColor,
    setNeutralColor,
    setRadius,
    setFont,
    setColorMode,
    setBlackAsPrimary
  }
}