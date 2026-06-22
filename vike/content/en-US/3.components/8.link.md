---
title: Link
description: Base-aware internal link component.
---

# Link

A base-aware internal link component. When the site is deployed under a non-root path (Vite `base` is set), `Link` automatically prepends the base prefix to internal absolute paths.

```ts
import { Link } from 'vike-vue-content/components/link'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | `''` | The link target. |
| `target` | `string` | `undefined` | How to open the link. Takes precedence when set explicitly. |
| `rel` | `string` | `undefined` | The link relationship. Takes precedence when set explicitly. |

## Usage

```vue
<Link href="/getting-started">Get Started</Link>
<!-- With base = "/vike-vue-content/", renders as: -->
<!-- <a href="/vike-vue-content/getting-started">Get Started</a> -->
```

## Behavior

- Only handles **internal absolute paths** starting with `/`; external links, anchors, and relative paths pass through unchanged.
- The base is injected at runtime by Vike via `pageContext._baseServer`, never baked in at library build time, so the built component is decoupled from the deployment path.
- **External links open in a new tab automatically**: links starting with `http://`, `https://`, or `//` get `target="_blank"` and `rel="noopener noreferrer"`. An explicit `target` / `rel` takes precedence and overrides this default.

## Controlling links in Markdown

Markdown links are parsed by comark and rendered through `Link`, so the behavior above applies to links in your docs too:

```md
<!-- External link: opens in a new tab automatically -->
[Vike website](https://vike.dev)

<!-- Force opening in the same tab (MDC inline attribute syntax) -->
[Vike website](https://vike.dev){target="_self"}

<!-- Internal link: base is prepended, no target added -->
[Get Started](/getting-started)
```

With comark's [MDC inline attribute syntax](https://comark.dev) `{key="value"}`, you can attach `target`, `rel`, `class`, `id`, and more to individual links for fine-grained control.
