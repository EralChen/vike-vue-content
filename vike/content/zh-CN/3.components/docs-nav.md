---
title: DocsNav
description: 侧边栏导航，递归渲染导航树。
---

# DocsNav

侧边栏导航，递归渲染导航树。

```ts
import { DocsNav } from 'vike-vue-content/components/docs-nav'
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `DocsNavigationItem[]` | `[]` | 导航项数组（含嵌套 children）。 |
| `currentPath` | `string` | `''` | 当前路径，用于高亮激活项。 |

内部使用 `<Link>` 渲染链接，自动处理 base 前缀。
