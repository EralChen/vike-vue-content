---
title: ThemeToggle
description: 主题模式切换按钮，在 light 和 dark 之间切换，并在支持时使用 View Transitions 动画。
---

# ThemeToggle

主题模式切换按钮组件。

```ts
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle'
```

`ThemeToggle` 内部直接使用 `useTheme()`，点击后会在 `light` 和 `dark` 之间切换当前主题模式，并同步更新根节点样式与 `localStorage['vvc-theme']`。

## 用法

```vue
<script setup>
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle'
</script>

<template>
  <ThemeToggle />
</template>
```

## 行为

- 当前为浅色时显示太阳图标，点击后切到深色
- 当前为深色时显示月亮图标，点击后切到浅色
- 不暴露额外 props，透传的 HTML attributes 会落到根按钮上
- 如果浏览器支持 `document.startViewTransition()`，并且用户没有开启 reduced motion，则会播放一次圆形展开过渡动画
- 如果不支持 View Transitions，则直接切换主题

## 依赖

`ThemeToggle` 依赖主题系统已经接入：

- 页面中已引入 `vike-vue-content/config`
- 布局中已引入 `vike-vue-content/index.css`

否则按钮仍然可以切换 `localStorage` 中的状态，但页面可能没有完整的主题样式表现。
