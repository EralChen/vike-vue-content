import { ref, computed, watch, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defaultTheme, colorModes, colorMap, neutralColorMap } from './constants'
import type { ThemeConfig } from './types'

export function useTheme() {
  const theme = useLocalStorage<ThemeConfig>('vvc-theme', { ...defaultTheme })
  const isDark = ref(false)

  // 计算属性
  const primary = computed({
    get: () => theme.value.colors.primary,
    set: (color: string) => {
      theme.value.colors.primary = color
      theme.value.blackAsPrimary = false
    }
  })

  const neutral = computed({
    get: () => theme.value.colors.neutral,
    set: (color: string) => {
      theme.value.colors.neutral = color
    }
  })

  const radius = computed({
    get: () => theme.value.radius,
    set: (r: number) => {
      theme.value.radius = r
    }
  })

  const font = computed({
    get: () => theme.value.font,
    set: (f: string) => {
      theme.value.font = f
    }
  })

  const mode = computed({
    get: () => theme.value.colorMode,
    set: (m: 'light' | 'dark' | 'system') => {
      theme.value.colorMode = m
    }
  })

  const blackAsPrimary = computed(() => theme.value.blackAsPrimary ?? false)

  const modes = colorModes

  // 检查是否有变更
  const hasCSSChanges = computed(() => {
    return theme.value.radius !== defaultTheme.radius
      || theme.value.blackAsPrimary
      || theme.value.font !== defaultTheme.font
  })

  const hasConfigChanges = computed(() => {
    return theme.value.colors.primary !== defaultTheme.colors.primary
      || theme.value.colors.neutral !== defaultTheme.colors.neutral
  })

  // 应用颜色模式
  function applyColorMode() {
    const { colorMode } = theme.value

    if (colorMode === 'system') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = colorMode === 'dark'
    }

    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 应用主题变量
  function applyThemeVariables() {
    const { colors, radius, font, blackAsPrimary: blackPrimary } = theme.value
    const root = document.documentElement

    // 主色调
    if (blackPrimary) {
      root.style.setProperty('--vvc-color-primary', isDark.value ? '#ffffff' : '#000000')
      root.style.setProperty('--vvc-color-primary-light', isDark.value ? '#e2e8f0' : '#334155')
      root.style.setProperty('--vvc-color-primary-dark', isDark.value ? '#cbd5e1' : '#1e293b')
    } else {
      const primaryColor = colorMap[colors.primary] || colorMap.blue
      root.style.setProperty('--vvc-color-primary', primaryColor[500])
      root.style.setProperty('--vvc-color-primary-light', primaryColor[400])
      root.style.setProperty('--vvc-color-primary-dark', primaryColor[600])
    }

    // 中性色
    const neutralColor = neutralColorMap[colors.neutral] || neutralColorMap.slate
    root.style.setProperty('--vvc-color-neutral', neutralColor[500])
    root.style.setProperty('--vvc-color-neutral-light', neutralColor[400])
    root.style.setProperty('--vvc-color-neutral-dark', neutralColor[600])

    // 圆角
    root.style.setProperty('--vvc-radius', `${radius}rem`)

    // 字体
    root.style.setProperty('--vvc-font-family', `'${font}', sans-serif`)
  }

  // 监听系统主题变化
  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value.colorMode === 'system') {
        applyColorMode()
        applyThemeVariables()
      }
    })
  }

  // 初始化主题
  function initTheme() {
    applyColorMode()
    applyThemeVariables()
    watchSystemTheme()
  }

  watch(theme, () => {
    applyColorMode()
    applyThemeVariables()
  }, { deep: true })

  onMounted(() => {
    initTheme()
  })

  // 方法
  function toggleDarkMode() {
    const currentIndex = colorModes.findIndex(m => m.label === theme.value.colorMode)
    const nextIndex = (currentIndex + 1) % colorModes.length
    theme.value.colorMode = colorModes[nextIndex].label
  }

  function setBlackAsPrimary(value: boolean) {
    theme.value.blackAsPrimary = value
  }

  function resetTheme() {
    theme.value = { ...defaultTheme, blackAsPrimary: false }
  }

  function exportCSS(): string {
    const lines: string[] = [
      ':root {',
      `  --vvc-radius: ${theme.value.radius}rem;`,
      `  --vvc-font-family: '${theme.value.font}', sans-serif;`,
      '}'
    ]

    if (theme.value.blackAsPrimary) {
      lines.push('', '.dark {', '  --vvc-color-primary: #ffffff;', '}')
    }

    return lines.join('\n')
  }

  function exportConfig(): string {
    const config = {
      colors: {
        primary: theme.value.colors.primary,
        neutral: theme.value.colors.neutral
      },
      radius: theme.value.radius,
      font: theme.value.font,
      colorMode: theme.value.colorMode,
      blackAsPrimary: theme.value.blackAsPrimary
    }

    return JSON.stringify(config, null, 2)
  }

  return {
    // 状态
    theme,
    isDark,
    primary,
    neutral,
    radius,
    font,
    mode,
    blackAsPrimary,
    modes,
    hasCSSChanges,
    hasConfigChanges,

    // 方法
    toggleDarkMode,
    setBlackAsPrimary,
    resetTheme,
    exportCSS,
    exportConfig
  }
}