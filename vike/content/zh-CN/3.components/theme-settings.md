---
title: ThemeSettings
description: 完整主题面板，支持 Primary、Neutral、Radius、Font、Color Mode 以及导出。
---

# ThemeSettings

完整主题面板组件。

```ts
import { ThemeSettings } from 'vike-vue-content/components/theme-settings'
```

`ThemeSettings` 内部基于 `useTheme()` 工作，直接读写当前主题状态。

它本质上是 `+config.ts` 默认主题之上的一层客户端覆盖：

- 首次进入页面时，默认值来自 `theme`、`themes`、`appearance`
- 用户在面板里的修改会写入 `localStorage['vvc-theme']`
- 点面板底部的重置按钮后，会丢弃这层客户端覆盖，回退到 `+config.ts` 里的默认配置

## 用法

```vue
<script setup>
import { ThemeSettings } from 'vike-vue-content/components/theme-settings'
</script>

<template>
  <ThemeSettings />
</template>
```

## 能力

- 选择 Primary 预设色板
- 输入 raw hex 作为 Primary，例如 `#0066cc`
- 选择 Neutral 预设色板
- 选择 Radius 预设
- 选择 Font 预设
- 切换 `light` / `dark` / `system`
- 导出当前主题对应的 CSS
- 导出可回填到 `themes` 的 `vike-theme.json`
- 一键重置到 `+config.ts` 中的默认主题

## 行为

- 不暴露额外 props，透传的 HTML attributes 会落到根节点上
- Primary 使用命名色板或 raw hex；raw hex 会自动生成 light / dark ramp
- Neutral 目前使用命名色板，并展开成 `muted`、`bg`、`surface`、`text`、`border` 等语义变量
- 主题修改会立即应用到 `document.documentElement`
- 用户修改会持久化到 `localStorage['vvc-theme']`
- 点击重置按钮后，会删除这层用户覆盖并重新采用 `+config.ts` 的 `theme/themes/appearance`

## 回退到 `+config.ts`

如果你希望用户回到站点定义的默认主题，有两种方式：

- 在 UI 中点击 `ThemeSettings` 底部的重置按钮
- 手动清掉 `localStorage['vvc-theme']`

回退后，运行时会重新采用 Vike 页面配置中的默认值：

```ts
export default {
  extends: [vikeVue, vikeVueContent],
  theme: 'brand',
  themes: [brand],
  appearance: 'system'
}
```

也就是说，`ThemeSettings` 不会改写 `+config.ts`；它只是在客户端暂时覆盖它。

## 导出

面板底部有两个导出按钮：

- `main.css`：导出当前主题的 CSS 变量结果
- `vike-theme.json`：导出规范化后的主题对象

导出的 JSON 可以直接作为 `themes` 中的主题对象使用。

## 依赖

`ThemeSettings` 依赖主题系统已经接入：

- 页面中已引入 `vike-vue-content/config`
- 布局中已引入 `vike-vue-content/index.css`

更底层的主题能力见 [主题系统](/zh-CN/guide/theme)。
