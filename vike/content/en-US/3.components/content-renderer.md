---
title: ContentRenderer
description: Renders a parsed content AST into Vue nodes, built on @comark/vue.
---

# ContentRenderer

Renders a parsed content AST into Vue nodes, built on `@comark/vue`.

```ts
import { ContentRenderer } from 'vike-vue-content/components/content-renderer'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tree` | `ContentBody` | required | The content AST (from `ContentEntry.body`). |
| `components` | `ContentComponents` | `{}` | A map of node → Vue component overrides. |
| `data` | `ContentData` | `{}` | Binding data injected into the content. |

## Events

| Event | Description |
| --- | --- |
| `resolve` | Fired after async content rendering completes (uses `<Suspense>` internally). |

## Usage

```vue
<script setup>
import { ContentRenderer } from 'vike-vue-content/components/content-renderer'
import { queryCollection } from 'vike-vue-content/query'

const page = await queryCollection('docs').path('/docs/getting-started').first()
</script>

<template>
  <ContentRenderer v-if="page" :tree="page.body" />
</template>
```

## Built-in component mappings

`ContentRenderer` pre-registers the following components by default:

| Tag | Component | Description |
| --- | --- | --- |
| `a` | `ProseA` | Base-aware link (auto base prefix, external links open in new tab). |
| `pre` | `ProseCode` | Code block with copy button and optional filename header. |
| `code-group` | `CodeGroup` | Tabbed code blocks. |
| `code-preview` | `CodePreview` | Live preview container with a `#source` slot. |

User-provided `components` take higher priority and can override any of these.
