---
title: Demo
description: 把已注册的实时预览和源码 key 绑定成一个 Markdown 调用点。
---

# Demo

`demo` 是 `code-preview` 之上的高层封装。

当预览组件和源码已经在 `+content.ts` 里注册好时，用它可以在 Markdown 里用一条声明完成展示。

## Preview 用法

在 `+content.ts` 中注册 demo：

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

`preview` 用来选择已注册的实时预览，`source` 传入已注册源码 key 的数组。传多个 key 时，源码面板会自动渲染成和 `code-group` 一样的标签页结构。

然后在 markdown 中引用：

````md
:::demo{preview="hello", source="['hello']"}
:::
````

:::demo{preview="hello", source="['hello']"}
:::

如果需要手写预览区和源码区插槽，改用 [CodePreview](./code-preview)。
