---
title: DocsToc
description: 页面目录，支持滚动高亮。
---

# DocsToc

页面目录（Table of Contents）。

```ts
import { DocsToc } from 'vike-vue-content/components/docs-toc'
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `links` | `ContentTocLink[]` | `[]` | 目录项数组。 |
| `active` | `string[]` | `[]` | 当前激活的标题 id（用于高亮）。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | `id: string` | 点击目录项时触发。 |

## TOC 定位

`DocsToc` 自身不处理定位，sticky 由 `DocsPage` 的 outline 容器负责。如果你的站点有固定 header 挡住目录，调整 CSS 变量即可：

```css
:root {
  /* 根据 header 高度调整 */
  --vvc-toc-sticky-top: 80px;
}
```

或关联已有的 header 变量：

```css
:root {
  --header-height: 64px;
  --vvc-toc-sticky-top: var(--header-height);
}
```
