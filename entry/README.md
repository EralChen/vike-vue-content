# vike-vue-content

[Vike](https://vike.dev/) + [Vue](https://vuejs.org/) 的内容渲染框架，为文档站点提供开箱即用的主题系统、内容路由和文档组件。

## 特性

- 🎨 **主题系统** - 17 种主色调、深色/浅色模式、圆角和字体自定义
- 📄 **内容驱动路由** - Markdown 文件自动生成页面路由
- 🔍 **内容查询** - 查询、排序、分页、上下页导航
- 📑 **文档组件** - 导航栏、目录、内容渲染器等开箱即用
- ⚡ **无 FOUC** - 内联脚本初始化主题，页面切换无闪烁

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

### 3. 创建文档页面

```
content/
└── docs/
    └── index.md        # 你的第一篇文档
```

```ts
// pages/docs/+config.ts
export default {
  docs: {
    collection: 'docs',
    contentDir: 'content',
  },
}

// pages/docs/+route.ts
export { createDocsRoute as default } from 'vike-vue-content/docs/route'

// pages/docs/+onBeforePrerenderStart.ts
export { createDocsPrerender as default } from 'vike-vue-content/docs/prerender'
```

`content/docs/` 下的 Markdown 文件会自动映射为 `/docs/**` 路由，`Page` 和 `data` 由 config 自动挂载，无需手写。

## 文档

完整文档（主题系统、文档组件、内容查询等）见 `vike/` 示例站点的内容源：

```bash
pnpm install
pnpm -C vike run dev    # 启动开发服务器，浏览在线文档
pnpm -C vike run build  # 构建生产产物（含预渲染）
```

内容源位于 [`vike/content/`](vike/content/)，本身就是一份用 `vike-vue-content` 渲染的可运行文档。

## 相关资源

- [Vike](https://vike.dev/) - 框架
- [vike-vue](https://github.com/vikejs/vike-vue) - Vue 集成
- [ROADMAP.md](ROADMAP.md) - 开发路线图
