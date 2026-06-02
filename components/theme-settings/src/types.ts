export interface ColorPreset {
  label: string
  value: string
}

export interface ThemeSettingsProps {
  primaryColors?: string[]
  neutralColors?: string[]
  radiusPresets?: number[]
  fontPresets?: string[]
}

export interface ThemeSettingsEmits {
  change: () => void
  reset: () => void
}