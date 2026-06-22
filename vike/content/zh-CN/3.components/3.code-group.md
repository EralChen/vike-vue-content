---
title: CodeGroup
description: 将多个代码块合并为标签页，标签名取自文件名。
---

# CodeGroup

`code-group` 将多个相邻代码块转为标签页界面，标签名取自代码块的 `[文件名]`。

已内置于 `ContentRenderer`，无需额外注册。

## 基本用法

````md
:::code-group
```vue [Button.vue]
<template>
  <button class="btn">点击我</button>
</template>
```

```css [style.css]
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
}
```
:::
````

:::code-group
```vue [Button.vue]
<template>
  <button class="btn">点击我</button>
</template>
```

```css [style.css]
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
}
```
:::

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultValue` | `string` | `'0'` | 初始激活标签的索引。 |

## 嵌套

冒号数量遵循 [MDC 嵌套规范](https://remark-mdc.nuxt.space/#syntax) —— 内层容器比外层多一层冒号。例如 `code-group` 嵌套在其他容器内时，外层用 `::::`，`code-group` 用 `:::`。
