---
title: Demo
description: 把已注册的实时预览和源码 key 绑定成一个 Markdown 调用点。
---

# Demo

`demo` 是 `code-preview` 之上的高层封装。

把 `.vue` 文件放到配置的 `demosDir` 目录（默认为空，不启用），即可自动注册，无需手动 import。通过一条 Markdown 声明即可完成展示。

## 快速开始

### 配置 demos 目录

在页面配置中指定 `demosDir`，每个 DocsPage 可独立配置：

```ts
// vike/pages/zh-CN/+config.ts
import { defineDocsPageConfig } from 'vike-vue-content/docs'

export default defineDocsPageConfig({
    collection: 'zh-CN',
    demosDir: 'demos',  // 多个页面可共享同一 demos 目录
})
```

将 `.vue` 文件放到项目根目录下的 `demosDir` 目录（上例中即 `demos/`），文件会自动注册——相对该目录的路径（含 `.vue` 扩展名）即为 demo 的 key。

例如 `demos/hello/index.vue` 注册为 `hello/index.vue`，然后在 markdown 中引用：

````md
:::demo{preview="hello/index.vue"}
:::
````

最简写法：不传 `source` 时，自动使用 `preview` 对应的源码。

## Props

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `preview` | `string` | 是 | 预览组件的 key，对应 demos 目录下的文件路径（含 `.vue`） |
| `source` | `string \| string[]` | 否 | 源码文件 key 数组，省略时默认使用 `preview` 对应的源码 |

## 用法示例

### 最简用法（仅 preview）

````md
:::demo{preview="hello/index.vue"}
:::
````

自动将 `hello/index.vue` 作为预览组件，同时展示其源码。

:::demo{preview="hello/index.vue"}
:::

### 指定多个源码文件

````md
:::demo{preview="hello/index.vue", :source='["hello/index.vue", "hello/data.txt"]'}
:::
````

- `preview="hello/index.vue"` — 渲染 `hello/index.vue` 组件作为实时预览
- `:source='["hello/index.vue", "hello/data.txt"]'` — 源码区展示两个文件，用 CodeGroup  tab 切换

注意 `:source` 前的冒号 `:` 表示 MDC 的 JS 表达式绑定，值为真正的数组而非字符串。

:::demo{preview="hello/index.vue", :source='["hello/index.vue", "hello/data.txt"]'}
:::

### 仅传字符串 source

````md
:::demo{preview="hello/index.vue", source="hello/data.txt"}
:::
````

源码区仅展示 `hello/data.txt` 的内容。

## 数据流

```
{demosDir} ──→ Vite 插件扫描 ──→ virtual:vvc-demos ──→ contentDemos
{demosDir} ──→ Vite 插件扫描 ──→ virtual:vvc-demo-sources ──→ contentSources
                                                    ──→ contentParsedSources (comark 解析)

Markdown (:::demo) ──→ Comark 解析 ──→ ContentRenderer ──→ Demo 组件
                                                        │
                                                        ├── useContentRenderer() 注入 demos/sources
                                                        ├── preview → demos[previewKey] → 渲染组件
                                                        └── source → parsedSources[key] → CodeGroup → 源码
```

## 架构层次

```
Demo (高层，Markdown 驱动)
 │
 └── CodePreview (中层，展开/收起源码)
      │
      ├── #default 槽：实时预览组件
      └── #source 槽：源码区
           │
           └── CodeGroup (底层，多文件 tab 切换)
                │
                └── ComarkRenderer (语法高亮渲染)
```

## 与 CodePreview 的关系

`Demo` 是便捷封装，适合大多数场景。如需手写预览区和源码区插槽的自定义内容，改用 [CodePreview](./code-preview)。
