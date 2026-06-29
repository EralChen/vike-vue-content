# Theme Settings 组件

主题设置面板组件，提供完整的主题自定义界面。

## 使用方法

```vue
<script setup>
import { ThemeSettings } from '@vike-vue-content/components/theme-settings'
</script>

<template>
  <ThemeSettings @change="onThemeChange" @reset="onThemeReset" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| primaryColors | `string[]` | 17种预设颜色 | 可选的主色调颜色列表 |
| neutralColors | `string[]` | 5种灰色系 | 可选的中性色颜色列表 |
| radiusPresets | `number[]` | 7种预设值 | 可选的圆角大小列表 |
| fontPresets | `string[]` | 8种常用字体 | 可选的字体列表 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | - | 主题配置变化时触发 |
| reset | - | 主题重置时触发 |

## 功能特性

- 🎨 主色调选择（17种颜色）
- 🎯 中性色选择（5种灰色系）
- 📐 圆角大小调整（7种预设）
- 📝 字体选择（8种字体）
- 📤 导出完整 CSS 变量（`:root` / `.dark`）和 vike-themes 兼容 JSON
- 🔄 一键重置主题

## 依赖

- `@vike-vue-content/composables/theme`
