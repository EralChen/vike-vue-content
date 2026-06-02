# Theme Toggle 组件

主题切换按钮组件，支持深色/浅色/系统跟随三种模式切换。

## 使用方法

```vue
<script setup>
import { ThemeToggle } from '@vike-vue-content/components/theme-toggle'
</script>

<template>
  <ThemeToggle @change="onThemeChange" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| mode | `'light' \| 'dark' \| 'system'` | `'system'` | 初始颜色模式 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `(mode: ColorMode)` | 主题模式变化时触发 |

## 依赖

- `@vike-vue-content/composables/theme`