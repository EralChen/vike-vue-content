# Theme Composable

主题系统组合式函数，提供主题配置管理和持久化功能。

## 使用方法

```vue
<script setup>
import { useTheme } from '@vike-vue-content/composables/theme'

const { theme, isDark, toggleDarkMode, setPrimaryColor, resetTheme } = useTheme()
</script>

<template>
  <div>
    <p>当前模式: {{ isDark ? '深色' : '浅色' }}</p>
    <p>主色调: {{ theme.colors.primary }}</p>
    <button @click="toggleDarkMode">切换主题</button>
    <button @click="setPrimaryColor('green')">设置绿色</button>
    <button @click="resetTheme">重置</button>
  </div>
</template>
```

## API

### `useTheme()`

返回以下对象：

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `theme` | `Ref<ThemeConfig>` | 主题配置响应式对象 |
| `isDark` | `Ref<boolean>` | 是否为深色模式 |
| `toggleDarkMode()` | `() => void` | 切换深色/浅色/系统模式 |
| `setPrimaryColor(color)` | `(color: string) => void` | 设置主色调 |
| `setNeutralColor(color)` | `(color: string) => void` | 设置中性色 |
| `setRadius(radius)` | `(radius: number) => void` | 设置圆角大小 |
| `setFont(font)` | `(font: string) => void` | 设置字体 |
| `resetTheme()` | `() => void` | 重置为默认主题 |

### `useThemeStorage()`

返回以下对象：

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `theme` | `Ref<ThemeConfig>` | 主题配置响应式对象 |
| `updateTheme(updates)` | `(updates: Partial<ThemeConfig>) => void` | 更新主题配置 |
| `resetTheme()` | `() => void` | 重置为默认主题 |
| `setPrimaryColor(color)` | `(color: string) => void` | 设置主色调 |
| `setNeutralColor(color)` | `(color: string) => void` | 设置中性色 |
| `setRadius(radius)` | `(radius: number) => void` | 设置圆角大小 |
| `setFont(font)` | `(font: string) => void` | 设置字体 |
| `setColorMode(mode)` | `(mode: ColorMode) => void` | 设置颜色模式 |

## 类型定义

```typescript
type ColorMode = 'light' | 'dark' | 'system'

interface ThemeConfig {
  colors: {
    primary: string
    neutral: string
  }
  radius: number
  font: string
  colorMode: ColorMode
}
```

## 预设值

### 主色调 (17种)
`red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

### 中性色 (5种)
`slate`, `gray`, `zinc`, `neutral`, `stone`

### 圆角 (7种)
`0`, `0.125`, `0.25`, `0.375`, `0.5`, `0.75`, `1` (单位: rem)

### 字体 (8种)
`Inter`, `system-ui`, `Roboto`, `Open Sans`, `Montserrat`, `Poppins`, `Raleway`, `Lato`

## 存储

主题配置使用 `localStorage` 存储，键名为 `vvc-theme`。