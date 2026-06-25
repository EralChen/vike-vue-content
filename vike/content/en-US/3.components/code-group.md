---
title: CodeGroup
description: Tab multiple code blocks together, with labels from filenames.
---

# CodeGroup

`code-group` turns multiple sibling code blocks into a tabbed interface. Each tab label comes from the code block's `[filename]`.

Built into `ContentRenderer` — no registration needed.

## Basic usage

````md
:::code-group
```vue [Button.vue]
<template>
  <button class="btn">Click me</button>
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
  <button class="btn">Click me</button>
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultValue` | `string` | `'0'` | Index of the initially active tab. |

## Nesting

Colon count follows the [MDC nesting convention](https://remark-mdc.nuxt.space/#syntax) — inner containers use more colons than their parent. For example, when `code-group` sits inside another container, use `::::` for the outer and `:::` for `code-group`.
