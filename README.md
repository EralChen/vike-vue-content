# vike-vue-content

[Vike](https://vike.dev/) 生态下，基于 [vike-vue](https://github.com/vikejs/vike-vue)，面向 Vue 文档站点的内容渲染框架。目标是为 Vike 项目提供接近 [Nuxt Content](https://content.nuxt.com/) 的内容组织、路由生成、文档渲染和站点构建体验。

> vike-vue-content 目前处于 early-stage。当前发布包已经提供最小 Vike config 入口和模板级导出，完整的 Markdown 内容管线、文档路由和查询能力正在建设中。长期路线见 [ROADMAP.md](ROADMAP.md)。

## 适合场景

- 在 Vike + Vue 项目中构建内容驱动的文档站点。
- 为 npm 包、组件库、工具库维护轻量但可扩展的文档入口。
- 迁移或复刻 Nuxt Content 风格的内容目录、页面渲染和发布体验。

## 安装

```bash
npm install vike-vue-content
```

如果使用 pnpm：

```bash
pnpm add vike-vue-content
```

## 当前可用导出

当前 npm 包暴露的是最小模板能力，适合验证包结构、类型声明和按路径导入是否工作：

```ts
import vikeVueContent from 'vike-vue-content/config'
import { queryCollection } from 'vike-vue-content/query'
import { ContentRenderer } from 'vike-vue-content/components/content-renderer'
import { Hello } from 'vike-vue-content/components/hello-world'
import { useHello } from 'vike-vue-content/composables/hello'
```

可用入口：

| 入口 | 用途 |
| --- | --- |
| `vike-vue-content/config` | Vike config 扩展入口，目前是最小 no-op 扩展 |
| `vike-vue-content/query` | 内容查询入口，提供 `queryCollection()`、`queryCollectionNavigation()` 和 `queryCollectionItemSurroundings()` |
| `vike-vue-content/components/content-renderer` | Vue 内容渲染组件，基于 `@comark/vue` 渲染 Comark AST |
| `vike-vue-content/components/hello-world` | Vue 组件导出模板 |
| `vike-vue-content/composables/hello` | Vue composable 导出模板 |
| `vike-vue-content/shared/types` | 共享类型导出模板，目前暂未暴露具体类型 |

## Vike 集成

在 Vike 项目中可以先接入最小 config 扩展，为后续内容能力保留稳定入口：

```ts
// vike.config.ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'
import type { Config } from 'vike/types'

export default {
	extends: [vikeVue, vikeVueContent],
} satisfies Config
```

当前 `vike-vue-content/config` 是最小 no-op 扩展，不会改变页面渲染行为。后续内容源扫描、Markdown 渲染和路由生成会挂载到这个入口上。

## 内容查询

服务端数据函数可以通过 `vike-vue-content/query` 读取 Markdown 内容：

```ts
import { queryCollection } from 'vike-vue-content/query'

const page = await queryCollection('docs').path('/docs').first()
```

`queryCollection()` 使用 [Comark](https://github.com/comarkdown/comark) 解析 Markdown、YAML frontmatter 和 AST。`page.body` 是可序列化的 `ComarkTree`，可以交给内容渲染组件：

```vue
<script setup lang="ts">
import { ContentRenderer } from 'vike-vue-content/components/content-renderer'

defineProps<{
	page: {
		body: unknown
	}
}>()
</script>

<template>
	<ContentRenderer :tree="page.body" />
</template>
```

当前先支持本地 `content/**/*.md`、`path()`、`all()` 和 `first()`。

## 内容驱动路由

把 Markdown 放进 `content/<collection>/**/*.md`，配合一个 catch-all Vike 路由即可按目录结构自动生成页面：

| 内容文件 | 访问路径 |
| --- | --- |
| `content/docs/index.md` | `/docs` |
| `content/docs/getting-started.md` | `/docs/getting-started` |
| `content/docs/guide/routing.md` | `/docs/guide/routing` |

`queryCollectionNavigation()` 返回按目录嵌套的导航树，`queryCollectionItemSurroundings()` 返回上一页/下一页，可直接用于侧边栏和翻页：

```ts
import {
  queryCollection,
  queryCollectionNavigation,
  queryCollectionItemSurroundings,
} from 'vike-vue-content/query'

const [page] = await queryCollection('docs').path(urlPathname).all()
const navigation = await queryCollectionNavigation('docs')
const [prev, next] = await queryCollectionItemSurroundings('docs', urlPathname)
```

完整示例见 `vike/pages/docs/`（`+route.ts`、`+data.ts`、`+Page.vue`、`DocsNav.vue`）。

## 开发状态

vike-vue-content 的工程目标分为两层：

- 当前层：稳定包结构、Vike config 入口、子包构建、类型声明和 npm 发布入口。
- 框架层：实现内容源扫描、Markdown/MDX 渲染、Vike 路由集成、查询 API、文档布局、搜索和主题系统。

路线图和阶段目标见 [ROADMAP.md](ROADMAP.md)。
开发者接手工程请先读 [development/README.md](development/README.md)。开发记录入口见 [devlog/README.md](devlog/README.md)，新任务接着 `devlog/` 下的编号文件写。

## 相关资源

- [Vike](https://vike.dev/)
- [vike-vue](https://github.com/vikejs/vike-vue)
- [Nuxt Content](https://content.nuxt.com/)

本仓库开发时可参考本地源码镜像：

- `../.dev/vike`
- `../.dev/vike-vue`
- `../.dev/content`
- `../.dev/movk-nuxt-docs`


