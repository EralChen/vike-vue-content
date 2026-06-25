---
title: CodePreview
description: 用于承载预览区和源码区插槽的基础容器。
---

# CodePreview

`code-preview` 是 `demo` 背后的底层容器。

当预览内容和源码块都直接写在 Markdown 里，而不是来自已注册的 `demos` / `sources` 时，优先使用它。

`ContentRenderer` 默认内置了 `code-preview`，因此在 Markdown 里可以直接写 `:::code-preview`。

## 基础用法

````md
:::code-preview

<span class="badge">New</span>

#source
```vue
<template>
  <span class="badge">New</span>
</template>
```
:::
````

:::code-preview

<span style="display:inline-block;padding:2px 8px;border-radius:9999px;background:#3b82f6;color:white;font-size:12px;">New</span>

#source
```vue
<template>
  <span class="badge">New</span>
</template>
```
:::

## 搭配 code-group

````md
:::code-preview

<div style="display:flex;gap:8px;">
  <span class="badge success">Success</span>
  <span class="badge error">Error</span>
</div>

#source
::::code-group

```vue [Vue]
<template>
  <span class="badge success">Success</span>
  <span class="badge error">Error</span>
</template>
```

```html [HTML]
<span class="badge success">Success</span>
<span class="badge error">Error</span>
```

::::
:::
````

:::code-preview

<div style="display:flex;gap:8px;">
  <span style="padding:4px 12px;border-radius:4px;background:#22c55e;color:white;">Success</span>
  <span style="padding:4px 12px;border-radius:4px;background:#ef4444;color:white;">Error</span>
</div>

#source
::::code-group

```vue [Vue]
<template>
  <span class="badge success">Success</span>
  <span class="badge error">Error</span>
</template>
```

```html [HTML]
<span class="badge success">Success</span>
<span class="badge error">Error</span>
```

::::
:::