---
title: DocsToc
description: Page table of contents with scroll-spy highlighting.
---

# DocsToc

The page table of contents.

```ts
import { DocsToc } from 'vike-vue-content/components/docs-toc'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `links` | `ContentTocLink[]` | `[]` | TOC items. |
| `active` | `string[]` | `[]` | Currently active heading ids (for highlighting). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `id: string` | Fired when a TOC item is clicked. |

## TOC positioning

`DocsToc` only renders the TOC content; sticky positioning is managed by the `DocsPage` outline container. If a fixed header covers the TOC, adjust the CSS variable:

```css
:root {
  /* adjust to your header height */
  --vvc-toc-sticky-top: 80px;
}
```

Or link it to an existing header variable:

```css
:root {
  --header-height: 64px;
  --vvc-toc-sticky-top: var(--header-height);
}
```
