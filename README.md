# <img src="./assets/logo.svg" width="48" alt="vike-vue-content logo" style="vertical-align:middle;margin-right:8px"/>vike-vue-content

> A content rendering framework built on [Vike](https://vike.dev/) + [Vue](https://vuejs.org/) — zero boilerplate for docs sites.

English | [中文](https://github.com/EralChen/vike-vue-content/blob/master/README.zh-CN.md)

## Features

- **Vike native** — Ships as a Vike Config Extension. `docs.page`, `docs.data` and other hooks are mounted automatically. No `+Page.vue` to write.
- **Content-driven routing** — Every `content/**/*.md` file becomes a page route automatically. No route table to maintain.
- **Lightweight integration** — Page-level `defineDocsPageConfig` defines the content collection and directory without restructuring your project.
- **Comark plugin system** — AST-level Markdown transformation pipeline. Supports Shiki code highlighting, Mermaid diagrams, custom component mappings, and more.
- **Theme system** — 17 accent colors × neutral tones, dark/light mode, radius and font presets.
- **Full-text search** — Search index built at build time, queried client-side.
- **SSG / SSR** — Powered by Vike. The built-in `onBeforePrerenderStart` hook enumerates every content path. Compatible with Vite `base` configuration for full static export.

## Quick Start

### 1. Install

```bash
npm install vike-vue-content
```

### 2. Configure Vike

```ts
// pages/+config.ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'
import type { Config } from 'vike/types'

export default {
  extends: [vikeVue, vikeVueContent],
} satisfies Config
```

### 3. (Optional) Configure plugins & custom components

```ts
// pages/+content.ts
import highlight from 'vike-vue-content/comark/highlight'

export default {
  plugins: [
    highlight(),
  ],
  components: {
    // Map HTML tags to Vue components — used by ContentRenderer
  },
}
```

### 4. Create a docs page

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

### 5. Add Markdown content

```
content/
└── docs/
    ├── index.md               # → /docs/
    ├── 1.getting-started.md   # → /docs/getting-started
    └── guide/
        └── routing.md         # → /docs/guide/routing
```

Start the dev server — `Page` and `data` are already wired by the config.

## Documentation

The full documentation (theme system, components, content queries, etc.) lives in the example site:

```bash
pnpm install
pnpm run lib
pnpm run vike:dev   # Open http://localhost:3000
```

## License

[MIT](LICENSE)