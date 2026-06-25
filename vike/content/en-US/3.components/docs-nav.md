---
title: DocsNav
description: Sidebar navigation, rendering the navigation tree recursively.
---

# DocsNav

The sidebar navigation, rendering the navigation tree recursively.

```ts
import { DocsNav } from 'vike-vue-content/components/docs-nav'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DocsNavigationItem[]` | `[]` | Navigation items (with nested children). |
| `currentPath` | `string` | `''` | Current path, used to highlight the active item. |

Internally uses `<Link>` to render links, handling the base prefix automatically.
