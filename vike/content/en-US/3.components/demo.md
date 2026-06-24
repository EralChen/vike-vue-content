---
title: Demo
description: Bind a registered live preview to registered source blocks.
---

# Demo

`demo` is the higher-level wrapper around `code-preview`.

Place `.vue` files in `demos/` for automatic registration — no manual imports. One Markdown declaration renders everything.

## Preview usage

Place `.vue` files in the `demos/` directory and they're auto-registered — the full path (with `.vue` extension) becomes the demo key. No manual imports needed in `+content.ts`.

For example, `demos/hello/index.vue` is auto-registered as `hello/index.vue`:

Then in markdown:

````md
:::demo{preview="hello/index.vue", source="['hello/index.vue', 'hello/data.txt']"}
:::
````

:::demo{preview="hello/index.vue", source="['hello/index.vue', 'hello/data.txt']"}
:::


For manual slot composition, use [CodePreview](./code-preview).
