<h1>
  <img src="./assets/logo.svg" width="42" alt="vike-vue-content logo" align="center">
  vike-vue-content
</h1>

> 基于 [Vike](https://vike.dev/) + [Vue](https://vuejs.org/) 的内容文档框架 — 零模板即可构建文档站点。

[English](./README.md) | 中文

## 特性

- **Vike 原生集成** — 以 Config Extension 形式接入，自动挂载 `docs.page`、`docs.data` 等 hooks，无需手写 `+Page.vue`
- **内容驱动路由** — `content/**/*.md` 文件自动映射为页面路由，无需维护路由表
- **轻量级集成** — 页面级 `defineDocsPageConfig` 定义内容集合和目录，无需调整项目架构
- **Comark 插件系统** — AST 级 Markdown 转换管线，支持 Shiki 代码高亮、Mermaid 图表、自定义组件映射等
- **实时 Demo** — 自动注册 `demosDir` 下的 `.vue` 示例，通过一条 Markdown 声明渲染实时预览和源码 Tab
- **主题系统** — 17 种主色调 × 中性色组合、暗色/亮色模式、圆角和字体预设
- **全文搜索** — 构建时生成搜索索引，客户端检索
- **SSG / SSR 双模式** — 基于 Vike，内置 `onBeforePrerenderStart` 钩子枚举所有内容路径，兼容 vite `base` 配置，支持完整静态导出

## 快速开始

### 1. 安装

```bash
npm install vike-vue-content
```

### 2. 配置 Vike

```ts
// pages/+config.ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'
import type { Config } from 'vike/types'

export default {
  extends: [vikeVue, vikeVueContent],
} satisfies Config
```

### 3. （可选）配置插件与自定义组件

```ts
// pages/+content.ts
import highlight from 'vike-vue-content/comark/highlight'

export default {
  plugins: [
    highlight(),
  ],
  components: {
    // 将 HTML 标签映射为 Vue 组件 — ContentRenderer 使用
  },
}
```

### 4. 创建文档页面

```ts
// pages/docs/+config.ts
import { defineDocsPageConfig } from 'vike-vue-content/docs'

export default defineDocsPageConfig({
  collection: 'docs',
  contentDir: 'content',
})

// pages/docs/+route.ts
export { createDocsRoute as default } from 'vike-vue-content/docs/route'

// pages/docs/+onBeforePrerenderStart.ts
export { createDocsPrerender as default } from 'vike-vue-content/docs/prerender'
```

### 5. 添加文档内容

```
content/
└── docs/
    ├── index.md               # → /docs/
    ├── 1.getting-started.md   # → /docs/getting-started
    └── guide/
        └── routing.md         # → /docs/guide/routing
```

启动开发服务器 — `Page` 和 `data` 已由 config 自动挂载。

## 文档

完整文档（主题系统、组件、内容查询等）见示例站点：

```bash
pnpm install
pnpm run lib
pnpm run vike:dev   # 打开 http://localhost:3000
```

## License

[MIT](LICENSE)
