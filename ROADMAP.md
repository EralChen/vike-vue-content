# Roadmap

vike-vue-content 的目标是成为 Vike + Vue 生态中的内容渲染框架：用 Vike 的文件路由、SSR/SSG 能力和 vike-vue 的 Vue 集成，提供类似 Nuxt Content 的文档开发体验。

这个路线图用于承载长期愿景；README 只描述当前 npm 使用者需要知道的安装方式、已发布导出和开发状态。

## 产品目标

- 让 Vike 项目可以通过一个 config 扩展接入内容能力。
- 让 Markdown/MDX 内容可以按目录组织，并自动参与页面路由、导航和构建。
- 提供面向文档站点的 Vue 组件、composables 和共享类型。
- 支持 npm 包文档、组件库文档、产品文档和知识库等常见内容站点。

## Phase 1: 包入口与 Vike 集成

- 已新增 `vike-vue-content/config` 最小导出。
- 在 Vike config 中通过 `extends: [vikeVueContent]` 接入。
- 明确 package exports、类型声明和构建产物结构。
- 将示例 Vike 应用改造成真实的内容站点示例。
- 更新 npm 包元数据、README 和发布预览流程。

## Phase 2: 内容源与渲染管线

- 支持从 `content/` 目录扫描 Markdown 内容。
- 解析 frontmatter，并生成标题、描述、目录、导航元数据。
- 提供内容查询 API，例如按路径、集合、标签或排序字段读取内容。
- 提供 Markdown 渲染组件，并允许用户覆盖局部渲染组件。
- 支持代码块高亮、标题锚点、目录生成和链接解析。

## Phase 3: 路由、布局与预渲染

- 根据内容目录生成 Vike 页面路由。
- 提供文档布局、侧边栏、上一页/下一页、面包屑等组件。
- 支持 SSR、SSG 和 prerender 场景。
- 为 npm 包文档提供 Release 页面和版本信息扩展点。
- 提供内容变更时的开发服务器热更新体验。

## Phase 4: 搜索、主题与生态

- 内置静态搜索索引生成。
- 提供主题 token、布局 slot 和组件覆盖机制。
- 支持多语言、多版本文档和内容集合。
- 提供从 Nuxt Content 迁移的指南和兼容层建议。
- 输出更完整的示例站点和最佳实践文档。

## 近期优先级

1. 将 Vike 示例应用改造成最小文档站点。
2. 建立 `content/` 目录扫描和 frontmatter 解析的最小闭环。
3. 将 Markdown 渲染组件挂载到真实页面。
4. 为内容路由和查询 API 设计稳定类型。
5. 为最小闭环添加构建验证和发布包预览检查。

## 非目标

- 不重新实现 Vike 或 vike-vue 已经负责的应用运行时。
- 不把框架限定为某一个固定主题。
- 不在核心层绑定特定 UI 组件库。
- 不把当前模板导出包装成已经完整可用的内容框架。