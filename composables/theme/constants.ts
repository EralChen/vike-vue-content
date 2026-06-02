import type { ThemeConfig, ColorValue } from './types'

// 默认主题配置
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: 'blue',
    neutral: 'slate'
  },
  radius: 0.25,
  font: 'Inter',
  colorMode: 'system',
  blackAsPrimary: false
}

// 主色调预设
export const primaryColors = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
]

// 中性色预设
export const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']

// 圆角预设
export const radiusPresets = [0, 0.125, 0.25, 0.375, 0.5]

// 字体预设
export const fontPresets = [
  'Inter',
  'system-ui',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Outfit',
  'Raleway'
]

// 颜色模式预设
export const colorModes = [
  { label: 'light' as const, icon: '☀️' },
  { label: 'dark' as const, icon: '🌙' },
  { label: 'system' as const, icon: '💻' }
]

// 主色调映射表
export const colorMap: Record<string, ColorValue> = {
  red:     { 500: '#ef4444', 400: '#f87171', 600: '#dc2626' },
  orange:  { 500: '#f97316', 400: '#fb923c', 600: '#ea580c' },
  amber:   { 500: '#f59e0b', 400: '#fbbf24', 600: '#d97706' },
  yellow:  { 500: '#eab308', 400: '#facc15', 600: '#ca8a04' },
  lime:    { 500: '#84cc16', 400: '#a3e635', 600: '#65a30d' },
  green:   { 500: '#22c55e', 400: '#4ade80', 600: '#16a34a' },
  emerald: { 500: '#10b981', 400: '#34d399', 600: '#059669' },
  teal:    { 500: '#14b8a6', 400: '#2dd4bf', 600: '#0d9488' },
  cyan:    { 500: '#06b6d4', 400: '#22d3ee', 600: '#0891b2' },
  sky:     { 500: '#0ea5e9', 400: '#38bdf8', 600: '#0284c7' },
  blue:    { 500: '#3b82f6', 400: '#60a5fa', 600: '#2563eb' },
  indigo:  { 500: '#6366f1', 400: '#818cf8', 600: '#4f46e5' },
  violet:  { 500: '#8b5cf6', 400: '#a78bfa', 600: '#7c3aed' },
  purple:  { 500: '#a855f7', 400: '#c084fc', 600: '#9333ea' },
  fuchsia: { 500: '#d946ef', 400: '#e879f9', 600: '#c026d3' },
  pink:    { 500: '#ec4899', 400: '#f472b6', 600: '#db2777' },
  rose:    { 500: '#f43f5e', 400: '#fb7185', 600: '#e11d48' },
}

// 中性色映射表
export const neutralColorMap: Record<string, ColorValue> = {
  slate:   { 500: '#64748b', 400: '#94a3b8', 600: '#475569' },
  gray:    { 500: '#6b7280', 400: '#9ca3af', 600: '#4b5563' },
  zinc:    { 500: '#71717a', 400: '#a1a1aa', 600: '#52525b' },
  neutral: { 500: '#737373', 400: '#a3a3a3', 600: '#525252' },
  stone:   { 500: '#78716c', 400: '#a8a29e', 600: '#57534e' },
}

// 获取颜色值的工具函数
export function getColorValue(color: string): string {
  return colorMap[color]?.[500] || '#6b7280'
}

export function getNeutralColorValue(color: string): string {
  return neutralColorMap[color]?.[500] || '#6b7280'
}