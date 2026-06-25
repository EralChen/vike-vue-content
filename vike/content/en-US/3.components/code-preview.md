---
title: CodePreview
description: A lower-level container for preview and source slots.
---

# CodePreview

`code-preview` is the lower-level building block behind `demo`.

Use it when the preview content and source blocks are authored directly in Markdown, instead of coming from registered `demos` and `sources`.

`ContentRenderer` registers `code-preview` by default, so Markdown can use `:::code-preview` directly.

## Basic usage

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

## With code-group

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