---
title: DocsPage
description: 完整的文档页面布局——侧边栏、正文、目录、上下页。
---

# DocsPage

完整的文档页面布局：左侧栏导航 + 中间正文 + 右侧目录 + 底部上下页。它通过 `useData()` 读取内置数据加载器提供的数据，因此**不接收 props**，直接用即可：

```ts
import { DocsPage } from 'vike-vue-content/components/docs-page'
```

## 用法

```vue
<script setup>
import { DocsPage } from 'vike-vue-content/components/docs-page'
</script>

<template>
  <DocsPage />
</template>
```

布局采用 CSS Grid，在窄屏（≤1100px）下自动堆叠为单列。
