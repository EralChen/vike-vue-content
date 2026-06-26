---
title: Demo
description: Bind a registered live preview to registered source blocks.
---

# Demo

`demo` is a higher-level wrapper built on top of `code-preview`.

Place `.vue` files in the configured `demosDir` directory (empty by default, not enabled). They are auto-registered — no manual imports. One Markdown declaration renders everything.

## Quick Start

### Configure demos directory

Specify `demosDir` in the page config. Each DocsPage can have its own configuration:

```ts
// vike/pages/en-US/+config.ts
import { defineDocsPageConfig } from 'vike-vue-content/docs'

export default defineDocsPageConfig({
    collection: 'en-US',
    demosDir: 'demos',  // multiple pages can share the same demos directory
})
```

Place `.vue` files in the project root's `demosDir` directory (`demos/` in the example above). They are auto-registered with their relative path (including `.vue` extension) as the demo key.

For example, `demos/hello/index.vue` is registered as `hello/index.vue`. Then reference it in markdown:

````md
:::demo{preview="hello/index.vue"}
:::
````

Minimal usage: when `source` is omitted, the source code for the `preview` key is shown automatically.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `preview` | `string` | Yes | Key of the preview component, corresponding to the file path in demos (including `.vue`) |
| `source` | `string \| string[]` | No | Source file key(s). When omitted, defaults to the `preview` key's source |

## Usage Examples

### Minimal (preview only)

````md
:::demo{preview="hello/index.vue"}
:::
````

Renders `hello/index.vue` as the live preview and shows its source code automatically.

:::demo{preview="hello/index.vue"}
:::

### Multiple source files

````md
:::demo{preview="hello/index.vue", :source='["hello/index.vue", "hello/data.txt"]'}
:::
````

- `preview="hello/index.vue"` — renders the `hello/index.vue` component as the live preview
- `:source='["hello/index.vue", "hello/data.txt"]'` — source area shows both files, switchable via CodeGroup tabs

The leading `:` before `source` is MDC's JS expression binding syntax, so the value is a real array.

:::demo{preview="hello/index.vue", :source='["hello/index.vue", "hello/data.txt"]'}
:::

### Single string source

````md
:::demo{preview="hello/index.vue", source="hello/data.txt"}
:::
````

Source area shows only `hello/data.txt`.

## Data Flow

```
{demosDir} ──→ Vite plugin scan ──→ virtual:vvc-demos ──→ contentDemos
{demosDir} ──→ Vite plugin scan ──→ virtual:vvc-demo-sources ──→ contentSources
                                                          ──→ contentParsedSources (comark parsed)

Markdown (:::demo) ──→ Comark parse ──→ ContentRenderer ──→ Demo component
                                                         │
                                                         ├── useContentRenderer() injects demos/sources
                                                         ├── preview → demos[previewKey] → renders component
                                                         └── source → parsedSources[key] → CodeGroup → source code
```

## Architecture

```
Demo (high-level, Markdown-driven)
 │
 └── CodePreview (mid-level, expand/collapse source)
      │
      ├── #default slot: live preview component
      └── #source slot: source area
           │
           └── CodeGroup (low-level, multi-file tabs)
                │
                └── ComarkRenderer (syntax-highlighted rendering)
```

## Relationship with CodePreview

`Demo` is the convenience wrapper for most use cases. For manual slot composition with custom preview and source content, use [CodePreview](./code-preview) instead.
