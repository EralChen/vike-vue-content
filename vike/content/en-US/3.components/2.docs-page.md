---
title: DocsPage
description: Full docs page layout — sidebar, content, TOC, prev/next.
---

# DocsPage

The full docs page layout: sidebar navigation + main content + TOC + prev/next. It reads data from the built-in data loader via `useData()`, so it takes **no props** — just use it:

```ts
import { DocsPage } from 'vike-vue-content/components/docs-page'
```

## Usage

```vue
<script setup>
import { DocsPage } from 'vike-vue-content/components/docs-page'
</script>

<template>
  <DocsPage />
</template>
```

The layout uses CSS Grid and stacks into a single column on narrow screens (≤1100px).
