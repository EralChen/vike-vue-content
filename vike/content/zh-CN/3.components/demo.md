---
title: Demo
description: 把已注册的实时预览和源码 key 绑定成一个 Markdown 调用点。
---

# Demo

`demo` 是 `code-preview` 之上的高层封装。

把 `.vue` 文件放到 `demos/` 目录即可自动注册，无需手动 import。通过一条 Markdown 声明即可完成展示。

## Preview 用法

将 `.vue` 文件放到 `demos/` 目录即可自动注册——完整路径（含 `.vue` 扩展名）即为 demo 的 key。无需在 `+content.ts` 中手动 import。

例如 `demos/hello/index.vue` 会自动注册为 `hello/index.vue`：

然后在 markdown 中引用：

````md
:::demo{preview="hello/index.vue", source="['hello/index.vue', 'hello/data.txt']"}
:::
````

:::demo{preview="hello/index.vue", source="['hello/index.vue', 'hello/data.txt']"}
:::

如果需要手写预览区和源码区插槽，改用 [CodePreview](./code-preview)。
