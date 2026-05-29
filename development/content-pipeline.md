# Content Pipeline

## 入口分工

运行时 API 不放在 `vike-vue-content/config`，避免和 Vike config-time loader 混用。

- `vike-vue-content/config`：纯 Vike extension default export。
- `vike-vue-content/query`：内容扫描、frontmatter、Comark AST 和查询 API。
- `vike-vue-content/components/content-renderer`：Vue 内容渲染组件，包装 `@comark/vue` 的 `ComarkRenderer`。

## Query 包

`queryCollection(collection, options)` 当前支持：

- `path(value)`：按路由路径过滤。
- `all()`：返回集合内匹配的全部内容。
- `first()`：返回第一个匹配内容或 `null`。

`ContentEntry.body` 是可序列化的 `ComarkTree`，不是原始 Markdown 字符串。原始文件内容保留在 `rawbody`，frontmatter 保留在 `frontmatter`。

## Comark 渲染

Markdown/frontmatter/AST 解析使用 `comark.createParse()`。Vue 渲染使用 `@comark/vue` 的 `ComarkRenderer`。

`ComarkRenderer` 是 async setup 组件，必须有 `<Suspense>` 边界。组件库的 `ContentRenderer` 已经在内部包了一层 `<Suspense>`，消费者正常使用：

```vue
<template>
  <ContentRenderer :tree="page.body" />
</template>
```

## 参考 .dev/content 的技术取舍

当前阶段需要参考 `.dev/content`，但不照搬 Nuxt Content 全量实现。

优先参考（MVP 必做）：

- 集合配置思想：`defineContentConfig` / `defineCollection` 的集合建模方式。
- 查询接口形状：`queryCollection().path().first()/all()` 这种链式 API。
- 渲染链路样例：页面通过 path 查询内容，拿到 AST 后交给 Vue renderer 渲染正文。

参考锚点（本地）：

- `.dev/content/playground/content.config.ts`
- `.dev/content/playground/pages/[...slug].vue`
- `.dev/content/playground/components/ContentPage.vue`
- `.dev/content/src/utils/collection.ts`
- `.dev/content/src/types/query.ts`

暂缓（MVP 不做）：

- 多源仓库拉取、远程 repository source。
- SQL/数据库层、复杂 schema 映射和批量 insert。
- 高亮、导航、搜索、目录等完整文档站能力。
- CMS、版本化、多语言等重型能力。

落地原则：

1. 先跑通最小闭环：`content/*.md` 扫描 -> Comark 解析 frontmatter 和 AST -> `queryCollection().first()` -> Vike 页面渲染。
2. 所有能力先放在源码包，通过 `entry/build.sh` 生成发布产物。
3. 每次新增能力后必须跑对应构建和 Vike 消费端验证，并记录到 [../devlog/](../devlog/) 的下一个编号文件。