---
title: Link
description: base 感知的站内链接组件。
---

# Link

base 感知的站内链接组件。当站点部署在非根路径（Vite 配置了 `base`）时，`Link` 会给站内绝对路径自动拼接 base 前缀。

```ts
import { Link } from 'vike-vue-content/components/link'
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `''` | 链接地址。 |
| `target` | `string` | `undefined` | 打开方式。显式传入时优先生效。 |
| `rel` | `string` | `undefined` | 链接关系。显式传入时优先生效。 |

## 用法

```vue
<Link href="/getting-started">开始</Link>
<!-- base = "/vike-vue-content/" 时渲染为： -->
<!-- <a href="/vike-vue-content/getting-started">开始</a> -->
```

## 行为

- 只处理以 `/` 开头的**站内绝对路径**；外链、锚点、相对路径原样透传。
- base 在运行时由 Vike 通过 `pageContext._baseServer` 注入，不会在组件库构建时被固化，因此组件产物与部署路径解耦。
- **外链自动新窗口打开**：以 `http://`、`https://` 或 `//` 开头的链接会自动加上 `target="_blank"` 与 `rel="noopener noreferrer"`。显式传入的 `target` / `rel` 优先级更高，可覆盖此默认行为。

## Markdown 中控制链接

markdown 链接由 comark 解析后交给 `Link` 渲染，因此上面的行为对文档里的链接同样生效：

```md
<!-- 外链：自动在新窗口打开 -->
[Vike 官网](https://vike.dev)

<!-- 强制在当前窗口打开（MDC 内联属性语法）-->
[Vike 官网](https://vike.dev){target="_self"}

<!-- 站内链接：自动拼接 base，不加 target -->
[开始](/getting-started)
```

借助 comark 的 [MDC 内联属性语法](https://comark.dev) `{key="value"}`，你可以为单个链接附加 `target`、`rel`、`class`、`id` 等属性，实现对个别链接的精细控制。
