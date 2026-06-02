# vike-vue-content

[Vike](https://vike.dev/) + [Vue](https://vuejs.org/) 的内容渲染框架，为文档站点提供开箱即用的主题系统、内容路由和文档组件。

## 特性

- 🎨 **主题系统** - 17 种主色调、深色/浅色模式、圆角和字体自定义
- 📄 **内容驱动路由** - Markdown 文件自动生成页面路由
- 🔍 **内容查询** - 查询、排序、分页、上下页导航
- 📑 **文档组件** - 导航栏、目录、内容渲染器等开箱即用
- ⚡ **无 FOUC** - 内联脚本初始化主题，页面切换无闪烁

## 快速开始

### 安装

```bash
npm install vike-vue-content
```

### 配置 Vike

```ts
// vike.config.ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'
import type { Config } from 'vike/types'

export default {
  extends: [vikeVue, vikeVueContent],
} satisfies Config
```

### 使用主题组件

```vue
<script setup>
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle'
import { ThemeSettings } from 'vike-vue-content/components/theme-settings'
</script>

<template>
  <header>
    <h1>My App</h1>
    <div>
      <!-- 主题设置面板 -->
      <ThemeSettings />
      <!-- 颜色模式切换 -->
      <ThemeToggle />
    </div>
  </header>
</template>
```

## 主题系统

### 功能

| 功能 | 说明 |
|------|------|
| Primary | 17 种主色调 + Black |
| Neutral | 5 种中性色 |
| Radius | 5 种圆角预设 |
| Font | 8 种字体选择 |
| Color Mode | 浅色 / 深色 / 跟随系统 |
| Export | 导出 CSS 或配置 |
| Reset | 一键重置 |

### 编程式控制

```vue
<script setup>
import { useTheme } from 'vike-vue-content/composables/theme'

const {
  theme,           // 响应式主题配置
  isDark,          // 是否深色模式
  primary,         // 主色调
  toggleDarkMode,  // 切换深色模式
  setPrimaryColor, // 设置主色调
  resetTheme       // 重置主题
} = useTheme()
</script>
```

### CSS 变量

组件自动适配主题变量：

```css
--vvc-color-primary      /* 主色调 */
--vvc-color-neutral      /* 中性色 */
--vvc-radius             /* 圆角 */
--vvc-font-family        /* 字体 */
--vvc-bg                 /* 背景色 */
--vvc-text               /* 文本色 */
--vvc-border             /* 边框色 */
```

## 文档组件

```vue
<script setup>
import { DocsPage } from 'vike-vue-content/components/docs-page'
import { DocsNav } from 'vike-vue-content/components/docs-nav'
import { DocsToc } from 'vike-vue-content/components/docs-toc'
import { DocsSurround } from 'vike-vue-content/components/docs-surround'
import { ContentRenderer } from 'vike-vue-content/components/content-renderer'
</script>
```

| 组件 | 说明 |
|------|------|
| `DocsPage` | 完整文档页面（侧边栏 + 内容 + 目录） |
| `DocsNav` | 文档导航 |
| `DocsToc` | 页面目录 |
| `DocsSurround` | 上一页/下一页 |
| `ContentRenderer` | Markdown 内容渲染 |

## 内容查询

```ts
import {
  queryCollection,
  queryCollectionNavigation,
  queryCollectionItemSurroundings,
} from 'vike-vue-content/query'

// 查询单页
const page = await queryCollection('docs').path('/getting-started').first()

// 查询导航树
const navigation = await queryCollectionNavigation('docs')

// 查询上下页
const [prev, next] = await queryCollectionItemSurroundings('docs', '/getting-started')
```

## 内容驱动路由

1. 创建内容目录和 Markdown 文件：

```
content/
└── docs/
    ├── index.md
    ├── getting-started.md
    └── guide/
        └── routing.md
```

2. 配置 docs 路由锚点：

```ts
// vike/pages/docs/+config.ts
export default {
  docs: {
    collection: 'docs',
    contentDir: 'content',
  },
}

// vike/pages/docs/+route.ts
export { createDocsRoute as default } from 'vike-vue-content/docs/route'

// vike/pages/docs/+onBeforePrerenderStart.ts
export { createDocsPrerender as default } from 'vike-vue-content/docs/prerender'
```

3. 自动生成路由：

| 文件路径 | 访问路径 |
|----------|----------|
| `content/docs/index.md` | `/docs` |
| `content/docs/getting-started.md` | `/docs/getting-started` |
| `content/docs/guide/routing.md` | `/docs/guide/routing` |

## 导出清单

```
vike-vue-content/
├── config                          # Vike config 扩展
├── query                           # 内容查询 API
├── components/
│   ├── content-renderer            # 内容渲染器
│   ├── docs-page                   # 文档页面
│   ├── docs-nav                    # 文档导航
│   ├── docs-toc                    # 页面目录
│   ├── docs-surround               # 上下页导航
│   ├── theme-toggle                # 颜色模式切换
│   └── theme-settings              # 主题设置面板
├── composables/
│   ├── theme                       # 主题 composable
│   └── scrollspy                   # 滚动监听
└── shared/
    └── types                       # 公共类型
```

## 相关资源

- [Vike](https://vike.dev/) - 框架
- [vike-vue](https://github.com/vikejs/vike-vue) - Vue 集成
- [ROADMAP.md](ROADMAP.md) - 开发路线图