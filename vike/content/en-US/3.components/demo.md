---
title: Demo
description: Bind a registered live preview to registered source blocks.
---

# Demo

`demo` is the higher-level wrapper around `code-preview`.

Use it when the preview component and source code are already registered in `+content.ts` and you want a single declarative Markdown call site.

## Preview usage

Register demos in `+content.ts`:

```ts
import HelloWorld from '../demos/hello.vue'
import HelloWorldSource from '../demos/hello.vue?raw'

export default {
  demos: {
    hello: HelloWorld,
  },
  sources: {
    hello: HelloWorldSource,
  },
} satisfies ContentConfig
```

`preview` selects the registered live demo, and `source` accepts an array of registered source keys. When multiple keys are provided, the source panel renders the same tabbed layout as `code-group`.

Then in markdown:

````md
:::demo{preview="hello", source="['hello']"}
:::
````

:::demo{preview="hello", source="['hello']"}
:::

For manual slot composition, use [CodePreview](./code-preview).
